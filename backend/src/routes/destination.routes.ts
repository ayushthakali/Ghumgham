import {
  getDestinationById,
  getDestinations,
  updateDestination,
  deleteDestination,
  createDestination,
} from "../controllers/destination.controller.js";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getDestinations);
router.get("/:id", getDestinationById);

router.post("/", protect, createDestination);
router.put("/:id", protect, updateDestination);
router.delete("/:id", protect, deleteDestination);

export default router;
