import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import User from 'src/entities/User';
import { LocalAuthGuard } from './local-guard.guard';
import { Public } from './public.decorator';
import { JwtService } from '@nestjs/jwt';

function unixTimestmap() {
  return Math.floor(Date.now() / 1000);
}

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Request() req) {
    let user: User = req.user;

    const payload = { sub: user.id, username: user.username };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
