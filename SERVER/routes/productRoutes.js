import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getLatestProducts,
  getRelatedProducts,
  getBestSellingProducts
} from "../controllers/productController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import { productValidator } from "../validators/productValidator.js";
import { uploadProductImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ===========================
        Public Routes
=========================== */

// Get all products
router.get("/", getProducts);

// Get featured products
router.get("/featured", getFeaturedProducts);
router.get("/latest", getLatestProducts);
router.get("/bestselling", getBestSellingProducts);

router.get("/:id/related", getRelatedProducts);

// Get single product
router.get("/:id", getProductById);

/* ===========================
    Admin / Super Admin
=========================== */

// Create product
router.post(
  "/",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadProductImages.array("images", 5),
  productValidator,
  createProduct
);
// Update product
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadProductImages.array("images", 5),
  productValidator,
  updateProduct
);

// Delete product (Soft Delete)
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  deleteProduct
);

export default router;