import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { SuccessfulOrderEventDto } from 'src/mailer/dto/successOrder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { Between, DataSource, Like, QueryRunner, Repository } from 'typeorm';
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
import { PayoutStatus, VendorPayout } from 'src/store/entities/vendorPayout.entity';
import { Account } from './entities/commissionAccount.entity';
import { AccountLedger, LedgerType } from 'src/commission/entities/AccountLegder.entity';
import { StoreAccount } from 'src/store/entities/storeAccount.entity';
import { AccountMonthHistory } from './entities/AccountMonthHistory.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { OrderStatus } from 'src/order/entities/order.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Store) private readonly storeRepo:Repository<Store>,
    @InjectRepository(VendorPayout) private readonly vendorPayoutRepo:Repository<VendorPayout>,
    @InjectRepository(OrderItem) private readonly orderItemRepo:Repository<OrderItem>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(CommissionTransaction) private readonly commissionTransactionRepo:Repository<CommissionTransaction>,
    @InjectRepository(CommissionSetting) private readonly commissionSettingRepo:Repository<CommissionSetting>,
    @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>,
    @InjectRepository(Revenue) private readonly revenueRepo: Repository<Revenue>,
    @InjectRepository(RevenueMonthHistory) private readonly revenueMonthHistoryRepo: Repository<RevenueMonthHistory>,
    @InjectRepository(RevenueYearHistory) private readonly revenueYearHistoryRepo: Repository<RevenueYearHistory>,
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    @InjectRepository(AccountLedger) private readonly accountLedgerRepo: Repository<AccountLedger>,
    @InjectRepository(AccountMonthHistory) private readonly accountMonthHistoryRepo: Repository<AccountMonthHistory>,
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

  async getAuditLogs(pageOptionsDto: PageOptionsDto, search?: string, from?: string, to?: string, action?: string) {
    const where: any = {};

    // 🔍 Filter by action
    if (action && action !== 'ALL') {
      where.action = action;
    }

    // 🔍 Search by description or entity
    if (search) {
      where.description = Like(`%${search}%`);
    }

    // 📆 Date range filter using date-fns
    if (from && to) {
      const fromDate = parseISO(from);
      const toDate = parseISO(to);

        where.createdAt = Between(startOfDay(fromDate), endOfDay(toDate));
    }

    const [data, total] = await this.auditRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(data, pageMetaDto);
  }

  async getLedger(pageOptionsDto: PageOptionsDto, search?: string, from?: string, to?: string) {
    const where: any = {};

    // 🔍 Optional search — you could search by month/year or description if applicable
    if (search) {
      // Example: filter by year or month match
      const searchNumber = parseInt(search);
      if (!isNaN(searchNumber)) {
        where.year = searchNumber;
      } else {
        where.description = Like(`%${search}%`);
      }
    }

    // 📆 Date range filter using date-fns
    if (from && to) {
      const fromDate = startOfDay(parseISO(from));
      const toDate = endOfDay(parseISO(to));
      where.createdAt = Between(fromDate, toDate);
    }

    // ⚙️ Fetch and paginate
    const [data, total] = await this.accountMonthHistoryRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });
    
    return new PageDto(data, pageMetaDto);
  }

  async getAccountsLedger(
    pageOptionsDto: PageOptionsDto,
    accountId?: number,
    search?: string,
    type?: string,
    from?: string,
    to?: string,
  ) {
    const where: any = {};

    // 🔍 Filter by account
    if (accountId) {
      where.account = { id: accountId };
    }

    // 🔍 Filter by ledger type
    if (type && type !== 'ALL') {
      where.type = type;
    }

    // 🔍 Search by reference or description
    if (search) {
      where.description = Like(`%${search}%`);
    }

    // 📆 Date range filter
    if (from && to) {
      where.createdAt = Between(
        startOfDay(new Date(from)),
        endOfDay(new Date(to)),
      );
    }

    const [data, total] = await this.accountLedgerRepo.findAndCount({
      where,
      relations: ['account', 'payout'],
      order: { createdAt: 'DESC' },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(data, pageMetaDto);
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

  findStoreTransactions(storeName: string){
    return this.commissionTransactionRepo.find({
      relations: {
        vendor: true,
        orderItem: {
          order: true,
          product: {
            store: true
          }
        }
      },
      where: {
        orderItem: {
          order: {
            status: OrderStatus.DELIVERED,  
          },
          product: {
            store: {
              slug: storeName
            }
          }
        },
        processedStatus: ProcessedStatus.PROCESSED,
        
      }
    })
  }

  async findStorePayouts(storeName: string,){
    return this.vendorPayoutRepo.find({
      relations:{
        store:true
      },
      where: {
        store: {
          slug: storeName
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

  async processVendorPayout(storeId: string, amount: number, paidById: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const storeRepo = queryRunner.manager.getRepository(Store);
      const userRepo = queryRunner.manager.getRepository(User);
      const payoutRepo = queryRunner.manager.getRepository(VendorPayout);
      const accountRepo = queryRunner.manager.getRepository(Account);
      const storeAccountRepo = queryRunner.manager.getRepository(StoreAccount);
      const ledgerRepo = queryRunner.manager.getRepository(AccountLedger);
      const auditRepo = queryRunner.manager.getRepository(AuditLog);

      // Load store
      const store = await storeRepo.findOne({
        where: { storeId },
        relations: ['financialAccount'],
      });

      if (!store) throw new NotFoundException('Store not found');

      // Get or create financial account
      let storeAccount = store.storeAccount;
      if (!storeAccount) {
        storeAccount = storeAccountRepo.create({
          storeAccountId: v4(),
          currentAccount: 0.0,
          due: 0.0,
          unpaid: 0.0,
          store,
        });

        await storeAccountRepo.save(storeAccount);
        store.storeAccount = storeAccount;
        await storeRepo.save(store);
      }

      const paidBy = await userRepo.findOneBy({ id: paidById });
      if (!paidBy) throw new BadRequestException('Paying user not found');

      if (Number(storeAccount.currentAccount) > amount) {
        throw new BadRequestException('Insufficient account balance');
      }

      // Record payout initiation in audit log
      await auditRepo.save(
        auditRepo.create({
          action: AuditAction.PAYOUT_INITIATED,
          context: 'VENDOR_PAYOUT',
          performedBy: paidBy,
          data: { storeId, amount },
        }),
      );

      // Create payout record
      const payout = payoutRepo.create({
        store,
        paidBy,
        totalAmount: amount,
        status: PayoutStatus.SUCCESS,
        paidAt: new Date(),
      });
      await payoutRepo.save(payout);

      // Deduct from account
      storeAccount.currentAccount = Number(storeAccount.currentAccount) - amount;
      await storeAccountRepo.save(storeAccount);

      // Record ledger entry
      const ledger = ledgerRepo.create({
        payout,
        amount,
        type: LedgerType.DEBIT,
        balanceAfter: storeAccount.currentAccount,
        reference: `PO-${payout.id}`,
      });
      await ledgerRepo.save(ledger);

      // Audit success
      await auditRepo.save(
        auditRepo.create({
          action: AuditAction.PAYOUT_COMPLETED,
          context: 'VENDOR_PAYOUT',
          performedBy: paidBy,
          data: { payoutId: payout.id, amount, storeId },
        }),
      );

      await queryRunner.commitTransaction();
      return payout;

    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Record failure in audit log (non-transactional)
      await this.dataSource.getRepository(AuditLog).save({
        action: AuditAction.PAYOUT_FAILED,
        context: 'VENDOR_PAYOUT',
        isError: true,
        errorMessage: error.message,
        data: { storeId, amount, paidById },
      });

      // If it's already an HttpException, just rethrow
      if (error instanceof BadRequestException ||
          error instanceof NotFoundException ||
          error instanceof ForbiddenException) {
        throw error;
      }

      // Otherwise, wrap unexpected errors
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
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
    const revenue = await queryRunner.manager.findOne(Revenue, { order: { id: 'DESC' } });
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
    
    const monthHistory = await queryRunner.manager.findOne(RevenueMonthHistory, {
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
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await queryRunner.manager.findOne(RevenueYearHistory, {
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

  async recordLedgerEntry(queryRunner: QueryRunner, storeAccount: StoreAccount, type: LedgerType, amount: number, referenceId: string, description: string, ) {
    const ledger = queryRunner.manager.create(AccountLedger, {
      ledgerId: v4(),
      type,
      amount,
      referenceId,
      description,
      storeAccount,
    });
    return await queryRunner.manager.save(AccountLedger, ledger);
  }

  async upsertAccountMonthHistory(payload: CommissionTransaction, queryRunner: QueryRunner) {
    const day = GetDay();
    const month = GetMonth();
    const year = GetYear();

    // Try to find existing record for the same day/month/year
    let record = await queryRunner.manager.findOne(AccountMonthHistory, { where: { day, month, year } });

    if (record) {
      record.totalCommission = Number(record.totalCommission) + Number(payload.commissionAmount);
      record.totalTax = Number(record.totalTax) + 0;
      record.totalShipping = Number(record.totalShipping) + 0;
    } else {
      record = queryRunner.manager.create(AccountMonthHistory, {
        day,
        month,
        year,
        totalCommission: payload.commissionAmount,
        totalTax: 0,
        totalShipping: 0,
      });
    }

    return await queryRunner.manager.save(AccountMonthHistory, record);
  }


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'payments-evaluation' })
  async evaluatePaymentsToBeMade() {
    const runId = v4(); // 👈 unique ID for this cron run

    await this.auditLog(AuditAction.PAYMENT_EVALUATION_INITIATED, { runId, startedAt: new Date() }, 2);

    try {
      const transactionsToBeProcessed = await this.commissionTransactionRepo.find({
        relations: {
          orderItem: {
            product: {
              store: {
                storeAccount: true,
              },
            },
          },
        },
        where: {
          isPaid: true,
          processedStatus: ProcessedStatus.PENDING,
        },
      });

      const BATCH_SIZE = 10;

      for (let i = 0; i < transactionsToBeProcessed.length; i += BATCH_SIZE) {
        const batch = transactionsToBeProcessed.slice(i, i + BATCH_SIZE);

        await this.auditLog(AuditAction.BATCH_STARTED, { runId, batchStart: i, batchEnd: i + batch.length }, 2);

        for (const transaction of batch) {
          const queryRunner = this.dataSource.createQueryRunner();
          await queryRunner.connect();
          await queryRunner.startTransaction();

          try {
            const store = transaction.orderItem.product.store;
            let storeAccount = store.storeAccount;

            if (!storeAccount) {
              storeAccount = queryRunner.manager.create(StoreAccount, {
                storeAccountId: v4(),
                currentAccount: 0.0,
                due: 0.0,
                unpaid: 0.0,
                store,
              });

              await queryRunner.manager.save(storeAccount);
              store.storeAccount = storeAccount;
              await queryRunner.manager.save(store);
            }

            // 1️⃣ Update StoreAccount balances
            storeAccount.currentAccount = Number(storeAccount.currentAccount) + Number(transaction.vendorEarning);
            storeAccount.due = Number(storeAccount.due) - Number(transaction.vendorEarning);
            store.processedRevenue = Number(store.processedRevenue) + Number(transaction.vendorEarning);

            await queryRunner.manager.save(storeAccount);
            await this.auditLog(AuditAction.STORE_UPDATED, { runId, storeAccount }, 2);

            // 2️⃣ Revenue History (Month + Year)
            try {
              await this.upsertRevenueMonthHistory(transaction, queryRunner);
              await this.upsertRevenueYearHistory(transaction, queryRunner);
              await this.auditLog(AuditAction.REVENUE_HISTORY_UPSERTED, { runId, transaction }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.REVENUE_HISTORY_FAILED, err, 2, { runId, transaction });
              throw err;
            }

            // 3️⃣ Revenue
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

            // 4️⃣ Commission Transaction processed flag
            try {
              await this.updateTransactionProcessStatus(transaction, queryRunner);
              await this.auditLog(AuditAction.COMMISSION_PROCESSED, { runId, transaction }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.COMMISSION_REVERSED, err, 2, { runId, transaction });
              throw err;
            }

            try {
              await this.upsertAccountMonthHistory(transaction, queryRunner);
              await this.auditLog(AuditAction.ACCOUNT_DAILY_AGGREGATED, { runId, transaction }, 2);
            } catch (err) {
              await this.auditLogError(AuditAction.ACCOUNT_DAILY_AGGREGATION_FAILED, err, 2, { runId, transaction });
              throw err;
            }

            await this.recordLedgerEntry(
              queryRunner,
              storeAccount,
              LedgerType.CREDIT,
              transaction.vendorEarning,
              transaction.id.toString(),
              `Vendor earning for transaction ${transaction.id}`
            );

            await this.recordLedgerEntry(
              queryRunner,
              storeAccount,
              LedgerType.CREDIT,
              transaction.commissionAmount,
              transaction.id.toString(),
              `Commission for transaction ${transaction.id}`
            );

            // 5️⃣ Commit transaction
            await queryRunner.commitTransaction();
          } catch (err) {
            await queryRunner.rollbackTransaction();
            await this.auditLogError(AuditAction.PAYMENT_EVALUATION_FAILED, err, 2, { runId, transaction });
            throw err;
          } finally {
            await queryRunner.release();
          }
        }

        await this.auditLog(AuditAction.BATCH_COMPLETED, { runId, batchStart: i, batchEnd: i + batch.length }, 2);
      }

      await this.auditLog(AuditAction.PAYMENT_EVALUATION_COMPLETED, { runId, finishedAt: new Date() }, 2);
    } catch (err) {
      await this.auditLogError(AuditAction.PAYMENT_EVALUATION_FAILED, err, 2, { runId, failedAt: new Date() });
      throw err;
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async rollUpMonthlyAccountHistory() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const month = lastMonth.getMonth() + 1;
    const year = lastMonth.getFullYear();

    const totals = await this.accountMonthHistoryRepo
      .createQueryBuilder("hist")
      .select("SUM(hist.totalCommission)", "totalCommission")
      .addSelect("SUM(hist.totalTax)", "totalTax")
      .addSelect("SUM(hist.totalShipping)", "totalShipping")
      .where("hist.month = :month AND hist.year = :year", { month, year })
      .getRawOne();

    if (totals && totals.totalCommission) {
      const account = await this.accountRepo.findOne({ where: {} });
      if (account) {
        account.currentAccount = Number(account.currentAccount) + Number(totals.totalCommission);
        await this.accountRepo.save(account);
        await this.auditLog(AuditAction.ACCOUNT_MONTHLY_ROLLED_UP, { month, year, totals }, 2);
      }
    }
  }


}
