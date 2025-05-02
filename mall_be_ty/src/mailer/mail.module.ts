import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { mailerConfig } from './mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { UploadModule } from 'src/upload/upload.module';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [MailController],
  providers: [MailService, UploadService],
  imports: [MailerModule.forRoot(mailerConfig), UploadModule]
})
export class MailModule {}
