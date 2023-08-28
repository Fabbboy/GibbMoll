import { Controller, Post, UploadedFiles, UseInterceptors, Query, Req, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express'; // Import the express Request type for better type checking
import StorageService from './storage.service';
import * as Multer from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import User from '../entities/User';

@Controller("storage")
export default class StorageController{
  constructor(private storageService: StorageService){}

  @Post("upload")
  @UseInterceptors(FilesInterceptor("file"))
  async upload(
    @UploadedFiles() files: Array<Multer.File>,
    @Query('override') override: string,
    @Req() request: Request
  ) {
    console.log(files )
    console.log("Check auth and get user folder and make mapping better")
    const user:User = new User("testUser", "testUserpassword", BigInt(22222), 1)
    if (!files) {
      return new HttpException("No files provided", HttpStatus.BAD_REQUEST);
    }

    let overrideBool: boolean = override === "true";

    return this.storageService.upload(files, user, overrideBool);
  }
}