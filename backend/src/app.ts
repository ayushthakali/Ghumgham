import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import { protect } from "./middleware/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use('/destinations',destinationRoutes)

app.get("/protected", protect, (req, res) => {
  res.json({ message: "Access granted" });
});

export default app;
