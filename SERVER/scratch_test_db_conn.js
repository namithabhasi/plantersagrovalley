import "dotenv/config";
import mongoose from "mongoose";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

const test = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB:", conn.connection.host);

    console.log("Fetching categories...");
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories.`);
    if (categories.length > 0) {
      console.log("Sample Category:", categories[0]);
    }

    console.log("Fetching products...");
    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);
    if (products.length > 0) {
      console.log("Sample Product:", products[0]);
    }

    mongoose.connection.close();
    console.log("Connection closed.");
  } catch (err) {
    console.error("Database Test Error:", err);
    process.exit(1);
  }
};

test();
