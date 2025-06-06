import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionTransaction } from 'src/commission/entities/commissionTransaction.entity';
import { VendorPayout } from 'src/commission/entities/vendorPayout.entity';
import { User } from 'src/user/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { AccountStatementLine } from './dto/account-statement.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(CommissionTransaction) private readonly txRepo: Repository<CommissionTransaction>,
        @InjectRepository(VendorPayout) private readonly payoutRepo: Repository<VendorPayout>,
    ) {}

    async getVendorSummary(vendorId: number): Promise<any> {
        const [totalSales, totalCommission, totalEarnings, pendingCommission] = await Promise.all([
            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.saleAmount)', 'total')
            .where('tx.vendorId = :vendorId', { vendorId })
            .andWhere('tx.isReversed = false')
            .getRawOne(),

            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.commissionAmount)', 'total')
            .where('tx.vendorId = :vendorId', { vendorId })
            .andWhere('tx.isReversed = false')
            .getRawOne(),

            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.vendorEarning)', 'total')
            .where('tx.vendorId = :vendorId', { vendorId })
            .andWhere('tx.isReversed = false')
            .getRawOne(),

            this.txRepo
            .createQueryBuilder('tx')
            .select('SUM(tx.vendorEarning)', 'total')
            .where('tx.vendorId = :vendorId AND tx.isPaid = false AND tx.isReversed = false', { vendorId })
            .getRawOne(),
        ]);

        return {
            totalSales: parseFloat(totalSales.total || '0'),
            totalCommission: parseFloat(totalCommission.total || '0'),
            totalEarnings: parseFloat(totalEarnings.total || '0'),
            unpaidEarnings: parseFloat(pendingCommission.total || '0'),
        };
    }


    async getVendorPayoutHistory(vendorId: number): Promise<VendorPayout[]> {
        return this.payoutRepo.find({
            where: { vendor: { id: vendorId } },
            order: { createdAt: 'DESC' },
        });
    }

    async getTopVendors(limit = 10): Promise<any[]> {

        return this.txRepo
            .createQueryBuilder('tx')
            .select('tx.vendorId', 'vendorId')
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

    async getVendorAccountStatement(vendorId: number, startDate: Date, endDate: Date,): Promise<AccountStatementLine[]> {
        const transactions = await this.txRepo.find({
            where: {
            vendor: { id: vendorId },
            createdAt: Between(startDate, endDate),
            },
            relations: ['orderItem'],
            order: { createdAt: 'ASC' },
        });

        const payouts = await this.payoutRepo.find({
            where: {
            vendor: { id: vendorId },
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

}
