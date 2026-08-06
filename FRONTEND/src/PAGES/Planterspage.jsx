import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../redux/auth/authSlice';
import { useCart } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Planters.css';

// Plastic Pots
import plastic1 from '../assets/PLASTICPOTS/image copy 2.png';
import plastic2 from '../assets/PLASTICPOTS/image copy 3.png';
import plastic3 from '../assets/PLASTICPOTS/image copy 4.png';
import plastic4 from '../assets/PLASTICPOTS/image copy 5.png';
import plastic5 from '../assets/PLASTICPOTS/image copy 6.png';
import plastic6 from '../assets/PLASTICPOTS/image copy 7.png';
import plastic7 from '../assets/PLASTICPOTS/image copy.png';
import plastic8 from '../assets/PLASTICPOTS/image.png';

// Ceramic Pots
import ceramic1 from '../assets/ceramicpots/image copy 2.png';
import ceramic2 from '../assets/ceramicpots/image copy 3.png';
import ceramic3 from '../assets/ceramicpots/image copy.png';
import ceramic4 from '../assets/ceramicpots/image.png';

// Hanging Basket
import hanging1 from '../assets/hangingbasket/image copy 2.png';
import hanging2 from '../assets/hangingbasket/image copy 3.png';
import hanging3 from '../assets/hangingbasket/image copy.png';
import hanging4 from '../assets/hangingbasket/image.png';

// Grill Pots
import grill1 from '../assets/GRILLPOTS/image copy 2.png';
import grill2 from '../assets/GRILLPOTS/image copy.png';
import grill3 from '../assets/GRILLPOTS/image.png';

// Tower Planters
import tower1 from '../assets/TOWERPLANTERS/image copy.png';
import tower2 from '../assets/TOWERPLANTERS/image.png';

// Germination Tray
import germination1 from '../assets/GERMINATIONTRAY/image copy 2.png';
import germination2 from '../assets/GERMINATIONTRAY/image copy.png';
import germination3 from '../assets/GERMINATIONTRAY/image.png';

// Grow Bags
import grow1 from '../assets/GROWBAGS/20+ Inspiring Grow Bag Garden Ideas - Garden_eco.jpg';
import grow2 from '../assets/GROWBAGS/Want Better Harvests_ 20 Elevated Garden Bed Construction Plans!.jpg';
import grow3 from '../assets/GROWBAGS/image copy.png';
import grow4 from '../assets/GROWBAGS/image.png';

