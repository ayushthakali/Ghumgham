import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../db/index.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in .env");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "All fields are required." });

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.run(
      `INSERT INTO users (email,password,name,provider) VALUES (?,?,?,?)`,
      [email, hashedPassword, name, "local"],
    );

    const token = jwt.sign({ id: result.lastID }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "2d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
