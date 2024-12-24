// E-Learning-Backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { ServeStaticModule } from '@nestjs/serve-static';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 
  // app.enableCors({
  //   origin: 'http://localhost:3000', // Your frontend URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both origins
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Include OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
    credentials: true, // Support cookies/authentication
  });
  
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  
  // app.enableCors({
  //   origin: 'http://localhost:3001',
  //   credentials: true});
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();