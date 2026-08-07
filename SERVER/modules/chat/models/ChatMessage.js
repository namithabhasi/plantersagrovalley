import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatConversation",
      required: true,
      index: true
    },
    sender: {
      type: String,
      enum: ["user", "bot", "agent"],
      required: true
    },
    senderName: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    attachmentUrl: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
