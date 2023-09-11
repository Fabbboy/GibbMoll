import * as fs from 'fs';
import User from '../../entities/User';
import * as crypto from 'crypto';
import { None, Option, from, isNone } from '../../RO/Option';
import path from 'path';

export class FileService {
  constructor() {
    if (!fs.existsSync('.cloud')) fs.mkdirSync('.cloud');
    if (!fs.existsSync('.cloud/users')) fs.mkdirSync('.cloud/users');
  }

  createOrGetUserFolder(username: string): string {
    if (!fs.existsSync(`.cloud/users/${username}`))
      fs.mkdirSync(`.cloud/users/${username}`);

    return '.cloud/users/' + username;
  }
}
