import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
  Get,
  Body,
  Delete,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import StorageService from './storage.service';
import * as Multer from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  DeleteDto,
  DownloadDto,
  MkdirDto,
  MoveFilesDto,
  UploadFileDto,
} from './storage.dto';
import { from } from '../RO/Option';
import { Request, Response } from 'express';

@Controller('storage')
export default class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  @UsePipes(new ValidationPipe())
  async upload(
    @UploadedFile() file: Multer.File,
    @Query() uploadFileDto: UploadFileDto,
    @Req() request,
  ) {
    if (!file) {
      return new HttpException('No files provided', HttpStatus.BAD_REQUEST);
    }

    return await this.storageService.upload(
      request,
      file,
      from(uploadFileDto.override),
    );
  }

  @Get('list')
  async list(@Req() request) {
    return this.storageService.list(request);
  }

  @Post('move')
  @UsePipes(new ValidationPipe())
  async moveFiles(@Req() req, @Body() movefilesDto: MoveFilesDto) {
    return this.storageService.moveFiles(req, movefilesDto);
  }

  @Post('mkdir')
  @UsePipes(new ValidationPipe())
  async mkdir(@Req() req, @Body() mkdirDto: MkdirDto) {
    return this.storageService.mkdir(req, mkdirDto);
  }

  @Delete('delete')
  async delete(@Req() req, @Body() files: DeleteDto) {
    return await this.storageService.delete(req, files);
  }

  @Get('download')
  async download(
    @Req() req: Request,
    @Query() downloadDto: DownloadDto,
    @Res() res: Response,
  ) {
    try {
      return await this.storageService.download(req, downloadDto, res);
    } catch (e) {
      console.log('error' + e);
    }
  }
}
