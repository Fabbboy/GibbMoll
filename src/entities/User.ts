

export default class User {
  username: string
  password: string
  creationDate: bigint

  constructor(username:string, password:string, creationDate: bigint){
    this.username = username
    this.password = password
    this.creationDate = creationDate
  };
}