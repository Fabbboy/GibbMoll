import * as fs from "fs";
import User from "../../entities/User";
import * as crypto from "crypto";
import { None, Option, from, isNone } from "../../RO/Option";

export class FileService{
  rootPath:string = "./.cloud/"
  usersPath:string = "./.cloud/users/"
  mappingsPath:string = "./.cloud/mappings.json" //=> to no have name conflicts we map all users to a ID

  constructor(){
    if(!fs.existsSync(this.rootPath)) 
      fs.mkdirSync(this.rootPath);
    if(!fs.existsSync(this.usersPath))
      fs.mkdirSync(this.usersPath);
  
    if(!fs.existsSync(this.mappingsPath))
      fs.writeFileSync(this.mappingsPath, "{}");
  }

  async createBinding(user:User):Promise<Option<string>>{
    const mapp = JSON.parse(fs.readFileSync(this.mappingsPath).toString());
    if (mapp[user.username] !== undefined) return from(mapp[user.username]);
    const vals = user.creationDate + user.username;
    const hash = crypto.createHash("sha256").update(vals).digest("hex");
    mapp[user.username] = hash;
    fs.writeFileSync(this.mappingsPath, JSON.stringify(mapp));
    fs.mkdirSync(this.usersPath + hash);
    return from(hash);
  }

  async getBinding(user:User):Promise<Option<string>>{
    const mapp = JSON.parse(fs.readFileSync(this.mappingsPath).toString());
    if (mapp[user.username] !== undefined) return from(mapp[user.username]);
    return None;
  }

  async emitFileToDB(user:User, file:File){
    
  }
}