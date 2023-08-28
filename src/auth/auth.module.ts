import { Module } from "@nestjs/common";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { UsersModule } from "src/users/users.modules";

@Module({
  imports: [UsersModule],
  controllers: [AuthController], 
  providers: [AuthService],     
})
export default class AuthModule {}
