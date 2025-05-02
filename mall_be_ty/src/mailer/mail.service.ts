import { Injectable } from '@nestjs/common';
import { ResetPasswordEventDto } from './dto/resetpassword.dot';
import { MailerService } from '@nestjs-modules/mailer';
import { SuccessfulOrderEventDto } from './dto/successOrder.dto';
import { UploadService } from 'src/upload/upload.service';
import { ProductReponseDto } from 'src/product/dto/response.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private readonly uploadService: UploadService,){}

    async sendResetPasswordLink(payload: ResetPasswordEventDto){
        return await this.mailerService.sendMail({
            to: payload.email,
            from: process.env.EMAIL_SENDER,
            subject: "Password reset - CLIXMART",
            template: "resetPassword",
            context: {
                link: payload.link,
                email: payload.email,
                name: payload.name
            }
        })
    }

    async sendSuccessfullOrderMail(payload: SuccessfulOrderEventDto){
        const orderItems = payload.order.orderItems
        let products = []
        let subTotal = 0
        
        orderItems.map(async (item)=>{
            const product = new ProductReponseDto(item.product)
            product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

            const itemObject = {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: product.imageUrl
            } 
            products.push(itemObject)
            subTotal += (item.price * item.quantity)
        })

        return await this.mailerService.sendMail({
            to: payload.order.user.email,
            from: process.env.EMAIL_SENDER,
            subject: "CLIXMART Password Reset",
            template: "orderSuccessful",
            context: {
                order: payload.order,
                products,
                createdAt: new Date(payload.order.createdAt).toDateString(),
                subTotal
            }
        })
    }
}
