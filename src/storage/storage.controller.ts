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
    return this.storageService.delete(req, files);
  }
}
