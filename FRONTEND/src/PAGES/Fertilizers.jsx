import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../redux/auth/authSlice';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Fertilizers.css';

// Import Assets
import cocoBrickImg from '../assets/FERTILIZERS/image.png';
import compostImg from '../assets/FERTILIZERS/image copy.png';
import cowManureImg from '../assets/FERTILIZERS/image copy 2.png';
import moistBallImg from '../assets/FERTILIZERS/image copy 3.png';
import mossStickImg from '../assets/FERTILIZERS/image copy 4.png';
import plantFoodImg from '../assets/FERTILIZERS/image copy 5.png';
import generalFertilizerImg from '../assets/FERTILIZERS/When Should You Fertilize Your Hydrangeas_ Here’s the Answer (1).jpg';

const fertilizerCategories = [
    { id: 'all', name: 'All Fertilizers' },
    { id: 'coco-bricks', name: 'Coco Bricks' },
    { id: 'compost', name: 'Compost' },
    { id: 'cow-manure', name: 'Cow Manure' },
    { id: 'moist-ball', name: 'Moist Ball' },
    { id: 'moss-stick', name: 'Moss Stick' },
    { id: 'plant-food', name: 'Plant Food' }
];

export const fertilizerProducts = [
    {
        id: 'f1',
        name: 'Premium Coco Peat Brick (5kg)',
        category: 'coco-bricks',
        price: 299,
        oldPrice: 399,
        image: cocoBrickImg,
        inStock: true,
        space: 'indoors',
        rating: 4.8,
        reviews: 128,
        description: 'High-quality compressed coco peat brick for healthy root systems and moisture retention.'
    },
    {
        id: 'f2',
        name: 'Organic Vermicompost (10kg)',
        category: 'compost',
        price: 499,
        oldPrice: 650,
        image: compostImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.9,
        reviews: 320,
        description: 'Rich organic compost packed with essential nutrients for healthy soil and plant growth.'
    },
    {
        id: 'f3',
        name: 'Dehydrated Cow Manure Powder (5kg)',
        category: 'cow-manure',
        price: 249,
        oldPrice: 350,
        image: cowManureImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.7,
        reviews: 94,
        description: 'Finely powdered, fully decomposed cow manure to enrich garden soil naturally.'
    },
    {
        id: 'f4',
        name: 'Water Retention Moist Ball (Set of 12)',
        category: 'moist-ball',
        price: 399,
        oldPrice: 499,
        image: moistBallImg,
        inStock: true,
        space: 'indoors',
        rating: 4.5,
        reviews: 42,
        description: 'Slow-release moisture balls designed for indoor planters to reduce watering frequency.'
    },
    {
        id: 'f5',
        name: 'Organic Moss Stick for Climbers (3ft)',
        category: 'moss-stick',
        price: 199,
        oldPrice: 299,
        image: mossStickImg,
        inStock: true,
        space: 'indoors',
        rating: 4.6,
        reviews: 115,
        description: 'Sturdy moss poles to support money plants, monstera, and other climbing vines.'
    },
    {
        id: 'f6',
        name: 'Liquid Plant Food - Concentrated (250ml)',
        category: 'plant-food',
        price: 349,
        oldPrice: 450,
        image: plantFoodImg,
        inStock: true,
        space: 'indoors',
        rating: 4.8,
        reviews: 210,
        description: 'Easy-to-use liquid nutrient solution for robust green foliage and healthy blooms.'
    },
    {
        id: 'f7',
        name: 'Hydrangea Bloom Booster Fertilizer (1kg)',
        category: 'plant-food',
        price: 450,
        oldPrice: 599,
        image: generalFertilizerImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.9,
        reviews: 87,
        description: 'Specialized nutrient formula designed to enhance hydrangeas and flowering shrubs blooms.'
    },
    {
        id: 'f8',
        name: 'Premium Coco Peat Coir Disc (Set of 20)',
        category: 'coco-bricks',
        price: 180,
        oldPrice: 250,
        image: cocoBrickImg,
        inStock: false,
        space: 'indoors',
        rating: 4.4,
        reviews: 35,
        description: 'Compact coir discs ideal for seedling trays and indoor micro-green propagation.'
    },
    {
        id: 'f9',
        name: 'Organic Leaf Mold Compost (5kg)',
        category: 'compost',
        price: 320,
        oldPrice: 420,
        image: compostImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.7,
        reviews: 63,
        description: 'Naturally aged leaf mold compost rich in beneficial microbial activity.'
    },
    {
        id: 'f10',
        name: 'Moss Stick Extension Pole (2ft)',
        category: 'moss-stick',
        price: 149,
        oldPrice: 199,
        image: mossStickImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.5,
        reviews: 58,
        description: 'Modular moss pole extension to expand support height as climbers grow.'
    }
];

