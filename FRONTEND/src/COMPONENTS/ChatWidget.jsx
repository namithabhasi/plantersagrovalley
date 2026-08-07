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

export default function ChatWidget() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

    // Dynamic Bot Reply
    setTimeout(() => {
      let botReplyText = "Thank you for reaching out! A support representative will get back to you shortly. Feel free to pick any quick topic above.";

      if (text && BOT_ANSWERS[text]) {
        botReplyText = BOT_ANSWERS[text];
      } else if (text) {
        const lower = text.toLowerCase();
        if (lower.includes("track") || lower.includes("order")) {
          botReplyText = BOT_ANSWERS["Track my order"];
        } else if (lower.includes("ship") || lower.includes("charge") || lower.includes("delivery fee")) {
          botReplyText = BOT_ANSWERS["What will be shipping Charges?"];
        } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("whatsapp")) {
          botReplyText = BOT_ANSWERS["What is Our contact info?"];
        } else if (lower.includes("coupon") || lower.includes("discount") || lower.includes("offer")) {
          botReplyText = BOT_ANSWERS["Is there any Coupon code available?"];
        } else if (lower.includes("cod") || lower.includes("cash on delivery")) {
          botReplyText = BOT_ANSWERS["Is COD Available with us?"];
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReplyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 700);
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
      {/* 1. FLOATING CHAT TRIGGER BUTTON (PIC 1 FIX) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center justify-center gap-2.5 bg-white text-gray-800 font-medium text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-xl border border-gray-200/90 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Open chat"
        >
          <FiMessageSquare className="w-4 h-4 text-gray-700 shrink-0" />
          <span className="leading-none select-none">Chat</span>
        </button>
      )}

      {/* 2. CHAT MODAL WINDOW (PICS 2 & 3 FIX - SINGLE UNIFIED SCROLL) */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded
              ? "bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-[500px] h-[calc(100vh-80px)] max-h-[700px]"
              : "bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-[380px] md:w-[400px] h-[calc(100vh-100px)] max-h-[540px]"
          }`}
        >
          {/* HEADER TOP CONTROLS (FIXED - NO SCROLL) */}
          <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-100 shrink-0 z-20">
            {/* Left: Sign in or User Badge */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                <FiUser className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{user.firstName || user.name || "Logged in"}</span>
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="bg-[#5B46F6] hover:bg-[#4836dc] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                Sign in
              </button>
            )}

            {/* Right: Expand & Minimize Controls */}
            <div className="flex items-center gap-1 text-gray-500">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer text-gray-600 hover:text-gray-900"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer text-gray-600 hover:text-gray-900"
                title="Minimize chat"
              >
                <FiMinus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SINGLE UNIFIED SCROLLABLE BODY (GREETING + CHIPS + MESSAGES) */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            {/* GREETING BANNER WITH TILTED CARDS */}
            <div className="relative bg-gradient-to-b from-purple-50/40 via-indigo-50/20 to-white px-4 sm:px-5 pt-3 pb-4 border-b border-gray-100 overflow-hidden min-h-[140px] flex items-center">
              {/* Left Text */}
              <div className="w-[62%] sm:w-[65%] z-10 pr-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Hi there!</h3>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed">
                  You can ask questions about shopping, sizing/dimensions, shipping, returns, or order status.
                </p>
                <p className="text-[9.5px] text-gray-400 mt-2 leading-snug">
                  Your messages are visible to Planters Agro Valley for the provision and improvement of the services. See{" "}
                  <a href="/privacy-policy" className="underline hover:text-indigo-600">
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              {/* Right Tilted Plant Preview Card Graphic */}
              <div className="absolute right-2 top-2 bottom-2 w-[35%] pointer-events-none select-none flex items-center justify-center">
                {/* Back Card */}
                <div className="absolute top-4 right-1 w-[80px] sm:w-[90px] bg-white rounded-xl shadow-md p-1.5 border border-gray-100 transform -rotate-[8deg] opacity-90">
                  <img
                    src={flameVine}
                    alt="Sankrant Vel Plant"
                    className="w-full h-14 sm:h-16 object-cover rounded-lg"
                  />
                  <p className="text-[8px] sm:text-[8.5px] font-medium text-gray-700 mt-1 truncate">
                    Sankrant Vel Plant
                  </p>
                </div>
                {/* Front Card */}
                <div className="absolute top-1 right-5 w-[85px] sm:w-[95px] bg-white rounded-xl shadow-lg p-1.5 border border-gray-100 transform rotate-[6deg]">
                  <img
                    src={desiRose}
                    alt="Desi Gulab Plant"
                    className="w-full h-14 sm:h-16 object-cover rounded-lg"
                  />
                  <p className="text-[8px] sm:text-[8.5px] font-medium text-gray-700 mt-1 truncate">
                    Desi Gulab Plant – Scented...
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT AREA (CHIPS & CONVERSATION) */}
            <div className="p-4 space-y-4">
              {/* SUGGESTED QUESTIONS CHIPS (FLOW INLINE, NO NESTED SCROLLBAR) */}
              <div>
                <p className="text-[10.5px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Suggested Questions
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {PRESET_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(q)}
                      className="bg-white border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/60 text-gray-700 hover:text-indigo-700 text-xs font-normal px-3 py-1.5 rounded-full transition-all duration-150 text-left shadow-2xs active:scale-95 cursor-pointer"
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
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      msg.sender === "user"
                        ? "bg-[#5B46F6] text-white rounded-tr-xs"
                        : "bg-gray-100 text-gray-800 border border-gray-200/70 rounded-tl-xs"
                    }`}
                  >
                    {msg.attachment && (
                      <div className="mb-2 rounded-lg overflow-hidden max-w-[200px]">
                        <img
                          src={msg.attachment}
                          alt="Attached file"
                          className="w-full h-auto object-cover max-h-36"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-[9.5px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200/80 px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[80px]">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* BOTTOM INPUT BAR (FIXED AT BOTTOM) */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0 z-20">
            {selectedFile && (
              <div className="flex items-center justify-between bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-lg mb-2">
                <span className="truncate max-w-[220px]">📎 {selectedFile.name}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-gray-100/90 border border-gray-200/90 rounded-full px-3.5 py-1.5 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
            >
              {/* Paperclip Icon for Attachment */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-indigo-600 transition cursor-pointer p-1 rounded-full hover:bg-gray-200/60 shrink-0"
                title="Attach image or file"
              >
                <FiPaperclip className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Text Input Field */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400 py-1"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() && !selectedFile}
                className="text-white bg-[#5B46F6] hover:bg-[#4836dc] p-1.5 sm:p-2 rounded-full transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center cursor-pointer"
                title="Send message"
              >
                <FiSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

