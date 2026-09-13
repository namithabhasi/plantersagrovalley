import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../redux/auth/authSlice';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import {
  FaSun,
  FaShieldAlt,
  FaTruck,
  FaLeaf,
  FaChevronRight,
  FaChevronLeft,
  FaShoppingCart,
  FaCheckCircle,
  FaMagic,
  FaPencilAlt,
  FaCheck,
} from 'react-icons/fa';
import {
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiSend,
  FiUser,
  FiFilter,
  FiAlertCircle,
} from 'react-icons/fi';
import './Customplant.css';
import './Chat.css';
import { getSmartBotResponse } from '../services/chat/chatBotEngine';

// Import catalog products from store pages
import { plantProducts } from './Plants.jsx';
import { planterProducts } from './Planterspage.jsx';
import { fertilizerProducts } from './Fertilizers.jsx';
import { gardenProducts } from './Gardendecors.jsx';

// Import local fallback image & video assets
import air4 from '../assets/AIRPLANTS/Peace Lily Air Purifying Plant Indoors Easy Care.jpg';
import ind1 from '../assets/INDOORPLANTS/11 Inspiring Secrets To Thriving Indoor Bamboo_ Choosing the Right Environment.jpg';
import ind2 from '../assets/INDOORPLANTS/Humidity-Loving Plants_ Transform Your Bathroom with Tropical Vibes - Quiet Minimal.jpg';
import ind3 from '../assets/INDOORPLANTS/Indoor Plants Ideas For Beginners_ Transform Your Home Into A Green Paradise.jpg';
import bal2 from '../assets/BALCONY/Gardening tips_ 9 easy ways to grow Lavender plants indoors in a pot.jpg';
import frag1 from '../assets/FRAGRANTPLANTS/Orange Jasmine.jpg';
import frag2 from '../assets/FRAGRANTPLANTS/tuberose_flowers.jpg';
import out1 from '../assets/OUTDOORPLANTS/How to Use Plumeria in a Florida Garden Design.jpg';

// Import Hero Video & Robot GIF Assets
import heroVideo from '../assets/vedio.mp4';
import robotGif from '../assets/cute_robot_watering_plant.gif';

// Configurator Steps
const STEPS = [
  { id: 1, label: 'Your Space' },
  { id: 2, label: 'Planter / Pot' },
  { id: 3, label: 'Select Plants' },
  { id: 4, label: 'Soil & Nutrients' },
  { id: 5, label: 'Care Tools' },
  { id: 6, label: 'Review Kit' },
];

// Room Spaces Catalog
const SPACES = [
  { id: 'sp1', title: 'Indoor Bedroom / Low Light', desc: 'Thrives in indirect sunlight & shaded corners.', badge: 'Popular', price: 0, img: ind3, category: 'indoor' },
  { id: 'sp2', title: 'Balcony / Partial Sun', desc: 'Receives 2-4 hours of gentle morning sun.', badge: 'Balanced', price: 0, img: bal2, category: 'balcony' },
  { id: 'sp3', title: 'Terrace / Direct Sunlight', desc: 'Loves full day direct tropical sun.', badge: 'Outdoor', price: 0, img: frag1, category: 'terrace' },
  { id: 'sp4', title: 'Office Desk / Artificial Light', desc: 'Compact size, requires minimal maintenance.', badge: 'Easy Care', price: 0, img: air4, category: 'office' },
  { id: 'sp5', title: 'Living Room / Bright Indirect', desc: 'Bright ambient light without scorching direct heat.', badge: 'Indoor', price: 0, img: ind1, category: 'indoor' },
  { id: 'sp6', title: 'Window Sill / Morning Sun', desc: 'Ideal for compact flowering pots & fragrant herbs.', badge: 'Compact', price: 0, img: frag2, category: 'balcony' },
  { id: 'sp7', title: 'Shaded Patio / Covered Garden', desc: 'Protected space shield from intense rainfall & harsh sun.', badge: 'Outdoor', price: 0, img: out1, category: 'terrace' },
  { id: 'sp8', title: 'Bathroom / High Humidity', desc: 'High humidity environment perfect for tropical ferns & lilies.', badge: 'Moisture Loving', price: 0, img: ind2, category: 'indoor' },
];

// Catalog Mappers
const formatPlantProduct = (p) => ({
  id: p.id,
  title: p.name,
  desc: p.description || `Healthy ${p.category ? p.category.replace('-', ' ') : 'nursery'} plant suitable for your garden setup.`,
  price: p.price,
  img: p.image || air4,
  badge: p.discount ? `${p.discount} OFF` : p.rating === 5 ? 'Top Rated' : null,
  category: p.category,
});

const formatPlanterProduct = (p) => ({
  id: p.id,
  title: p.name,
  desc: p.description || `Durable ${p.category ? p.category.replace('-', ' ') : 'planter'} pot with optimal drainage.`,
  price: p.price,
  img: p.image || ind3,
  badge: p.discount ? `${p.discount} OFF` : p.rating === 5 ? 'Best Seller' : null,
  category: p.category,
});

const formatFertilizerProduct = (f) => ({
  id: f.id,
  title: f.name,
  desc: f.description || `Organic potting soil & nutrient essential.`,
  price: f.price,
  img: f.image || ind3,
  badge: f.oldPrice ? 'Recommended' : null,
  category: f.category,
});

const formatGardenProduct = (g) => ({
  id: g.id,
  title: g.name,
  desc: g.description || `Essential care tool & accessory for plant health.`,
  price: g.price,
  img: g.image || air4,
  badge: g.oldPrice ? 'Essential' : null,
  category: g.category,
});

// Prepared Catalog Lists
const CATALOG_PLANTS = (plantProducts || []).map(formatPlantProduct);
const CATALOG_POTS = (planterProducts || []).map(formatPlanterProduct);
const CATALOG_SOILS = (fertilizerProducts || []).map(formatFertilizerProduct);
const CATALOG_TOOLS = (gardenProducts || []).map(formatGardenProduct);

