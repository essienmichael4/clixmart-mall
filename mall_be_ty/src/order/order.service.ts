import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory, Product, Status } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/order.entity';
import { v4 } from 'uuid';
import { ReviewStatus } from 'src/product/entities/review.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Product) private readonly productRepo:Repository<Product>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(OrderItem) private readonly orderItemRepo:Repository<OrderItem>,
    @InjectRepository(Order) private readonly orderRepo:Repository<Order>,
  ){}

  async create(createOrderDto: CreateOrderDto, userId:number) {
    try{
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
            id: item.id,
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
        total: total,
        orderItems: orderItems,
        user: user
      }

      const order = await this.orderRepo.save(saveEntity)
      
      return order
    }catch(err){
      throw err
    }
  }

  findAll() {
    return this.orderRepo.find({
      relations: {
          orderItems: true
      }
    })
  }

  findAllStoreOrders(store: string) {
    return this.orderRepo.find({
      relations: {
          orderItems: {
            product: {
              store: true
            }
          }
      }, where: {
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
          orderItems: {
            product: {
              store: true
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

  findOne(id: string) {
    return this.orderRepo.findOne({
      where: {
        orderId: id
      },
      relations:{
        orderItems: {
          product: {
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
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
