import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  ValidationPipe,
  UnauthorizedException,
  Delete,
  Put,
  Query,
  BadRequestException,
  Get,
} from '@nestjs/common';
import User from 'src/entities/User';
import { LocalAuthGuard } from './local-guard.guard';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto, DeleteUserDto } from './user.dto';
import { UsersService } from 'src/users/users.service';
import { AdminService } from '../admin/admin.service';
import { UpdateUserDto } from 'src/users/users.dto';
import {
  Omit,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

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
    console.log(createUser);
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
  @Delete('delete')
  async deleteUser(@Body() deleteUser: DeleteUserDto, @Request() req) {
    if (!(await this.adminService.isUserAdmin(req.user.username))) {
      throw new UnauthorizedException('Not a Admin');
    } else if (deleteUser.username == 'admin') {
      throw new BadRequestException('You should not delete the admin user');
    }

    return await this.usersService.deleteUser(deleteUser.username);
  }

  @Put('update')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Query() username: string,
    @Request() req,
  ) {
    if (!(await this.adminService.isUserAdmin(req.user.username))) {
      throw new UnauthorizedException('Not a Admin');
    }

    try {
      return await this.usersService.updateUser(username, updateUserDto);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code == 'P2025') {
        throw new BadRequestException('Could not find User');
      }

      throw e;
    }
  }

  @Get('users')
  async users(@Request() req) {
    if (!(await this.adminService.isUserAdmin(req.user.username))) {
      throw new UnauthorizedException('Not a Admin');
    }

    const result = await this.usersService.all();

    return result.map((value: any) => {
      const save = value.creationDate;
      delete value.creationDate;
      delete value.password;
      value.creationDate = save.toString();
      return value;
    });
  }
}
