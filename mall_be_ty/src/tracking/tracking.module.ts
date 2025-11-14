import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracking } from 'src/order/entities/orderTracking.entity';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracking, Order])],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
