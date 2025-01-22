import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Follow } from './entities/follow.entity';
import { StoreImage } from './entities/storeImage.entity';
import { StoreReview } from './entities/storeReview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Follow, StoreImage, StoreReview])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
