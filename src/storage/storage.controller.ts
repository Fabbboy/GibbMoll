import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Query,
  Req,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express'; // Import the express Request type for better type checking
import StorageService from './storage.service';
import * as Multer from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import User from '../entities/User';
import { UploadFileDto } from './storage.dto';
import { from } from '../RO/Option';

@Controller('storage')
export default class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  @UsePipes(new ValidationPipe())
  async upload(
    @UploadedFiles() files: Array<Multer.File>,
    @Query() uploadFileDto: UploadFileDto,
    @Req() request,
  ) {
    if (!files) {
      return new HttpException('No files provided', HttpStatus.BAD_REQUEST);
    }

    return this.storageService.upload(
      request,
      files,
      from(uploadFileDto.override),
    );
  }

  @Get('list')
  async list(@Req() request) {
    return this.storageService.list(request);
  }
}
