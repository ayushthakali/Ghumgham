import { open } from "sqlite"; //A wrapper around sqlite3 that adds Promise/async-await support
import sqlite3 from "sqlite3"; //The core driver — low level, talks directly to SQLite

//open -> opens/creates the database connection asynchronously
export const db = await open({
  filename: "./ghumgham.db", //Path to SQLite database file. If ghumgham.db doesn't exist, it gets automatically created. If it exists, it just opens it.
  driver: sqlite3.Database, //Tells sqlite which driver/engine to use internally.
});
