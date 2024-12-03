import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//will remove later
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  //will add (Original)
 // const app = await NestFactory.create(AppModule);

  //will remove later(temp)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'), {  // 'static' is in the root folder
    prefix: '/',
  });  
  
  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
