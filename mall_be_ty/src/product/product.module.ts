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

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductReview, Store, User, Category, SubCategory, Brand, Tag]),
    UploadModule
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
