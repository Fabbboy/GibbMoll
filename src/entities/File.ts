import { Optional } from "@nestjs/common";
import { None, Option } from "../RO/Option";
import User from "./User";
export enum FileTypes{
  FILE = 'FILE',
  FOLDER = 'FOLDER'
}

type Bytearray = Uint8Array | number[];

export interface File{
  name: string
  creator: User
  path: string
  size:BigInt
  zip: boolean
  type: FileTypes 
  content: Option<Bytearray>
  createdAt: BigInt
  updatedAt: Option<BigInt>
  parent: Option<string>
  isShared: Option<boolean>
}

function createFile(
  creator: User,
  name: string,
  path:string,
  size: BigInt,
  // type: FileTypes,
  zip: boolean,
  content: Option<Bytearray>,
  createdAt: BigInt,
  updatedAt: Option<BigInt>,
  parent: Option<string>,
  isShared: Option<boolean>
): File{
  let type: FileTypes = FileTypes.FILE;
  let file: File = {
    creator,
    name,
    path,
    size,
    zip,
    type,
    content,
    createdAt,
    updatedAt,
    parent,
    isShared
  }

  return file;
}

function createFolder(
  creator: User,
  name: string,
  path:string,
  size: BigInt,
  // type: FileTypes,
  zip: boolean,
  createdAt: BigInt,
  updatedAt: Option<BigInt>,
  parent: Option<string>,
  isShared: Option<boolean>
): File{
  let type: FileTypes = FileTypes.FOLDER;
  let file: File = {
    creator,
    name,
    path,
    size,
    zip,
    type,
    content: None,
    createdAt,
    updatedAt,
    parent,
    isShared
  }

  return file;
}