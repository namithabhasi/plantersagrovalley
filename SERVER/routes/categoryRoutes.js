import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { uploadCategoryImage } from "../middleware/uploadMiddleware.js";

import { categoryValidator } from "../validators/categoryValidator.js";

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin & Super Admin
router.post(
  "/",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadCategoryImage.single("image"),
  categoryValidator,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  categoryValidator,
  updateCategory
);

// Super Admin Only
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super-admin"),
  deleteCategory
);

export default router;