import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { FileService } from './storage/manager/FileService';

console.log(process.env)
const fileService:FileService = new FileService();

async function bootstrap() {
  if(!fs.existsSync(".cloud")) 
    fs.mkdirSync(".cloud");
  if(!fs.existsSync(".cloud/users"))
    fs.mkdirSync(".cloud/users");

  if(!fs.existsSync(".cloud/map.json"))
    fs.writeFileSync(".cloud/map.json", "{}");
  

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
