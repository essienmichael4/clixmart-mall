import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionSetting } from './entities/commissionSettings.entity';
import { CommissionTransaction } from './entities/commissionTransaction.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { VendorPayout } from './entities/vendorPayout.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionSetting, CommissionTransaction, OrderItem, VendorPayout, Category])],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {}
