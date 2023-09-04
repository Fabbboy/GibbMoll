import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWithoutPassword } from './user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password == pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
