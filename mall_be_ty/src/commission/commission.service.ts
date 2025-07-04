import { Injectable } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { SuccessfulOrderEventDto } from 'src/mailer/dto/successOrder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { Repository } from 'typeorm';
import { CommissionTransaction } from './entities/commissionTransaction.entity';
import { CommissionSetting } from './entities/commissionSettings.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(OrderItem) private readonly orderItemRepo:Repository<OrderItem>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(CommissionTransaction) private readonly commissionTransactionRepo:Repository<CommissionTransaction>,
    @InjectRepository(CommissionSetting) private readonly commissionSettingRepo:Repository<CommissionSetting>,
  ){}

  async calculateCommission(payload: SuccessfulOrderEventDto){
    const orderItems = payload.order.orderItems

    orderItems.map(async (item)=>{
      const commissionPercent = item.product.category.commision.rate
      const rate = this.commissionPercentToDecimal(commissionPercent)
      const commissionAmount = (item.quantity * item.price) * rate
      const vendorEarning = item.subTotal - commissionAmount

      await this.orderItemRepo.save({
        ...item,
        commissionRate: commissionPercent,
        commissionAmount: commissionAmount,
        vendorEarning: vendorEarning,
        commissionTransaction: {
          saleAmount: item.subTotal,
          commissionRate: commissionPercent,
          commissionAmount: commissionAmount,
          vendorEarning: vendorEarning,
          vendor: item.product.user
        }
      })
      
    })

    return await orderItems
  }

  async create(createCommissionDto: CreateCommissionDto) {
    try{
      const category = await this.categoryRepo.findOne({
        where: {
          name: createCommissionDto.category.toLowerCase()
        }
      })

      if(!category) throw new Error("Category does not exist")

      const commision = await this.commissionSettingRepo.findOne({
        relations: {
          category: true
        },
        where: {
          category: {
            name: category.name
          }
        }
      })

      if(commision){
        commision.rate = createCommissionDto.rate
        return await this.commissionSettingRepo.save(commision)
      }else{
        const commisionEntity = this.commissionSettingRepo.create()
        const saveEntity = {
          ...commisionEntity,
          rate: createCommissionDto.rate,
          category: category
        }

        return await this.commissionSettingRepo.save(saveEntity)
      }
    }catch(err){
      throw err
    }
  }

  findAll() {
    return this.commissionSettingRepo.find({
      relations: {
        category: true
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} commission`;
  }

  update(id: number, updateCommissionDto: UpdateCommissionDto) {
    return this.commissionSettingRepo.update(id, {
      rate: updateCommissionDto.rate
    });
  }

  remove(id: number) {
    return `This action removes a #${id} commission`;
  }

  async reverseCommissionByOrderItem(orderItemId: number, reason: string): Promise<void> {
    const tx = await this.commissionTransactionRepo.findOne({
      where: { orderItem: { id: orderItemId }, isReversed: false },
      relations: ['orderItem', 'vendor'],
    });

    if (!tx) {
      throw new Error('Commission transaction not found or already reversed.');
    }

    // Mark the original as reversed
    tx.isReversed = true;
    tx.reversalReason = reason;
    tx.reversedAt = new Date();
    await this.commissionTransactionRepo.save(tx);

    // (Optional) Create a negative reversal entry for bookkeeping
    const reversalTx = this.commissionTransactionRepo.create({
      vendor: tx.vendor,
      orderItem: tx.orderItem,
      saleAmount: -tx.saleAmount,
      commissionRate: tx.commissionRate,
      commissionAmount: -tx.commissionAmount,
      vendorEarning: -tx.vendorEarning,
      isPaid: true, // Already paid, just reverse it
      isReversed: true,
      reversalReferenceId: tx.id,
      reversalReason: reason,
      reversedAt: new Date(),
    });

    await this.commissionTransactionRepo.save(reversalTx);
  }


  private commissionPercentToDecimal(commissionPercent:number){
    return commissionPercent / 100
  }
}
