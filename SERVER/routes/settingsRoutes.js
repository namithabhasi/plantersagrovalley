import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { updateSettingsValidator } from "../validators/settingsValidator.js";
import { uploadSettingsLogo } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get settings route is accessible to anyone (public)
router.get(
  "/",
  getSettings
);

// Update settings route is only accessible to super-admins
router.put(
  "/",
  authenticate,
  authorizeRoles("super-admin"),
  uploadSettingsLogo.single("logo"),
  updateSettingsValidator,
  validationMiddleware,
  updateSettings
);

export default router;
