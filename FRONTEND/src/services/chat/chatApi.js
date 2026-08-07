import axiosInstance from "../../api/axiosInstance";

// Fetch or initialize chat session
export const getOrCreateChatSession = async (sessionId, userName, userEmail) => {
  try {
    const res = await axiosInstance.post("/chat/session", { sessionId, userName, userEmail });
    return res.data;
  } catch (error) {
    console.error("Chat session error:", error);
    return { success: false, conversation: null, messages: [] };
  }
};

// Send user message
export const sendChatMessage = async (sessionId, text, attachmentUrl, userName) => {
  try {
    const res = await axiosInstance.post("/chat/message", { sessionId, text, attachmentUrl, userName });
    return res.data;
  } catch (error) {
    console.error("Send chat message error:", error);
    return { success: false };
  }
};

// Get messages for conversation ID
export const fetchChatMessages = async (conversationId) => {
  try {
    const res = await axiosInstance.get(`/chat/messages/${conversationId}`);
    return res.data;
  } catch (error) {
    console.error("Fetch chat messages error:", error);
    return { success: false, messages: [] };
  }
};

// Admin: Get all conversations
export const fetchAdminConversations = async () => {
  try {
    const res = await axiosInstance.get("/chat/admin/conversations");
    return res.data;
  } catch (error) {
    console.error("Fetch admin conversations error:", error);
    return { success: false, conversations: [] };
  }
};

// Admin: Send agent reply
export const sendAdminReply = async (conversationId, text, agentName) => {
  try {
    const res = await axiosInstance.post("/chat/admin/reply", { conversationId, text, agentName });
    return res.data;
  } catch (error) {
    console.error("Send admin reply error:", error);
    return { success: false };
  }
};

// Admin: Update conversation status
export const updateConversationStatus = async (conversationId, status) => {
  try {
    const res = await axiosInstance.put("/chat/admin/status", { conversationId, status });
    return res.data;
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false };
  }
};
