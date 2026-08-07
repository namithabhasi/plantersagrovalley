import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiDollarSign,
  FiZap,
  FiLayers,
  FiCheckCircle,
  FiThumbsUp,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiX,
  FiSun,
  FiDroplet,
  FiHome,
  FiCamera,
  FiArrowUpRight,
  FiUser
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../redux/auth/authSlice';
import { plantProducts } from './Plants';
import { seedProducts } from './Seeds';
import { planterProducts } from './Planterspage';
import { fertilizerProducts } from './Fertilizers';
import { gardenProducts } from './Gardendecors';
import haworthiaImg from '../assets/Haworthia.jpg';
import '../index.css';

// Initial reviews sample matching Pic 3 & 4 format
const initialMockReviews = [
  {
    id: 1,
    author: 'Namitha Bhasi',
    avatar: 'R',
    date: '17 June 2026',
    rating: 5,
    title: 'Great buy',
    size: 'Standard',
    color: 'Green',
    comment: 'I have not only purchased this for myself, but for my mum and my dad, this is the most comfortable pair. I have used it for a really long time and I recommend it to everyone.',
    verified: true,
    likes: 18,
    helpfulText: 'One person found this helpful'
  },
  {
    id: 2,
    author: 'Navaneeth Bhasi',
    avatar: 'V',
    date: '18 January 2026',
    rating: 5,
    title: 'The product is light and comfortable',
    size: 'Medium',
    color: 'Green',
    comment: 'Excellent quality and comfort. Everyone should go for it. Arrived securely packed and in pristine condition.',
    verified: true,
    likes: 12,
    helpfulText: '2 people found this helpful'
  },
  {
    id: 3,
    author: 'Nithin Bhasi',
    avatar: 'A',
    date: '28 May 2026',
    rating: 4,
    title: 'Very satisfied with the build',
    size: 'Standard',
    color: 'Natural',
    comment: 'Looks sleek and fits nicely in my living space. Very easy to set up and maintain.',
    verified: true,
    likes: 7,
    helpfulText: null
  }
];

// Bank Offers data
const bankOffersData = [
  {
    id: 'hdfc',
    bank: 'HDFC Bank',
    discount: '10% Instant Discount',
    description: 'on HDFC Bank Credit Cards up to ₹750 on orders above ₹5,000',
    logoText: 'HDFC Bank'
  },
  {
    id: 'icici',
    bank: 'ICICI Bank',
    discount: '10% Instant Discount',
    description: 'on ICICI Bank Credit Cards up to ₹750 on orders above ₹5,000',
    logoText: 'ICICI Bank'
  },
  {
    id: 'sbi',
    bank: 'SBI Card',
    discount: '5% Instant Discount',
    description: 'on SBI Credit Cards up to ₹500 on orders above ₹5,000',
    logoText: 'SBI Card'
  },
  {
    id: 'emi',
    bank: 'All Banks',
    discount: '3 Months No Cost EMI',
    description: 'on Credit Cards. Min. order value ₹3,000',
    logoText: 'All Banks'
  }
];

function Productdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { user } = useSelector((state) => state.auth || {});

  const handleWriteReviewClick = () => {
    if (!user) {
      toast.info("Please log in to write a customer review.");
      dispatch(openAuthModal("login"));
      return;
    }
    navigate('/review', { state: { product } });
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Real-time Reviews State
  const [reviewsList, setReviewsList] = useState(initialMockReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const reviewsPerPage = 3;

  // Load customer reviews from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('planters_custom_reviews') || '[]');
      if (saved && saved.length > 0) {
        setReviewsList([...saved, ...initialMockReviews]);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  }, []);

  // Calculate Real-Time Tag Counts dynamically based on reviews
  const tagCounts = useMemo(() => {
    const counts = {
      Comfort: 94,
      Quality: 70,
      'Value for money': 18,
      Fit: 8
    };
    reviewsList.forEach(r => {
      const text = (r.comment + ' ' + r.title + ' ' + (r.helpfulText || '')).toLowerCase();
      if (text.includes('comfort') || text.includes('soft') || text.includes('ease') || text.includes('care') || r.rating >= 5) {
        counts.Comfort++;
      }
      if (text.includes('quality') || text.includes('build') || text.includes('durable') || text.includes('material') || text.includes('plant') || text.includes('healthy')) {
        counts.Quality++;
      }
      if (text.includes('value') || text.includes('money') || text.includes('price') || text.includes('buy') || text.includes('worth') || text.includes('satisfied')) {
        counts['Value for money']++;
      }
      if (text.includes('fit') || text.includes('size') || text.includes('space') || text.includes('room') || text.includes('pot') || text.includes('standard')) {
        counts.Fit++;
      }
    });
    return counts;
  }, [reviewsList]);

  // Filter reviews when user selects a tag to learn more
  const filteredReviews = useMemo(() => {
    if (!selectedTag) return reviewsList;
    return reviewsList.filter(r => {
      const text = (r.comment + ' ' + r.title).toLowerCase();
      if (selectedTag === 'Comfort') return text.includes('comfort') || text.includes('soft') || text.includes('ease') || text.includes('care') || r.rating >= 5;
      if (selectedTag === 'Quality') return text.includes('quality') || text.includes('build') || text.includes('durable') || text.includes('material') || text.includes('plant') || text.includes('healthy');
      if (selectedTag === 'Value for money') return text.includes('value') || text.includes('money') || text.includes('price') || text.includes('buy') || text.includes('worth') || text.includes('satisfied');
      if (selectedTag === 'Fit') return text.includes('fit') || text.includes('size') || text.includes('space') || text.includes('room') || text.includes('pot') || text.includes('standard');
      return true;
    });
  }, [reviewsList, selectedTag]);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    return filteredReviews.slice(startIndex, startIndex + reviewsPerPage);
  }, [filteredReviews, currentPage]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    photo: null
  });

  // Calculate Real-Time Rating Metrics dynamically
  const ratingMetrics = useMemo(() => {
    const totalCount = reviewsList.length;
    if (totalCount === 0) {
      return { average: '4.7', totalCount: 3, breakdown: { 5: 80, 4: 15, 3: 5, 2: 0, 1: 0 } };
    }
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / totalCount).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach(r => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });

    const breakdown = {
      5: Math.round((counts[5] / totalCount) * 100),
      4: Math.round((counts[4] / totalCount) * 100),
      3: Math.round((counts[3] / totalCount) * 100),
      2: Math.round((counts[2] / totalCount) * 100),
      1: Math.round((counts[1] / totalCount) * 100)
    };

    return { average: avg, totalCount, breakdown };
  }, [reviewsList]);

  // Fetch / resolve product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // 1. Check local catalog
        const localProduct = plantProducts.find(p => p.id === id) ||
          seedProducts.find(p => p.id === id) ||
          planterProducts.find(p => p.id === id) ||
          fertilizerProducts.find(p => p.id === id) ||
          gardenProducts.find(p => p.id === id);

        if (localProduct) {
          const isPlantCategory = (localProduct.category === 'Plants' || localProduct.category === 'Seeds' || !localProduct.category);
          const discountPct = localProduct.originalPrice && localProduct.originalPrice > localProduct.price
            ? Math.round(((localProduct.originalPrice - localProduct.price) / localProduct.originalPrice) * 100)
            : (localProduct.discount ? parseInt(localProduct.discount) : 17);

          const defaultPlantAbout = [
            "Hand-picked Healthy Specimen – Cultivated under optimal nursery conditions for high hardiness and vibrant growth.",
            "Air Purifying & Aesthetic – Naturally filters indoor pollutants while adding fresh green ambiance to your living space.",
            "Easy Maintenance – Thrives in well-draining soil mixes with minimal daily care required.",
            "Versatile Placement – Perfect for balconies, living rooms, window sills, trellises, and office desks.",
            "Eco-friendly Secure Packaging – Shipped with root moisture retention and protective eco-friendly packaging."
          ];

          const defaultPlantSpecs = {
            "Plant Type": "Indoor / Outdoor Botanical",
            "Watering": "Once a week (when top 1 inch soil dries)",
            "Sunlight": "Bright indirect sunlight",
            "Placement": "Living Room, Balcony, Office",
            "Maintenance Level": "Easy to moderate",
            "Pet Friendly": "Keep away from pets"
          };

          const defaultShelfAbout = [
            "No Drilling Installation Option – Easy self adhesive mounting with strong wall hold and zero damage.",
            "Rustproof Heavy Duty Metal Build – Premium powder coated metal designed for humid and wet environments.",
            "Smart Space Storage – Maximizes unused corner spaces for organizers, toiletries, or decorative items.",
            "Multi-Room Utility – Great for bathrooms, kitchen counters, laundry, or office supply organization.",
            "Complete Accessory Kit – Includes strong adhesive pads and mounting hardware."
          ];

          const defaultShelfSpecs = {
            "Material": "Powder Coated Metal",
            "Mounting Type": "Adhesive Wall Mount",
            "Room Type": "Bathroom, Kitchen, Balcony, Office",
            "Shelf Type": "Corner / Wall Shelf",
            "Special Feature": "Rust Proof, Heavy Duty, Space Saving",
            "Finish Type": "Matte Powder Finish"
          };

          setProduct({
            _id: localProduct.id,
            name: localProduct.name,
            subtitle: isPlantCategory ? "Fresh Botanical Plant" : "Durable Home & Garden Accessory",
            price: localProduct.price || 499,
            originalPrice: localProduct.originalPrice || (localProduct.price ? Math.round(localProduct.price * 1.25) : 599),
            discountText: discountPct ? `${discountPct}% OFF` : null,
            images: [
              { url: localProduct.image || haworthiaImg },
              { url: localProduct.image || haworthiaImg }
            ],
            inStock: localProduct.inStock !== false,
            category: { name: localProduct.category || 'Plants' },
            subcategory: isPlantCategory ? "Indoor Plants" : "Home Decor",
            description: localProduct.description || (isPlantCategory
              ? `Bring the beauty of nature home with ${localProduct.name}. Carefully grown for high hardiness, vibrant foliage, and effortless maintenance.`
              : `High quality ${localProduct.name} built with durable weather-resistant materials for indoor and outdoor spaces.`),
            aboutItems: isPlantCategory ? defaultPlantAbout : defaultShelfAbout,
            specifications: isPlantCategory ? defaultPlantSpecs : defaultShelfSpecs,
            isPlant: isPlantCategory
          });
          setLoading(false);
          return;
        }

        // 2. Fetch from backend API
        const { data } = await axios.get(`/products/${id}`);
        if (data.success && data.product) {
          const apiProd = data.product;
          setProduct({
            ...apiProd,
            subtitle: apiProd.subtitle || "Premium Agro Valley Product",
            aboutItems: apiProd.aboutItems || [
              "High quality material designed for extra durability and modern aesthetics.",
              "Easy to clean, store, and maintain with minimal effort.",
              "Multi-purpose utility suitable for indoor and outdoor settings."
            ],
            specifications: apiProd.specifications || {
              "Material": "Premium Grade Quality",
              "Placement": "Living Room, Balcony, Office",
              "Special Feature": "Durable Build, Easy Maintenance"
            },
            isPlant: true
          });
        } else {
          toast.error("Product not found");
          navigate('/plants');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !product) return;
      try {
        const { data } = await axios.get('/wishlist');
        if (data.success && data.wishlist) {
          const exists = data.wishlist.products?.some(p => p._id === product._id);
          setInWishlist(!!exists);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };
    checkWishlist();
  }, [product, user]);

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.info("Please log in to add items to your wishlist.");
      return;
    }
    try {
      setAddingWishlist(true);
      if (inWishlist) {
        await axios.delete(`/wishlist/${product._id}`);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post('/wishlist', { productId: product._id });
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("Failed to update wishlist.");
    } finally {
      setAddingWishlist(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const productImage = product.images && product.images[0] ? product.images[0].url : haworthiaImg;
    const displayPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: displayPrice,
        image: productImage
      });
    }
    toast.success(`${product.name} (x${quantity}) added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  // Upvote / Like Review
  const handleLikeReview = (reviewId) => {
    setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1, helpfulText: `${r.likes + 1} people found this helpful` } : r));
    toast.success("Thank you for your feedback!");
  };

  // Submit New Review (Pic 5 format)
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error("Please fill in the review title and body.");
      return;
    }

    const userName = user?.name || 'Verified Customer';
    const reviewToAdd = {
      id: Date.now(),
      author: userName,
      avatar: userName.charAt(0).toUpperCase(),
      date: 'Today',
      rating: Number(newReview.rating),
      title: newReview.title.trim(),
      comment: newReview.comment.trim(),
      verified: true,
      likes: 0,
      helpfulText: null
    };

    setReviewsList([reviewToAdd, ...reviewsList]);
    setShowReviewModal(false);
    setNewReview({ rating: 5, title: '', comment: '', photo: null });
    toast.success("Review submitted! Rating updated live.");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06492D] mb-4"></div>
        <p className="text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  const displayPrice = product.price;
  const originalPrice = product.originalPrice;
  const mainImage = product.images && product.images[selectedImageIndex] ? product.images[selectedImageIndex].url : haworthiaImg;

  return (
    <div style={{ marginTop: '20px' }} className="w-full bg-white min-h-screen pt-4 pb-16">

      {/* =========================================================================
         SECTION 1: Main Product Overview & Image Gallery
         ========================================================================= */}
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 mb-16 items-start">

          {/* Left Column: Image Gallery Container */}
          <div className="md:col-span-5 flex flex-col gap-4 w-full">
            <div className="w-full h-[350px] sm:h-[400px] lg:h-[430px] bg-[#f8f9fa] rounded-[3px] overflow-hidden flex items-center justify-center relative group">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.discountText && (
                <span className="absolute top-4 left-4 bg-[#1b7a42] text-white font-bold text-xs uppercase px-3 py-1 rounded-[3px] z-10 shadow-xs">
                  {product.discountText}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-[3px] overflow-hidden bg-[#f8f9fa] flex-shrink-0 transition-all cursor-pointer ${selectedImageIndex === index ? 'ring-2 ring-[#06492D]' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Action Panel */}
          <div className="md:col-span-7 flex flex-col">

            {/* Title & Subtitle */}
            <div className="mt-1 mb-1.5 space-y-0.5">
              <h1 className="section-title text-2xl sm:text-3xl font-bold tracking-tight py-0 leading-snug text-slate-900">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed font-medium">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Price & Taxes Section */}
            <div className="my-1.5 py-0">
              <div className="flex items-baseline gap-3.5">
                <span className="text-3xl font-bold text-[#06492D]">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {originalPrice && (
                  <span className="text-base text-slate-400 line-through font-normal">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountText && (
                  <span className="bg-[#e8f5e9] text-[#1b7a42] font-bold text-xs px-2.5 py-0.5 rounded-[3px] border border-[#2da15d]/20">
                    {product.discountText}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 block mt-0.5 font-medium">Inclusive of all taxes</span>
            </div>

            {/* Description Body Text */}
            <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed my-1.5 py-0">
              {product.description}
            </p>

            {/* Feature Highlights */}
            <div style={{ padding: '10px' }} className="flex flex-wrap gap-4 sm:gap-6 my-1.5 py-0">
              {product.isPlant ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiCheckCircle className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Easy Care</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiSun className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Bright Indirect</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiDroplet className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Weekly Water</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiHome className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Air Purifying</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiCheckCircle className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Rust Proof</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiZap className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Heavy Duty</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiLayers className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Space Saving</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FiCheckCircle className="text-[#06492D] flex-shrink-0" size={17} />
                    <span>Easy Install</span>
                  </div>
                </>
              )}
            </div>

            {/* Quantity Selector & Rating Stars Row (In Line!) */}
            <div style={{ padding: '10px' }} className="flex flex-wrap items-center justify-between gap-4 mt-6 mb-4 py-1">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2.5 text-slate-700">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-slate-300 rounded-[3px] bg-white h-10">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-200 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors border-l border-slate-200 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Rating Stars placed in line with Quantity */}
              <div className="flex items-center gap-3 cursor-pointer pt-3 sm:pt-0">
                <div className="flex items-center text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => {
                    const avg = Number(ratingMetrics.average);
                    const isFull = i < Math.floor(avg);
                    const isPartial = i === Math.floor(avg) && avg % 1 !== 0;
                    const partialPct = isPartial ? Math.round((avg % 1) * 100) : 0;

                    if (isFull) {
                      return <FaStar key={i} size={16} className="text-amber-500" />;
                    } else if (isPartial) {
                      return (
                        <div key={i} className="relative inline-block" style={{ width: 16, height: 16 }}>
                          <FaStar size={16} className="text-slate-200" />
                          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialPct}%`, height: 16 }}>
                            <FaStar size={16} className="text-amber-500" />
                          </div>
                        </div>
                      );
                    } else {
                      return <FaStar key={i} size={16} className="text-slate-200" />;
                    }
                  })}
                </div>
                <span className="text-sm font-bold text-slate-900">{ratingMetrics.average}</span>
                <span className="text-sm text-slate-500">
                  ({ratingMetrics.totalCount} reviews)
                </span>
              </div>
            </div>

            {/* Action Buttons Row - Mobile Responsive */}
            <div style={{ padding: '10px' }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 mb-10 w-full">
              <div className="flex items-center gap-2 sm:gap-4 flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn btn-primary flex-1 min-h-[46px] py-3 px-2 sm:px-5 text-xs sm:text-sm font-bold uppercase tracking-normal sm:tracking-wider flex items-center justify-center gap-1.5 text-center whitespace-nowrap"
                >
                  <FiShoppingCart size={17} className="flex-shrink-0" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="btn btn-outline-primary flex-1 min-h-[46px] py-3 px-2 sm:px-5 text-xs sm:text-sm font-bold uppercase tracking-normal sm:tracking-wider flex items-center justify-center gap-1.5 text-center whitespace-nowrap"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              <button
                onClick={handleWishlistToggle}
                disabled={addingWishlist}
                className={`h-11 sm:w-11 px-4 sm:px-0 rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${inWishlist ? 'bg-red-50 border-red-300 text-red-500 hover:bg-red-100' : 'bg-white border-slate-300 text-slate-600 hover:border-[#06492D] hover:text-red-500'}`}
                title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <FiHeart size={20} fill={inWishlist ? "currentColor" : "none"} />
                <span className="sm:hidden ml-2 text-xs font-bold uppercase text-slate-700">Wishlist</span>
              </button>
            </div>

            {/* Trust Badges Row */}
            <div style={{ padding: '10px' }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/80 rounded-[3px] py-6 px-4 mt-8 mb-4 text-center">
              <div className="flex flex-col items-center justify-center p-1">
                <FiTruck size={20} className="text-[#06492D] mb-1.5" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Free Delivery</span>
                <span className="text-[10px] text-slate-500">above ₹999</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1">
                <FiRotateCcw size={20} className="text-[#06492D] mb-1.5" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">7 Days Return</span>
                <span className="text-[10px] text-slate-500">Easy returns</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1">
                <FiShield size={20} className="text-[#06492D] mb-1.5" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Secure Payment</span>
                <span className="text-[10px] text-slate-500">100% protected</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1">
                <FiDollarSign size={20} className="text-[#06492D] mb-1.5" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500">Available</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
         SECTION 2: Product Details & Specifications
         ========================================================================= */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }} className="w-full  py-10 sm:py-16 my-8 sm:my-12">
        <div style={{ marginTop: '20px', marginBottom: '20px' }} className="container px-4 sm:px-6 lg:px-8 mx-auto">

          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06492D] uppercase">
              Product Details
            </h2>
            <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed text-center mt-1">Complete item overview, features and specifications</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left Column: About this item (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide py-1">
                About this item
              </h3>
              <ul className="space-y-4 list-disc pl-5">
                {product.aboutItems?.map((item, idx) => {
                  const parts = item.split(' – ');
                  return (
                    <li key={idx} className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed pl-1">
                      {parts.length > 1 ? (
                        <>
                          <strong className="font-bold text-slate-900">{parts[0]}</strong> – {parts[1]}
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column: Product Specifications Table (5 Cols) */}
            <div className="lg:col-span-5">
              <div style={{ padding: '20px' }} className="bg-white rounded-[3px] p-6 shadow-sm border border-slate-200/80">
                <h3 className="text-xl font-bold text-[#06492D] uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
                  Specifications
                </h3>
                <div className="divide-y divide-slate-100">
                  {product.specifications && Object.entries(product.specifications).map(([key, val], idx) => (
                    <div key={idx} className="py-3 grid grid-cols-5 gap-2">
                      <span className="col-span-2 font-semibold text-slate-600 font-[var(--font-family-base)] text-sm">{key}</span>
                      <span className="col-span-3 font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bank Offers Horizontal Bar */}
          <div style={{ marginTop: '10px', marginBottom: '10px' }} className="mt-15 pt-8 border-slate-200/80">
            <h3 style={{ marginTop: '10px', marginBottom: '10px' }} className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wide">
              Available Bank Offers
            </h3>
            <div style={{padding:'10px'}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
              {bankOffersData.map((offer) => (
                <div style={{padding:'10px'}} key={offer.id} className="bg-white rounded-[3px] p-5 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-[3px] bg-[#e8f5e9] text-[#06492D] inline-block mb-3">
                      {offer.logoText}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">{offer.discount}</h4>
                    <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed">{offer.description}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold mt-4 block">T&C Apply</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
         SECTION 3: Customer Reviews Section (Positioned Directly Below Product Details)
         ========================================================================= */}
      <div style={{ marginTop: '10px', marginBottom: '10px' }} className="w-full bg-white py-16 sm:py-20">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            
            <div className="lg:col-span-4 space-y-8">

              {/* Overall Ratings */}
              <div className="space-y-3">
                <h3 style={{ marginTop: '10px', marginBottom: '10px' }} className="text-2xl font-bold text-slate-900">CLIENT REVIEWS</h3>
                <div className="flex items-center gap-2">
                  <div className="flex text-[#1b7a42] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={20} className={i < Math.round(Number(ratingMetrics.average)) ? 'text-[#1b7a42]' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span className="text-xl font-extrabold text-slate-900">{ratingMetrics.average} out of 5</span>
                </div>
                <span className="text-xs text-slate-900 font-medium block">{ratingMetrics.totalCount} global ratings</span>
              </div>

              {/* Star Rating Breakdown Progress Bars */}
              <div style={{ padding: '20px' }} className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-900">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div style={{ padding: '10px' }} key={stars} className="flex items-center gap-3">
                    <span className="w-12 font-medium text-slate-900 flex-shrink-0 hover:underline cursor-pointer">{stars} star</span>
                    <div className="flex-1 h-3.5 bg-slate-100 rounded-sm overflow-hidden border border-slate-200/60">
                      <div
                        className="h-full bg-[#f39c12] transition-all duration-500"
                        style={{ width: `${ratingMetrics.breakdown[stars]}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-medium text-slate-500 flex-shrink-0">
                      {ratingMetrics.breakdown[stars]}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Review This Product Card (Exact Pic 2 Layout) */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h3 style={{ marginTop: '10px', marginBottom: '10px' }} className="text-xl font-bold text-[#06492D] tracking-wide leading-tight">REVIEW THIS PRODUCT</h3>
                <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed">Share your thoughts with other customers</p>
                <button style={{ marginTop: '5px', marginBottom: '5px' }}
                  onClick={handleWriteReviewClick}
                  className="btn btn-primary w-full text-center flex items-center justify-center gap-2 uppercase tracking-wider py-3.5 mt-3 font-bold cursor-pointer shadow-sm"
                >
                  <span>WRITE A REVIEW</span>
                  
                </button>
              </div>

            </div>

            {/* Right Main Column (8 Columns Desktop): Customers Say, Photos & Review Feed */}
            <div style={{ marginTop: '10px', marginBottom: '10px' }} className="lg:col-span-8 space-y-10">

              {/* Customers Say Block */}
              <div className="pb-8 border-b border-slate-200/80 mb-6">
                <h3  className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">CUSTOMERS SAY</h3>
                <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mb-6">
                  Customers find these items comfortable, with high build quality, easy maintenance, and superb design. They offer good value for money and provide a great fit for living spaces.
                </p>
                <div style={{ marginTop: '10px', marginBottom: '10px' }} className="flex flex-wrap items-center gap-3 pt-4  text-xs">
                  <span className="text-slate-500 font-semibold mr-1">Select to learn more:</span>
                  {['Comfort', 'Quality', 'Value for money', 'Fit'].map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTag(isSelected ? null : tag);
                          setCurrentPage(1);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5  font-medium transition-all cursor-pointer  ${isSelected
                          ? 'bg-[#06492D] text-white border-[#06492D] shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                      >
                        <FiArrowUpRight size={13} className={isSelected ? 'text-white' : 'text-[#06492D]'} />
                        <span>{tag}</span>
                        <span className={isSelected ? 'text-slate-200 font-bold' : 'text-slate-500'}>
                          ({tagCounts[tag]})
                        </span>
                      </button>
                    );
                  })}
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-xs text-red-600 hover:underline font-semibold ml-2 cursor-pointer"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>

              {/* Customer Reviews Feed */}
              <div style={{ marginTop: '10px', marginBottom: '10px' }} className="space-y-10 pt-2">
                {paginatedReviews.map((rev) => (
                  <div key={rev.id} className="space-y-4 pb-8 border-b border-slate-200/80">

                    {/* Review Profile Header */}
                    <div style={{ marginTop: '10px', marginBottom: '10px' ,padding:'5px'}} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {rev.avatar || rev.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-base font-bold text-slate-900">{rev.author}</span>
                    </div>

                    {/* Star Rating & Bold Title */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="flex text-[#f39c12] gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={15} className={i < rev.rating ? 'text-[#f39c12]' : 'text-slate-200'} />
                        ))}
                      </div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">{rev.title}</h4>
                    </div>

                    {/* Metadata Line */}
                    <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-3 font-medium my-2">
                      <span> {rev.date === 'Today' ? '6 August 2026' : rev.date}</span>
                      <span className="text-slate-300">|</span>
                      <span>Size: {rev.size || 'Standard'}</span>
                      <span className="text-slate-300">|</span>
                      <span>Colour: {rev.color || 'Green'}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-amber-700 font-bold">Verified Purchase</span>
                    </div>

                    {/* Review Body Text */}
                    <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed py-1 my-1">
                      {rev.comment}
                    </p>

                    {/* Display Uploaded Photo if present */}
                    {rev.photo && (
                      <div className="w-28 h-28 rounded-[3px] overflow-hidden my-3 border border-slate-200 shadow-xs">
                        <img src={rev.photo} alt="Customer upload" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Helpful text count */}
                    {rev.helpfulText && (
                      <p className="text-xs text-slate-500 pt-1">{rev.helpfulText}</p>
                    )}

                    {/* Redesigned Helpful Pill Chip Button & Report link */}
                    <div style={{ marginTop: '10px', marginBottom: '10px',padding:'5px'}}  className="flex items-center gap-4 pt-2 text-xs">
                      <button
                        onClick={() => handleLikeReview(rev.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5  text-xs font-semibold text-slate-700 hover:border-[#06492D] hover:bg-[#f3f8f3] hover:text-[#06492D] transition-all cursor-pointer shadow-2xs no-underline"
                      >
                        <FiThumbsUp size={13} className="text-slate-500" />
                        <span className="no-underline" >Helpful</span>
                        {rev.likes > 0 && <span className="text-[#06492D] font-bold">({rev.likes})</span>}
                      </button>
                    </div>

                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-[3px] border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      &lt; Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                            ? 'bg-[#06492D] text-white border border-[#06492D]'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-[3px] border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next &gt;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {/* =========================================================================
         SECTION 4: Write A Review Page/Modal (Exact Pic 5 Layout)
         ========================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 shadow-2xl relative border border-slate-200 overflow-y-auto max-h-[90vh]">

            {/* Close Button */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 border-none bg-transparent cursor-pointer"
              aria-label="Close modal"
            >
              <FiX size={22} />
            </button>

            {/* Header: Product Thumbnail + Title + Interactive Stars (Exact Pic 5 Header) */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <img src={mainImage} alt="" className="w-14 h-14 object-cover rounded-[3px] flex-shrink-0 bg-slate-100" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">How was the item?</h3>
                <p className="text-sm text-slate-600 font-medium mt-0.5">{product.name}</p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">

              {/* Interactive Star Rating */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 border-none bg-transparent cursor-pointer transition-transform hover:scale-110"
                    >
                      <FaStar size={32} className={star <= newReview.rating ? 'text-orange-400' : 'text-slate-200'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 1: Write a review (Exact Pic 5) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Write a review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What should other customers know?"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full border border-slate-400 rounded-lg p-3.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Field 2: Share a video or photo (Exact Pic 5) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Share a video or photo</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50 hover:bg-slate-100/60 transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <FiCamera size={32} className="text-slate-500 mb-2" />
                  <span className="text-xs text-slate-500">Click to upload photos or videos</span>
                </div>
              </div>

              {/* Field 3: Title your review (required) (Exact Pic 5) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Title your review (required)</label>
                <input
                  type="text"
                  required
                  placeholder="What's most important to know?"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full border border-slate-400 rounded-lg p-3.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Submit Button (Exact Pic 5 Yellow/Gold Pill Button) */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 font-bold py-2.5 px-10 rounded-full text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </div>

            </form>
          </div>
        </div>
      )} */

    </div>
  );
}

export default Productdetails;
