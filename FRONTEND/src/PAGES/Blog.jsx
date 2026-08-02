import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaArrowLeft, FaClock, FaTag, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Import local assets from the assets directory to replace all Unsplash links
import anthuriumPic from '../assets/Anthurium.png';
import fertilizerPic from '../assets/fertilizer.jpg';
import balconyGardenHero from '../assets/balcony-garden-hero.jpg';
import aboutUsPic2 from '../assets/aboutuspic2.jpg';
import gardenDecorsPic from '../assets/gardendecors.jpg';
import aboutUsPic1 from '../assets/aboutuspic1.jpg';
import repottingPic from '../assets/From Seed to Tree_ The Beauty of Home-Grown Organic Avocado.jpg';
import vegetableSeedsPic from '../assets/vegetableseeds.jpg';

// 8 Professional Mock Blog Posts (Dates in July 2026, content styled with standard theme colors, clean spacings)
const BLOG_POSTS = [
  {
    id: 1,
    title: "Top 10 Low-Maintenance Indoor Plants for Effortless Greenery",
    date: "JULY 01, 2026",
    category: "MY PLANT DIARY",
    author: "Planters Expert",
    readTime: "5 min read",
    image: anthuriumPic,
    summary: "Here's our list of the top 10 low-maintenance indoor plants perfect for beginners, frequent travelers, and anyone who wants to enjoy beautiful greenery without the stress of constant upkeep. These plants are extremely resilient and will grow well in different light levels.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Cultivating indoor flora is a highly rewarding way to improve indoor air quality and biophilic connection. For busy professionals or beginners, starting with high-resilience, low-maintenance species reduces the complexity of plant parenting. Certain houseplants possess physiological adaptations—such as succulent leaves, CAM photosynthesis, or rhizomatic root systems—that allow them to thrive in low-light environments and survive prolonged periods of drought.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">1. Sansevieria (The Snake Plant)</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Sansevieria is renowned for its hardiness. It utilizes Crassulacean Acid Metabolism (CAM), allowing it to absorb carbon dioxide and release oxygen during nocturnal hours. Its upright, architectural leaves filter common volatile organic compounds (VOCs) such as benzene and formaldehyde.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">2. Zamioculcas Zamiifolia (ZZ Plant)</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        The ZZ Plant features thick, waxy leaflets that reflect light and conserve moisture. Under the soil, the plant utilizes specialized bulbous rhizomes that store water, making it extremely drought-resistant. It thrives in low-intensity indirect light, making it suitable for dark office corners.
      </p>
      
      <div class="border-l-4 border-[var(--color-primary)] pl-6 text-[var(--color-text-main)] my-8 bg-[var(--color-bg-secondary)] p-6 rounded-r-[3px] font-sans text-base leading-relaxed text-justify" style="text-align: justify; text-justify: inter-word;">
        "Pro Tip: If you aren't sure whether to water your ZZ plant, wait another week. Overwatering is the only real way to harm this resilient beauty."
      </div>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">3. Golden Pothos (Devil's Ivy)</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Perfect for shelves or hanging baskets, the Pothos features cascading vines with heart-shaped variegated leaves. It grows rapidly, tolerates irregular watering, and can easily be propagated in water to create new plants for your friends.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">4. Spider Plant (Chlorophytum comosum)</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Known for its air-purifying qualities and safety for pets, the Spider Plant produces long, narrow leaves and "babies" (spiderettes) that dangle down from the mother plant. It loves indirect light and moderate watering.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">5. Peace Lily (Spathiphyllum)</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        If you want flowers without the fuss, the Peace Lily is a beautiful option. It will dramatically droop its leaves when it is thirsty, letting you know exactly when to water it. Once watered, it bounces back within hours, showing off its elegant white blooms.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Conclusion</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Bringing nature indoors has never been easier. Start with one of these forgiving green companions, learn their simple rhythms, and watch your space transform into a serene, oxygen-rich sanctuary.
      </p>
    `
  },
  {
    id: 2,
    title: "The Ultimate Guide to Plant Fertilizers: What, When, and How",
    date: "JULY 05, 2026",
    category: "PLANT CARE 101",
    author: "Garden Botanist",
    readTime: "7 min read",
    image: fertilizerPic,
    summary: "Understanding fertilizers is key to a flourishing garden. Learn the difference between organic and chemical feeds, and how to apply them for maximum growth. Follow these expert tips to ensure your soil gets the right nutrients.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Botanical nutrition is the cornerstone of successful horticulture. While soil provides physical anchorage, plant health requires a consistent balance of macronutrients and trace minerals. Understanding the chemistry of organic versus synthetic fertilizers is crucial for optimizing vegetative growth, root development, and reproductive flowering cycles.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">The N-P-K Elemental Ratio</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Fertilizers are classified by their N-P-K ratios, representing the percentage concentrations of Nitrogen, Phosphorus, and Potassium:
      </p>
      <ul class="list-disc list-inside pl-0 mb-6 text-[var(--color-text-main)] space-y-3 font-sans text-base text-justify" style="text-align: justify; text-justify: inter-word;">
        <li><strong>Nitrogen (N):</strong> The primary driver of chlorophyll synthesis, vital for foliage growth and stem development.</li>
        <li><strong>Phosphorus (P):</strong> Essential for cellular energy transfer (ATP), stimulating root branching and flower initiation.</li>
        <li><strong>Potassium (K):</strong> Regulates stomatal opening and water transport, enhancing disease resistance and winter hardiness.</li>
      </ul>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Organic vs. Synthetic Fertilizers</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Organic fertilizers (manure, compost, fish emulsion) break down slowly, feeding the soil microbiome and improving soil structure over time. Synthetic fertilizers deliver nutrients instantly, but they do not improve soil health and can burn the roots if over-applied.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">When and How to Feed</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        As a general rule, only fertilize plants during their active growing season (spring and summer). Reduce or stop feeding entirely in autumn and winter when plants go dormant. Always water your plants thoroughly before applying fertilizer to protect the delicate root hairs from salt burn.
      </p>
    `
  },
  {
    id: 3,
    title: "Balcony Gardening: How to Maximize Small Spaces",
    date: "JULY 10, 2026",
    category: "URBAN GARDENING",
    author: "Urban Farmer",
    readTime: "6 min read",
    image: balconyGardenHero,
    summary: "Turn your small apartment balcony into a lush green oasis. Learn about vertical planters, railing pots, and selecting the best plants for shady or sunny balconies. We cover drainage tips and plant varieties that fit.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Urban balcony gardening is a sophisticated exercise in spatial design and microclimate management. For the apartment dweller, a balcony represents a vital portal to the natural world. Transforming this limited footprint into a lush, biodiverse sanctuary requires careful consideration of structural weight limits, solar radiation patterns, and container aerodynamics. This guide outlines the key engineering and botanical principles required to maximize small-scale green spaces.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">1. Vertical Layering & Structural Pergolas</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        When horizontal space is constrained, vertical scaling becomes essential. Utilizing lightweight wall-mounted trellises, cascading pocket planters, and overhead wooden or steel pergolas allows you to layer foliage at multiple heights. Incorporating climbing species such as Bougainvillea or English Ivy on overhead structures creates a natural canopy that filters direct sunlight while preserving precious floor space for seating.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">2. Microclimate Analysis & Light Mapping</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Before selecting botanical specimens, it is critical to perform light mapping over a 24-hour cycle. Balconies are subject to intense microclimates—exposure to wind speeds increases at higher floors, and concrete walls absorb heat, raising ambient temperatures.
      </p>
      <ul class="list-disc list-inside pl-0 mb-6 text-[var(--color-text-main)] space-y-3 font-sans text-base text-justify" style="text-align: justify; text-justify: inter-word;">
        <li><strong>Full Sun Exposure (South/West Facing):</strong> Ideal for xerophytic species, dwarf citrus, bougainvillea, lavender, and woody Mediterranean herbs like rosemary which possess high transpiration resistance.</li>
        <li><strong>Partial Shade to Deep Shade (North/East Facing):</strong> Perfect for broad-leaved foliage plants such as ferns, hostas, calatheas, and understory cultivars that thrive in diffused solar radiation.</li>
      </ul>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">3. Container Choice & Drainage Systems</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Weight loading is a primary safety constraint in structural balcony design. Traditional terracotta and concrete planters are exceptionally heavy and prone to moisture retention. Modern lightweight composite containers, manufactured from fiberglass, structural resin, or aerated fabric, offer root aeration while significantly reducing load weight. Ensure all planters incorporate drainage ports and gravel sub-layers to prevent root rot.
      </p>
    `
  },
  {
    id: 4,
    title: "How to Water Your Plants Correctly: The Golden Rules",
    date: "JULY 15, 2026",
    category: "PLANT CARE 101",
    author: "Planters Expert",
    readTime: "4 min read",
    image: aboutUsPic2,
    summary: "Overwatering is the number one killer of houseplants. Discover the finger test, how drainage works, and the warning signs of root rot before it's too late. Master these rules to keep roots healthy.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Watering seems like the simplest part of plant care, yet it is where most plant parents fail. Overwatering leads to root rot, which suffocates the plant's roots, while underwatering leaves them parched and wilted. Here are the golden rules to ensure perfect hydration every time.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">The Gold Standard: The Finger Test</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Never water your plants on a strict calendar schedule. Ambient temperatures, humidity levels, and seasons change how fast soil dries. Instead, push your index finger about 2 inches deep into the soil. If it feels damp and cool, wait. If it feels dry and dusty, it’s time to water.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Water Deeply, Not Frequently</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        When you water, pour until water runs out of the drainage holes at the bottom of the pot. This ensures that the entire root system gets wet, encouraging roots to grow deep into the container. Empty the drainage saucer after 15 minutes so the plant doesn't sit in stagnant water.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Top Watering vs. Bottom Watering</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        While top watering is standard, bottom watering (setting the pot in a bowl of shallow water for 20 minutes) allows the soil to wicks up water naturally. This is excellent for plants with sensitive leaves (like African Violets) or when the soil has become compacted and hydrophobic.
      </p>
    `
  },
  {
    id: 5,
    title: "Creative Garden Decor Ideas to Beautify Your Space",
    date: "JULY 18, 2026",
    category: "INSPIRATION",
    author: "Decor Stylist",
    readTime: "5 min read",
    image: gardenDecorsPic,
    summary: "From fairy lights and wind chimes to vintage planters and stone pathways, discover how simple decorative elements can elevate your garden's aesthetic. Small visual additions make a major impact.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        A garden is more than just a collection of plants; it is an extension of your home's personality. By blending natural beauty with creative decorative elements, you can transform your backyard or patio into an enchanting retreat.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">1. Warm Atmospheric Lighting</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Extend your garden's beauty into the evening hours. Solar-powered lanterns, delicate copper fairy lights, and stake lighting along paths create a cozy, magical atmosphere. Hang string lights overhead to define seating or dining areas.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">2. Quirky & Repurposed Planters</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Break away from matching plastic pots. Use vintage items like wooden crates, old metallic watering cans, rustic wheelbarrows, or even painted teacups for small succulents. Repurposing old objects adds vintage charm and is highly sustainable.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">3. Soundscapes with Wind Chimes & Water Features</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Appeal to the senses. The soft trickle of a tabletop stone fountain or the gentle ring of wooden wind chimes creates a peaceful soundscape that masks city noise and invites birds and wildlife to your sanctuary.
      </p>
    `
  },
  {
    id: 6,
    title: "Air-Purifying Plants: Science-Backed Green Companions",
    date: "JULY 22, 2026",
    category: "HEALTH & WELLNESS",
    author: "Health & Care",
    readTime: "6 min read",
    image: aboutUsPic1,
    summary: "NASA's clean air study proved that certain houseplants can filter out common household toxins. Here are the top air-purifiers to keep in your bedroom to boost health.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Did you know that indoor air can be up to five times more polluted than outdoor air? Common synthetic household materials, paint, and cleaning products off-gas volatile organic compounds (VOCs) like benzene, formaldehyde, and xylene. Fortunately, nature has a beautiful, built-in solution.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">The NASA Clean Air Study</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        In 1989, NASA conducted a study to research ways to clean the air in space stations. They discovered that several plants, along with their soil microorganisms, excel at absorbing toxic gases and releasing any air toxins.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Top Clean-Air Champions</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Here are the most effective air-filtering plants you can add to your home:
      </p>
      <ul class="list-disc list-inside pl-0 mb-6 text-[var(--color-text-main)] space-y-3 font-sans text-base text-justify" style="text-align: justify; text-justify: inter-word;">
        <li><strong>Areca Palm:</strong> A stunning, tropical-looking palm that filters formaldehyde and acts as a natural humidifier.</li>
        <li><strong>English Ivy:</strong> Proven to reduce airborne mold particles, making it ideal for bathrooms or damp spaces.</li>
        <li><strong>Boston Fern:</strong> Highly effective at clearing chemicals like xylene from the atmosphere.</li>
        <li><strong>Peace Lily:</strong> Excellent at absorbing indoor contaminants and raising room humidity levels.</li>
      </ul>
      
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Keep 1 to 2 medium-sized plants for every 100 square feet of indoor space to optimize air filtration and boost your mental well-being.
      </p>
    `
  },
  {
    id: 7,
    title: "Repotting 101: Signs Your Plant Has Outgrown Its Pot",
    date: "JULY 26, 2026",
    category: "PLANT CARE 101",
    author: "Planters Expert",
    readTime: "5 min read",
    image: repottingPic,
    summary: "Are roots peaking out of the bottom? Is water running straight through? Learn how to safely upgrade your plant to its next container without transplant shock.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        As plants grow above ground, they also grow below. Eventually, the root system runs out of room, wrapping around itself in a tight spiral. This is known as being "root-bound," and it limits the nutrients your plant can absorb. Repotting gives roots the fresh space and soil they need to thrive.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Signs Your Plant Needs Repotting</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Keep an eye out for these classic indicators:
      </p>
      <ul class="list-disc list-inside pl-0 mb-6 text-[var(--color-text-main)] space-y-3 font-sans text-base text-justify" style="text-align: justify; text-justify: inter-word;">
        <li>Roots are growing out of the bottom drainage holes.</li>
        <li>Water runs straight through the pot without being absorbed.</li>
        <li>The plant is top-heavy and keeps falling over.</li>
        <li>Growth has slowed down significantly during the spring/summer season.</li>
      </ul>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">Choosing the Right Container</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Only size up by 1 to 2 inches in diameter. Giving a plant a pot that is too large holds too much moisture, leading to root rot. Make sure the new container has adequate drainage, and always use fresh potting mix tailored to your plant type (e.g., well-draining cactus mix for succulents).
      </p>
    `
  },
  {
    id: 8,
    title: "Why Organic Vegetable Gardening is Worth the Effort",
    date: "JULY 30, 2026",
    category: "GROW YOUR OWN",
    author: "Kitchen Gardener",
    readTime: "8 min read",
    image: vegetableSeedsPic,
    summary: "Nothing beats the taste of homegrown vegetables and fresh herbs. Learn how to start your first chemical-free kitchen garden from scratch.",
    content: `
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Imagine walking out to your balcony or backyard and harvesting sun-warmed cherry tomatoes, fresh herbs, and organic lettuce for your dinner salad. Starting an organic kitchen garden is incredibly rewarding and ensures your family enjoys chemical-free produce.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">1. Unmatched Taste & Nutrition</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Commercial produce is often harvested before it is ripe and shipped thousands of miles. Homegrown vegetables ripen fully on the vine, maximizing their natural sugars, antioxidants, and vitamins. The difference in taste is noticeable from the first bite.
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">2. Start Small and Focused</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        Don't overwhelm yourself. Start with a few pots of high-yielding, easy-to-grow herbs like mint, basil, and coriander, along with container tomatoes or green chilies. 
      </p>
      
      <h3 class="text-sm font-semibold text-[var(--color-primary-dark)] mt-12 mb-5 font-[Poppins] uppercase tracking-wider">3. Organic Pest Control</h3>
      <p class="mb-6 text-base leading-relaxed text-[var(--color-text-main)] font-sans text-justify" style="text-align: justify; text-justify: inter-word;">
        In organic gardening, we avoid chemical pesticides. Instead, use natural remedies like cold-pressed neem oil spray, introducing beneficial insects like ladybugs, and planting companion crops (like marigolds) that naturally repel pests.
      </p>
    `
  }
];

function Blog() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse state from URL search params
  const params = new URLSearchParams(location.search);
  const blogIdParam = params.get('id');
  const pageParam = parseInt(params.get('page')) || 1;

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pagination config:
  // - Post 0 is the Featured Post (displayed only on page 1).
  // - The remaining posts are paginated separately at exactly 6 grid cards per page.
  const postsPerPage = 6;
  const featuredPost = BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.slice(1);

  // Handle syncing state with URL parameters
  useEffect(() => {
    if (blogIdParam) {
      const foundBlog = BLOG_POSTS.find(post => post.id === parseInt(blogIdParam));
      if (foundBlog) {
        setSelectedBlog(foundBlog);
        window.scrollTo(0, 0);
      } else {
        navigate('/blogs', { replace: true });
        setSelectedBlog(null);
      }
    } else {
      setSelectedBlog(null);
      setCurrentPage(pageParam);
    }
  }, [blogIdParam, pageParam, navigate]);

  // Navigate helper to change pages
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/blogs?page=${pageNumber}`);
    window.scrollTo(0, 0);
  };

  // Navigate helper to read a blog
  const handleReadBlog = (id) => {
    navigate(`/blogs?id=${id}`);
  };

  // Navigate helper to return to list
  const handleBackToList = () => {
    navigate(`/blogs?page=${currentPage}`);
  };

  // Handle email subscription submit with double-subscription block, error indicators, and toast
  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanedEmail = emailInput.trim().toLowerCase();
    
    if (!cleanedEmail) {
      setErrorMsg("Email address cannot be empty.");
      return;
    }
    if (!emailRegex.test(cleanedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Retrieve existing subscribers list from localStorage to block double subscriptions
    const subscribers = JSON.parse(localStorage.getItem('planters_blog_subscribers') || '[]');
    if (subscribers.includes(cleanedEmail)) {
      setErrorMsg("This email address is already subscribed.");
      return;
    }

    // Save new subscriber to the list
    subscribers.push(cleanedEmail);
    localStorage.setItem('planters_blog_subscribers', JSON.stringify(subscribers));

    toast.success("Welcome to planters agro family!");
    setEmailInput('');
    setErrorMsg('');
  };

  // Pagination calculations:
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentGridPosts = remainingPosts.slice(indexOfFirstPost, indexOfLastPost);

  // If Detail View is active
  if (selectedBlog) {
    const relatedPosts = BLOG_POSTS
      .filter(post => post.id !== selectedBlog.id)
      .slice(0, 3);

    return (
      <div className="page-section bg-[var(--color-bg-main)] py-12">
        {/* Container styled exactly like Privacy Policy layout for clean text content alignment */}
        <div className="container flex justify-center mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[800px] flex flex-col gap-8">
            
            {/* Back Button */}
            <div className="flex justify-start">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors duration-200 cursor-pointer font-[Poppins] px-4 py-2 rounded-[3px] bg-[var(--color-bg-secondary)]"
              >
                <FaArrowLeft className="text-xs" /> Back to Blogs
              </button>
            </div>

            {/* Detailed Blog Container */}
            <div className="w-full flex flex-col gap-6">
              
              {/* Meta Tags (Always Left Aligned) */}
              <div className="flex flex-wrap items-center justify-start gap-4 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest font-[Poppins]">
                <span className="bg-[var(--color-primary-subtle)] text-[var(--color-primary-dark)] px-3 py-1 rounded-[3px] flex items-center gap-1.5">
                  <FaTag className="text-[10px]" /> {selectedBlog.category}
                </span>
                <span className="text-[var(--color-text-main)] tracking-normal normal-case font-normal flex items-center gap-1.5">
                  <FaClock /> {selectedBlog.readTime}
                </span>
              </div>

              {/* Title (Scaled Down to text-xl/text-2xl on mobile to fit nicely, always left-aligned) */}
              <h1 className="font-[var(--font-family-heading)] text-xl sm:text-3xl md:text-4xl font-semibold text-[var(--color-primary-dark)] leading-tight text-left">
                {selectedBlog.title}
              </h1>

              {/* Author and Date Row (Left-aligned, wraps cleanly on narrow viewports, date floats right on mobile) */}
              <div className="flex flex-row flex-wrap items-center justify-start gap-y-2 gap-x-4 pb-3 border-b border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-text-main)] font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary-dark)] font-bold text-[10px] uppercase">
                    {selectedBlog.author.charAt(0)}
                  </div>
                  <span>By <strong>{selectedBlog.author}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <FaCalendarAlt className="text-xs text-[var(--color-text-light)]" />
                  <span>{selectedBlog.date}</span>
                </div>
              </div>

              {/* Hero Image (Elegant, matches text container size, restricted height) */}
              <img 
                src={selectedBlog.image} 
                alt={selectedBlog.title} 
                style={{ display: 'block', width: '100%', maxWidth: '100%', height: 'auto', maxHeight: '380px', objectFit: 'cover', borderRadius: '3px', margin: '12px auto' }}
              />

              {/* Content Body (Justified align, custom tag rules applied inside content string) */}
              <div 
                className="blog-detail-content font-sans text-[var(--color-text-main)] text-[16px] leading-[1.8]"
                style={{ marginTop: '20px' }}
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />

              {/* Loved this article? Section & Centered Inline Subscription Form (Clean spacings, block container for centering, no wrapping) */}
              <div className="text-center" style={{ marginTop: '36px', marginBottom: '0px' }}>
                <h3 className="font-[var(--font-family-heading)] text-lg sm:text-xl font-bold text-[var(--color-primary-dark)] uppercase tracking-wider" style={{ marginBottom: '14px' }}>
                  Loved this article?
                </h3>
                <p className="text-sm text-[var(--color-text-main)] font-sans w-full" style={{ marginBottom: '0px' }}>
                  Subscribe to our newsletters or share it with fellow plant enthusiasts to help spread the green movement!
                </p>
                
                {/* Horizontal Centering container wrapping the form element */}
                <div className="flex justify-center w-full" style={{ marginTop: '36px' }}>
                  <form onSubmit={handleSubscribe} className="w-full max-w-[320px] text-left" style={{ marginTop: '16px' }}>
                    <div className="flex items-center border-b border-gray-300 pb-2.5 focus-within:border-[var(--color-primary)] transition-colors">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Enter email here"
                        className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-gray-400 text-[var(--color-text-main)] !border-none !p-0 font-sans font-light select-text"
                      />
                      <button 
                        type="submit" 
                        className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors ml-3 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                      >
                        <FaArrowRight size={16} />
                      </button>
                    </div>
                    {/* Validation indicator in red text below the input field, centered */}
                    {errorMsg && (
                      <p className="text-red-500 text-xs font-sans mt-2 text-center w-full block">
                        {errorMsg}
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* Related Posts Section (Pushed down cleanly with margin bottom, no top margin to prevent double spacing) */}
              <div style={{ marginTop: '0px', borderTop: '1px solid var(--color-border)', paddingTop: '24px', marginBottom: '60px' }}>
                <h3 className="font-[var(--font-family-heading)] text-xl font-semibold text-[var(--color-primary-dark)] uppercase tracking-wider mb-6 text-center sm:text-left">
                  Recommended Reads
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedPosts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={() => handleReadBlog(post.id)}
                      className="group cursor-pointer flex flex-col h-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[3px] overflow-hidden hover:bg-[var(--color-primary-bg)] transition-colors duration-300"
                    >
                      <div className="w-full h-36 overflow-hidden bg-[var(--color-bg-secondary)] shrink-0 rounded-t-[3px]">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow bg-transparent" style={{ paddingBottom: '20px' }}>
                        <span className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider font-[Poppins] block text-left mb-1.5">
                          {post.category}
                        </span>
                        <h4 className="font-[var(--font-family-heading)] text-sm font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-2 text-left mb-3 min-h-[40px]">
                          {post.title}
                        </h4>
                        <span className="text-[11px] text-[var(--color-text-main)] font-sans mt-auto text-left block">
                          {post.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // List View (All Blogs with Pagination)
  return (
    <div className="page-section bg-[var(--color-bg-main)] py-12">
      <div className="container">
        
        {/* Horizontally & Vertically Centered Header & Intro Section */}
        <div 
          className="flex flex-col items-center justify-center text-center w-full px-6"
          style={{ marginBottom: '60px', paddingBottom: '10px' }}
        >
          <span className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] tracking-[3.6px] uppercase font-[Poppins] block mb-2">
            Our Publications
          </span>
          <h1 className="text-[var(--color-primary-dark)] uppercase font-[Poppins] font-semibold text-3xl sm:text-4xl md:text-5xl tracking-[0.6px] mb-4">
            The Planters Blog
          </h1>
          <p className="max-w-2xl font-sans text-base text-[var(--color-text-main)] leading-relaxed mt-2">
            Welcome to our green journal. Discover professional plant care guides, design inspiration, urban gardening guides, and lifestyle tips curated by our expert horticulturists.
          </p>
        </div>

        {/* Featured Post (Only on Page 1) - Card container matching Home.jsx with explicit margins */}
        {currentPage === 1 && BLOG_POSTS.length > 0 && (
          <div className="w-full block" style={{ marginBottom: '60px' }}>
            <div 
              onClick={() => handleReadBlog(featuredPost.id)}
              className="group cursor-pointer bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[3px] overflow-hidden hover:bg-[var(--color-primary-bg)] transition-colors duration-300 flex flex-col lg:flex-row w-full gap-0"
              style={{ minHeight: '360px' }}
            >
              {/* Image Container */}
              <div className="w-full lg:w-[55%] h-[280px] sm:h-[350px] lg:h-[380px] relative overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                
                {/* Image Glassmorphic overlay */}
                <div className="absolute inset-0 p-6 flex items-center justify-center pointer-events-none">
                  <div className="max-w-[85%] bg-white/45 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-[8px] text-center shadow-lg transition-all duration-300 group-hover:bg-white/60">
                    <h3 className="font-[var(--font-family-heading)] text-sm sm:text-base md:text-xl lg:text-lg xl:text-xl font-semibold text-[var(--color-primary-dark)] leading-snug">
                      {featuredPost.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Featured Post Details (Padded explicitly with inline styles) */}
              <div 
                className="w-full lg:w-[45%] flex flex-col justify-center flex-grow bg-transparent"
                style={{ padding: '30px', minHeight: '350px' }}
              >
                <span 
                  className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest font-[Poppins] text-left block"
                  style={{ marginBottom: '6px' }}
                >
                  FEATURED • {featuredPost.category}
                </span>
                
                <h2 
                  className="font-[var(--font-family-heading)] text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--color-primary-dark)] group-hover:text-[var(--color-primary)] transition-colors duration-200 leading-snug text-left"
                  style={{ marginBottom: '12px' }}
                >
                  {featuredPost.title}
                </h2>
                
                <div 
                  className="flex justify-between items-center text-xs text-[var(--color-text-main)] font-sans font-medium"
                  style={{ marginBottom: '14px' }}
                >
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[10px] text-[var(--color-primary)]" /> {featuredPost.date}
                  </span>
                  <span className="text-[var(--color-primary-dark)]">{featuredPost.readTime}</span>
                </div>

                <p 
                  className="font-sans text-sm text-[var(--color-text-main)] leading-relaxed text-left line-clamp-4"
                  style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '20px' }}
                >
                  {featuredPost.summary}
                </p>

                <div className="mt-auto flex justify-end">
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-dark)] group-hover:text-[var(--color-primary)] transition-colors duration-200 font-[Poppins]">
                    Read more <span className="ml-1.5">—</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Post Grid - Fully styled with 6 grid cards per page */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
          style={{ gap: '48px 32px', marginTop: '60px', clear: 'both' }}
        >
          {currentGridPosts.map(post => (
            <div 
              key={post.id} 
              onClick={() => handleReadBlog(post.id)}
              className="group cursor-pointer flex flex-col bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[3px] overflow-hidden hover:bg-[var(--color-primary-bg)] transition-colors duration-300 h-full w-full"
              style={{ marginBottom: '16px' }}
            >
              {/* Card Image Container (More compact height in desktop) */}
              <div className="relative h-48 sm:h-52 md:h-48 lg:h-44 w-full overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Glassmorphic miniature overlay */}
                <div className="absolute inset-0 p-4 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="max-w-[90%] bg-white/45 backdrop-blur-md border border-white/20 p-3 rounded-[8px] text-center shadow-md">
                    <h4 className="font-[var(--font-family-heading)] text-xs font-semibold text-[var(--color-primary-dark)] line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Card Details (Spaced, padded with tighter inline styles for compact viewport fit) */}
              <div 
                className="flex flex-col flex-grow bg-transparent"
                style={{ padding: '16px 20px' }}
              >
                <span 
                  className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider font-[Poppins] block text-left"
                  style={{ marginBottom: '6px' }}
                >
                  {post.category}
                </span>

                <h3 
                  className="font-[var(--font-family-heading)] text-base font-semibold text-[var(--color-primary-dark)] group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-2 leading-snug text-left"
                  style={{ marginBottom: '12px' }}
                >
                  {post.title}
                </h3>

                <div 
                  className="flex justify-between items-center text-xs text-[var(--color-text-main)] font-sans font-medium"
                  style={{ marginBottom: '14px' }}
                >
                  <span>{post.date}</span>
                  <span className="text-[var(--color-primary-dark)]">{post.readTime}</span>
                </div>

                <p 
                  className="font-sans text-sm text-[var(--color-text-main)] leading-relaxed text-left line-clamp-4"
                  style={{ textAlign: 'justify', textJustify: 'inter-word', marginBottom: '20px' }}
                >
                  {post.summary}
                </p>

                <div className="mt-auto flex justify-end">
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-dark)] group-hover:text-[var(--color-primary)] transition-colors duration-200 font-[Poppins]">
                    Read more <span className="ml-1.5">—</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Section (Professional layout positioning, margin top, clear both) */}
        {totalPages > 1 && (
          <div 
            className="w-full flex justify-center items-center gap-2"
            style={{ marginTop: '100px', paddingBottom: '60px', clear: 'both' }}
          >
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-[3px] border transition-colors duration-200 ${
                currentPage === 1 
                  ? 'border-[var(--color-border)] text-[var(--color-text-light)] cursor-not-allowed bg-transparent' 
                  : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] cursor-pointer'
              }`}
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 font-[Poppins] text-sm font-semibold rounded-[3px] border transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[var(--color-primary-dark)] border-[var(--color-primary-dark)] text-white' 
                      : 'border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-[3px] border transition-colors duration-200 ${
                currentPage === totalPages 
                  ? 'border-[var(--color-border)] text-[var(--color-text-light)] cursor-not-allowed bg-transparent' 
                  : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] cursor-pointer'
              }`}
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Blog;
