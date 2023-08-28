import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import {JwtService} from '@nestjs/jwt'

@Injectable()
export default class AuthService{
  constructor(private userService: UsersService,
    private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {sub: user.id, username: user.username}
    return {
      access_tokern: await this.jwtService.signAsync(payload)
    }

  }
}
