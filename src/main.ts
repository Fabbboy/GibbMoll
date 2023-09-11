import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { FileService } from './storage/manager/FileService';

export const fileService: FileService = new FileService();

async function bootstrap() {
  if (!fs.existsSync('.cloud')) fs.mkdirSync('.cloud');
  if (!fs.existsSync('.cloud/users')) fs.mkdirSync('.cloud/users');

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
