import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileImage } from './entities/profileImage.entity';
import { UploadModule } from 'src/upload/upload.module';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfileImage, Address]), UploadModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports:[UserService]
})
export class UserModule {}
