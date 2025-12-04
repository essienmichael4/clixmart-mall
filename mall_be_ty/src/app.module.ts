import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { BrandModule } from './brand/brand.module';
import { UploadModule } from './upload/upload.module';
import { StatsModule } from './stats/stats.module';
import { MailModule } from './mailer/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SettingsModule } from './settings/settings.module';
import { CommissionModule } from './commission/commission.module';
import { ReportModule } from './report/report.module';
import { TrackingModule } from './tracking/tracking.module';
import { DepartmentModule } from './department/department.module';
import { DeliveryModule } from './delivery/delivery.module';
import { HubModule } from './hub/hub.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get("DB_HOST"),
        // port: +configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        // entities: [],
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize:true
      })
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    StoreModule,
    OrderModule,
    BrandModule,
    UploadModule,
    StatsModule,
    MailModule,
    SettingsModule,
    CommissionModule,
    ReportModule,
    TrackingModule,
    DepartmentModule,
    DeliveryModule,
    HubModule,
    LocationModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
