import * as fs from 'fs';
import { Option, from, isNone } from '../RO/Option.js';
import * as dotenv from 'dotenv';

let initalized = false

class Config {
  host: Option<string>;
  port: Option<number>;
  user: Option<string>;
  password: Option<string>;
  database: Option<string>;
  hostPort: Option<number>;

  constructor() {
    if (!initalized) {
      dotenv.config()
      initalized = true;
    }
    console.log(process.env)

    this.host = from(process.env.DB_HOST);
    this.port = from(parseInt(process.env.DB_PORT));
    this.user = from(process.env.DB_USER);
    this.password = from(process.env.DB_PASSWORD);
    this.database = from(process.env.DB);
    this.hostPort = from(parseInt(process.env.HOST_PORT));

    if (
      isNone(this.host) ||
      isNone(this.port) ||
      isNone(this.user) ||
      isNone(this.password) ||
      isNone(this.database)
    ) {
      throw new Error(
        'Could not read Database file: ' + JSON.stringify(Object.values(this)),
      );
    }
  }
}

export default Config;
