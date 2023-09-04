import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import User from 'src/entities/User';
import { LocalAuthGuard } from './local-guard.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    let user: User = req.user;

    return {
      id: user.id,
      username: user.username,
      password: user.password,
      creationDate: user.creationDate.toString(),
    };
  }
}
