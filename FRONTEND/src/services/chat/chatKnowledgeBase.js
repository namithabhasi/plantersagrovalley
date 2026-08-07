/* ==========================================================================
   KNOWLEDGE BASE - PLANTERS AGRO VALLEY CHATBOT
   Contains intents, keywords, responses, and plant care knowledge
   ========================================================================== */

export const KNOWLEDGE_BASE = {
  greetings: {
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "namaste", "hola", "sup"],
    responses: [
      "Hello! Welcome to Planters Agro Valley 🌿 How can I help you today? Feel free to ask about plant care, order status, shipping, or recommendations!",
      "Hi there! 🌱 How can I assist with your greenery journey today?",
      "Hey! Welcome! Let me know if you need help finding plants, checking order status, or getting care tips!"
    ]
  },

  botIdentity: {
    keywords: ["who are you", "what are you", "what is your name", "are you bot", "are you human", "what can you do"],
    responses: [
      "I am the Planters Agro Valley AI Assistant 🌿 I can help you track orders, find the best plants for your space, answer care queries, and explain shipping & returns!"
    ]
  },

  plantCareWatering: {
    keywords: ["water", "watering", "how often water", "overwater", "underwater", "dry soil"],
    responses: [
      "💧 **Plant Watering Tip**:\n- Most indoor plants prefer soil to dry out 1-2 inches deep before watering again.\n- Always ensure pots have drainage holes!\n- Overwatering causes root rot (yellow mushy leaves), while underwatering causes crisp brown tips."
    ]
  },

  plantCareLeaves: {
    keywords: ["yellow leaves", "brown leaves", "drooping", "falling leaves", "dry leaf", "dying plant", "leaf spot"],
    responses: [
      "🍃 **Leaf Trouble Guide**:\n- **Yellow leaves**: Usually caused by overwatering or poor drainage.\n- **Crisp brown tips**: Indicates low humidity or underwatering.\n- **Drooping leaves**: Check soil moisture — if dry, water deeply; if soggy, let it dry out in bright indirect light."
    ]
  },

  plantCareLight: {
    keywords: ["sunlight", "sun", "light", "dark room", "shade", "direct sun", "indirect light", "bright light"],
    responses: [
      "☀️ **Sunlight Guide**:\n- **Bright Indirect Light**: Ideal for Snake Plant, Peace Lily, Areca Palm, & Money Plant (place near a window with sheer curtains).\n- **Direct Sun**: Best for Succulents, Cactus, Hibiscus, & Rose.\n- Avoid placing shade plants in direct harsh afternoon sun to prevent leaf sunburn!"
    ]
  },

  plantCarePests: {
    keywords: ["pests", "bugs", "insects", "white bugs", "mealybugs", "fungus", "fertilizer", "neem oil"],
    responses: [
      "🐛 **Pest & Fertilizer Tip**:\n- For mealybugs or aphids: Spray a mixture of diluted Neem Oil (5ml per liter of water) with a drop of liquid soap.\n- Feed your plants organic fertilizer or seaweed extract once every 2-3 weeks during growth season (Spring/Summer)."
    ]
  },

  productRecommendations: {
    keywords: ["recommend", "best plant", "indoor plant", "low maintenance", "easy plant", "air purifying", "bedroom plant", "office plant", "succulent", "gift"],
    responses: [
      "🪴 **Recommended Indoor Plants**:\n1. **Sansevieria (Snake Plant)**: Air-purifying & indestructible.\n2. **Peace Lily**: Beautiful white blooms & natural air filter.\n3. **Crassula Ovata (Jade Plant)**: Good luck & succulent beauty.\n4. **Areca Palm**: Natural home humidifier & lush green vibes!\n\nBrowse all indoor plants in our [Plants Catalog](/plants)."
    ]
  },

  aquaticAndLotus: {
    keywords: ["lotus", "water lily", "aquatic", "water plant", "pond plant", "lotus seeds", "lotus plant"],
    responses: [
      "🪷 **Lotus & Aquatic Plants**:\nYes! We offer beautiful Lotus plants, Water Lilies, and Aquatic seeds perfect for home ponds and water containers.\n\nExplore our full selection in our [Plants Catalog](/plants) or [Seeds Collection](/seeds)!"
    ]
  },

  orderTracking: {
    keywords: ["track", "status", "order status", "where is my order", "order ID", "tracking number", "when will my order arrive"],
    responses: [
      "📦 **Order Tracking**:\nYou can track your live order by visiting our [Track Order Page](/track-order) or by entering your Order ID and mobile number!"
    ]
  },

  shipping: {
    keywords: ["shipping", "delivery charge", "free shipping", "shipping cost", "delivery time", "how long deliver", "pincode", "courier"],
    responses: [
      "🚚 **Shipping & Delivery Info**:\n- **FREE Shipping** on orders above ₹499! (Flat ₹49 for orders below ₹499).\n- Dispatch within 24-48 business hours.\n- Delivery takes 2-5 business days across 25,000+ pincodes in India via BlueDart, Delhivery & Xpressbees."
    ]
  },

  cod: {
    keywords: ["cod", "cash on delivery", "pay on delivery", "payment methods"],
    responses: [
      "💳 **Payment & COD**:\n- **Cash on Delivery (COD)** is available nationwide!\n- We also accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Netbanking."
    ]
  },

  coupons: {
    keywords: ["coupon", "discount", "offer", "promo", "promo code", "voucher", "deal"],
    responses: [
      "🎉 **Special Discount**:\nUse coupon code **WELCOME10** at checkout to get **10% OFF** on your purchase! Check our home banner for seasonal deals."
    ]
  },

  returns: {
    keywords: ["return", "refund", "cancel", "damaged", "broken pot", "replacement", "exchange"],
    responses: [
      "🔄 **Replacement & Cancellation Policy**:\n- **Free 7-Day Replacement**: If your plant or pot arrives damaged, share a photo with us for an instant replacement!\n- Order cancellations are allowed before dispatch via your profile page."
    ]
  },

  contactInfo: {
    keywords: ["contact", "phone", "email", "support", "whatsapp", "call", "address", "location"],
    responses: [
      "📞 **Contact Support**:\n- **Email**: support@plantersagrovalley.com\n- **Phone / WhatsApp**: +91 98765 43210 (Mon - Sat, 9 AM - 7 PM)\n- **Page**: Visit our [Contact Page](/contact) to leave us a direct message."
    ]
  }
};
