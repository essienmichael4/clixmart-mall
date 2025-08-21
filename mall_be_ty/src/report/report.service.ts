import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionTransaction } from 'src/commission/entities/commissionTransaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { AccountStatementLine } from './dto/account-statement.dto';
import { VendorPayout } from 'src/store/entities/vendorPayout.entity';
import { Store } from 'src/store/entities/store.entity';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(CommissionTransaction) private readonly txRepo: Repository<CommissionTransaction>,
        @InjectRepository(VendorPayout) private readonly payoutRepo: Repository<VendorPayout>,
        @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
    ) {}

    async getVendorSummary(storeId: number): Promise<any> {
        const [totalSales, totalCommission, totalEarnings, pendingCommission] = await Promise.all([
            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.saleAmount)', 'total')
            .where('tx.orderItem.product.store.id = :storeId', { storeId })
            .andWhere('tx.isReversed = false')
            .getRawOne(),

            this.payoutRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.commissionAmount)', 'total')
            .where('tx.orderItem.product.store.id = :storeId', { storeId })
            .andWhere('tx.isReversed = false')
            .getRawOne(),

            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.vendorEarning)', 'total')
            .where('tx.orderItem.product.store.id = :storeId', { storeId })
            .andWhere('tx.isReversed = false')
            .getRawOne(),

            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.vendorEarning)', 'total')
            .where('tx.orderItem.product.store.id = :storeId AND tx.isPaid = false AND tx.isReversed = false', { storeId })
            .getRawOne(),
        ]);

        return {
            totalSales: parseFloat(totalSales.total || '0'),
            totalCommission: parseFloat(totalCommission.total || '0'),
            totalEarnings: parseFloat(totalEarnings.total || '0'),
            unpaidEarnings: parseFloat(pendingCommission.total || '0'),
        };
    }


    async getVendorPayoutHistory(storeId: number): Promise<VendorPayout[]> {
        return this.payoutRepo.find({
            where: { store: { id: storeId } },
            order: { createdAt: 'DESC' },
        });
    }

    async getTopVendors(limit = 10): Promise<any[]> {

        return this.txRepo
            .createQueryBuilder('tx')
            .select('tx.orderItem.product.store.id', 'vendorId')
            .addSelect('SUM(tx.vendorEarning)', 'totalEarning')
            .where('tx.isReversed = false')
            .groupBy('tx.vendorId')
            .orderBy('totalEarning', 'DESC')
            .limit(limit)
            .getRawMany();
    }

    async getCommissionSummaryByDate(startDate: Date, endDate: Date): Promise<any> {
        const result = await this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.saleAmount)', 'totalSales')
            .addSelect('SUM(tx.commissionAmount)', 'totalCommission')
            .addSelect('SUM(tx.vendorEarning)', 'totalEarning')
            .where('tx.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
            .andWhere('tx.isReversed = false')
            .getRawOne();

        return {
            totalSales: parseFloat(result.totalSales || '0'),
            totalCommission: parseFloat(result.totalCommission || '0'),
            totalEarning: parseFloat(result.totalEarning || '0'),
        };
    }

    async getVendorAccountStatement(storeId: number, startDate: Date, endDate: Date,): Promise<AccountStatementLine[]> {
        const transactions = await this.txRepo.find({
            where: {
                orderItem: { 
                    product: {
                        store:{
                            id: storeId
                        }
                    }
                 },
                createdAt: Between(startDate, endDate),
            },
            relations: ['orderItem.product.store'],
            order: { createdAt: 'ASC' },
        });

        const payouts = await this.payoutRepo.find({
            where: {
                store: {id: storeId},
                createdAt: Between(startDate, endDate),
            },
            order: { createdAt: 'ASC' },
        });

        let statement: AccountStatementLine[] = [];
        let balance = 0;

        // 1. Add earnings per transaction
        for (const tx of transactions) {
            if (tx.isReversed) {
            statement.push({
                date: tx.reversedAt?.toISOString().split('T')[0] || '',
                description: `Reversal: Order Item #${tx.orderItem?.id}`,
                debit: tx.vendorEarning,
                credit: 0,
                balance: (balance -= tx.vendorEarning),
            });
            } else {
            statement.push({
                date: tx.createdAt.toISOString().split('T')[0],
                description: `Sale: Order Item #${tx.orderItem?.id}`,
                debit: 0,
                credit: tx.vendorEarning,
                balance: (balance += tx.vendorEarning),
            });
            }
        }

        // 2. Add payouts as debits
        for (const payout of payouts) {
            statement.push({
                date: payout.paidAt?.toISOString().split('T')[0] || payout.createdAt.toISOString().split('T')[0],
                description: `Payout #${payout.id}`,
                debit: payout.totalAmount,
                credit: 0,
                balance: (balance -= payout.totalAmount),
            });
        }

        // 3. Sort by date
        statement = statement.sort((a, b) => a.date.localeCompare(b.date));

        return statement;
    }

    async getTotalProcessedRevenue(): Promise<number> {
        const result = await this.storeRepo
            .createQueryBuilder('store')
            .select('COALESCE(SUM(store.processedRevenue), 0)', 'totalRevenue')
            .where('store.isDeleted = :isDeleted', { isDeleted: 'FALSE' })
            .getRawOne();

        return parseFloat(result.totalRevenue);
    }

}
