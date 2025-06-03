import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { UploadModule } from 'src/upload/upload.module';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/upload/file.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), UploadModule],
  controllers: [SettingsController],
  providers: [SettingsService, JwtService, FileService, UploadService],
})
export class SettingsModule {}
