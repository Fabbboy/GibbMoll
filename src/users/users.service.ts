import { Injectable } from "@nestjs/common";
import database from "src/Database/Database";
import User from "src/entities/User";

@Injectable()
export class UsersService {
  async findOne(username: string) {
    let result = await database.run("SELECT * from users WHERE username = ?", username)
    console.log(result)
    return new User(result.username, result.password, result.creationDate, result.id)
  }
}