import { Put, Body, Controller, Get, HttpException, Delete, HttpStatus, Post, Query, Param, HttpCode } from "@nestjs/common";

import AuthService from "./auth.service";

@Controller("auth")
export default class AuthController{
  constructor(private authService: AuthService){}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() singInDto: Record<string, any>) {
    return this.authService.signIn(singInDto.username, singInDto.password)
  }
  
}