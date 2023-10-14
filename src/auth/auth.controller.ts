import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import User from 'src/entities/User';
import { LocalAuthGuard } from './local-guard.guard';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto, DeleteUserDto } from './user.dto';
import { UsersService } from 'src/users/users.service';
import { AdminService } from '../admin/admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private adminService: AdminService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Request() req) {
    const user: User = req.user;
    return this.authService.login(user);
  }

  @Post('signup')
  async createOne(
    @Body(ValidationPipe) createUser: CreateUserDto,
    @Request() req,
  ) {
    const user: Omit<User, 'id'> = {
      username: createUser.username,
      password: createUser.password,
      creationDate: BigInt(Date.now()),
    };
    if (!(await this.adminService.isUserAdmin(req.user.username))) {
      throw new UnauthorizedException('Not a Admin');
    }
    return await this.usersService.createOne(user);
  }

  async deleteUser(@Body() deleteUser: DeleteUserDto, @Request() req) {
    if (!(await this.adminService.isUserAdmin(req.user.username))) {
      throw new UnauthorizedException('Not a Admin');
    }

    return await this.usersService.deleteUser(deleteUser.username);
  }
}
