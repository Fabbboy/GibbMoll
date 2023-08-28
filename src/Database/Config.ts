import * as fs from "fs";
import { Option, from, isNone } from "../RO/Option.js";

export function generateDefault() {
  if (fs.existsSync("config.json")) return;
  fs.writeFileSync(
    "config.json",
    JSON.stringify(
      {
        database: {
          host: "localhost",
          port: 3306,
          user: "",
          password: "",
          database: "",
        },
      },
      null,
      4
    )
  );
}
class Config {
  host: Option<string>;
  port: Option<number>;
  user: Option<string>;
  password: Option<string>;
  database: Option<string>;
  hostPort: Option<number>;

  constructor() {
    let obj: any = JSON.parse(fs.readFileSync("config.json").toString());

    this.host = from(obj["database"]["host"]);
    this.port = from(obj["database"]["port"]);
    this.user = from(obj["database"]["user"]);
    this.password = from(obj["database"]["password"]);
    this.database = from(obj["database"]["database"]);
    this.hostPort = from(obj["database"]["hostPort"] || 3000);

    if (
      isNone(this.host) ||
      isNone(this.port) ||
      isNone(this.user) ||
      isNone(this.password) ||
      isNone(this.database)
    ) {
      throw new Error("Could not read Database file");
    }
  }
}

export default Config;
