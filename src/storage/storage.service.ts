import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { from, isNone, isSome, None, Option, unwrap } from '../RO/Option';
import { fileService } from '../main';
import database from '../Database/Database';
function unixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

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

    let objs: [
      {
        creator: number;
        filename: string;
        path: string;
        folder: boolean;
        created_at: number;
        updated_at: number;
        mimetype: string;
        size: number;
      },
    ] = [] as any;

    for (const file of files) {
      objs.push({
        creator: req['user'].id as number,
        filename: file.originalname as string,
        path: path as string,
        folder: false as boolean,
        created_at: unixTimestamp() as number,
        updated_at: unixTimestamp() as number,
        mimetype: file.mimetype as string,
        size: file.size as number,
      });
    }

    for (const obj of objs) {
      await database.run(
        'INSERT INTO files (creator, filename, path, folder, created_at, updated_at, mimetype, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          obj.creator,
          obj.filename,
          obj.path,
          obj.folder,
          obj.created_at,
          obj.updated_at,
          obj.mimetype,
          obj.size,
        ],
      );      
    }

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
