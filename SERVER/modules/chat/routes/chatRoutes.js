import express from "express";
import {
  getOrCreateSession,
  postUserMessage,
  getMessages,
  getAdminConversations,
  adminReply,
  updateStatus
} from "../controllers/chatController.js";

const router = express.Router();

// Customer Endpoints
router.post("/session", getOrCreateSession);
router.post("/message", postUserMessage);
router.get("/messages/:conversationId", getMessages);

// Admin Live Support Endpoints
router.get("/admin/conversations", getAdminConversations);
router.post("/admin/reply", adminReply);
router.put("/admin/status", updateStatus);

export default router;
