import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { isNone, Option } from '../RO/Option';
import { fileService } from '../main';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { MoveFilesDto } from './storage.dto';

@Injectable()
export default class StorageService {
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

  moveFiles(req: Request, movefilesDto: MoveFilesDto) {
    const username = req['user'].username;
    console.log(`Username: ${username}`);
    const userBasePath = `.cloud/users/${username}`;
    
    if (!movefilesDto || !movefilesDto.files || !movefilesDto.destination) {
      return {
        message: 'Invalid or incomplete data',
      };
    }
  
    // Validate paths
    if (
      !this.validatePath(username, movefilesDto.destination) ||
      !movefilesDto.files.every((file) => this.validatePath(username, file))
    ) {
      return {
        message: 'Permission denied',
      };
    }
  
    try {
      for (const file of movefilesDto.files) {
        const absoluteSrcPath = path.join(userBasePath, file);
        const absoluteDestPath = path.join(userBasePath, path.basename(file));
        const absoluteDestDir = path.join(userBasePath, movefilesDto.destination);
        
        console.log(`Checking existence: Source(${absoluteSrcPath}), Destination(${absoluteDestDir})`);
        
        if (!fs.existsSync(absoluteSrcPath) || !fs.existsSync(absoluteDestDir)) {
          console.log(`File or Directory not found. Source Exists: ${fs.existsSync(absoluteSrcPath)}, Destination Exists: ${fs.existsSync(absoluteDestDir)}`);
          return {
            message: 'Source or destination does not exist',
          };
        }
  
        fs.renameSync(
          absoluteSrcPath,
          path.join(absoluteDestDir, path.basename(file)),
        );
      }
  
      return {
        message: 'Files moved successfully',
      };
    } catch (e) {
      console.error(e);
      return {
        message: 'Error moving files: ' + e.message,
      };
    }
  }
  
  private validatePath(username: string, path: string): boolean {
    return path.startsWith(`.cloud/users/${username}`);
  }
}
