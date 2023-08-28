import { Injectable } from "@nestjs/common";
import database from "src/Database/Database";

@Injectable()
export class UsersService {
  async findOne(username: string) {
    let result = database.run("SELECT * from users WHERE username = ?", username)
    console.log(result)
    return result
  }
}