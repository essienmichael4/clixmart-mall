import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { join } from "path";

export const mailerConfig: MailerOptions = {
    transport: {
        host: "smtp.gmail.com",
        auth: {
            user: "sell.clixmart@gmail.com",
            pass: "qouefenqybhdawkr"
        }
    }, 
    defaults: {
        from: 'sell.clixmart@gmail.com',
    },
    template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true
        }
    }
}
