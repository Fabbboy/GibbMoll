import { Injectable } from "@nestjs/common";
import * as Multer from "multer";
import * as fs from "fs";
import { HttpException, HttpStatus } from "@nestjs/common";
import User from "../entities/User";
import* as crypto from "crypto";
import { from, isNone, None, Option } from "../RO/Option";

@Injectable({})
export default class StorageService{
  async upload(files: Array<Multer.File>,user:User, override:boolean){
    
  }
}
