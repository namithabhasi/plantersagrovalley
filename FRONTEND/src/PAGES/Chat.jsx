import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../redux/auth/authSlice";
import {
  FiMessageSquare,
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiPaperclip,
  FiSend,
  FiMinus,
  FiUser
} from "react-icons/fi";
import desiRose from "../assets/Anthurium.png";
import flameVine from "../assets/Peace Lily (Spathiphyllum).jpg";
import { getSmartBotResponse } from "../services/chat/chatBotEngine";
import { getOrCreateChatSession, sendChatMessage } from "../services/chat/chatApi";
import "./Chat.css";

const PRESET_QUESTIONS = [
  "Track my order",
  "What is Our contact info?",
  "What will be shipping Charges?",
  "Is COD Available with us?",
  "How much time to deliver order and Courier partners?",
  "Can i choose courier partner to my location?",
  "Do we provide same day delivery?",
  "How to check if we can deliver in your area?",
  "Is there any Coupon code available?",
  "Are the plants come with pot?",
  "What is the cancellation and replacement policy?",
  "How long it will take to dispatch my order?"
];

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

function Chat() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize persistent session ID
  useEffect(() => {
    let sId = localStorage.getItem("planters_chat_session_id");
    if (!sId) {
      sId = "session_" + Math.random().toString(36).substring(2, 9) + Date.now();
      localStorage.setItem("planters_chat_session_id", sId);
    }
    setSessionId(sId);
  }, []);

  // Fetch conversation messages from server on open
  useEffect(() => {
    if (isOpen && sessionId) {
      const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Guest Visitor";
      const userEmail = user?.email || "";

      getOrCreateChatSession(sessionId, userName, userEmail).then((res) => {
        if (res.success && res.messages && res.messages.length > 0) {
          const formatted = res.messages.map((m) => ({
            id: m._id || Date.now(),
            sender: m.sender,
            text: m.text,
            time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }));
          setMessages(formatted);
        }
      });
    }
  }, [isOpen, sessionId, user]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleOpenAuth = () => {
    dispatch(openAuthModal({ tab: "login" }));
  };

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputMessage.trim();
    if (!text && !selectedFile) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      attachment: selectedFile ? URL.createObjectURL(selectedFile) : null,
      attachmentName: selectedFile ? selectedFile.name : null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setSelectedFile(null);
    setIsTyping(true);

    // Sync message to backend server asynchronously
    const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Guest Visitor";
    sendChatMessage(sessionId, text, null, userName);

    // Dynamic Smart Bot Reply
    setTimeout(async () => {
      const responseObj = await getSmartBotResponse(text);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: responseObj.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleChipClick = (question) => {
    handleSendMessage(question);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      {/* 1. FLOATING CHAT TRIGGER BUTTON (PIC 1) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-trigger-btn"
          aria-label="Open chat"
        >
          <FiMessageSquare className="chat-trigger-icon" />
          <span>Chat</span>
        </button>
      )}

      {/* 2. CHAT MODAL WINDOW (PICS 2 & 3) */}
      {isOpen && (
        <div className={`chat-window-modal ${isExpanded ? "expanded" : ""}`}>
          {/* HEADER TOP CONTROLS */}
          <div className="chat-header-bar">
            {/* Left: Sign in or User Badge */}
            {user ? (
              <div className="chat-user-badge">
                <FiUser style={{ fontSize: "14px" }} />
                <span>{user.firstName || user.name || "Logged in"}</span>
              </div>
            ) : (
              <button onClick={handleOpenAuth} className="chat-signin-btn">
                Sign in
              </button>
            )}

            {/* Right: Controls (Expand & Minimize) */}
            <div className="chat-header-controls">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="chat-control-icon-btn"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-control-icon-btn"
                title="Minimize chat"
              >
                <FiMinus />
              </button>
            </div>
          </div>

          {/* SINGLE UNIFIED SCROLLABLE BODY */}
          <div className="chat-body-scrollable">
            {/* GREETING BANNER WITH TILTED CARDS */}
            <div className="chat-greeting-banner">
              {/* Left Text */}
              <div className="chat-greeting-text-col">
                <h3 className="chat-greeting-title">Hi there!</h3>
                <p className="chat-greeting-desc">
                  You can ask questions about shopping, sizing/dimensions, shipping, returns, or order status.
                </p>
                <p className="chat-privacy-disclaimer">
                  Your messages are visible to Planters Agro Valley for the provision and improvement of the services. See{" "}
                  <a href="/privacy-policy">privacy policy</a>.
                </p>
              </div>

              {/* Right Tilted Plant Preview Graphic */}
              <div className="chat-cards-graphic">
                {/* Back Card */}
                <div className="chat-plant-card card-back">
                  <img src={flameVine} alt="Sankrant Vel Plant" className="chat-card-img" />
                  <p className="chat-card-label">Sankrant Vel Plant</p>
                </div>
                {/* Front Card */}
                <div className="chat-plant-card card-front">
                  <img src={desiRose} alt="Desi Gulab Plant" className="chat-card-img" />
                  <p className="chat-card-label">Desi Gulab Plant</p>
                </div>
              </div>
            </div>

            {/* CONTENT AREA (SUGGESTED CHIPS & CONVERSATION) */}
            <div className="chat-content-container">
              {/* SUGGESTED QUESTIONS CHIPS */}
              <div>
                <div className="chat-chips-section-title">Suggested Questions</div>
                <div className="chat-chips-grid">
                  {PRESET_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(q)}
                      className="chat-question-chip-btn"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONVERSATION MESSAGES */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-msg-row ${
                    msg.sender === "user" ? "user-msg-row" : "bot-msg-row"
                  }`}
                >
                  <div
                    className={`chat-msg-bubble ${
                      msg.sender === "user" ? "user-msg-bubble" : "bot-msg-bubble"
                    }`}
                  >
                    {msg.attachment && (
                      <div style={{ marginBottom: "8px", borderRadius: "8px", overflow: "hidden" }}>
                        <img
                          src={msg.attachment}
                          alt="Attached file"
                          style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div
                      className="chat-msg-text-content"
                      dangerouslySetInnerHTML={{
                        __html: (msg.text || "")
                          // Bold **text**
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          // Markdown links [label](url)
                          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="chat-inline-link">$1</a>')
                          // Newlines
                          .replace(/\n/g, "<br/>")
                      }}
                    />
                  </div>
                  <span className="chat-msg-time">{msg.time}</span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="chat-msg-row bot-msg-row">
                  <div className="chat-typing-dots">
                    <div className="chat-typing-dot"></div>
                    <div className="chat-typing-dot"></div>
                    <div className="chat-typing-dot"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* BOTTOM INPUT BAR */}
          <div className="chat-input-footer">
            {selectedFile && (
              <div className="chat-attachment-preview">
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  📎 {selectedFile.name}
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <FiX />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="chat-input-pill-container"
            >
              {/* Paperclip Attachment Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="chat-attach-btn"
                title="Attach image or file"
              >
                <FiPaperclip />
              </button>

              {/* Input Text */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything..."
                className="chat-text-input"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() && !selectedFile}
                className="chat-send-btn"
                title="Send message"
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
