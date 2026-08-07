import ChatConversation from "../models/ChatConversation.js";
import ChatMessage from "../models/ChatMessage.js";

// Helper Knowledge Base Answers for Server Side Bot Response
const BOT_ANSWERS = {
  "Track my order": "You can track your live order status by visiting our Track Order page (/track-order) or by entering your Order ID & phone number!",
  "What is Our contact info?": "Our support team is available Mon-Sat (9 AM - 7 PM). Email: support@plantersagrovalley.com | Phone/WhatsApp: +91 98765 43210.",
  "What will be shipping Charges?": "We offer FREE Shipping on all orders above ₹499! For orders below ₹499, a flat shipping fee of ₹49 applies.",
  "Is COD Available with us?": "Yes, Cash on Delivery (COD) is available for most pincodes across India!",
  "How much time to deliver order and Courier partners?": "Orders are dispatched within 24 hours and delivered in 2 to 5 business days via trusted partners like BlueDart, Delhivery, and Xpressbees.",
  "Can i choose courier partner to my location?": "Our smart logistics system automatically selects the fastest courier service available for your specific delivery location.",
  "Do we provide same day delivery?": "Same-day express delivery is available in select metro locations for plant orders placed before 12 PM.",
  "How to check if we can deliver in your area?": "We ship to over 25,000+ pincodes! You can enter your pincode on any product page or checkout step to verify instant delivery.",
  "Is there any Coupon code available?": "Use coupon code WELCOME10 at checkout to get 10% OFF on your first purchase!",
  "Are the plants come with pot?": "Yes! All our live plants come securely potted in durable, nursery-grade pots, ready to thrive in your space.",
  "What is the cancellation and replacement policy?": "You can cancel anytime before dispatch. We also provide a 7-day Replacement Guarantee if your plant arrives damaged.",
  "How long it will take to dispatch my order?": "Every order is carefully inspected, packed with care, and dispatched within 24-48 business hours from our nursery."
};

function getBotReply(text) {
  if (!text) return "How can I help you today?";
  if (BOT_ANSWERS[text]) return BOT_ANSWERS[text];

  const lower = text.toLowerCase();
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    return "Hello! Welcome to Planters Agro Valley 🌿 How can I help you today?";
  }
  if (lower.includes("track") || lower.includes("order")) {
    return BOT_ANSWERS["Track my order"];
  }
  if (lower.includes("water")) {
    return "💧 Most indoor plants prefer soil to dry out 1-2 inches deep before watering again. Always ensure pots have drainage holes!";
  }
  if (lower.includes("yellow")) {
    return "🍃 Yellow leaves are usually caused by overwatering or poor drainage. Let the soil dry out in bright indirect light.";
  }
  if (lower.includes("ship") || lower.includes("charge")) {
    return BOT_ANSWERS["What will be shipping Charges?"];
  }
  if (lower.includes("coupon") || lower.includes("discount")) {
    return BOT_ANSWERS["Is there any Coupon code available?"];
  }
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email")) {
    return BOT_ANSWERS["What is Our contact info?"];
  }

  return `Thank you for reaching out! A support representative will get back to you shortly. Feel free to reach us at support@plantersagrovalley.com or +91 98765 43210.`;
}

// 1. Get or Create Chat Session
export const getOrCreateSession = async (req, res) => {
  try {
    const { sessionId, userName, userEmail } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID required" });
    }

    let conversation = await ChatConversation.findOne({ sessionId });
    if (!conversation) {
      conversation = await ChatConversation.create({
        sessionId,
        userName: userName || "Guest Visitor",
        userEmail: userEmail || "",
        status: "bot",
        lastMessage: "Conversation started"
      });
    }

    const messages = await ChatMessage.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation,
      messages
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Post Customer Message & Persist
export const postUserMessage = async (req, res) => {
  try {
    const { sessionId, text, attachmentUrl, userName } = req.body;
    if (!sessionId || (!text && !attachmentUrl)) {
      return res.status(400).json({ success: false, message: "Session ID and content required" });
    }

    let conversation = await ChatConversation.findOne({ sessionId });
    if (!conversation) {
      conversation = await ChatConversation.create({
        sessionId,
        userName: userName || "Guest Visitor",
        status: "bot"
      });
    }

    // Save User Message
    const userMsg = await ChatMessage.create({
      conversationId: conversation._id,
      sender: "user",
      senderName: conversation.userName,
      text: text || "",
      attachmentUrl: attachmentUrl || null
    });

    // Update conversation metadata
    conversation.lastMessage = text || "Attached a file";
    conversation.unreadCountAdmin += 1;
    await conversation.save();

    let botMsg = null;
    // Generate Bot Reply if status is 'bot'
    if (conversation.status === "bot") {
      const botReplyText = getBotReply(text);
      botMsg = await ChatMessage.create({
        conversationId: conversation._id,
        sender: "bot",
        senderName: "Planters Support Bot",
        text: botReplyText
      });
    }

    const messages = await ChatMessage.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation,
      messages,
      userMsg,
      botMsg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Messages for Conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await ChatMessage.find({ conversationId }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Admin - Get All Conversations
export const getAdminConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.find().sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Admin - Reply to Customer
export const adminReply = async (req, res) => {
  try {
    const { conversationId, text, agentName } = req.body;
    if (!conversationId || !text) {
      return res.status(400).json({ success: false, message: "Conversation ID and reply text required" });
    }

    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const agentMsg = await ChatMessage.create({
      conversationId: conversation._id,
      sender: "agent",
      senderName: agentName || "Support Representative",
      text
    });

    conversation.status = "active_agent";
    conversation.lastMessage = `[Agent]: ${text}`;
    conversation.unreadCountAdmin = 0;
    await conversation.save();

    const messages = await ChatMessage.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation,
      messages,
      agentMsg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Admin - Update Conversation Status
export const updateStatus = async (req, res) => {
  try {
    const { conversationId, status } = req.body;
    const conversation = await ChatConversation.findByIdAndUpdate(
      conversationId,
      { status },
      { new: true }
    );
    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
