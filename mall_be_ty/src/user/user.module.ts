import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileImage } from './entities/profileImage.entity';
import { UploadModule } from 'src/upload/upload.module';
import { Address } from './entities/address.entity';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfileImage, Address, MonthHistory, YearHistory]), UploadModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports:[UserService]
})
export class UserModule {}
