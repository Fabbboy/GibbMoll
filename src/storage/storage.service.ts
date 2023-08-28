import { Injectable } from "@nestjs/common";
import * as Multer from "multer";

@Injectable({})
export default class StorageService{
  async upload(files: Array<Multer.File>, filename: string, size: number){
    return "good"
  }
}