export const planterProducts = [
    // Plastic Pots
    { id: 'pot-pl-1', category: 'plastic-pots', name: 'Classic Terracotta Plastic Pot (10 inch)', price: 120, rating: 5, image: plastic1, date: '2026-01-01', inStock: true, space: 'outdoors' },
    { id: 'pot-pl-2', category: 'plastic-pots', name: 'Self-Watering White Plastic Planter', price: 180, originalPrice: 220, discount: '-18%', rating: 4, image: plastic2, date: '2026-01-02', inStock: true, space: 'indoors' },
    { id: 'pot-pl-3', category: 'plastic-pots', name: 'Premium Pastel Green Flower Pot', price: 140, rating: 5, image: plastic3, date: '2026-01-03', inStock: true, space: 'indoors' },
    { id: 'pot-pl-4', category: 'plastic-pots', name: 'Heavy-Duty Nursery Grow Pots (Set of 5)', price: 250, rating: 4, image: plastic4, date: '2026-01-04', inStock: true, space: 'outdoors' },
    { id: 'pot-pl-5', category: 'plastic-pots', name: 'Colorful Decor Round Plastic Pots', price: 99, rating: 4, image: plastic5, date: '2026-01-05', inStock: true, space: 'indoors' },
    { id: 'pot-pl-6', category: 'plastic-pots', name: 'Textured Matte Finish Plant Pot', price: 160, rating: 5, image: plastic6, date: '2026-01-06', inStock: true, space: 'indoors' },
    { id: 'pot-pl-7', category: 'plastic-pots', name: 'Octagonal Base Garden Plastic Pot', price: 110, rating: 4, image: plastic7, date: '2026-01-07', inStock: false, space: 'outdoors' },
    { id: 'pot-pl-8', category: 'plastic-pots', name: 'Traditional Brown Plastic Planter', price: 85, rating: 4, image: plastic8, date: '2026-01-08', inStock: true, space: 'outdoors' },

    // Metal Pots (reusing ceramic and plastic images)
    { id: 'pot-metal-1', category: 'metal-pots', name: 'Vintage Copper Finish Planter Pot', price: 699, rating: 5, image: ceramic1, date: '2026-01-09', inStock: true, space: 'indoors' },
    { id: 'pot-metal-2', category: 'metal-pots', name: 'Galvanized Zinc Flower Pot with Handle', price: 449, originalPrice: 599, discount: '-25%', rating: 4, image: plastic6, date: '2026-01-10', inStock: true, space: 'outdoors' },
    { id: 'pot-metal-3', category: 'metal-pots', name: 'Brushed Brass Decorative Table Pot', price: 799, rating: 5, image: ceramic4, date: '2026-01-11', inStock: false, space: 'indoors' },

    // Ceramic Pots
    { id: 'pot-cer-1', category: 'ceramic-pots', name: 'Abstract Teal Glazed Ceramic Pot', price: 490, rating: 5, image: ceramic1, date: '2026-01-12', inStock: true, space: 'indoors' },
    { id: 'pot-cer-2', category: 'ceramic-pots', name: 'Minimalist Matte White Ceramic Planter', price: 390, rating: 4, image: ceramic2, date: '2026-01-13', inStock: true, space: 'indoors' },
    { id: 'pot-cer-3', category: 'ceramic-pots', name: 'Handmade Textured Clay Ceramic Pot', price: 450, originalPrice: 550, discount: '-18%', rating: 5, image: ceramic3, date: '2026-01-14', inStock: true, space: 'indoors' },
    { id: 'pot-cer-4', category: 'ceramic-pots', name: 'Premium Royal Blue Ceramic Planter', price: 590, rating: 5, image: ceramic4, date: '2026-01-15', inStock: true, space: 'indoors' },

    // Hanging Basket
    { id: 'pot-hang-1', category: 'hanging-basket', name: 'Coconut Coir Hanging Basket', price: 240, rating: 4, image: hanging1, date: '2026-01-16', inStock: true, space: 'outdoors' },
    { id: 'pot-hang-2', category: 'hanging-basket', name: 'Macrame Cotton Rope Plant Hanger', price: 180, rating: 5, image: hanging2, date: '2026-01-17', inStock: true, space: 'indoors' },
    { id: 'pot-hang-3', category: 'hanging-basket', name: 'Classic Forest Green Hanging Basket', price: 199, originalPrice: 249, discount: '-20%', rating: 4, image: hanging3, date: '2026-01-18', inStock: true, space: 'outdoors' },
    { id: 'pot-hang-4', category: 'hanging-basket', name: 'Premium Auto-Watering Hanging Pot', price: 320, rating: 5, image: hanging4, date: '2026-01-19', inStock: false, space: 'outdoors' },

    // Grill Pots
    { id: 'pot-grill-1', category: 'grill-pots', name: 'Double-Hook Railing Planter Box', price: 380, rating: 5, image: grill1, date: '2026-01-20', inStock: true, space: 'outdoors' },
    { id: 'pot-grill-2', category: 'grill-pots', name: 'Oval Railing Iron Pot Holder', price: 299, originalPrice: 349, discount: '-14%', rating: 4, image: grill2, date: '2026-01-21', inStock: true, space: 'outdoors' },
    { id: 'pot-grill-3', category: 'grill-pots', name: 'Space-Saving Balcony Grill Planter', price: 220, rating: 4, image: grill3, date: '2026-01-22', inStock: true, space: 'outdoors' },

    // Tower Planters
    { id: 'pot-tower-1', category: 'tower-planters', name: '5-Tier Vertical Herb Tower Planter', price: 1499, rating: 5, image: tower1, date: '2026-01-23', inStock: true, space: 'outdoors' },
    { id: 'pot-tower-2', category: 'tower-planters', name: 'Stackable Strawberry Tower Pot', price: 990, rating: 4, image: tower2, date: '2026-01-24', inStock: true, space: 'outdoors' },

    // Germination Tray
    { id: 'pot-germ-1', category: 'germination-tray', name: '50-Cell Seedling Germination Tray', price: 150, rating: 5, image: germination1, date: '2026-01-25', inStock: true, space: 'outdoors' },
    { id: 'pot-germ-2', category: 'germination-tray', name: 'Reusable Seed Starter Plug Tray', price: 120, rating: 4, image: germination2, date: '2026-01-26', inStock: true, space: 'outdoors' },
    { id: 'pot-germ-3', category: 'germination-tray', name: 'Germination Dome Set with Vent', price: 250, originalPrice: 290, discount: '-13%', rating: 4, image: germination3, date: '2026-01-27', inStock: true, space: 'indoors' },

    // Grow Bags
    { id: 'pot-grow-1', category: 'grow-bags', name: 'Premium Aeration Fabric Grow Bag (5 Gallon)', price: 180, rating: 4, image: grow1, date: '2026-01-28', inStock: true, space: 'outdoors' },
    { id: 'pot-grow-2', category: 'grow-bags', name: 'Heavy-Duty Potato Grow Bag with Flap', price: 280, rating: 5, image: grow2, date: '2026-01-29', inStock: true, space: 'outdoors' },
    { id: 'pot-grow-3', category: 'grow-bags', name: 'Breathable Fabric Planter Grow Bag', price: 140, rating: 4, image: grow3, date: '2026-01-30', inStock: true, space: 'outdoors' },
    { id: 'pot-grow-4', category: 'grow-bags', name: 'Reinforced Handle Garden Grow Bag', price: 220, originalPrice: 260, discount: '-15%', rating: 5, image: grow4, date: '2026-01-31', inStock: false, space: 'outdoors' }
];

