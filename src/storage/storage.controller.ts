import { Controller, Post, UploadedFiles, UseInterceptors, Query, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express'; // Import the express Request type for better type checking
import StorageService from './storage.service';
import * as Multer from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller("storage")
export default class StorageController{
  constructor(private storageService: StorageService){}

  @Post("upload")
  @UseInterceptors(FilesInterceptor("file"))
  async upload(
    @UploadedFiles() files: Array<Multer.File>,
    @Query('filename') filename: string,
    @Query('size') size: number,
    @Req() request: Request
  ) {
    return this.storageService.upload(files, filename, size);
  }
}