import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import User from 'src/entities/User';
import { LocalAuthGuard } from './local-guard.guard';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from './user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Request() req) {
    const user: User = req.user;
    return this.authService.login(user);
  }
  @Post('signup')
  @Public()
  async createOne(@Body(ValidationPipe) createUser: CreateUserDto) {
    const user: Omit<User, 'id'> = {
      username: createUser.username,
      password: createUser.password,
      creationDate: BigInt(Date.now()),
    };
    return await this.usersService.createOne(user);
  }
}
