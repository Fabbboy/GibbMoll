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
    let overrideBool: boolean = override === "true";
    console.log("Check auth and get user folder and make mapping better")
    if (!files) {
      return new HttpException("No files provided", HttpStatus.BAD_REQUEST);
    }
    const jwt = request.headers.authorization;
    if(!jwt){
      return new HttpException("Authorization failed", HttpStatus.UNAUTHORIZED);
    }

    //const usr: User = await AuthService.prototype.validateUser(jwt);
    const unixTimestmap:bigint = BigInt(Date.now());
    const templateUser = new User("test", "test", unixTimestmap, 0);

    return this.storageService.upload(files, templateUser, overrideBool);
  }
}