import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { isNone, Option } from '../RO/Option';
import { fileService } from '../main';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { DeleteDto, DownloadDto, MkdirDto, MoveFilesDto } from './storage.dto';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

class User {
  username: string;
  sub: number;
}

@Injectable()
export default class StorageService {
  constructor(private databaseService: DatabaseService) {}

  async upload(
    req: Request,
    files: Array<multer.File>,
    override: Option<string>,
  ) {
    const user = this.getUser(req.user);

    const path = fileService.createOrGetUserFolder(user.username);
    for (const file of files) {
      const filePath = `${path}/${file.originalname}`;

      if (!isNone(override)) {
        // If override is enabled, remove the existing file and database entry
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        const existingFile = await this.databaseService.files.findFirst({
          where: {
            userId: user.sub as number,
            filename: file.originalname,
          },
        });

        if (existingFile) {
          await this.databaseService.files.delete({
            where: { id: existingFile.id },
          });
        }
      } else if (fs.existsSync(filePath)) {
        return new HttpException('File already exists', HttpStatus.BAD_REQUEST);
      }

      fs.writeFileSync(filePath, file.buffer);
    }

    const objs: Prisma.FilesCreateManyInput[] = [];
    for (const file of files) {
      objs.push({
        userId: user.sub as number,
        filename: file.originalname as string,
        path: path as string,
        folder: false as boolean,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        mimetype: file.mimetype as string,
        size: file.size as number,
        absolutePath: `${path}/${file.originalname}` as string,
      });
    }

    try {
      await this.databaseService.files.createMany({ data: objs });
    } catch (e) {
      console.error(e);
      // Delete the files from the disk if database insertion fails
      for (const file of files) {
        fs.unlinkSync(`${path}/${file.originalname}`);
      }
      return {
        message: 'Error uploading files',
      };
    }

    return {
      message: 'File uploaded successfully',
      paths: files.map((file) => path + '/' + file.originalname),
    };
  }

  async list(req: Request) {
    const user = this.getUser(req.user);

    const rootPath = fileService.createOrGetUserFolder(user.username);

    // Function to recursively get all files
    const getAllFiles = (dirPath, arrayOfFiles) => {
      const files = fs.readdirSync(dirPath);

      arrayOfFiles = arrayOfFiles || [];

      files.forEach((file) => {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
          arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
        } else {
          arrayOfFiles.push(path.join(dirPath, '/', file));
        }
      });

      return arrayOfFiles;
    };

    // Get all files in the root directory and subdirectories
    const allFiles = getAllFiles(rootPath, []);

    // Fetch all files belonging to the user from the database
    const filesInDb = await this.databaseService.files.findMany({
      where: { userId: user.sub as number },
    });

    // Filter out the files that are not in the database
    const filesToReturn = allFiles.filter((file) => {
      const filename = path.basename(file);
      return filesInDb.some((dbFile) => dbFile.filename === filename);
    });

    //also get all files where the user has reference to
    const sharedFiles = await this.databaseService.reference.findMany({
      where: { userId: user.sub as number },
    });

    // now we have references now we need to get the files from the database
    const filesToReturnFromShared = await this.databaseService.files.findMany({
      where: { id: { in: sharedFiles.map((f) => f.fileId) } },
    });

    // filter everything bu tthe absolute path
    const sharedFilesToReturn = filesToReturnFromShared.map(
      (f) => f.absolutePath,
    );

