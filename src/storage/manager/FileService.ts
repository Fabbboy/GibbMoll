import * as fs from 'fs';

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
