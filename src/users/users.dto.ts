export interface UpdateUserDto {
  username: string | undefined;
  id: number | undefined;
  creationDate: number | undefined;
  password: string | undefined;
  isAdmin: boolean | undefined;
}
