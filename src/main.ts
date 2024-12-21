// E-Learning-Backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add CORS configuration here
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001); // or whatever port you're using
}
bootstrap();