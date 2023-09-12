import {Pool} from "pg"
import * as process from "process";

const {NEXT_PUBLIC_HOST_DB, NEXT_PUBLIC_USER_DB, NEXT_PUBLIC_NAME_DB, NEXT_PUBLIC_PASSWORD_DB, NEXT_PUBLIC_PORT_DB} = process.env

let conn: any

if (!conn) {
  conn = new Pool({
    host: NEXT_PUBLIC_HOST_DB,
    user: NEXT_PUBLIC_USER_DB,
    database: NEXT_PUBLIC_NAME_DB,
    password: NEXT_PUBLIC_PASSWORD_DB,
    port: parseInt(NEXT_PUBLIC_PORT_DB as string),
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export {
  conn
}