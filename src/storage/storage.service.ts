import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import User from '../entities/User';
import * as crypto from 'crypto';
import { from, isNone, None, Option } from '../RO/Option';
import { JwtService } from '@nestjs/jwt';
import { fileService } from '../main';

@Injectable({})
export default class StorageService {
  async upload(req: User, files: Array<Multer.File>, override: Option<string>) {
    const path = fileService.createOrGetUserFolder(req.username);
    for (let file of files) {
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
    };
  }
}
