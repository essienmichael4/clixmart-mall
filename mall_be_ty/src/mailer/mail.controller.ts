import { Body, Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResetPasswordEventDto } from './dto/resetpassword.dot';
import { SuccessfulOrderEventDto } from './dto/successOrder.dto';
import { ProductReponseDto } from 'src/product/dto/response.dto';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @OnEvent("order.created")
  successfulOrderEmail(@Body() payload:SuccessfulOrderEventDto){
    return this.mailService
  }

  confirmOrderEmail(){

  }

  @OnEvent("reset.password")
  resetPassword(payload:ResetPasswordEventDto){
    return this.mailService.sendResetPasswordLink(payload)
  }
}
