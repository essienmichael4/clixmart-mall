import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Follow } from './entities/follow.entity';
import { StoreImage } from './entities/storeImage.entity';
import { StoreReview } from './entities/storeReview.entity';
import { PaymentDetail } from './entities/paymentDetails.entity';
import { StoreDetail } from './entities/storeDetails.entity';
import { StoreAddress } from './entities/storeAddress.entity';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { NextOfKin } from './entities/nextOfKin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Follow, StoreImage, StoreReview, PaymentDetail, StoreDetail, StoreAddress, NextOfKin, User]),
    UserModule
  ],
  controllers: [StoreController],
  providers: [StoreService, JwtService],
})
export class StoreModule {}
