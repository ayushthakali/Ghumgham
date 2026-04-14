import { type Request, type Response } from "express";
import { db } from "../db/index.js";

export const getDestinations = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      minCost,
      maxCost,
      rating,
    } = req.query as any;

    const offset = (parseInt(page) - 1) * parseInt(limit); //skip this many rows

    let query = `SELECT * FROM destinations WHERE 1=1`;
    const params = [];

    if (search) {
      query += ` AND name LIKE ?`;
      params.push(`%${search}%`);
    }
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }
    if (minCost) {
      query += ` AND cost >= ?`;
      params.push(Number(minCost));
    }
    if (maxCost) {
      query += ` AND cost <= ?`;
      params.push(Number(maxCost));
    }
    if (rating) {
      query += ` AND rating >= ?`;
      params.push(Number(rating));
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(page), Number(offset));

    const data = await db.all(query, params);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const destination = await db.get(
      `SELECT * FROM destinations WHERE id = ?`,
      [id],
    );

    if (!destination) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const { name, cost, category, rating, image_url, description } = req.body;

    if (!name || !cost || !category) {
      return res
        .json(400)
        .json({ error: "Name, cost and category are required" });
    }
    const result = await db.run(
      `INSERT INTO destinations (name, cost, category, rating, image_url, description) VALUES (?,?,?,?,?,?)`,
      [name, cost, category, rating, image_url, description],
    );

    res.json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, cost, category, rating, image_url, description } = req.body;

    const result = await db.run(
      `UPDATE destinations SET name=?, cost=?, category=?, rating=?, image_url=?, description=? WHERE id=?`,
      [name, cost, category, rating, image_url, description, id],
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Destination Updated" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const destination = await db.get(
      `SELECT * FROM destinations WHERE id = ?`,
      [id],
    );

    if (!destination) {
      return res.status(404).json({ error: "Not found" });
    }

    await db.run(`DELETE FROM destinations WHERE id = ?`, [id]);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
