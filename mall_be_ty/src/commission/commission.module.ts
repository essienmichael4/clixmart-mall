import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionSetting } from './entities/commissionSettings.entity';
import { CommissionTransaction } from './entities/commissionTransaction.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { Category } from 'src/category/entities/category.entity';
import { AuditLog } from './entities/AuditLog.entity';
import { User } from 'src/user/entities/user.entity';
import { Account } from './entities/commissionAccount.entity';
import { JwtService } from '@nestjs/jwt';
import { Store } from 'src/store/entities/store.entity';
import { RevenueMonthHistory } from 'src/settings/entities/revenueMonthHistory.entity';
import { Revenue } from 'src/settings/entities/revenue.entity';
import { RevenueYearHistory } from 'src/settings/entities/revenueYearHistory.entity';
import { AccountLedger } from './entities/AccountLegder.entity';
import { AccountMonthHistory } from './entities/AccountMonthHistory.entity';
import { VendorPayout } from 'src/store/entities/vendorPayout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountMonthHistory, Revenue, VendorPayout, RevenueMonthHistory, RevenueYearHistory, Store, CommissionSetting, CommissionTransaction, OrderItem, Category, AuditLog, User, AccountLedger])],
  controllers: [CommissionController],
  providers: [CommissionService, JwtService],
  exports: [CommissionService]
})
export class CommissionModule {}
