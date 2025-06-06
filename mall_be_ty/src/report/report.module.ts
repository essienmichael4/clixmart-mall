import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorPayout } from 'src/commission/entities/vendorPayout.entity';
import { CommissionTransaction } from 'src/commission/entities/commissionTransaction.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorPayout, CommissionTransaction, User])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