    return {
      files: filesToReturn,
      sharedFiles: sharedFilesToReturn,
    };
  }

  async moveFiles(req: Request, movefilesDto: MoveFilesDto) {
    try {
      const user = this.getUser(req.user);

      const username = user.username;
      const sourcePath = fileService.createOrGetUserFolder(username);
      const destinationPath = path.join(sourcePath, movefilesDto.destination);

      // Log for debugging
      console.log(
        `Source path: ${sourcePath}, Destination path: ${destinationPath}`,
      );

      // Check if destination folder exists, if not create it
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
      }

      const filesInDb = await this.databaseService.files.findMany({
        where: { userId: user.sub as number },
      });

      const filesToMove = filesInDb.filter((file) => {
        return movefilesDto.files.includes(file.filename);
      });

      if (filesToMove.length === 0) {
        return {
          message: 'No files found to move',
        };
      }

      for (const file of filesToMove) {
        const oldPath = path.join(sourcePath, file.filename);
        const newPath = path.join(destinationPath, file.filename);

        // Log for debugging
        console.log(`Moving file from ${oldPath} to ${newPath}`);

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);

          // Update the file path in the database
          await this.databaseService.files.update({
            where: { id: file.id },
            data: { path: destinationPath, absolutePath: newPath },
          });
        } else {
          console.log(
            `File ${file.filename} does not exist in the source directory.`,
          );
        }
      }

      return {
        message: 'Files moved successfully',
      };
    } catch (error) {
      console.error('An error occurred:', error);
      return {
        message: `An error occurred while moving files: ${error.message}`,
      };
    }
  }

  async mkdir(req: Request, mkdirDto: MkdirDto) {
    try {
      const user = this.getUser(req.user);

      const username = user.username;
      const path = fileService.createOrGetUserFolder(username);
      const folderPath = path + '/' + mkdirDto.folderName;

      if (fs.existsSync(folderPath)) {
        return {
          message: 'Folder already exists',
        };
      }

      fs.mkdirSync(folderPath);

      return {
        message: 'Folder created successfully',
      };
    } catch (error) {
      console.error('An error occurred:', error);
      return {
        message: `An error occurred while creating the folder: ${error.message}`,
      };
    }
  }
  /*export class DeleteDto {
  @IsNotEmpty()
  files: string[];
}
*/
  async delete(req: Request, deleteDto: DeleteDto) {
    try {
      const user = this.getUser(req.user);

      const results = []; // To store deletion status for each file or directory

      const filesInDb = await this.databaseService.files.findMany({
        where: { userId: user.sub as number },
      });

      for (const file of deleteDto.files) {
        const username = user.username;
        const path = fileService.createOrGetUserFolder(username);
        const filePath = path + '/' + file;

        let deletedFromDB = false;
        let deletedFromFileSystem = false;

        const fileInDb = filesInDb.find((dbFile) => {
          return dbFile.path === '.cloud/users/' + user.username + file;
        });
        if (fileInDb) {
          await this.databaseService.files.delete({
            where: { id: fileInDb.id },
          });
          //delete all references to this file
          await this.databaseService.reference.deleteMany({
            where: { fileId: fileInDb.id },
          });

          deletedFromDB = true;
        }

        if (fs.existsSync(filePath)) {
          const fileStat = fs.statSync(filePath);
          if (fileStat.isDirectory()) {
            fs.rmdirSync(filePath, { recursive: true });
          } else {
            fs.unlinkSync(filePath);
          }
          deletedFromFileSystem = true;
        }

        results.push({
          filename: file,
        });
      }

      return {
        message: 'Files deleted successfully or not found',
        details: results,
      };
    } catch (error) {
      console.error('An error occurred:', error);
      return {
        message: `An error occurred while deleting files: ${error.message}`,
      };
    }
  }

  async download(req: Request, downloadDto: DownloadDto, res: Response) {
    const user = this.getUser(req.user);

    const username = user.username as string;
    const path = fileService.createOrGetUserFolder(username);

    const filePath = path + '/' + downloadDto.file;

    const fileStream = createReadStream(join(process.cwd(), filePath));
    fileStream.pipe(res);
  }

  getUser(user: Express.User): User {
    if ('sub' in user && this.isNumber(user.sub)) {
      if ('username' in user && this.isString(user.username)) {
        return {
          username: user.username as string,
          sub: user.sub as number,
        };
      }
    }
  }

  isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }
}