const planterCategories = [
    { id: 'all', name: 'All Planters' },
    { id: 'plastic-pots', name: 'Plastic Pots' },
    { id: 'metal-pots', name: 'Metal Pots' },
    { id: 'ceramic-pots', name: 'Ceramic Pots' },
    { id: 'hanging-basket', name: 'Hanging Baskets' },
    { id: 'grill-pots', name: 'Grill/Railing Pots' },
    { id: 'tower-planters', name: 'Tower Planters' },
    { id: 'germination-tray', name: 'Germination Trays' },
    { id: 'grow-bags', name: 'Grow Bags' }
];

function Planterspage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('best-selling');
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const { addToCart } = useCart();
    const location = useLocation();

    // Sidebar Filter toggles (collapsible state) - collapse on mobile for space clarity
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 992;
    const [catsOpen, setCatsOpen] = useState(!isMobileViewport);
    const [availOpen, setAvailOpen] = useState(!isMobileViewport);
    const [priceOpen, setPriceOpen] = useState(!isMobileViewport);
    const [spaceOpen, setSpaceOpen] = useState(!isMobileViewport);

    // Filter States
    const [inStockOnly, setInStockOnly] = useState(false);
    const [outOfStockOnly, setOutOfStockOnly] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2500); // Planters maximum is 2500
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
    const filteredProducts = planterProducts.filter(product => {
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
            return new Date(b.date) - new Date(a.date);
        }
        return b.rating - a.rating;
    });

    // Pagination slicing
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const paginatedProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Dynamic counts for stock and space filters based on active Category
    const categoryProducts = activeCategory === 'all'
        ? planterProducts
        : planterProducts.filter(p => p.category === activeCategory);

    const inStockCount = categoryProducts.filter(p => p.inStock).length;
    const outOfStockCount = categoryProducts.filter(p => !p.inStock).length;
    const indoorsCount = categoryProducts.filter(p => p.space === 'indoors').length;
    const outdoorsCount = categoryProducts.filter(p => p.space === 'outdoors').length;

    return (
        <div className="planters-page-wrapper text-[#1c2c21]">

            {/* Left Aligned Breadcrumbs and Title Section */}
            <section className="planters-header-section pt-16 pb-12">
                <div className="container">
                    <div className="planters-breadcrumbs text-xs text-gray-400 mb-3">
                        <Link to="/" className="hover:underline text-gray-400">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-600">Planters</span>
                    </div>

                    <h1 className="planters-page-title text-xl font-normal mb-3 text-[#1c2c21]">
                        {activeCategory === 'all' 
                            ? 'All Planters' 
                            : planterCategories.find(c => c.id === activeCategory)?.name || 'Planters'}
                    </h1>

                    <p className="planters-page-description font-[var(--font-family-base)] text-sm text-[#4b5563] max-w-[800px] leading-relaxed">
                        Add style and life to your spaces with our curated collection of pots and planters. Choose from heavy-duty plastic pots, premium metallic planters, handcrafted ceramic pots, hanging baskets, balcony railing pots, multi-tier vertical tower planters, germination trays, and fabric grow bags.
                    </p>
                </div>
            </section>

            {/* Main Catalog Workspace */}
            <section className="planters-catalog-section py-12">
                <div className="container planters-layout-container">

                    {/* Left Column: Sidebar Filters */}
                    <div className="planters-sidebar">

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
                                    <div className="planters-category-list">
                                        {planterCategories.map((cat) => {
                                            const count = cat.id === 'all'
                                                ? planterProducts.length
                                                : planterProducts.filter(p => p.category === cat.id).length;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className={`planters-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                                >
                                                    <span className="cat-name">{cat.name}</span>
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
                                    <button
                                        onClick={() => {
                                            setInStockOnly(false);
                                            setOutOfStockOnly(false);
                                        }}
                                        className="filter-reset-link"
                                    >
                                        Reset
                                    </button>

                                    <label className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => setInStockOnly(e.target.checked)}
                                            className="filter-checkbox-input"
                                        />
                                        <span>In stock ({inStockCount})</span>
                                    </label>

                                    <label className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={outOfStockOnly}
                                            onChange={(e) => setOutOfStockOnly(e.target.checked)}
                                            className="filter-checkbox-input"
                                        />
                                        <span>Out of stock ({outOfStockCount})</span>
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
                                    <button
                                        onClick={() => {
                                            setMinPrice(0);
                                            setMaxPrice(2500);
                                        }}
                                        className="filter-reset-link"
                                    >
                                        Reset
                                    </button>

                                    <div className="price-slider-outer">
                                        <div className="double-slider-container">
                                            <span className="currency-symbol">₹</span>
                                            <div className="double-slider-wrapper">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2500"
                                                    step="50"
                                                    value={minPrice}
                                                    onChange={(e) => {
                                                        const val = Math.min(Number(e.target.value), maxPrice - 100);
                                                        setMinPrice(val);
                                                    }}
                                                    className="slider-thumb slider-thumb-left"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2500"
                                                    step="50"
                                                    value={maxPrice}
                                                    onChange={(e) => {
                                                        const val = Math.max(Number(e.target.value), minPrice + 100);
                                                        setMaxPrice(val);
                                                    }}
                                                    className="slider-thumb slider-thumb-right"
                                                />
                                                <div className="slider-track" />
                                                <div 
                                                    className="slider-range-bar" 
                                                    style={{
                                                        left: `${(minPrice / 2500) * 100}%`,
                                                        right: `${100 - (maxPrice / 2500) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="filter-price-text">
                                            Price: Rs. {minPrice} – Rs. {maxPrice}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr className="filter-divider" />

                        {/* 4. Suitable Space Accordion */}
                        <div className="filter-accordion">
                            <div
                                className="filter-accordion-header"
                                onClick={() => setSpaceOpen(!spaceOpen)}
                            >
                                <h3 className="filter-accordion-title">Suitable space</h3>
                                {spaceOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>

                            {spaceOpen && (
                                <div className="filter-accordion-content">
                                    <button
                                        onClick={() => {
                                            setIndoorsChecked(false);
                                            setOutdoorsChecked(false);
                                        }}
                                        className="filter-reset-link"
                                    >
                                        Reset
                                    </button>

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
                    <div className="planters-main-content">

                        {/* Toolbar Area */}
                        <div className="planters-toolbar mb-8">
                            <span className="planters-count-text text-sm text-gray-500 font-[var(--font-family-base)]">
                                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
                            </span>

                            <div className="planters-sort-container">
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
                        <div className="product-grid planters-grid">
                            {paginatedProducts.map((product) => (
                                <div key={product.id} className="product-card-wrapper">
                                    <div className="product-card" style={{ flexGrow: 1 }}>
                                        {!product.inStock && (
                                            <span className="card-badge sale bg-red-600 text-white">SOLD OUT</span>
                                        )}
                                        {product.inStock && product.discount && (
                                            <span className="card-badge sale">{product.discount}</span>
                                        )}

                                        <div className="product-card-image">
                                            <img src={product.image} alt={product.name} />
                                        </div>

                                        <div className="product-card-content">
                                            <h4 className="product-title" title={product.name}>
                                                {product.name}
                                            </h4>

                                            <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: 'var(--space-2)' }}>
                                                {product.originalPrice ? (
                                                    <>
                                                        <span className="price-original">Rs. {product.originalPrice}.00</span>
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
                                        disabled={!product.inStock}
                                    >
                                        {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
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
                                No planters matches the selected filter options. Please try resetting some filters.
                            </div>
                        )}

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Planterspage;
