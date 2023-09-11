export default class User {
  username: string;
  password: string;
  creationDate: number;
  id: number;

  constructor(
    username: string,
    password: string,
    creationDate: number,
    id: number,
  ) {
    this.username = username;
    this.password = password;
    this.creationDate = creationDate;
    this.id = id;
  }
}
