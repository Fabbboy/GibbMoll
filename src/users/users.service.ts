import { Injectable } from '@nestjs/common';
import User from 'src/entities/User';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findOne(username: string) {
    // const result: User = (
    //   (await database.connector.query(
    //     'SELECT * from users WHERE username = ?',
    //     username,
    //   )) as Array<User>
    // ).pop();

    const result = await this.databaseService.user.findFirstOrThrow({
      where: { username },
    });

    return new User(
      result.username,
      result.password,
      result.creationDate,
      result.id,
    );
  }

  async createOne(user: Omit<User, 'id'>) {
    const result = await this.databaseService.user.create({
      data: { ...user },
    });

    console.log(result);
  }
}
