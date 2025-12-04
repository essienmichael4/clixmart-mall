import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from 'src/hub/entities/hub.entity';
import { Mmda } from 'src/hub/entities/metropolitan.entity';
import { Delivery } from './entities/delivery.entity';
import { User } from 'src/user/entities/user.entity';
import { Carrier } from './entities/carrier.entity';
import { Courier } from './entities/courier.entity';
import { Driver } from './entities/driver.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Shipment } from './entities/shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, User, Hub, Mmda, Vehicle, Carrier, Driver, Courier, Shipment])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
