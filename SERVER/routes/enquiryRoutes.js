import express from "express";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  replyEnquiry,
} from "../controllers/enquiryController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public submission route
router.post("/", createEnquiry);

// Protected Admin/Super-Admin routes
router.get("/", authenticate, authorizeRoles("super-admin", "admin"), getEnquiries);
router.patch("/:id/status", authenticate, authorizeRoles("super-admin", "admin"), updateEnquiryStatus);
router.post("/:id/reply", authenticate, authorizeRoles("super-admin", "admin"), replyEnquiry);
router.delete("/:id", authenticate, authorizeRoles("super-admin", "admin"), deleteEnquiry);

export default router;
