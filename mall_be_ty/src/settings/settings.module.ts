import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { UploadModule } from 'src/upload/upload.module';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/upload/file.service';
import { UploadService } from 'src/upload/upload.service';
import { Tax } from './entities/tax.entity';
import { User } from 'src/user/entities/user.entity';
import { AuditLog } from 'src/commission/entities/AuditLog.entity';
import { CommissionModule } from 'src/commission/commission.module';
import { CategoryBanner } from './entities/categoriesBanner.entity';
import { Revenue } from './entities/revenue.entity';
import { RevenueYearHistory } from './entities/revenueYearHistory.entity';
import { RevenueMonthHistory } from './entities/revenueMonthHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tax, RevenueYearHistory, RevenueMonthHistory, Revenue, Banner, User, AuditLog, CategoryBanner]), UploadModule, CommissionModule],
  controllers: [SettingsController],
  providers: [SettingsService, JwtService, FileService, UploadService],
})
export class SettingsModule {}
