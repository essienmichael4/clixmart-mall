import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionTransaction } from 'src/commission/entities/commissionTransaction.entity';
import { User } from 'src/user/entities/user.entity';
import { VendorPayout } from 'src/store/entities/vendorPayout.entity';
import { Store } from 'src/store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorPayout, CommissionTransaction, Store, User])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
