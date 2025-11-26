import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from 'src/hub/entities/hub.entity';
import { Mmda } from 'src/hub/entities/metropolitan.entity';
import { Delivery } from './entities/delivery.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, User, Hub, Mmda])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
