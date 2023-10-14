export interface UserWithoutPassword {
  username: string;
  creationDate: bigint;
  id: number;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface DeleteUserDto {
  username: string;
}
