import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { HubController } from './hub.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HubType } from './entities/hub-type.entity';
import { Hub } from './entities/hub.entity';
import { Mmda } from './entities/metropolitan.entity';
import { Region } from './entities/region.entity';
import { Town } from './entities/town.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hub, HubType, Region, Mmda, Town])],
  controllers: [HubController],
  providers: [HubService],
})
export class HubModule {}
