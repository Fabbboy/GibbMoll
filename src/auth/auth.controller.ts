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
import { AuthService } from './auth.service';

function unixTimestmap() {
  return Math.floor(Date.now() / 1000);
}

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Request() req) {
    let user: User = req.user;
    return this.authService.login(user);
  }
}
