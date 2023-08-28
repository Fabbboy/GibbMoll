import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
async function bootstrap() {
  if(!fs.existsSync(".cloud")) 
    fs.mkdirSync(".cloud");
  

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
