/* ==========================================================================
   CHAT BOT ENGINE - PLANTERS AGRO VALLEY
   Handles intent matching & dynamic AI answers for any random user query
   ========================================================================== */

import { KNOWLEDGE_BASE } from "./chatKnowledgeBase";

// Dynamic Knowledge Generator for unprogrammed queries
function generatePlantAIResponse(query) {
  const lower = query.toLowerCase();

  // 1. Order, Dispatch & Shipping Queries
  if (lower.includes("dispatch") || lower.includes("ship") || lower.includes("deliver") || lower.includes("courier") || lower.includes("track") || lower.includes("order")) {
    return "🚚 **Order Dispatch & Shipping Info**:\n" +
           "- **Dispatch Time**: Orders are inspected, packed with care, and **dispatched within 24 to 48 business hours**.\n" +
           "- **Delivery Time**: Delivery takes **2 to 5 business days** nationwide via BlueDart, Delhivery, and Xpressbees.\n" +
           "- **Tracking**: You can track your live order status on our [Track Order Page](/track-order) or view updates in your [Profile](/profile)!";
  }

  // 2. Payment & Pricing Queries
  if (lower.includes("pay") || lower.includes("cod") || lower.includes("price") || lower.includes("cost") || lower.includes("money") || lower.includes("charge")) {
    return "💳 **Payment & Shipping Charges**:\n" +
           "- **Free Shipping**: Available on all orders above ₹499! (Flat ₹49 for orders under ₹499).\n" +
           "- **Payment Methods**: Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm), Cards & Netbanking are accepted.";
  }

  // 3. Plant Care Specific Queries
  if (lower.includes("soil") || lower.includes("mud") || lower.includes("potting mix")) {
    return "🌱 **Soil & Potting Mix Care**:\nFor healthy plants, use well-draining soil mixed with coco-peat, vermicompost, and perlite in a 40:40:20 ratio. This prevents root rot and keeps soil airy!";
  }
  if (lower.includes("fertilizer") || lower.includes("manure") || lower.includes("food") || lower.includes("feed")) {
    return "🌿 **Fertilizer Tip**:\nFeed your plants organic liquid fertilizer, seaweed extract, or vermicompost once every 2-3 weeks during active growth (Spring & Summer). Avoid over-fertilizing in winter.";
  }
  if (lower.includes("prun") || lower.includes("cut") || lower.includes("trim")) {
    return "✂️ **Pruning Advice**:\nTrim dead or yellow leaves at a 45-degree angle near the main stem using clean pruning shears. Pruning encourages bushier, vibrant new growth!";
  }
  if (lower.includes("propagat") || lower.includes("stem")) {
    return "🌱 **Propagation Tip**:\nTake a healthy 4-6 inch stem cutting below a node. Place it in clean water or moist potting mix in bright indirect sunlight until roots develop (2-3 weeks).";
  }
  if (lower.includes("sun") || lower.includes("balcony") || lower.includes("window")) {
    return "☀️ **Sunlight & Placement**:\nMost flowering & fruit plants need 4-6 hours of direct sunlight. Indoor foliage plants prefer bright indirect sunlight near a window!";
  }
  if (lower.includes("pot") || lower.includes("planter") || lower.includes("container")) {
    return "🪴 **Pots & Planters**:\nWe offer high quality Ceramic, Plastic, Metal, and Hanging Pots! Always select a pot with drainage holes 2 inches larger than the root ball.";
  }

  // 4. Specific Plant Name Detection
  const commonPlants = [
    "rose", "tulip", "jasmine", "hibiscus", "cactus", "orchid", "bamboo",
    "aloe", "fern", "bonsai", "mango", "lemon", "money plant", "palm",
    "succulent", "mint", "tulsi", "bougainvillea", "marigold"
  ];

  const matchedPlant = commonPlants.find((p) => lower.includes(p));
  if (matchedPlant) {
    const capitalized = matchedPlant.charAt(0).toUpperCase() + matchedPlant.slice(1);
    return `🌱 **${capitalized} Plant Information**:\n${capitalized} plants thrive well in well-draining soil and bright indirect light. Keep the soil slightly moist and avoid stagnant water in the pot.\n\nYou can explore available ${capitalized} varieties in our [Plants Catalog](/plants) or [Seeds Collection](/seeds)!`;
  }

  // 5. Default General Support Assistance
  return `🌿 **Planters Agro Valley Support**:\nRegarding your query about "${query}":\n\n` +
         `Our customer support team is available Mon - Sat (9 AM - 7 PM). You can explore our full catalog under [Plants](/plants), [Seeds](/seeds), or track orders via [Track Order](/track-order).\n\n` +
         `For immediate assistance, feel free to contact us at **support@plantersagrovalley.com** or **+91 98765 43210**!`;
}

/**
 * Main Smart Bot Response Processor
 */
export async function getSmartBotResponse(userQuery) {
  if (!userQuery || typeof userQuery !== "string") {
    return {
      text: "Hello! Feel free to ask any question about plants, care tips, or your order status!",
      category: "general",
      isFallback: true
    };
  }

  const normalized = userQuery.toLowerCase().trim();

  // Step 1: Check defined Intent Categories in Knowledge Base
  let bestMatch = null;
  let maxScore = 0;

  for (const [key, intent] of Object.entries(KNOWLEDGE_BASE)) {
    let currentScore = 0;

    for (const kw of intent.keywords) {
      if (normalized.includes(kw)) {
        currentScore += kw.length;
      }
    }

    if (currentScore > maxScore) {
      maxScore = currentScore;
      const responses = intent.responses;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      bestMatch = {
        text: randomResponse,
        category: key,
        isFallback: false
      };
    }
  }

  if (bestMatch && maxScore > 0) {
    return bestMatch;
  }

  // Step 2: Optional External Gemini API Call (if VITE_GEMINI_API_KEY is configured in .env)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `You are a helpful gardening and plant expert assistant for Planters Agro Valley online store. Answer concisely in 2-3 sentences: ${userQuery}` }]
            }
          ]
        })
      });
      const data = await apiRes.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        return { text: aiText, category: "ai", isFallback: false };
      }
    } catch (err) {
      console.warn("Gemini API call failed, using internal AI generator:", err);
    }
  }

  // Step 3: Dynamic Plant AI Knowledge Generator Fallback
  const aiGeneratedText = generatePlantAIResponse(userQuery);
  return {
    text: aiGeneratedText,
    category: "dynamic_ai",
    isFallback: false
  };
}
