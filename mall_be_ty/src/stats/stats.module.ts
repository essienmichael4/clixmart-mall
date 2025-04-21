import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/category/entities/subcategory.entity';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserMonthHistory } from 'src/product/entities/UserMonthHistory.entity';
import { UserYearHistory } from 'src/product/entities/UserYearHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Store, Order, OrderItem, User, Category, SubCategory, Brand, MonthHistory, UserMonthHistory, YearHistory, UserYearHistory]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
