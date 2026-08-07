import mongoose from "mongoose";

const chatConversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    userName: {
      type: String,
      default: "Guest Visitor"
    },
    userEmail: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["bot", "active_agent", "closed"],
      default: "bot"
    },
    lastMessage: {
      type: String,
      default: ""
    },
    unreadCountAdmin: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.ChatConversation || mongoose.model("ChatConversation", chatConversationSchema);
