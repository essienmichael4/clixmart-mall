import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/productImage.entity';
import { ProductReview } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductReview])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
