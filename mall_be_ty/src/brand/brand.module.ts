import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from './upload.service';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category])],
  controllers: [BrandController],
  providers: [BrandService, UploadService, JwtService, FileService],
})
export class BrandModule {}
