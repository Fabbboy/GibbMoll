import { Option } from "../RO/Option";

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
  updatedAt: BigInt
  parent: Option<string>
  isShared: Option<boolean>
}



