import { None, Option, from } from '../RO/Option';
import User from './User';

export enum FileTypes {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

type Bytearray = Uint8Array | number[];

export class File {
  name: string;
  creator: User;
  path: string;
  size: BigInt;
  zip: boolean;
  type: FileTypes;
  content: Option<Bytearray>;
  createdAt: BigInt;
  updatedAt: Option<BigInt>;
  parent: Option<string>;
  isShared: Option<boolean>;

  constructor(
    creator: User,
    name: string,
    path: string,
    size: BigInt,
    zip: boolean,
    type: FileTypes,
    content: Option<Bytearray>,
    createdAt: BigInt,
    updatedAt: Option<BigInt>,
    parent: Option<string>,
    isShared: Option<boolean>,
  ) {
    this.creator = creator;
    this.name = name;
    this.path = path;
    this.size = size;
    this.zip = zip;
    this.type = type;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.parent = parent;
    this.isShared = isShared;
  }

  static createFile(
    creator: User,
    name: string,
    path: string,
    size: BigInt,
    zip: boolean,
    content: Option<Bytearray>,
    createdAt: BigInt,
    updatedAt: Option<BigInt>,
    parent: Option<string>,
    isShared: Option<boolean>,
  ): File {
    return new File(
      creator,
      name,
      path,
      size,
      zip,
      FileTypes.FILE,
      content,
      createdAt,
      updatedAt,
      parent,
      isShared,
    );
  }

  static createFolder(
    creator: User,
    name: string,
    path: string,
    size: BigInt,
    zip: boolean,
    createdAt: BigInt,
    updatedAt: Option<BigInt>,
    parent: Option<string>,
    isShared: Option<boolean>,
  ): File {
    return new File(
      creator,
      name,
      path,
      size,
      zip,
      FileTypes.FOLDER,
      None,
      createdAt,
      updatedAt,
      parent,
      isShared,
    );
  }
}
