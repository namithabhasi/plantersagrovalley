import express from "express";
import {
  subscribe,
  getSubscribers,
  deleteSubscriber,
  sendBulkNewsletter,
} from "../controllers/subscriberController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to subscribe
router.post("/", subscribe);

// Admin-only routes to get and delete subscribers
router.get(
  "/admin",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  getSubscribers
);

router.post(
  "/admin/send-newsletter",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  sendBulkNewsletter
);

router.delete(
  "/admin/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  deleteSubscriber
);

export default router;
