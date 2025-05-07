import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Inventory, Product, Status } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/order.entity';
import { v4 } from 'uuid';
import { ReviewStatus } from 'src/product/entities/review.entity';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';
import { UserMonthHistory } from 'src/product/entities/UserMonthHistory.entity';
import { UserYearHistory } from 'src/product/entities/UserYearHistory.entity';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderReponseDto } from './dto/response.dto';
import { UploadService } from 'src/upload/upload.service';
import { OrderFilterDto } from './dto/request.dto';
import { ProductReponseDto } from 'src/product/dto/response.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Product) private readonly productRepo:Repository<Product>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(OrderItem) private readonly orderItemRepo:Repository<OrderItem>,
    @InjectRepository(Order) private readonly orderRepo:Repository<Order>,
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    @InjectRepository(UserMonthHistory) private readonly userMonthHistoryRepo:Repository<UserMonthHistory>,
    @InjectRepository(UserYearHistory) private readonly userYearHistoryRepo:Repository<UserYearHistory>,
    private readonly dataSource:DataSource,
    private readonly uploadService: UploadService,
    private eventEmitter:EventEmitter2
  ){}

  async create(createOrderDto: CreateOrderDto, userId:number) {
    const queryRunner = this.dataSource.createQueryRunner()
    try{
      await queryRunner.connect()
      await queryRunner.startTransaction()
      const user = await this.userRepo.findOne({where: {
          id:userId
        }
      })

      if(!user) throw new Error("User does not exist")

      const orderEntity = this.orderRepo.create()

      const orderItems = []
      let total = 0

      for(const item of createOrderDto.items){
        const product = await this.productRepo.findOne({
          where: {
            productId: item.id,
            inventory: Inventory.INSTOCK,
            status: Status.PUBLISH,
            productReview: {
              status: ReviewStatus.APPROVED
            },
          },
        })

        if(!product) throw new Error("Product not found")
        
        const orderItem = new OrderItem()
        orderItem.orderItemId = v4()
        orderItem.product = product
        orderItem.quantity = item.quantity
        orderItem.price = product.price
        orderItem.name = product.name
        orderItem.subTotal = product.price * item.quantity
        total += (product.price * item.quantity)

        orderItems.push(orderItem)
      }

      const saveEntity = {
        ...orderEntity,
        orderId: v4(),
        shownOrderId: this.generateAmazonStyleOrderId(),
        total: total,
        orderItems: orderItems,
        user: user
      }

      const order = await this.createUserOrder(saveEntity, queryRunner)
      await this.upsertMonthHistoryOrder(queryRunner)
      await this.upsertYearHistoryOrder(queryRunner)
      await this.upsertUserYearHistoryOrder(user.id, queryRunner)
      await this.upsertUserMonthHistoryOrder(user.id, queryRunner)
      await queryRunner.commitTransaction()
      const items = order.orderItems
        let products = []
        items.map(async (item)=>{
            const product = new ProductReponseDto(item.product)
            product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

            const itemObject = {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: product.imageUrl
            }
          
          products = [...products, itemObject]
      })


      this.eventEmitter.emit("order.created", {order, products})
      return order
    }catch(err){
      await queryRunner.rollbackTransaction()
      throw err
    }finally{
      await queryRunner.release()
    }
  }

  async createUserOrder(payload, queryRunner: QueryRunner){
    return await queryRunner.manager.save(Order, {
      ...payload
    })
  }

  findAll(orderFilterDto:OrderFilterDto) {
    const {status} = orderFilterDto
    return this.orderRepo.find({
      relations: {
          orderItems: true
      },
      where: {
        ...(status && { status:  status}),
      }
    })
  }

  findAllStoreOrders(store: string, orderFilterDto:OrderFilterDto) {
    const {status} = orderFilterDto
    return this.orderRepo.find({
      relations: {
        user: true,
        orderItems: {
          product: {
            store: true
          }
        }
      }, where: {
        ...(status && { status:  status}),
        orderItems: {
          product: {
            store: {
              slug: store
            }
          }
        }
      }
    })
  }

  findStoreOrderItem(store: string, orderId:string) {
    return this.orderRepo.findOne({
      relations: {
        user: true,
        orderItems: {
          product: {
            store: true,
            category: true,
            subCategory: true,
            brand: true
          }
        }
      }, where: {
        orderId,
        orderItems: {
          product: {
            store: {
              slug: store
            }
          }
        }
      }
    })
  }

  async findOne(id: string) {
     const order = await this.orderRepo.findOne({
      where: {
        orderId: id
      },
      relations:{
        orderItems: {
          product: {
            category: true,
            brand: true,
            subCategory: true,
            store: {
              user: true,
              storeAddress: true,
              storeDetail: true,
              paymentDetail: true
            }
          }
        },
        user: true
      }
    });

    const orderResponse = new OrderReponseDto(order)
    
    orderResponse.orderItems.map(async(item)=> {
      if(item.product.imageName){
        item.product.imageUrl = await this.uploadService.getPresignedUrl(`products/${item.product.imageName}`)
      }
      return item
    })

    return orderResponse
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async upsertMonthHistoryOrder(queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.monthHistoryRepo.findOne({
      where: { day, month, year }
    })

    if(monthHistory){
      monthHistory.orders += 1
      return await queryRunner.manager.save(MonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.monthHistoryRepo.create({
        day, month, year, orders: 1
    })
      return await queryRunner.manager.save(MonthHistory, {...newMonthHistory})
    }

  }

  async upsertYearHistoryOrder(queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.yearHistoryRepo.findOne({
      where: { month, year }
    })

    if(yearHistory){
      yearHistory.orders += 1
      return await queryRunner.manager.save(YearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.yearHistoryRepo.create({
       month, year, orders: 1
    })
      return await queryRunner.manager.save(YearHistory, {...newYearHistory})
    }

  }

  async upsertUserMonthHistoryOrder(userId:number, queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.userMonthHistoryRepo.findOne({
      where: { day, month, year, userId }
    })

    if(monthHistory){
      monthHistory.orders += 1
      return await queryRunner.manager.save(UserMonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.userMonthHistoryRepo.create({
        day, month, year, orders: 1, userId
    })
      return await queryRunner.manager.save(UserMonthHistory, {...newMonthHistory})
    }

  }

  async upsertUserYearHistoryOrder(userId:number, queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.userYearHistoryRepo.findOne({
      where: { month, year, userId }
    })

    if(yearHistory){
      yearHistory.orders += 1
      return await queryRunner.manager.save(UserYearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.userYearHistoryRepo.create({
       month, year, orders: 1, userId
    })
      return await queryRunner.manager.save(UserYearHistory, {...newYearHistory})
    }

  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  generateAmazonStyleOrderId(): string {
    const part1 = Math.floor(100 + Math.random() * 900);       // 3 digits
    const part2 = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
    const part3 = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
    return `ORD-${part1}-${part2}-${part3}`;
  }


}
