import { Injectable } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { SuccessfulOrderEventDto } from 'src/mailer/dto/successOrder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CommissionTransaction, ProcessedStatus } from './entities/commissionTransaction.entity';
import { CommissionSetting } from './entities/commissionSettings.entity';
import { Category } from 'src/category/entities/category.entity';
import { AuditAction, AuditLog } from './entities/AuditLog.entity';
import { User } from 'src/user/entities/user.entity';
import { Store } from 'src/store/entities/store.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Revenue } from 'src/settings/entities/revenue.entity';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';
import { RevenueMonthHistory } from 'src/settings/entities/revenueMonthHistory.entity';
import { v4 } from 'uuid';
import { RevenueYearHistory } from 'src/settings/entities/revenueYearHistory.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Store) private readonly storeRepo:Repository<Store>,
    @InjectRepository(OrderItem) private readonly orderItemRepo:Repository<OrderItem>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(CommissionTransaction) private readonly commissionTransactionRepo:Repository<CommissionTransaction>,
    @InjectRepository(CommissionSetting) private readonly commissionSettingRepo:Repository<CommissionSetting>,
    @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>,
    @InjectRepository(Revenue) private readonly revenueRepo: Repository<Revenue>,
    @InjectRepository(RevenueMonthHistory) private readonly revenueMonthHistoryRepo: Repository<RevenueMonthHistory>,
    @InjectRepository(RevenueYearHistory) private readonly revenueYearHistoryRepo: Repository<RevenueYearHistory>,
    private readonly dataSource:DataSource
  ){}

  async auditLog(action: AuditAction, data: any, userId: number, context?:string) {
    const user = await this.userRepo.findOne({where: {id:userId}})
    await this.auditRepo.save({
      action,
      data: data,
      performedBy: user,
      context
    });
  }

  async auditLogError(action: AuditAction, error: Error, userId: number, data?: any, context?: string) {
    const user = await this.userRepo.findOne({where: {id:userId}})
    await this.auditRepo.save({
      action,
      isError: true,
      errorMessage: error.message,
      data,
      performedBy: user,
      context
    });
  }

  async calculateCommission(payload: SuccessfulOrderEventDto){
    const orderItems = payload.order.orderItems

    orderItems.map(async (item)=>{
      const commissionPercent = item.product?.category?.commision?.rate || 10
      const rate = this.commissionPercentToDecimal(commissionPercent)
      const commissionAmount = (item.quantity * item.price) * rate
      const vendorEarning = item.subTotal - commissionAmount

      const ordered = await this.orderItemRepo.save({
        ...item,
        commissionTransaction: {
          saleAmount: item.subTotal,
          commissionRate: commissionPercent,
          commissionAmount: commissionAmount,
          vendorEarning: vendorEarning,
          vendor: item.product.user
        }
      })

      console.log(ordered);
    })

    return orderItems
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

  async findTransactions(){
    const transactions = await this.commissionTransactionRepo.find({
      relations: [
        'orderItem',
        'orderItem.order',
        'orderItem.product',
        'orderItem.product.store',
        'orderItem.product.store.user',
        'vendor'
      ]
    })

    return transactions
  }

  findStoresTransactions(){
    return this.storeRepo.find({
      relations: {
        storeAccount: true,
        user: true
      },
      order: {
        storeAccount: {
          currentAccount: "DESC",
          unpaid: "DESC",
          due: "DESC"
        }
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

  async updateStore(payload:Store, queryRunner:QueryRunner){
    return await queryRunner.manager.update(Store, { id: payload.id }, { processedRevenue: payload.processedRevenue })
  }

  async updateTransactionProcessStatus(payload:CommissionTransaction, queryRunner:QueryRunner){
    return await queryRunner.manager.save(CommissionTransaction, {
      id: payload.id,
      processedStatus: ProcessedStatus.PROCESSED
    })
  }

  async updateRevenue(payload:CommissionTransaction, queryRunner:QueryRunner){
    const revenue = await this.revenueRepo.findOne({
      where: {},
      order: {id: "DESC"}
    })
    if (revenue){
      revenue.commissionRevenue += payload.commissionAmount
      revenue.taxRevenue += 0
      revenue.vendorEarnings += payload.vendorEarning
      revenue.soldRevenue += payload.saleAmount
      return await queryRunner.manager.save(Revenue, {...revenue})
    }else{
      const newRevenue = this.revenueRepo.create({
        commissionRevenue: payload.commissionAmount, 
        vendorEarnings: payload.vendorEarning,
        soldRevenue: payload.saleAmount,
        taxRevenue: 0
      })
      return await queryRunner.manager.save(Revenue, {...newRevenue})
    }
  }

  
  async upsertRevenueMonthHistory(payload:CommissionTransaction, queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.revenueMonthHistoryRepo.findOne({
      where: { day, month, year }
    })

    if(monthHistory){
      monthHistory.commissionRevenue += payload.commissionAmount
      monthHistory.taxRevenue += 0
      monthHistory.vendorEarnings += payload.vendorEarning
      monthHistory.soldRevenue += payload.saleAmount
      return await queryRunner.manager.save(RevenueMonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.revenueMonthHistoryRepo.create({
        day, month, year, 
        commissionRevenue: payload.commissionAmount, 
        vendorEarnings: payload.vendorEarning,
        soldRevenue: payload.saleAmount,
        taxRevenue: 0
      })
      return await queryRunner.manager.save(RevenueMonthHistory, {...newMonthHistory})
    }
  }
  
  async upsertRevenueYearHistory(payload:CommissionTransaction, queryRunner: QueryRunner){
    // const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.revenueYearHistoryRepo.findOne({
      where: { month, year }
    })

    if(yearHistory){
      yearHistory.commissionRevenue += payload.commissionAmount
      yearHistory.taxRevenue += 0
      yearHistory.vendorEarnings += payload.vendorEarning
      yearHistory.soldRevenue += payload.saleAmount
      return await queryRunner.manager.save(RevenueYearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.revenueYearHistoryRepo.create({
        month, year, 
        commissionRevenue: payload.commissionAmount, 
        vendorEarnings: payload.vendorEarning,
        soldRevenue: payload.saleAmount,
        taxRevenue: 0
      })
      return await queryRunner.manager.save(RevenueYearHistory, {...newYearHistory})
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'daily-client-membership-evaluation' })
  async evaluatePaymentsToBeMade() {
    const runId = v4(); // 👈 unique id for this cron run

    // 👇 top-level log: batch run started
    await this.auditLog(AuditAction.PAYOUT_INITIATED, { runId, startedAt: new Date() }, 2);

    try {
      const transactionsToBeProcessed = await this.commissionTransactionRepo.find({
        relations: {
          orderItem: {
            product: {
              store: true
            }
          }
        },
        where: {
          isPaid: true,
          processedStatus: ProcessedStatus.PENDING
        }
      });

      const BATCH_SIZE = 10;

      for (let i = 0; i < transactionsToBeProcessed.length; i += BATCH_SIZE) {
        const batch = transactionsToBeProcessed.slice(i, i + BATCH_SIZE);

        // 👇 log per-batch start
        await this.auditLog(AuditAction.BATCH_STARTED, { runId, batchStart: i, batchEnd: i + batch.length }, 2);

        for (const transaction of batch) {
          const queryRunner = this.dataSource.createQueryRunner();
          const store = transaction.orderItem.product.store;

          try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            store.processedRevenue = store.processedRevenue + transaction.vendorEarning;

            // 1. Revenue Month & Year History
            try {
              await this.upsertRevenueMonthHistory(transaction, queryRunner);
              await this.upsertRevenueYearHistory(transaction, queryRunner);
              await this.auditLog(AuditAction.REVENUE_HISTORY_UPSERTED, { runId, transaction }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.REVENUE_HISTORY_FAILED, err, 2, { runId, transaction });
              throw err;
            }

            // 2. Revenue
            try {
              await this.updateRevenue(transaction, queryRunner);
              await this.auditLog(AuditAction.REVENUE_PROCESSED, { runId, transaction }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.REVENUE_PROCESS_FAILED, err, 2, { runId, transaction });
              throw err;
            }

            // 3. Store
            try {
              await this.updateStore(store, queryRunner);
              await this.auditLog(AuditAction.STORE_UPDATED, { runId, store }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.STORE_UPDATE_FAILED, err, 2, { runId, store });
              throw err;
            }

            // 4. Commission Transaction
            try {
              await this.updateTransactionProcessStatus(transaction, queryRunner);
              await this.auditLog(AuditAction.COMMISSION_PROCESSED, { runId, transaction }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.COMMISSION_REVERSED, err, 2, { runId, transaction });
              throw err;
            }

            await queryRunner.commitTransaction();
          } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
          } finally {
            await queryRunner.release();
          }
        }

        // 👇 log per-batch success
        await this.auditLog(AuditAction.BATCH_COMPLETED, { runId, batchStart: i, batchEnd: i + batch.length }, 2);
      }

      // 👇 top-level success log
      await this.auditLog(AuditAction.PAYOUT_COMPLETED, { runId, finishedAt: new Date() }, 2);
    } catch (err) {
      // 👇 top-level error log
      await this.auditLogError(AuditAction.PAYOUT_FAILED, err, 2, { runId, failedAt: new Date() });
      throw err;
    }
  }
}
