import { Body, Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResetPasswordEventDto } from './dto/resetpassword.dot';
import { SuccessfulOrderEventDto } from './dto/successOrder.dto';
import { UploadService } from 'src/upload/upload.service';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailService: MailService, private readonly uploadService: UploadService) {}

  @OnEvent("order.created")
  successfulOrderEmail(@Body() payload:SuccessfulOrderEventDto){
    return this.mailService.sendSuccessfullOrderMail(payload)
  }

  confirmOrderEmail(){

  }

  @OnEvent("reset.password")
  resetPassword(payload:ResetPasswordEventDto){
    return this.mailService.sendResetPasswordLink(payload)
  }
}
