import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("Secret Loaded:", !!process.env.CLOUDINARY_API_SECRET);
console.log(process.env.RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_KEY_SECRET);

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});