import { Router } from "express";
import {
  addDestinationToTrip,
  createTrip,
  getTripDetails,
  getUserTrips,
  removeDestinationFromTrip,
} from "../controllers/trip.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createTrip);
router.get("/", protect, getUserTrips);
router.get("/:id", protect, getTripDetails);

router.post("/add", protect, addDestinationToTrip);
router.delete("/remove", protect, removeDestinationFromTrip);

export default router;
