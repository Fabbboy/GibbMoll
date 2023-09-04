import * as mariadb from "mariadb";
import Config from "./Config.js";
import { unwrap } from "../RO/Option.js";

export class Database {
  connector: mariadb.Pool;

  constructor(config: Config) {
    this.connector = mariadb.createPool({
      host: unwrap(config.host),
      user: unwrap(config.user),
      password: unwrap(config.password),
      database: unwrap(config.database),
      port: unwrap(config.port),
    });

    /*this.connector = mariadb.createPool({
      host: "localhost",
      user: "root",
      password: "toor",
      database: "fss",
    });*/

    if (this.connector == null) {
      console.error("A connection to the database could not be established");
      process.exit(1);
    }
  }

  close() {
    this.connector.end();
  }

  async run(
    query: string | mariadb.QueryOptions,
    ...args: any[]
  ): Promise<any> {
    return await this.connector.query(query, ...args);
  }
}
const database = new Database(new Config())
export default database;
