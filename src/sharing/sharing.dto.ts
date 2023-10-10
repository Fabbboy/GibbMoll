import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateShareDto {
  @IsNotEmpty()
  @IsNumber()
  fileId: number;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsDate()
  expirationDate: Date;
}
