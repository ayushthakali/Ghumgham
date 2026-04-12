import app from "./app.js";
import dotenv from "dotenv";
import { initDB } from "./db/init.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

await initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
