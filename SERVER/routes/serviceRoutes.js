import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadCategoryImage } from "../middleware/uploadMiddleware.js";
import { serviceValidator } from "../validators/serviceValidator.js";

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin/Super Admin protected routes
router.post(
  "/",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadCategoryImage.single("image"),
  serviceValidator,
  createService
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadCategoryImage.single("image"),
  serviceValidator,
  updateService
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  deleteService
);

export default router;
