import express from "express";
import { getDashboard } from "../controllers/adminDashboardController.js";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get Admin Dashboard Statistics
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super-admin", "admin", "shipping-manager"),
  getDashboard
);

export default router;