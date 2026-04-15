import { type AuthRequest } from "../middleware/auth.middleware.js";
import { type Response } from "express";
import { db } from "../db/index.js";

export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await db.run(
      `INSERT INTO trips (user_id, total_cost) VALUES (?, ?)`,
      [userId, 0],
    );

    res.status(201).json({ tripId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addDestinationToTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { destinationId, tripId } = req.body;

    //Check for user ownership
    const trip = await db.get(
      `SELECT * FROM trips WHERE id = ? AND user_id = ?`,
      [tripId, userId],
    );

    if (!trip) return res.status(403).json({ error: "Unauthorized" });

    //Add destination to trip
    await db.run(
      `INSERT INTO trip_items (trip_id, destination_id) VALUES (?,?)`,
      [tripId, destinationId],
    );

    //Calculate total cost
    const result = await db.get(
      `SELECT SUM(d.cost) as total FROM trip_items ti JOIN destinations d ON ti.destination_id = d.id WHERE ti.trip_id = ?`,
      [tripId],
    );

    const total = result.total ?? 0;

    //Update the total cost of the trip
    await db.run(`UPDATE trips SET total_cost = ? WHERE id = ?`, [
      total,
      tripId,
    ]);

    res.json({ message: "Destination Added To Trip", total_cost: total });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
};

export const getUserTrips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const trips = await db.all(`SELECT * FROM trips WHERE user_id = ?`, [
      userId,
    ]);

    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTripDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const items = await db.all(
    `SELECT d.* FROM trip_items ti JOIN destinations d ON ti.destination_id = d.id WHERE ti.trip_id = ?`,
    [id],
  );

  res.json(items);
};

export const removeDestinationFromTrip = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { destinationId, tripId } = req.body;

    const trip = await db.get(
      `SELECT * FROM trips WHERE id = ? AND user_id = ?`,
      [tripId, userId],
    );
    if (!trip) return res.status(403).json({ error: "Unauthorized" });

    await db.run(
      `DELETE FROM trip_items WHERE trip_id = ? AND destination_id = ?`,
      [tripId, destinationId],
    );

    const items = await db.all(
      `SELECT d.cost FROM trip_items ti JOIN destinations d ON ti.destination_id = d.id WHERE ti.trip_id = ?`,
      [tripId],
    );

    const total = items.reduce((sum, item) => sum + item.cost, 0);

    await db.run(`UPDATE trips SET total_cost = ? WHERE id = ?`, [
      total,
      tripId,
    ]);

    res.json({ message: "Destination Removed From Trip", total_cost: total });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
