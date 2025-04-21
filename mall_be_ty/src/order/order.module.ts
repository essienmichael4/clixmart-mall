import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OrderItem } from './entities/orderItem.entity';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';
import { UserMonthHistory } from 'src/product/entities/UserMonthHistory.entity';
import { UserYearHistory } from 'src/product/entities/UserYearHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User, MonthHistory, YearHistory, UserMonthHistory, UserYearHistory])],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