const Customplant = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { addToCart } = useCart();

  // Selection States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedPot, setSelectedPot] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedSoil, setSelectedSoil] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  // Category Filter & Pagination State
  const [filterCategory, setFilterCategory] = useState('All');
  const [cardPage, setCardPage] = useState(1);

  // Live Summary Modal State & Edit Mode States
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [editingFromReviewStep, setEditingFromReviewStep] = useState(null);
  const [initialItemOnEdit, setInitialItemOnEdit] = useState(null);
  const [hasChangedProduct, setHasChangedProduct] = useState(false);
  const [editReturnModalOpen, setEditReturnModalOpen] = useState(false);
  const [noChangeModalOpen, setNoChangeModalOpen] = useState(false);

  // Reset filter and pagination when step changes
  useEffect(() => {
    setFilterCategory('All');
    setCardPage(1);
  }, [currentStep]);

  const handleEditFromReview = (stepId) => {
    setEditingFromReviewStep(stepId);
    setHasChangedProduct(false);

    let initialItem = null;
    if (stepId === 1) initialItem = selectedSpace;
    else if (stepId === 2) initialItem = selectedPot;
    else if (stepId === 3) initialItem = selectedPlant;
    else if (stepId === 4) initialItem = selectedSoil;
    else if (stepId === 5) initialItem = selectedTool;

    setInitialItemOnEdit(initialItem);
    setCurrentStep(stepId);
    scrollToConfigurator();
  };

  const handleSelectCardItem = (item, setterFunc) => {
    setterFunc(item);
    if (editingFromReviewStep) {
      if (initialItemOnEdit && initialItemOnEdit.id === item.id) {
        setHasChangedProduct(false);
      } else {
        setHasChangedProduct(true);
        setEditReturnModalOpen(true);
      }
    }
  };

  const handleReturnToReview = () => {
    if (editingFromReviewStep && !hasChangedProduct) {
      // Trigger confirmation modal asking if they wish to keep existing item or stay to edit
      setNoChangeModalOpen(true);
    } else {
      setEditReturnModalOpen(false);
      setNoChangeModalOpen(false);
      if (hasChangedProduct) {
        toast.success('Selection updated successfully!', {
          position: 'top-center',
          autoClose: 2000,
        });
      }
      setEditingFromReviewStep(null);
      setInitialItemOnEdit(null);
      setHasChangedProduct(false);
      setCurrentStep(6);
      scrollToConfigurator();
    }
  };

  const handleConfirmKeepExisting = () => {
    setNoChangeModalOpen(false);
    toast.info('No product change made. Keeping your existing selection.', {
      position: 'top-center',
      autoClose: 2500,
    });
    setEditingFromReviewStep(null);
    setInitialItemOnEdit(null);
    setHasChangedProduct(false);
    setCurrentStep(6);
    scrollToConfigurator();
  };

  const selectedCount = [selectedSpace, selectedPot, selectedPlant, selectedSoil, selectedTool].filter(Boolean).length;

  // Real-time Total Price Calculation
  const totalPrice =
    (selectedSpace?.price || 0) +
    (selectedPot?.price || 0) +
    (selectedPlant?.price || 0) +
    (selectedSoil?.price || 0) +
    (selectedTool?.price || 0);

  // Sequential Step Locking Validation Logic
  const isStepUnlocked = (stepId) => {
    if (stepId === 1) return true;
    if (stepId === 2) return Boolean(selectedSpace);
    if (stepId === 3) return Boolean(selectedSpace && selectedPot);
    if (stepId === 4) return Boolean(selectedSpace && selectedPot && selectedPlant);
    if (stepId === 5) return Boolean(selectedSpace && selectedPot && selectedPlant && selectedSoil);
    if (stepId === 6) return Boolean(selectedSpace && selectedPot && selectedPlant && selectedSoil && selectedTool);
    return false;
  };

  const currentStepHasSelection = () => {
    if (currentStep === 1) return Boolean(selectedSpace);
    if (currentStep === 2) return Boolean(selectedPot);
    if (currentStep === 3) return Boolean(selectedPlant);
    if (currentStep === 4) return Boolean(selectedSoil);
    if (currentStep === 5) return Boolean(selectedTool);
    if (currentStep === 6) return true;
    return false;
  };

  const scrollToConfigurator = () => {
    const el = document.getElementById('configurator-start');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (editingFromReviewStep) {
      handleReturnToReview();
      return;
    }
    if (currentStep < STEPS.length) {
      if (currentStepHasSelection()) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        const stepMessages = {
          1: 'Please select a Room Space & Sunlight option to proceed!',
          2: 'Please select a Planter / Pot to proceed to the next step!',
          3: 'Please select your desired Plant to proceed to the next step!',
          4: 'Please select Soil & Nutrients for your plant setup!',
          5: 'Please select a Care Tool / Accessory to proceed!',
        };
        toast.warning(stepMessages[currentStep] || `Please make a selection for Step ${currentStep} first!`, {
          position: 'top-center',
          autoClose: 2500,
        });
      }
    }
  };

  const handlePrev = () => {
    if (editingFromReviewStep) {
      handleReturnToReview();
      return;
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  // Helper to check the first uncompleted step (1 to 5)
  const getFirstUncompletedStep = () => {
    if (!selectedSpace) return 1;
    if (!selectedPot) return 2;
    if (!selectedPlant) return 3;
    if (!selectedSoil) return 4;
    if (!selectedTool) return 5;
    return 6; // All steps completed
  };

  const isKitFullyCompleted = getFirstUncompletedStep() === 6;

  // Handler when user clicks "View Full Kit" inside Live Kit Summary Modal
  const handleViewFullKitModal = () => {
    setSummaryModalOpen(false);
    const uncompletedStep = getFirstUncompletedStep();
    if (uncompletedStep < 6) {
      const stepNames = {
        1: 'Space & Sunlight',
        2: 'Planter / Pot',
        3: 'Plant Choice',
        4: 'Soil & Nutrients',
        5: 'Care Tool',
      };
      toast.warning(`Please complete your bucket list selection for ${stepNames[uncompletedStep]} first!`, {
        position: 'top-center',
        autoClose: 3000,
      });
      setCurrentStep(uncompletedStep);
      scrollToConfigurator();
    } else {
      setCurrentStep(6);
    }
  };

  const handleAddToCart = () => {
    const uncompletedStep = getFirstUncompletedStep();
    if (uncompletedStep < 6) {
      const stepNames = {
        1: 'Space & Sunlight',
        2: 'Planter / Pot',
        3: 'Plant Choice',
        4: 'Soil & Nutrients',
        5: 'Care Tool',
      };
      toast.warning(`Please complete your bucket list selection for ${stepNames[uncompletedStep]} before adding to cart!`, {
        position: 'top-center',
        autoClose: 3000,
      });
      setCurrentStep(uncompletedStep);
      scrollToConfigurator();
      return;
    }

    const customKitItem = {
      _id: `custom-kit-${Date.now()}`,
      name: `Custom Garden Kit: ${selectedPlant?.title || 'Custom Setup'}`,
      title: `Custom Garden Kit: ${selectedPlant?.title || 'Custom Setup'}`,
      price: totalPrice,
      priceNum: totalPrice,
      image: selectedPlant?.img || selectedPot?.img || air4,
      img: selectedPlant?.img || selectedPot?.img || air4,
      category: 'Custom Kit',
      quantity: 1,
      isCustomKit: true,
      kitDetails: {
        space: selectedSpace?.title,
        pot: selectedPot?.title,
        plant: selectedPlant?.title,
        soil: selectedSoil?.title,
        tool: selectedTool?.title,
      },
    };

    // IF USER IS NOT LOGGED IN: Save pending kit to sessionStorage & redirect to /signin
    if (!user) {
      toast.info('Please sign in or register to complete your purchase!', {
        position: 'top-center',
        autoClose: 3500,
      });
      sessionStorage.setItem('pendingCustomKit', JSON.stringify(customKitItem));
      sessionStorage.setItem('postLoginRedirect', '/cart');
      navigate('/signin');
      return;
    }

    // IF USER IS LOGGED IN: Add to cart and navigate to cart page
    addToCart(customKitItem);
    toast.success('🌿 Your Custom Garden Kit has been added to cart!', {
      position: 'top-center',
    });
    navigate('/cart');
  };

  // Helper to retrieve category options per stepper step
  const getStepCategoryOptions = () => {
    if (currentStep === 1) {
      return [
        { id: 'All', label: 'All Spaces' },
        { id: 'indoor', label: 'Indoor Rooms' },
        { id: 'balcony', label: 'Balcony & Patio' },
        { id: 'terrace', label: 'Terrace Gardens' },
        { id: 'office', label: 'Office Desk' },
      ];
    }
    if (currentStep === 2) {
      return [
        { id: 'All', label: 'All Pots' },
        { id: 'ceramic-pots', label: 'Ceramic Pots' },
        { id: 'plastic-pots', label: 'Plastic Pots' },
        { id: 'metal-pots', label: 'Metal Pots' },
        { id: 'hanging-basket', label: 'Hanging Baskets' },
        { id: 'grill-pots', label: 'Grill / Railing' },
        { id: 'grow-bags', label: 'Grow Bags' },
      ];
    }
    if (currentStep === 3) {
      return [
        { id: 'All', label: 'All Plants' },
        { id: 'flowering-plants', label: 'Flowering Plants' },
        { id: 'indoor-plants', label: 'Indoor Foliage' },
        { id: 'fruit-plants', label: 'Fruit Plants' },
        { id: 'cactus-plants', label: 'Cactus & Succulents' },
        { id: 'medicinal-plants', label: 'Medicinal Herbs' },
        { id: 'climbers-creepers', label: 'Climbers & Vines' },
        { id: 'air-plants', label: 'Air Purifiers' },
      ];
    }
    if (currentStep === 4) {
      return [
        { id: 'All', label: 'All Soil & Fertilizers' },
        { id: 'coco-bricks', label: 'Coco Peat' },
        { id: 'compost', label: 'Vermicompost' },
        { id: 'cow-manure', label: 'Organic Manure' },
        { id: 'plant-food', label: 'Liquid Food' },
      ];
    }
    if (currentStep === 5) {
      return [
        { id: 'All', label: 'All Tools & Decors' },
        { id: 'garden-tools', label: 'Hand Tools & Shears' },
        { id: 'pebbles', label: 'Decorative Pebbles' },
        { id: 'bird-houses', label: 'Bird Houses' },
        { id: 'fairy-garden', label: 'Fairy Accessories' },
      ];
    }
    return [{ id: 'All', label: 'All Categories' }];
  };

  // Planters Agro AI Chatbot States & Intelligent Consultation Logic
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic Selection-Aware AI Assistant Prompter
  const getContextualAiPrompt = () => {
    if (!selectedSpace) {
      return {
        text: "Hi there! I'm Planters Agro Valley AI 🌿\nI'll analyze your preferences to help you build the ideal garden kit. First, what room or sunlight setting are you setting up?",
        chips: [
          'Balcony / Partial Sun ☀️',
          'Indoor Bedroom / Low Light 🪴',
          'Office Desk / Artificial Light 💼',
          'Terrace / Direct Sunlight 🌞',
        ],
      };
    }
    if (!selectedPlant) {
      return {
        text: `Based on your selection of **${selectedSpace.title}**, what plant style do you prefer for this environment?`,
        chips: [
          'Flowering Plants (e.g. Jasmine, Rose)',
          'Lush Foliage Air Purifiers',
          'Medicinal Herbs & Fragrant Plants',
          'Low Maintenance Succulents',
        ],
      };
    }
    if (!selectedPot) {
      return {
        text: `Great choice! **${selectedPlant.title}** pairs wonderfully with ${selectedSpace.title}. Next, what style of planter or pot would you like to place it in?`,
        chips: [
          'Ceramic Pots (Elegant & Sturdy)',
          'Plastic Pots (Lightweight & Durable)',
          'Hanging Baskets',
          'Fabric Grow Bags',
        ],
      };
    }
    if (!selectedSoil) {
      return {
        text: `Nice choice with **${selectedPot.title}**! To keep your **${selectedPlant.title}** thriving, what organic soil or nutrient mix would you like?`,
        chips: [
          'Coco Peat Mix (Aeration & Moisture)',
          'Vermicompost (Rich Organic Food)',
          'Organic Manure Mix',
          'Liquid Plant Food',
        ],
      };
    }
    if (!selectedTool) {
      return {
        text: `Potting mix set to **${selectedSoil.title}** 🌾! Would you like to add care tools or decorative accessories to finish your setup?`,
        chips: [
          'Hand Shears & Pruning Tools',
          'Decorative Garden Pebbles',
          'Fairy Garden Accessories',
          'View Full Kit (Step 6)',
        ],
      };
    }
    return {
      text: `Your Custom Garden Kit is fully assembled around **${selectedPlant.title}** in **${selectedPot.title}**! 🎉\n\nWould you like to review your complete kit summary or add it directly to your cart?`,
      chips: ['View Full Kit (Step 6)', 'Add Complete Kit to Cart'],
    };
  };

  const initialPrompt = getContextualAiPrompt();
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: initialPrompt.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chips: initialPrompt.chips,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef(null);

  // Sync initial welcome prompt when AI Chat is opened
  useEffect(() => {
    if (aiChatOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, aiChatOpen, isTyping]);

  const handleConsultantConversation = async (userText) => {
    const text = userText.toLowerCase().trim();
    let replyText = '';
    let nextChips = [];
    let showRecommendation = false;

    // 1. Analyze Space Selection
    if (text.includes('balcony') || text.includes('bedroom') || text.includes('terrace') || text.includes('office') || text.includes('indoor')) {
      let spaceChoice = SPACES[0];
      if (text.includes('balcony')) spaceChoice = SPACES[1];
      else if (text.includes('terrace')) spaceChoice = SPACES[2];
      else if (text.includes('office')) spaceChoice = SPACES[3];

      setSelectedSpace(spaceChoice);

      replyText = `Understood! I've set your space to **${spaceChoice.title}** 🌿\n\nBased on this environment, what type of plant would you like to grow here?`;
      nextChips = [
        'Flowering Plants (e.g. Jasmine, Rose)',
        'Lush Foliage Air Purifiers',
        'Medicinal Herbs & Fragrant Plants',
        'Low Maintenance Succulents',
      ];
    }
    // 2. Analyze Plant Choice
    else if (text.includes('flower') || text.includes('rose') || text.includes('jasmine') || text.includes('foliage') || text.includes('greenery') || text.includes('air') || text.includes('herb') || text.includes('succulent')) {
      let plantChoice = CATALOG_PLANTS[0];
      if (text.includes('flower') || text.includes('rose')) plantChoice = CATALOG_PLANTS.find(p => p.category === 'flowering-plants') || CATALOG_PLANTS[0];
      else if (text.includes('air') || text.includes('foliage')) plantChoice = CATALOG_PLANTS.find(p => p.category === 'air-plants' || p.category === 'indoor-plants') || CATALOG_PLANTS[0];
      else if (text.includes('herb')) plantChoice = CATALOG_PLANTS.find(p => p.category === 'medicinal-plants') || CATALOG_PLANTS[0];

      setSelectedPlant(plantChoice);

      const spaceName = selectedSpace?.title || 'your space';
      replyText = `Excellent! **${plantChoice.title}** will thrive in ${spaceName} 🌱\n\nNext, what style of planter or pot would you like to pair with this plant?`;
      nextChips = [
        'Ceramic Pots (Elegant & Sturdy)',
        'Plastic Pots (Lightweight & Durable)',
        'Hanging Baskets',
        'Fabric Grow Bags',
      ];
    }
    // 3. Analyze Pot Choice
    else if (text.includes('ceramic') || text.includes('plastic') || text.includes('hanging') || text.includes('grow bag') || text.includes('pot') || text.includes('planter')) {
      let potChoice = CATALOG_POTS[0];
      if (text.includes('ceramic')) potChoice = CATALOG_POTS.find(p => p.category === 'ceramic-pots') || CATALOG_POTS[0];
      else if (text.includes('hanging')) potChoice = CATALOG_POTS.find(p => p.category === 'hanging-basket') || CATALOG_POTS[0];
      else if (text.includes('grow')) potChoice = CATALOG_POTS.find(p => p.category === 'grow-bags') || CATALOG_POTS[0];
      else if (text.includes('plastic')) potChoice = CATALOG_POTS.find(p => p.category === 'plastic-pots') || CATALOG_POTS[0];

      setSelectedPot(potChoice);

      replyText = `Great selection! **${potChoice.title}** complements your setup 🪴\n\nWhat organic soil or nutrient mix would you like for healthy root growth?`;
      nextChips = [
        'Coco Peat Mix (Aeration & Moisture)',
        'Vermicompost (Rich Organic Food)',
        'Organic Manure Mix',
        'Liquid Plant Food',
      ];
    }
    // 4. Analyze Soil Choice
    else if (text.includes('coco') || text.includes('compost') || text.includes('manure') || text.includes('soil') || text.includes('food') || text.includes('nutrient')) {
      let soilChoice = CATALOG_SOILS[0];
      if (text.includes('compost')) soilChoice = CATALOG_SOILS.find(s => s.category === 'compost') || CATALOG_SOILS[0];
      else if (text.includes('manure')) soilChoice = CATALOG_SOILS.find(s => s.category === 'cow-manure') || CATALOG_SOILS[0];
      else if (text.includes('coco')) soilChoice = CATALOG_SOILS.find(s => s.category === 'coco-bricks') || CATALOG_SOILS[0];

      setSelectedSoil(soilChoice);

      replyText = `Potting mix set to **${soilChoice.title}** 🌾\n\nFinally, would you like to add any care tools or garden decor to complete your setup?`;
      nextChips = [
        'Hand Shears & Pruning Tools',
        'Decorative Garden Pebbles',
        'Fairy Garden Accessories',
        'View Full Kit (Step 6)',
      ];
    }
    // 5. Analyze Tool Choice / Review Kit
    else if (text.includes('shears') || text.includes('tool') || text.includes('pebbles') || text.includes('fairy') || text.includes('complete') || text.includes('review')) {
      let toolChoice = CATALOG_TOOLS[0];
      if (text.includes('shears') || text.includes('tool')) toolChoice = CATALOG_TOOLS.find(t => t.category === 'garden-tools') || CATALOG_TOOLS[0];
      else if (text.includes('pebbles')) toolChoice = CATALOG_TOOLS.find(t => t.category === 'pebbles') || CATALOG_TOOLS[0];
      else if (text.includes('fairy')) toolChoice = CATALOG_TOOLS.find(t => t.category === 'fairy-garden') || CATALOG_TOOLS[0];

      setSelectedTool(toolChoice);

      replyText = `Awesome! Your Custom Garden Kit is now fully customized! 🎉\n\nYou can review your full summary or add your complete kit to the cart.`;
      showRecommendation = true;
      nextChips = ['View Full Kit (Step 6)', 'Add Complete Kit to Cart'];
    }
    // 6. Free-Form Questions answered by live AI engine (Gemini / Knowledge Base)
    else {
      const aiResult = await getSmartBotResponse(userText);
      replyText = aiResult.text;

      const promptInfo = getContextualAiPrompt();
      nextChips = promptInfo.chips;
    }

    return { text: replyText, chips: nextChips, recommendation: showRecommendation };
  };

  const handleSendChatMessage = async (userText) => {
    const textToSend = userText || inputMessage;
    if (!textToSend || !textToSend.trim()) return;

    if (textToSend.includes('View Full Kit')) {
      setAiChatOpen(false);
      setCurrentStep(6);
      return;
    }
    if (textToSend.includes('Add Complete Kit to Cart')) {
      setAiChatOpen(false);
      handleAddToCart();
      return;
    }

    const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [
      ...chatMessages,
      { id: Date.now(), sender: 'user', text: textToSend, time: timeStamp },
    ];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    const result = await handleConsultantConversation(textToSend);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: result.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: result.chips,
          recommendation: result.recommendation,
          kitData: result.recommendation
            ? {
                total: totalPrice,
                space: selectedSpace,
                pot: selectedPot,
                plant: selectedPlant,
                soil: selectedSoil,
                tool: selectedTool,
              }
            : null,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const getStepHeaderInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Choose Your Room Space & Sunlight',
          subtitle: 'Pick a space setting so we can auto-match compatible plants for optimal growth.',
        };
      case 2:
        return {
          title: 'Choose Your Planter / Pot',
          subtitle: 'Pick a durable, high-quality planter that complements your space and style.',
        };
      case 3:
        return {
          title: 'Select Compatible Plant',
          subtitle: 'Hand-picked healthy nursery plants compatible with your environment.',
        };
      case 4:
        return {
          title: 'Potting Soil & Nutrients',
          subtitle: 'Choose nutrient-rich organic soil mixes tailored for root aeration and growth.',
        };
      case 5:
        return {
          title: 'Care Tools & Accessories',
          subtitle: 'Add maintenance essentials, misters, and decorative accents for your garden.',
        };
      case 6:
      default:
        return {
          title: 'Review & Finalize Kit',
          subtitle: 'Inspect your complete garden setup before adding it to your shopping cart.',
        };
    }
  };

  // Render 4-Column x 2-Row Card Grid (Filtered by Category Dropdown)
  const renderCardGrid = (items, selected, setSelected) => {
    let filtered = items;
    if (filterCategory !== 'All') {
      filtered = items.filter(
        (item) => item.category === filterCategory || (item.category && item.category.includes(filterCategory))
      );
    }

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const startIndex = (cardPage - 1) * itemsPerPage;
    const visibleItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="customplant-cards-section">
        {visibleItems.length === 0 ? (
          <div className="customplant-empty-category">
            <p>No items found for category "{filterCategory}".</p>
            <button
              className="customplant-reset-cat-btn"
              onClick={() => {
                setFilterCategory('All');
                setCardPage(1);
              }}
            >
              Show All Items
            </button>
          </div>
        ) : (
          <div className="customplant-cards-grid">
            {visibleItems.map((item) => {
              const isSelected = selected?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`customplant-grid-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectCardItem(item, setSelected)}
                >
                  {/* Badge Tag */}
                  {item.badge && (
                    <div className="grid-card-badge">
                      <span className="badge-dot" /> {item.badge}
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="grid-card-image-box">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="grid-card-img"
                    />
                  </div>

                  {/* Content Body */}
                  <div className="grid-card-body">
                    <h4 className="grid-card-title" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="grid-card-desc" title={item.desc}>
                      {item.desc}
                    </p>
                    
                    {item.price > 0 && (
                      <div className="grid-card-price">
                        Rs. {item.price}.00
                      </div>
                    )}

                    {/* Bottom Action Button */}
                    <button
                      className={`grid-card-action-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCardItem(item, setSelected);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <FaCheckCircle /> Selected
                        </>
                      ) : (
                        <>
                          <FaShoppingCart /> Add to Kit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS WITH GREEN CIRCULAR ARROW BUTTONS */}
        {totalPages > 1 && (
          <div className="customplant-pagination-bar">
            <button
              className="green-circle-arrow-btn"
              disabled={cardPage === 1}
              onClick={() => setCardPage((prev) => Math.max(1, prev - 1))}
              title="Previous Page"
            >
              <FaChevronLeft />
            </button>

            <span className="pagination-info-text">
              Page {cardPage} of {totalPages}
            </span>

            <button
              className="green-circle-arrow-btn"
              disabled={cardPage === totalPages}
              onClick={() => setCardPage((prev) => Math.min(totalPages, prev + 1))}
              title="Next Page"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  };

  const headerInfo = getStepHeaderInfo();
  const stepCategories = getStepCategoryOptions();

  return (
    <div className="customplant-page-wrapper">
      {/* 1. HERO BANNER SECTION */}
      <section className="customplant-hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="customplant-hero-video"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="container">
          <div className="customplant-hero-content">
            <h1 className="customplant-hero-title">
              BUILD YOUR CUSTOM GARDEN KIT
            </h1>
            <p className="customplant-hero-subtitle">
              Tailor-made plant setups matched to your room sunlight, pot preferences, organic soil, and essential care tools.
            </p>

            <div className="customplant-hero-badges">
              <div className="customplant-badge-item">
                <FaSun /> 100% Sunlight Match
              </div>
              <div className="customplant-badge-item">
                <FaShieldAlt /> Organic Soil & Nutrients
              </div>
              <div className="customplant-badge-item">
                <FaTruck /> Safe Express Shipping
              </div>
            </div>

            <button
              className="btn btn-primary customplant-hero-cta"
              onClick={scrollToConfigurator}
            >
              <FaMagic /> START CUSTOMIZING KIT
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONFIGURATOR CONTAINER */}
      <div className="container customplant-container" id="configurator-start">
        {/* TOP BUILDER BANNER WITH CUTE ROBOT GIF & SPARKLING AGRO AI BUTTON */}
        <div className="customplant-builder-banner">
          <div className="customplant-builder-banner-left">
            <div className="customplant-banner-icon-box">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 7 6 7 11C7 13.5 8.5 15.5 10.5 16.3V18H13.5V16.3C15.5 15.5 17 13.5 17 11C17 6 12 2 12 2Z" fill="#16a34a"/>
                <path d="M7 21H17V18H7V21Z" fill="#06492D"/>
                <path d="M12 5V13" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 className="customplant-banner-title">Build Your Garden Kit</h2>
              <p className="customplant-banner-subtitle">A few simple steps to your perfect green space</p>
            </div>
          </div>

          <div className="customplant-builder-banner-right">
            <img
              src={robotGif}
              alt="Cute Robot Watering Plant"
              className="customplant-banner-clean-gif"
            />
            <button className="customplant-ai-sparkle-btn" onClick={() => setAiChatOpen(true)}>
              <div className="ai-sparkle-stars">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#FACC15"/>
                </svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sparkle-small">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#FDE047"/>
                </svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sparkle-tiny">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#FEF08A"/>
                </svg>
              </div>
              <div className="ai-btn-text-content">
                <span className="ai-btn-main-text">BUILD WITH AGRO AI</span>
                <span className="ai-btn-beta-tag">BETA</span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. FIXED / STICKY RESPONSIVE 6-STEP CONNECTED LINE STEPPER */}
        <div className="customplant-line-stepper">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const unlocked = isStepUnlocked(step.id);
            const lineFilled = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`stepper-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!unlocked ? 'disabled' : ''}`}
                  onClick={() => {
                    if (currentStep === 6 && step.id < 6) {
                      toast.info(`Please click the "Edit" button next to ${step.label} in the Review Summary below to modify it!`, {
                        position: 'top-center',
                        autoClose: 2500,
                      });
                      return;
                    }
                    if (unlocked) {
                      setCurrentStep(step.id);
                    } else {
                      const uncompletedStep = getFirstUncompletedStep();
                      const stepNames = {
                        1: 'Space & Sunlight',
                        2: 'Planter / Pot',
                        3: 'Plant Choice',
                        4: 'Soil & Nutrients',
                        5: 'Care Tool',
                      };
                      toast.warning(`Please complete your bucket list selection for ${stepNames[uncompletedStep]} first!`, {
                        position: 'top-center',
                        autoClose: 2500,
                      });
                      setCurrentStep(uncompletedStep);
                    }
                  }}
                  title={unlocked ? step.label : `Complete Step ${step.id - 1} to unlock`}
                >
                  <div className="stepper-circle">
                    {isCompleted ? <FaCheck /> : step.id}
                  </div>
                  <span className="stepper-label">{step.label}</span>
                </div>

                {index < STEPS.length - 1 && (
                  <div className={`stepper-connector ${lineFilled ? 'filled' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* SELECTION AREA CONTAINER */}
        <div className="customplant-selection-area">
          {/* STEP HEADER DIV (LIGHT GREEN BG WITH TITLE & CATEGORY DROPDOWN + SUMMARY BUTTON) */}
          <div className="customplant-step-top-bar">
            <div>
              <h2 className="customplant-step-title">{headerInfo.title}</h2>
              <p className="customplant-step-subtitle">{headerInfo.subtitle}</p>
            </div>

            <div className="customplant-header-right-actions">
              {/* CATEGORY FILTER DROPDOWN PERTAINING TO CURRENT STEPPER */}
              {currentStep < 6 && (
                <div className="customplant-category-select-wrapper">
                  <FiFilter className="category-select-icon" />
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setCardPage(1);
                    }}
                    className="customplant-header-category-select"
                  >
                    {stepCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* TOP LIVE KIT SUMMARY MODAL TRIGGER BUTTON (ONLY ON STEPS 1 TO 5) */}
              {currentStep < 6 && (
                <button
                  className="customplant-top-cart-btn"
                  onClick={() => setSummaryModalOpen(true)}
                  title="Open Live Kit Summary Modal"
                >
                  <div className="top-cart-icon-wrap">
                    <FaShoppingCart />
                    <span className="top-cart-badge">{selectedCount}</span>
                  </div>
                  <span className="top-cart-text">Live Kit Summary</span>
                </button>
              )}
            </div>
          </div>

          {/* STEP 1: SPACES */}
          {currentStep === 1 && renderCardGrid(SPACES, selectedSpace, setSelectedSpace)}

          {/* STEP 2: POTS */}
          {currentStep === 2 && renderCardGrid(CATALOG_POTS, selectedPot, setSelectedPot)}

          {/* STEP 3: PLANTS */}
          {currentStep === 3 && renderCardGrid(CATALOG_PLANTS, selectedPlant, setSelectedPlant)}

          {/* STEP 4: SOIL */}
          {currentStep === 4 && renderCardGrid(CATALOG_SOILS, selectedSoil, setSelectedSoil)}

          {/* STEP 5: TOOLS */}
          {currentStep === 5 && renderCardGrid(CATALOG_TOOLS, selectedTool, setSelectedTool)}

          {/* STEP 6: REVIEW */}
          {currentStep === 6 && (
            <div className="customplant-review-container">
              <div className="review-card">
                {/* Centered Header with Robot GIF & Peace Tagline (No Emojis) */}
                <div className="review-card-header centered">
                  <img
                    src={robotGif}
                    alt="Cute Robot Watering Plant"
                    className="review-robot-gif"
                  />
                  <h3 className="review-title">
                    CUSTOM GARDEN KIT SUMMARY: <span style={{ color: '#047857', fontWeight: '700' }}>COMPLETE</span>
                  </h3>
                  <p className="review-peace-tagline">
                    May your space be green and bring you peace
                  </p>
                </div>

                {/* Items List with Edit Buttons for Each Step (No Step Badges) */}
                <div className="review-items-list">
                  {/* 1. SPACE */}
                  <div className="review-item-row">
                    <div className="review-item-left">
                      <div className="review-item-info">
                        <span className="review-item-label">Space & Sunlight</span>
                        <span className="review-item-title">{selectedSpace?.title || 'Not Selected'}</span>
                      </div>
                    </div>
                    <div className="review-item-right">
                      <span className="review-item-price">Included</span>
                      <button
                        className="review-edit-btn"
                        onClick={() => handleEditFromReview(1)}
                        title="Edit Space & Sunlight"
                      >
                        <FaPencilAlt /> Edit
                      </button>
                    </div>
                  </div>

                  {/* 2. POT */}
                  <div className="review-item-row">
                    <div className="review-item-left">
                      <div className="review-item-info">
                        <span className="review-item-label">Planter / Pot</span>
                        <span className="review-item-title">{selectedPot?.title || 'Not Selected'}</span>
                      </div>
                    </div>
                    <div className="review-item-right">
                      <span className="review-item-price">Rs. {selectedPot?.price || 0}.00</span>
                      <button
                        className="review-edit-btn"
                        onClick={() => handleEditFromReview(2)}
                        title="Edit Planter / Pot"
                      >
                        <FaPencilAlt /> Edit
                      </button>
                    </div>
                  </div>

                  {/* 3. PLANT */}
                  <div className="review-item-row">
                    <div className="review-item-left">
                      <div className="review-item-info">
                        <span className="review-item-label">Plant Choice</span>
                        <span className="review-item-title">{selectedPlant?.title || 'Not Selected'}</span>
                      </div>
                    </div>
                    <div className="review-item-right">
                      <span className="review-item-price">Rs. {selectedPlant?.price || 0}.00</span>
                      <button
                        className="review-edit-btn"
                        onClick={() => handleEditFromReview(3)}
                        title="Edit Plant Choice"
                      >
                        <FaPencilAlt /> Edit
                      </button>
                    </div>
                  </div>

                  {/* 4. SOIL */}
                  <div className="review-item-row">
                    <div className="review-item-left">
                      <div className="review-item-info">
                        <span className="review-item-label">Soil & Nutrients</span>
                        <span className="review-item-title">{selectedSoil?.title || 'Not Selected'}</span>
                      </div>
                    </div>
                    <div className="review-item-right">
                      <span className="review-item-price">Rs. {selectedSoil?.price || 0}.00</span>
                      <button
                        className="review-edit-btn"
                        onClick={() => handleEditFromReview(4)}
                        title="Edit Soil & Nutrients"
                      >
                        <FaPencilAlt /> Edit
                      </button>
                    </div>
                  </div>

                  {/* 5. CARE TOOL */}
                  <div className="review-item-row">
                    <div className="review-item-left">
                      <div className="review-item-info">
                        <span className="review-item-label">Care Tool & Decor</span>
                        <span className="review-item-title">{selectedTool?.title || 'Not Selected'}</span>
                      </div>
                    </div>
                    <div className="review-item-right">
                      <span className="review-item-price">Rs. {selectedTool?.price || 0}.00</span>
                      <button
                        className="review-edit-btn"
                        onClick={() => handleEditFromReview(5)}
                        title="Edit Care Tool"
                      >
                        <FaPencilAlt /> Edit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Price Box */}
                <div className="review-total-row">
                  <span>Total Kit Price:</span>
                  <span className="review-price-highlight">Rs. {totalPrice}.00</span>
                </div>

                {/* Primary Add Complete Kit to Cart Button */}
                <button className="customplant-add-cart-btn" onClick={handleAddToCart}>
                  <FaShoppingCart /> ADD COMPLETE KIT TO CART (Rs. {totalPrice}.00)
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM NAV BUTTONS (ONLY FOR STEPS 1 TO 5) */}
          {currentStep < 6 && (
            <div className="customplant-nav-buttons">
              <button
                className="customplant-nav-btn back"
                onClick={handlePrev}
                disabled={currentStep === 1 && !editingFromReviewStep}
              >
                <FaChevronLeft /> {editingFromReviewStep ? 'Return to Review' : 'Back'}
              </button>

              <button className="customplant-nav-btn next" onClick={handleNext}>
                {editingFromReviewStep
                  ? 'Return to Review Kit'
                  : `Next: ${STEPS[currentStep]?.label || 'Next Step'}`}{' '}
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. LIVE KIT SUMMARY OVERLAY MODAL (NO UNNECESSARY SCROLLS) */}
      {summaryModalOpen && (
        <div className="customplant-modal-overlay" onClick={() => setSummaryModalOpen(false)}>
          <div className="customplant-summary-modal" onClick={(e) => e.stopPropagation()}>
            <div className="summary-modal-header">
              <h3 className="summary-modal-title">
                <FaLeaf /> LIVE KIT SUMMARY
              </h3>
              <button
                className="summary-close-btn"
                onClick={() => setSummaryModalOpen(false)}
                title="Close Modal"
              >
                <FiX />
              </button>
            </div>

            <div className="summary-items-list">
              {/* 1. SPACE */}
              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">SPACE & LIGHT</span>
                  <div className="summary-item-val">
                    {selectedSpace ? selectedSpace.title : 'Not Selected Yet'}
                  </div>
                </div>
                <button
                  className="summary-edit-link"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    setCurrentStep(1);
                  }}
                >
                  <FaPencilAlt /> Edit
                </button>
              </div>

              {/* 2. POT */}
              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">PLANTER / POT</span>
                  <div className="summary-item-val">
                    {selectedPot ? selectedPot.title : 'Not Selected Yet'}
                  </div>
                </div>
                <div className="summary-item-price">
                  {selectedPot ? `Rs. ${selectedPot.price}.00` : 'Rs. 0.00'}
                </div>
                <button
                  className="summary-edit-link"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    setCurrentStep(2);
                  }}
                >
                  <FaPencilAlt /> Edit
                </button>
              </div>

              {/* 3. PLANT */}
              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">PLANT</span>
                  <div className="summary-item-val">
                    {selectedPlant ? selectedPlant.title : 'Not Selected Yet'}
                  </div>
                </div>
                <div className="summary-item-price">
                  {selectedPlant ? `Rs. ${selectedPlant.price}.00` : 'Rs. 0.00'}
                </div>
                <button
                  className="summary-edit-link"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    setCurrentStep(3);
                  }}
                >
                  <FaPencilAlt /> Edit
                </button>
              </div>

              {/* 4. SOIL */}
              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">SOIL & NUTRIENTS</span>
                  <div className="summary-item-val">
                    {selectedSoil ? selectedSoil.title : 'Not Selected Yet'}
                  </div>
                </div>
                <div className="summary-item-price">
                  {selectedSoil ? `Rs. ${selectedSoil.price}.00` : 'Rs. 0.00'}
                </div>
                <button
                  className="summary-edit-link"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    setCurrentStep(4);
                  }}
                >
                  <FaPencilAlt /> Edit
                </button>
              </div>

              {/* 5. TOOL */}
              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">CARE TOOL</span>
                  <div className="summary-item-val">
                    {selectedTool ? selectedTool.title : 'Not Selected Yet'}
                  </div>
                </div>
                <div className="summary-item-price">
                  {selectedTool ? `Rs. ${selectedTool.price}.00` : 'Rs. 0.00'}
                </div>
                <button
                  className="summary-edit-link"
                  onClick={() => {
                    setSummaryModalOpen(false);
                    setCurrentStep(5);
                  }}
                >
                  <FaPencilAlt /> Edit
                </button>
              </div>
            </div>

            {/* REAL-TIME TOTAL PRICE BOX */}
            <div className="summary-total-box">
              <span className="total-box-label">Total Price:</span>
              <span className="total-box-price">Rs. {totalPrice}.00</span>
            </div>

            <button
              className="summary-cta-btn"
              onClick={handleViewFullKitModal}
            >
              View Full Kit <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* 5. AGRO AI CHATBOT MODAL WINDOW */}
      {aiChatOpen && (
        <div className={`chat-window-modal ${isExpanded ? "expanded" : ""}`}>
          <div className="chat-header-bar">
            {user ? (
              <div className="chat-user-badge">
                <FiUser style={{ fontSize: "14px" }} />
                <span>{user.firstName || user.name || "Logged in"}</span>
              </div>
            ) : (
              <button onClick={() => dispatch(openAuthModal({ tab: "login" }))} className="chat-signin-btn">
                Sign in
              </button>
            )}

            <div className="chat-header-controls">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="chat-control-icon-btn"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button
                onClick={() => setAiChatOpen(false)}
                className="chat-control-icon-btn"
                title="Close chat"
              >
                <FiX />
              </button>
            </div>
          </div>

          <div className="chat-body-scrollable">
            <div className="chat-content-container">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="chat-msg-block">
                  <div className={`chat-msg-row ${msg.sender === "user" ? "user-msg-row" : "bot-msg-row"}`}>
                    <div className={`chat-msg-bubble ${msg.sender === "user" ? "user-msg-bubble" : "bot-msg-bubble"}`}>
                      <div
                        className="chat-msg-text-content"
                        dangerouslySetInnerHTML={{
                          __html: (msg.text || "")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br/>")
                        }}
                      />
                    </div>
                  </div>

                  {msg.chips && msg.chips.length > 0 && (
                    <div className="chat-chips-below-container">
                      {msg.chips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSendChatMessage(chip)}
                          className="chat-question-chip-btn"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="chat-msg-row bot-msg-row">
                  <div className="chat-typing-dots">
                    <div className="chat-typing-dot"></div>
                    <div className="chat-typing-dot"></div>
                    <div className="chat-typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>
          </div>

          <div className="chat-input-footer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="chat-input-pill-container"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Agro AI for plant advice..."
                className="chat-text-input"
              />
              <button type="submit" disabled={!inputMessage.trim()} className="chat-send-btn">
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT RETURN CONFIRMATION MODAL */}
      {editReturnModalOpen && (
        <div className="customplant-modal-overlay" onClick={() => setEditReturnModalOpen(false)}>
          <div className="customplant-summary-modal edit-return-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-return-header">
              <div className="edit-return-icon-box">
                <FaCheckCircle />
              </div>
              <h3 className="edit-return-title">Selection Updated!</h3>
              <p className="edit-return-subtitle">
                Your garden kit item has been successfully updated.
              </p>
            </div>

            <div className="edit-return-actions">
              <button
                className="edit-return-primary-btn"
                onClick={handleReturnToReview}
              >
                Return to Review Kit <FaChevronRight />
              </button>

              <button
                className="edit-return-secondary-btn"
                onClick={() => setEditReturnModalOpen(false)}
              >
                Continue Customizing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. NO CHANGE CONFIRMATION MODAL */}
      {noChangeModalOpen && (
        <div className="customplant-modal-overlay" onClick={() => setNoChangeModalOpen(false)}>
          <div className="customplant-summary-modal edit-return-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-return-header">
              <div className="no-change-icon-box">
                <FiAlertCircle />
              </div>
              <h3 className="edit-return-title">No Changes Made</h3>
              <p className="edit-return-subtitle">
                You haven't selected a new item for{' '}
                <strong>{STEPS[editingFromReviewStep - 1]?.label || 'this step'}</strong>. Do you wish to continue with your existing selection or stay to choose another item?
              </p>
            </div>

            <div className="edit-return-actions">
              <button
                className="edit-return-primary-btn"
                onClick={handleConfirmKeepExisting}
              >
                Yes, Keep Existing & Go to Review Kit <FaChevronRight />
              </button>

              <button
                className="edit-return-secondary-btn"
                onClick={() => setNoChangeModalOpen(false)}
              >
                No, Stay & Pick Another Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customplant;
