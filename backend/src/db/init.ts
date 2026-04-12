import { db } from "./index.js";

export async function initDB() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT,
      provider TEXT,
      provider_id TEXT
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      country TEXT DEFAULT 'Nepal',
      cost INTEGER,
      category TEXT,
      rating REAL,
      image_url TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_cost INTEGER
    );

    CREATE TABLE IF NOT EXISTS trip_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER,
      destination_id INTEGER
    );
  `);
}
