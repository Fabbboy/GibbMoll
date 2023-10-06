//TODO: check user existance
import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  override: string | undefined;
}

export class MoveFilesDto {
  @IsNotEmpty()
  files: string[];

  @IsNotEmpty()
  destination: string;
}

export class MkdirDto {
  @IsNotEmpty()
  folderName: string;
}

export class DeleteDto {
  @IsNotEmpty()
  files: string[];
}


export class DownloadDto {
  @IsNotEmpty()
  file: string;
}