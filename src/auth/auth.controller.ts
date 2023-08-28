import { Put, Body, Controller, Get, HttpException, Delete, HttpStatus, Post, Query, Param } from "@nestjs/common";

import AuthService from "./auth.service";

@Controller("auth")
export default class AuthController{
  constructor(private authService: AuthService){}

  
}