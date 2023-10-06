import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import User from '../entities/User';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.usersService.findOne(username);
      if (user && user.password == pass) {
        const result: Omit<User, 'password'> = user;
        return result;
      }
      return null;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async login(user: { username: string; id: number }) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
