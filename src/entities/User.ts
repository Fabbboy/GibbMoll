export default class User {
  username: string;
  password: string;
  creationDate: bigint;
  id: number;

  constructor(
    username: string,
    password: string,
    creationDate: bigint,
    id: number,
  ) {
    this.username = username;
    this.password = password;
    this.creationDate = creationDate;
    this.id = id;
  }
}
