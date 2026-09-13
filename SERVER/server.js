import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";


const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB().then(async () => {
  try {
    const { seedMockProducts } = await import("./utils/seeder.js");
    await seedMockProducts();
  } catch (err) {
    console.error("Failed to seed mock products:", err);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});