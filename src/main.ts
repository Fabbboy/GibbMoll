import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import dotenv from 'dotenv';
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
console.log(dotenv.config() + "hshs")
bootstrap();
