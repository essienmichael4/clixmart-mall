import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mmda } from 'src/hub/entities/metropolitan.entity';
import { Region } from 'src/hub/entities/region.entity';
import { Town } from 'src/hub/entities/town.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Town, Mmda])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
