import "dotenv/config";
import app from "./app.js";
import { initDB } from "./db/init.js";

const PORT = process.env.PORT || 5000;

await initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
