import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { FileService } from './storage/manager/FileService';
import { ValidationPipe } from '@nestjs/common';

export const fileService: FileService = new FileService();

async function bootstrap() {
  if (!fs.existsSync('.cloud')) fs.mkdirSync('.cloud');
  if (!fs.existsSync('.cloud/users')) fs.mkdirSync('.cloud/users');

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
