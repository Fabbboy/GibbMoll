import { IsNotEmpty, IsString } from 'class-validator';

export interface UserWithoutPassword {
  username: string;
  creationDate: bigint;
  id: number;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface DeleteUserDto {
  username: string;
}
