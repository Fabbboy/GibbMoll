import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { isNone, Option } from '../RO/Option';
import { fileService } from '../main';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { MoveFilesDto } from './storage.dto';

@Injectable()
export default class StorageService {
  moveFiles(movefilesDto: MoveFilesDto) {
    throw new Error('Method not implemented.');
  }
  constructor(private databaseService: DatabaseService) {}

  async upload(
    req: Request,
    files: Array<Multer.File>,
    override: Option<string>,
  ) {
    const path = fileService.createOrGetUserFolder(req['user'].username);
    for (const file of files) {
      if (isNone(override)) {
        if (fs.existsSync(`${path}/${file.originalname}`)) {
          return new HttpException(
            'File already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      fs.writeFileSync(`${path}/${file.originalname}`, file.buffer);
    }

    const objs: Prisma.FilesCreateManyInput[] = [];

    for (const file of files) {
      objs.push({
        userId: req['user'].sub as number,
        filename: file.originalname as string,
        path: path as string,
        folder: false as boolean,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        mimetype: file.mimetype as string,
        size: file.size as number,
      });
    }

    this.databaseService.files.createMany({ data: objs });

    return {
      message: 'File uploaded successfully',
      paths: files.map((file) => path + '/' + file.originalname),
    };
  }

  async list(req: Request) {
    const path = fileService.createOrGetUserFolder(req['user'].username);
    const files = fs.readdirSync(path);
    return {
      files: files.map((file) => path + '/' + file),
    };
  }
}
