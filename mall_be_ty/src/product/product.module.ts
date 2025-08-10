import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/productImage.entity';
import { ProductReview } from './entities/review.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/category/entities/subcategory.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { UploadModule } from 'src/upload/upload.module';
import { Tag } from './entities/tag.entity';
import { MonthHistory } from './entities/MonthHistory.entity';
import { UserMonthHistory } from './entities/UserMonthHistory.entity';
import { YearHistory } from './entities/YearHistory.entity';
import { UserYearHistory } from './entities/UserYearHistory.entity';
import { FileService } from 'src/upload/file.service';
import { UploadService } from 'src/upload/upload.service';
import { ProductOption } from './entities/productOption.entity';
import { ProductOptionValue } from './entities/productOptionValue.entity';
import { ProductSpecification } from './entities/productSpecification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductSpecification, ProductOption, ProductOptionValue, ProductImage, ProductReview, Store, User, Category, SubCategory, Brand, Tag, MonthHistory, UserMonthHistory, YearHistory, UserYearHistory]),
    UploadModule
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService, FileService, UploadService],
})
export class ProductModule {}
