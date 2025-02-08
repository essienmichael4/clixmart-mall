import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import { ValidationPipe } from '@nestjs/common';
// import {config} from 'aws-sdk'

async function bootstrap() {
  // config.update({
  //   accessKey: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_REGION
  // })
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  app.enableCors()
  app.setGlobalPrefix("api/v1")
  SwaggerModule.setup("api", app, createDocument(app))
  await app.listen(3000);
}
bootstrap();
