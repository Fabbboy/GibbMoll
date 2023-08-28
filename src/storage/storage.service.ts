import { Injectable } from "@nestjs/common";
import * as Multer from "multer";
import * as fs from "fs";
import { HttpException, HttpStatus } from "@nestjs/common";
import User from "../entities/User";

function createOrAcceptFolder(user:User):boolean{
  try {
    if(fs.existsSync("./.cloud/" + user.username)){
      return true;
    }else{
      fs.mkdirSync("./.cloud/" + user.username);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

@Injectable({})
export default class StorageService{
  async upload(files: Array<Multer.File>,user:User, override:boolean){
    const root = "./.cloud";
    try {
      if (!fs.existsSync(root)) {
        return new HttpException("Internal file system error", HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if(createOrAcceptFolder(user)){
        for (const file of files) {
          if(override){
            fs.writeFileSync(root + "/" + user.username + "/" + file.originalname, file.buffer);
          }else {
            if(fs.existsSync(root + "/" + user.username + "/" + file.originalname)){
              return new HttpException("Can't override file", HttpStatus.CONFLICT);
            }else{
              fs.writeFileSync(root + "/" + user.username + "/" + file.originalname, file.buffer);
            }
          }
        }
      }else{
        return new HttpException("User folder not found and can't be created", HttpStatus.INTERNAL_SERVER_ERROR);
      }

    } catch (err) {
      console.error(err);
      return new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
