import { Optional } from "@nestjs/common";
import { None, Option } from "../RO/Option";

export enum FileTypes{
  FILE = 'FILE',
  FOLDER = 'FOLDER'
}

type Bytearray = Uint8Array | number[];

export interface File{
  name: string
  size:BigInt
  type: FileTypes 
  content: Option<Bytearray>
  createdAt: BigInt
  updatedAt: Option<BigInt>
  parent: Option<string>
  isShared: Option<boolean>
}

function createFile(
  name: string,
  size: BigInt,
  // type: FileTypes,
  content: Option<Bytearray>,
  createdAt: BigInt,
  updatedAt: Option<BigInt>,
  parent: Option<string>,
  isShared: Option<boolean>
): File{
  let type: FileTypes = FileTypes.FILE;
  let file: File = {
    name,
    size,
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
  name: string,
  size: BigInt,
  // type: FileTypes,
  createdAt: BigInt,
  updatedAt: Option<BigInt>,
  parent: Option<string>,
  isShared: Option<boolean>
): File{
  let type: FileTypes = FileTypes.FOLDER;
  let file: File = {
    name,
    size,
    type,
    content: None,
    createdAt,
    updatedAt,
    parent,
    isShared
  }

  return file;
}