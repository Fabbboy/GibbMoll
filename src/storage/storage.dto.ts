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
