import { Injectable } from '@nestjs/common';
import database from 'src/Database/Database';
import User from 'src/entities/User';

@Injectable()
export class UsersService {
  async findOne(username: string) {
    const result: User = (
      (await database.connector.query(
        'SELECT * from users WHERE username = ?',
        username,
      )) as Array<User>
    ).pop();
    return new User(
      result.username,
      result.password,
      result.creationDate,
      result.id,
    );
  }
  
  async createOne(user: Omit<User, 'id'>) {
    const result = await database.connector.query(
      `INSERT INTO users (username, password, creationDate) VALUES (?, ?, ?)`,
      [user.username, user.password, user.creationDate],
    );

    console.log(result);
  }
}
