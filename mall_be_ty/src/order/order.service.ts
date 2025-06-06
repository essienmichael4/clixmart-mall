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
import { ProductResponseDto } from 'src/product/dto/response.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Address } from 'src/user/entities/address.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Product) private readonly productRepo:Repository<Product>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Address) private readonly addressRepo:Repository<Address>,
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

      const userAddress = await this.addressRepo.findOne({where: {
          addressId:createOrderDto.addressId
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
        user: user,
        ...(userAddress && {address: userAddress})
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
            const product = new ProductResponseDto(item.product)
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
      const commissionOrder = await this.orderRepo.findOne({
        where:{id: order.id},
        relations: {
          orderItems: {
            product: {
              category: {
                commision: true
              }
            }
          }
        }
      })

      this.eventEmitter.emit("order.commission", {commissionOrder})
      
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

  async findUsersOrder(userId:number, orderId:string) {
    try{
      const user = await this.userRepo.findOne({where: {
        id:userId
        }
      })
      if(!user) throw new Error("User does not exist")

      const order = await this.orderRepo.findOne({
        relations: {
          orderItems: {
            product: true
          },
          user: true
        },
        where: {
          orderId,
          user: { id: user.id }
        }
      })

      if (!order) throw new Error("Order not found")

      const orderResponse = new OrderReponseDto(order)

      await Promise.all(orderResponse.orderItems.map(async item => {
          if (item.product?.imageName) {
            item.product.imageUrl = await this.uploadService.getPresignedUrl(`products/${item.product.imageName}`)
          }
        })
      )
      
      return orderResponse
    }catch (err) {
      // this.logger.error(`Failed to find order ${orderId} for user ${userId}`, err)
      throw err
    }
  }

  async findUsersOrders(pageOptionsDto:PageOptionsDto, userId:number, orderFilterDto:OrderFilterDto) {
    try{
      const user = await this.userRepo.findOne({where: {
        id:userId
        }
      })
      if(!user) throw new Error("User does not exist")

      const {status} = orderFilterDto

      const [orders, ordersCount] = await Promise.all([
      this.orderRepo.find({
        relations: {
          orderItems: {
            product: true
          },
          user: true
        },
        where: {
          ...(status && { status }),
          user: { id: user.id }
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take
      }),

      this.orderRepo.count({
        where: {
          ...(status && { status }),
          user: { id: user.id }
        }
      })
    ])

      const orderResponse = orders.map(order => new OrderReponseDto(order))

      await Promise.all(orderResponse.flatMap(order =>
        order.orderItems.map(async item => {
          if (item.product?.imageName) {
            item.product.imageUrl = await this.uploadService.getPresignedUrl(`products/${item.product.imageName}`)
          }
        })
      ))

      const pageMetaDto = new PageMetaDto({itemCount: ordersCount, pageOptionsDto})
      return new PageDto(orders, pageMetaDto)
    }catch(err){
      throw err
    }
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
