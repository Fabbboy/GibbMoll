import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { isNone, None, Option } from '../RO/Option';
import { fileService } from '../main';

@Injectable({})
export default class StorageService {
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

    return {
      message: 'File uploaded successfully',
      paths: files.map((file) => path + '/' + file.originalname),
    };
  }
}
