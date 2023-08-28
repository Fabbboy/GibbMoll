import { Module } from "@nestjs/common";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { UsersModule } from "src/users/users.modules";
import {JwtModule} from "@nestjs/jwt"
import { jwtConstants } from "./constants";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '60s'}
    })
  ],
  controllers: [AuthController], 
  providers: [AuthService],
  exports: [AuthService]
})
export default class AuthModule {}
