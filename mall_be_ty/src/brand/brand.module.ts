import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { JwtService } from '@nestjs/jwt';
import { UploadModule } from 'src/upload/upload.module';
import { SubCategory } from 'src/category/entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category, SubCategory]), UploadModule],
  controllers: [BrandController],
  providers: [BrandService, JwtService],
})
export class BrandModule {}
