import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserWithoutPassword } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import User from '../entities/User';
import database from '../Database/Database';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
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

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
