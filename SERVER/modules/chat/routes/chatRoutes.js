import express from "express";
import {
  getOrCreateSession,
  postUserMessage,
  getMessages,
  getAdminConversations,
  adminReply,
  updateStatus
} from "../controllers/chatController.js";
import { authenticate, authorizeRoles } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Customer Endpoints
router.post("/session", getOrCreateSession);
router.post("/message", postUserMessage);
router.get("/messages/:conversationId", getMessages);

// Admin Live Support Endpoints
router.get("/admin/conversations", authenticate, authorizeRoles("super-admin", "admin"), getAdminConversations);
router.post("/admin/reply", authenticate, authorizeRoles("super-admin", "admin"), adminReply);
router.put("/admin/status", authenticate, authorizeRoles("super-admin", "admin"), updateStatus);

export default router;
