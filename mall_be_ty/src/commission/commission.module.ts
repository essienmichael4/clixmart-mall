import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionSetting } from './entities/commissionSettings.entity';
import { CommissionTransaction } from './entities/commissionTransaction.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { VendorPayout } from './entities/vendorPayout.entity';
import { Category } from 'src/category/entities/category.entity';
import { AuditLog } from './entities/AuditLog.entity';
import { User } from 'src/user/entities/user.entity';
import { Account } from './entities/commissionAccount.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Account, CommissionSetting, CommissionTransaction, OrderItem, VendorPayout, Category, AuditLog, User])],
  controllers: [CommissionController],
  providers: [CommissionService, JwtService],
  exports: [CommissionService]
})
export class CommissionModule {}
