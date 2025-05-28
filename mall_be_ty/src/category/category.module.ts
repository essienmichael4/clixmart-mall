import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/subcategory.entity';
import { UploadService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';
import { SecondLevelSubCategory } from './entities/secondLevelSubCategory.entity';
import { ThirdLevelSubCategory } from './entities/thirdLevelSubcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory, SecondLevelSubCategory, ThirdLevelSubCategory]), UploadModule],
  controllers: [CategoryController],
  providers: [CategoryService, UploadService],
})
export class CategoryModule {}
