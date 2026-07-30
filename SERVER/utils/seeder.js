import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to generate deterministic MongoId from mockId string
export const getMongoIdFromMockId = (mockId) => {
  let hex = "";
  for (let i = 0; i < mockId.length; i++) {
    hex += mockId.charCodeAt(i).toString(16);
  }
  return hex.padEnd(24, "0").slice(0, 24);
};

const getCategoryName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const seedMockProducts = async () => {
  try {
    console.log("🌱 Starting Mock Product Database Seeding...");

    // Relative paths to frontend product pages from SERVER/utils/seeder.js
    const filesToParse = [
      { name: "Plants.jsx", path: path.join(__dirname, "../../FRONTEND/src/PAGES/Plants.jsx") },
      { name: "Seeds.jsx", path: path.join(__dirname, "../../FRONTEND/src/PAGES/Seeds.jsx") },
      { name: "Planterspage.jsx", path: path.join(__dirname, "../../FRONTEND/src/PAGES/Planterspage.jsx") },
      { name: "Fertilizers.jsx", path: path.join(__dirname, "../../FRONTEND/src/PAGES/Fertilizers.jsx") },
      { name: "Gardendecors.jsx", path: path.join(__dirname, "../../FRONTEND/src/PAGES/Gardendecors.jsx") },
    ];

    const productsToSeed = [];

    // Regex to match product items like: { id: '...', category: '...', name: '...', price: ... }
    const productRegex = /id:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*price:\s*(\d+)/g;

    for (const fileObj of filesToParse) {
      if (!fs.existsSync(fileObj.path)) {
        console.warn(`⚠️ Warning: Mock file not found at ${fileObj.path}. Skipping.`);
        continue;
      }

      const fileContent = fs.readFileSync(fileObj.path, "utf-8");
      let match;
      // Reset regex index
      productRegex.lastIndex = 0;

      while ((match = productRegex.exec(fileContent)) !== null) {
        const [_, id, categorySlug, name, priceStr] = match;
        productsToSeed.push({
          mockId: id,
          categorySlug: categorySlug.trim(),
          name: name.trim(),
          price: parseInt(priceStr, 10),
        });
      }
    }

    console.log(`🔍 Found ${productsToSeed.length} products to seed.`);

    // 1. Create or Find categories
    const categoryCache = {};
    for (const prod of productsToSeed) {
      const slug = prod.categorySlug;
      if (!categoryCache[slug]) {
        let category = await Category.findOne({ slug });
        if (!category) {
          category = await Category.create({
            name: getCategoryName(slug),
            slug: slug,
            description: `Seeded category for ${getCategoryName(slug)}`,
          });
          console.log(`✅ Created Category: ${category.name} (${slug})`);
        }
        categoryCache[slug] = category._id;
      }
    }

    // 2. Upsert Products
    let upsertCount = 0;
    for (const prod of productsToSeed) {
      const _id = getMongoIdFromMockId(prod.mockId);
      const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const sku = `SKU-${prod.mockId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const productData = {
        name: prod.name,
        slug: slug,
        sku: sku,
        description: `This is a premium high-quality ${prod.name} curated especially for Planters Agro Valley customers.`,
        price: prod.price,
        salePrice: prod.price,
        stock: 150, // default stock so they are inStock
        category: categoryCache[prod.categorySlug],
        images: [
          {
            url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
            public_id: "default_plant_image",
          },
        ],
        isActive: true,
        isDeleted: false,
      };

      // Check if product already exists to avoid overwriting description/images unnecessarily
      const existingProduct = await Product.findById(_id);
      if (!existingProduct) {
        await Product.create({
          _id,
          ...productData,
        });
        upsertCount++;
      } else {
        // Just update price and name in case mock data changed
        existingProduct.name = prod.name;
        existingProduct.price = prod.price;
        existingProduct.salePrice = prod.price;
        existingProduct.isDeleted = false;
        existingProduct.isActive = true;
        await existingProduct.save();
      }
    }

    console.log(`🎉 Database seeding completed. Seeded ${upsertCount} new products.`);
  } catch (error) {
    console.error("❌ Error seeding mock products:", error);
  }
};
