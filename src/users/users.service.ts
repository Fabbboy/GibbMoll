import { Injectable } from '@nestjs/common';
import database from 'src/Database/Database';
import User from 'src/entities/User';

@Injectable()
export class UsersService {
  async findOne(username: string) {
    let result: User = (await database.connector.query('SELECT * from users WHERE username = ?', username) as Array<User>).pop()
    console.log(result);
    return new User(
      result.username,
      result.password,
      result.creationDate,
      result.id,
    );
  }
}
