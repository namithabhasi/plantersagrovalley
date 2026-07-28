import express from "express";

import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import { uploadBannerImage } from "../middleware/uploadMiddleware.js";
import { bannerValidator } from "../validators/bannerValidator.js";


const router = express.Router();

/* ===========================
        Public Routes
=========================== */

// Get all active banners
router.get("/", getBanners);

// Get banner by ID
router.get("/:id", getBannerById);

/* ===========================
    Admin / Super Admin
=========================== */

// Create Banner
router.post(
  "/",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadBannerImage.single("image"),
  bannerValidator,
  createBanner
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadBannerImage.single("image"),
  bannerValidator,
  updateBanner
);

// Delete Banner (Soft Delete)
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super-admin"),
  deleteBanner
);

export default router;