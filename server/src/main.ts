import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { bootUpStore } from "./product/data/store";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Pipes are Nest's way of data validation in apis. 
  // Transform = true enables implicit conversion of request payload to dto types 
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  
  // Setting global prefix so all endpoints originate from /api
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
  });

  //Configuration for API Docs
  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('Api Docs')
    .setVersion('1.0')
    .build();

  //Setting up Swagger Module
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/api-docs', app, document);

  await bootUpStore();
  await app.listen(3000);
}
bootstrap();