function Fertilizers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('best-selling');
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const { addToCart } = useCart();
    const location = useLocation();

    // Sidebar Filter toggles - collapse on mobile
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 992;
    const [catsOpen, setCatsOpen] = useState(!isMobileViewport);
    const [availOpen, setAvailOpen] = useState(!isMobileViewport);
    const [priceOpen, setPriceOpen] = useState(!isMobileViewport);
    const [spaceOpen, setSpaceOpen] = useState(!isMobileViewport);

    // Filter States
    const [inStockOnly, setInStockOnly] = useState(false);
    const [outOfStockOnly, setOutOfStockOnly] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [indoorsChecked, setIndoorsChecked] = useState(false);
    const [outdoorsChecked, setOutdoorsChecked] = useState(false);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Reset pagination to page 1 whenever any filter or sort option changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, inStockOnly, outOfStockOnly, minPrice, maxPrice, indoorsChecked, outdoorsChecked, sortBy]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) {
            setActiveCategory(cat);
        } else {
            setActiveCategory('all');
        }
    }, [location]);

    // Filters logic
    const filteredProducts = fertilizerProducts.filter(product => {
        // 1. Category filter
        if (activeCategory !== 'all' && product.category !== activeCategory) {
            return false;
        }

        // 2. Availability filter
        if (inStockOnly && !outOfStockOnly && !product.inStock) {
            return false;
        }
        if (outOfStockOnly && !inStockOnly && product.inStock) {
            return false;
        }

        // 3. Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }

        // 4. Space filter
        if (indoorsChecked && !outdoorsChecked && product.space !== 'indoors') {
            return false;
        }
        if (outdoorsChecked && !indoorsChecked && product.space !== 'outdoors') {
            return false;
        }

        return true;
    });

    // Sorting logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low-high') {
            return a.price - b.price;
        }
        if (sortBy === 'price-high-low') {
            return b.price - a.price;
        }
        if (sortBy === 'name-a-z') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-z-a') {
            return b.name.localeCompare(a.name);
        }
        if (sortBy === 'newest') {
            return b.reviews - a.reviews; // Mock date fallback using reviews count
        }
        return b.rating - a.rating;
    });

    // Pagination slicing
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const paginatedProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Dynamic counts
    const inStockCount = fertilizerProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && p.inStock
    ).length;

    const outOfStockCount = fertilizerProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && !p.inStock
    ).length;

    const indoorsCount = fertilizerProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && p.space === 'indoors'
    ).length;

    const outdoorsCount = fertilizerProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && p.space === 'outdoors'
    ).length;

    const handlePriceChange = (e, bound) => {
        const value = parseInt(e.target.value, 10);
        if (bound === 'min') {
            setMinPrice(Math.min(value, maxPrice));
        } else {
            setMaxPrice(Math.max(value, minPrice));
        }
    };

    return (
        <div className="fertilizers-page-wrapper text-[#1c2c21]">

            {/* Breadcrumbs & Description Section */}
            <section className="fertilizers-header-section pt-16 pb-12">
                <div className="container">
                    <div className="fertilizers-breadcrumbs text-xs text-gray-400 mb-3">
                        <Link to="/" className="hover:underline text-gray-400">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-600">Fertilizers</span>
                    </div>

                    <h1 className="fertilizers-page-title text-xl font-normal mb-3 text-[#1c2c21]">
                        {activeCategory === 'all'
                            ? 'All Fertilizers'
                            : fertilizerCategories.find(c => c.id === activeCategory)?.name || 'Fertilizers'}
                    </h1>

                    <p className="fertilizers-page-description font-[var(--font-family-base)] text-sm text-[#4b5563] max-w-[800px] leading-relaxed">
                        Nourish your plants with our premium organic fertilizers and soil enhancers. Choose from moisture-retaining coco bricks, nutrient-rich vermicompost, slow-release moist balls, sturdy moss sticks, and concentrated plant foods online.
                    </p>
                </div>
            </section>

            {/* Main Catalog Workspace */}
            <section className="fertilizers-catalog-section py-12">
                <div className="container fertilizers-layout-container">

                    {/* Left Column: Sidebar Filters */}
                    <div className="fertilizers-sidebar">

                        {/* 1. Category Accordion */}
                        <div className="filter-accordion">
                            <div
                                className="filter-accordion-header"
                                onClick={() => setCatsOpen(!catsOpen)}
                            >
                                <h3 className="filter-accordion-title">Categories</h3>
                                {catsOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>

                            {catsOpen && (
                                <div className="filter-accordion-content">
                                    <button
                                        onClick={() => setActiveCategory('all')}
                                        className="filter-reset-link"
                                    >
                                        Reset
                                    </button>
                                    <div className="fertilizers-category-list">
                                        {fertilizerCategories.map((cat) => {
                                            const count = cat.id === 'all'
                                                ? fertilizerProducts.length
                                                : fertilizerProducts.filter(p => p.category === cat.id).length;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className={`fertilizers-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                                >
                                                    <span>{cat.name}</span>
                                                    <span className="cat-count">({count})</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr className="filter-divider" />

                        {/* 2. Availability Accordion */}
                        <div className="filter-accordion">
                            <div
                                className="filter-accordion-header"
                                onClick={() => setAvailOpen(!availOpen)}
                            >
                                <h3 className="filter-accordion-title">Availability</h3>
                                {availOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>

                            {availOpen && (
                                <div className="filter-accordion-content">
                                    <label className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => setInStockOnly(e.target.checked)}
                                            className="filter-checkbox-input"
                                        />
                                        <span>In Stock ({inStockCount})</span>
                                    </label>
                                    <label className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={outOfStockOnly}
                                            onChange={(e) => setOutOfStockOnly(e.target.checked)}
                                            className="filter-checkbox-input"
                                        />
                                        <span>Out of Stock ({outOfStockCount})</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <hr className="filter-divider" />

                        {/* 3. Price Accordion */}
                        <div className="filter-accordion">
                            <div
                                className="filter-accordion-header"
                                onClick={() => setPriceOpen(!priceOpen)}
                            >
                                <h3 className="filter-accordion-title">Price</h3>
                                {priceOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>

                            {priceOpen && (
                                <div className="filter-accordion-content">
                                    <div className="price-slider-outer">
                                        <div className="double-slider-container">
                                            <span className="currency-symbol">₹</span>
                                            <div className="double-slider-wrapper">
                                                <div className="slider-track" />
                                                <div
                                                    className="slider-range-bar"
                                                    style={{
                                                        left: `${(minPrice / 1000) * 100}%`,
                                                        right: `${100 - (maxPrice / 1000) * 100}%`
                                                    }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000"
                                                    value={minPrice}
                                                    onChange={(e) => handlePriceChange(e, 'min')}
                                                    className="slider-thumb"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000"
                                                    value={maxPrice}
                                                    onChange={(e) => handlePriceChange(e, 'max')}
                                                    className="slider-thumb"
                                                />
                                            </div>
                                        </div>
                                        <span className="filter-price-text">
                                            Price: ₹{minPrice} — ₹{maxPrice}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr className="filter-divider" />

                        {/* 4. Suitability Accordion */}
                        <div className="filter-accordion">
                            <div
                                className="filter-accordion-header"
                                onClick={() => setSpaceOpen(!spaceOpen)}
                            >
                                <h3 className="filter-accordion-title">Suitability</h3>
                                {spaceOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>

                            {spaceOpen && (
                                <div className="filter-accordion-content">
                                    <label className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={indoorsChecked}
                                            onChange={(e) => setIndoorsChecked(e.target.checked)}
                                            className="filter-checkbox-input"
                                        />
                                        <span>Indoors ({indoorsCount})</span>
                                    </label>
                                    <label className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={outdoorsChecked}
                                            onChange={(e) => setOutdoorsChecked(e.target.checked)}
                                            className="filter-checkbox-input"
                                        />
                                        <span>Outdoors ({outdoorsCount})</span>
                                    </label>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Grid and Toolbar */}
                    <div className="fertilizers-main-content">

                        {/* Toolbar Area */}
                        <div className="fertilizers-toolbar mb-8">
                            <span className="fertilizers-count-text text-sm text-gray-500 font-[var(--font-family-base)]">
                                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'pack' : 'packs'}
                            </span>

                            <div className="fertilizers-sort-container">
                                <div className="custom-sort-dropdown">
                                    <button
                                        className="sort-dropdown-btn"
                                        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    >
                                        <span>Sort by: {
                                            sortBy === 'best-selling' ? 'Best Selling' :
                                                sortBy === 'price-low-high' ? 'Price: Low to High' :
                                                    sortBy === 'price-high-low' ? 'Price: High to Low' :
                                                        sortBy === 'name-a-z' ? 'Alphabetically: A-Z' :
                                                            sortBy === 'name-z-a' ? 'Alphabetically: Z-A' :
                                                                sortBy === 'newest' ? 'Newest Arrivals' : 'Best Selling'
                                        }</span>
                                        <FiChevronDown size={14} />
                                    </button>
                                    {sortDropdownOpen && (
                                        <>
                                            <div
                                                style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                                                onClick={() => setSortDropdownOpen(false)}
                                            />
                                            <div className="sort-dropdown-menu" style={{ zIndex: 999 }}>
                                                <button onClick={() => { setSortBy('best-selling'); setSortDropdownOpen(false); }} className={`sort-dropdown-item ${sortBy === 'best-selling' ? 'active' : ''}`}>Best Selling</button>
                                                <button onClick={() => { setSortBy('price-low-high'); setSortDropdownOpen(false); }} className={`sort-dropdown-item ${sortBy === 'price-low-high' ? 'active' : ''}`}>Price: Low to High</button>
                                                <button onClick={() => { setSortBy('price-high-low'); setSortDropdownOpen(false); }} className={`sort-dropdown-item ${sortBy === 'price-high-low' ? 'active' : ''}`}>Price: High to Low</button>
                                                <button onClick={() => { setSortBy('name-a-z'); setSortDropdownOpen(false); }} className={`sort-dropdown-item ${sortBy === 'name-a-z' ? 'active' : ''}`}>Alphabetically: A-Z</button>
                                                <button onClick={() => { setSortBy('name-z-a'); setSortDropdownOpen(false); }} className={`sort-dropdown-item ${sortBy === 'name-z-a' ? 'active' : ''}`}>Alphabetically: Z-A</button>
                                                <button onClick={() => { setSortBy('newest'); setSortDropdownOpen(false); }} className={`sort-dropdown-item ${sortBy === 'newest' ? 'active' : ''}`}>Newest Arrivals</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Card Grid */}
                        <div className="product-grid fertilizers-grid">
                            {paginatedProducts.map((product) => (
                                <div key={product.id} className="product-card-wrapper">
                                    <div className="product-card" style={{ flexGrow: 1 }}>
                                        {!product.inStock && (
                                            <span className="card-badge sale bg-red-600 text-white">SOLD OUT</span>
                                        )}
                                        {product.inStock && product.oldPrice && (
                                            <span className="card-badge sale">
                                                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                            </span>
                                        )}

                                        <div className="product-card-image">
                                            <img src={product.image} alt={product.name} />
                                        </div>

                                        <div className="product-card-content">
                                            <h4 className="product-title" title={product.name}>
                                                {product.name}
                                            </h4>

                                            <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: 'var(--space-2)' }}>
                                                {product.oldPrice ? (
                                                    <>
                                                        <span className="price-original">Rs. {product.oldPrice}.00</span>
                                                        <span className="price-current sale">Rs. {product.price}.00</span>
                                                    </>
                                                ) : (
                                                    <span className="price-current">Rs. {product.price}.00</span>
                                                )}
                                            </div>

                                            <div className="product-rating" style={{ marginBottom: 0, minHeight: '18px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        color={i < product.rating ? 'var(--color-gold)' : '#e2e8f0'}
                                                        size={14}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (user) {
                                                navigate(`/product/${product.id}`);
                                            } else {
                                                sessionStorage.setItem("postLoginRedirect", `/product/${product.id}`);
                                                dispatch(openAuthModal("login"));
                                            }
                                        }}
                                        className="btn btn-primary"
                                        style={{ borderRadius: '3px' }}
                                        disabled={product.inStock === false || product.isOutOfStock === true}
                                    >
                                        {product.inStock !== false && !product.isOutOfStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="pagination-btn pagination-arrow"
                                >
                                    &larr; Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => {
                                            setCurrentPage(index + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn pagination-arrow"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        )}

                        {sortedProducts.length === 0 && (
                            <div className="text-center py-16 text-gray-500 font-[var(--font-family-base)]">
                                No fertilizers matches the selected filter options. Please try resetting some filters.
                            </div>
                        )}

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Fertilizers;
