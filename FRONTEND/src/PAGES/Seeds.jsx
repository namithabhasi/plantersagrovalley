import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../redux/auth/authSlice';
import { useCart } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Seeds.css';

// Flower Seeds
import fs1 from '../assets/FLOWERSEEDS/Rainbow Rose Seeds • Rare Holland Variety • Multicolor Blooms - Etsy.jpg';
import fs2 from '../assets/FLOWERSEEDS/Rare Black Rose Seeds _ Perennial Shrub Blooms _ Ornamental Garden Plant.jpg';
import fs3 from '../assets/FLOWERSEEDS/This item is unavailable - Etsy.jpg';
import fs4 from '../assets/FLOWERSEEDS/download (22).jpg';
import fs5 from '../assets/FLOWERSEEDS/download (23).jpg';

// Vegetable Seeds
import vs1 from '../assets/VEGETABLESEEDS/download (24).jpg';
import vs2 from '../assets/VEGETABLESEEDS/image copy 2.png';
import vs3 from '../assets/VEGETABLESEEDS/image copy 3.png';
import vs4 from '../assets/VEGETABLESEEDS/image copy 4.png';
import vs5 from '../assets/VEGETABLESEEDS/image copy 5.png';
import vs6 from '../assets/VEGETABLESEEDS/image copy.png';
import vs7 from '../assets/VEGETABLESEEDS/image.png';

// Herb Seeds
import hs1 from '../assets/HERBSEEDS/image copy 2.png';
import hs2 from '../assets/HERBSEEDS/image copy 3.png';
import hs3 from '../assets/HERBSEEDS/image copy 4.png';
import hs4 from '../assets/HERBSEEDS/image copy.png';
import hs5 from '../assets/HERBSEEDS/image.png';

// Flower Bulbs
import fb1 from '../assets/FLOWERBULBS/image copy 2.png';
import fb2 from '../assets/FLOWERBULBS/image copy 3.png';
import fb3 from '../assets/FLOWERBULBS/image copy 4.png';
import fb4 from '../assets/FLOWERBULBS/image copy 5.png';
import fb5 from '../assets/FLOWERBULBS/image copy 6.png';
import fb6 from '../assets/FLOWERBULBS/image copy 7.png';
import fb7 from '../assets/FLOWERBULBS/image copy 8.png';
import fb8 from '../assets/FLOWERBULBS/image copy 9.png';
import fb9 from '../assets/FLOWERBULBS/image copy.png';
import fb10 from '../assets/FLOWERBULBS/image.png';

// Forestry Seeds (Imported from FORESTARYSEEDS)
import forest1 from '../assets/FORESTARYSEEDS/image copy 2.png';
import forest2 from '../assets/FORESTARYSEEDS/image copy 3.png';
import forest3 from '../assets/FORESTARYSEEDS/image copy 4.png';
import forest4 from '../assets/FORESTARYSEEDS/image copy.png';
import forest5 from '../assets/FORESTARYSEEDS/image.png';

// Lawn Seeds
import ls1 from '../assets/LAWNSEEDS/image copy.png';
import ls2 from '../assets/LAWNSEEDS/image.png';

export const seedProducts = [
    // Flower Seeds
    { id: 'seed-fs-1', category: 'flower-seeds', name: 'Rainbow Rose Seeds (Holland Variety)', price: 149, rating: 5, image: fs1, date: '2026-01-01', inStock: true, space: 'outdoors' },
    { id: 'seed-fs-2', category: 'flower-seeds', name: 'Rare Black Rose Shrub Seeds', price: 199, originalPrice: 249, discount: '-20%', rating: 5, image: fs2, date: '2026-01-02', inStock: true, space: 'outdoors' },
    { id: 'seed-fs-3', category: 'flower-seeds', name: 'Exotic Purple Orchid Seeds', price: 249, rating: 4, image: fs3, date: '2026-01-03', inStock: false, space: 'indoors' },
    { id: 'seed-fs-4', category: 'flower-seeds', name: 'Mixed Aster Flower Seeds', price: 99, rating: 4, image: fs4, date: '2026-01-04', inStock: true, space: 'outdoors' },
    { id: 'seed-fs-5', category: 'flower-seeds', name: 'Dwarf Marigold Flower Seeds', price: 79, rating: 4, image: fs5, date: '2026-01-05', inStock: true, space: 'outdoors' },

    // Vegetable Seeds
    { id: 'seed-vs-1', category: 'vegetable-seeds', name: 'Organic Tomato Seeds', price: 59, rating: 5, image: vs1, date: '2026-01-06', inStock: true, space: 'outdoors' },
    { id: 'seed-vs-2', category: 'vegetable-seeds', name: 'Red Chili Pepper Seeds', price: 49, rating: 4, image: vs2, date: '2026-01-07', inStock: true, space: 'outdoors' },
    { id: 'seed-vs-3', category: 'vegetable-seeds', name: 'Bell Pepper Sweet Seeds', price: 69, rating: 4, image: vs3, date: '2026-01-08', inStock: true, space: 'outdoors' },
    { id: 'seed-vs-4', category: 'vegetable-seeds', name: 'F1 Hybrid Carrot Seeds', price: 59, rating: 4, image: vs4, date: '2026-01-09', inStock: true, space: 'outdoors' },
    { id: 'seed-vs-5', category: 'vegetable-seeds', name: 'Long Green Cucumber Seeds', price: 49, rating: 4, image: vs5, date: '2026-01-10', inStock: false, space: 'outdoors' },
    { id: 'seed-vs-6', category: 'vegetable-seeds', name: 'Spinach / Palak Seeds', price: 39, originalPrice: 49, discount: '-20%', rating: 5, image: vs6, date: '2026-01-11', inStock: true, space: 'outdoors' },
    { id: 'seed-vs-7', category: 'vegetable-seeds', name: 'French Beans Seeds', price: 49, rating: 4, image: vs7, date: '2026-01-12', inStock: true, space: 'outdoors' },

    // Herb Seeds
    { id: 'seed-hs-1', category: 'herb-seeds', name: 'Sweet Basil Herb Seeds', price: 79, rating: 5, image: hs1, date: '2026-01-13', inStock: true, space: 'indoors' },
    { id: 'seed-hs-2', category: 'herb-seeds', name: 'Italian Parsley Herb Seeds', price: 69, rating: 4, image: hs2, date: '2026-01-14', inStock: true, space: 'indoors' },
    { id: 'seed-hs-3', category: 'herb-seeds', name: 'Coriander / Cilantro Seeds', price: 39, rating: 5, image: hs3, date: '2026-01-15', inStock: true, space: 'outdoors' },
    { id: 'seed-hs-4', category: 'herb-seeds', name: 'Peppermint Herb Seeds', price: 79, originalPrice: 99, discount: '-20%', rating: 4, image: hs4, date: '2026-01-16', inStock: true, space: 'indoors' },
    { id: 'seed-hs-5', category: 'herb-seeds', name: 'Thyme Herb Seeds', price: 89, rating: 4, image: hs5, date: '2026-01-17', inStock: false, space: 'indoors' },

    // Flower Bulbs
    { id: 'seed-fb-1', category: 'flower-bulbs', name: 'Red Tulip Bulbs (Premium)', price: 299, rating: 5, image: fb1, date: '2026-01-18', inStock: true, space: 'outdoors' },
    { id: 'seed-fb-2', category: 'flower-bulbs', name: 'Yellow Daffodil Bulbs', price: 199, rating: 4, image: fb2, date: '2026-01-19', inStock: true, space: 'outdoors' },
    { id: 'seed-fb-3', category: 'flower-bulbs', name: 'Purple Crocus Bulbs', price: 249, rating: 5, image: fb3, date: '2026-01-20', inStock: true, space: 'outdoors' },
    { id: 'seed-fb-4', category: 'flower-bulbs', name: 'White Lily Bulbs', price: 220, rating: 4, image: fb4, date: '2026-01-21', inStock: true, space: 'indoors' },
    { id: 'seed-fb-5', category: 'flower-bulbs', name: 'Blue Hyacinth Bulbs', price: 279, originalPrice: 349, discount: '-20%', rating: 5, image: fb5, date: '2026-01-22', inStock: true, space: 'indoors' },
    { id: 'seed-fb-6', category: 'flower-bulbs', name: 'Pink Ranunculus Bulbs', price: 250, rating: 4, image: fb6, date: '2026-01-23', inStock: true, space: 'outdoors' },
    { id: 'seed-fb-7', category: 'flower-bulbs', name: 'Double Freesia Bulbs', price: 189, rating: 4, image: fb7, date: '2026-01-24', inStock: true, space: 'outdoors' },
    { id: 'seed-fb-8', category: 'flower-bulbs', name: 'Gladiolus Mixed Bulbs', price: 159, rating: 4, image: fb8, date: '2026-01-25', inStock: false, space: 'outdoors' },
    { id: 'seed-fb-9', category: 'flower-bulbs', name: 'Anemone Flower Bulbs', price: 179, rating: 4, image: fb9, date: '2026-01-26', inStock: true, space: 'outdoors' },
    { id: 'seed-fb-10', category: 'flower-bulbs', name: 'Amaryllis Red Bulbs', price: 349, rating: 5, image: fb10, date: '2026-01-27', inStock: true, space: 'indoors' },

    // Forestry Seeds
    { id: 'seed-forest-1', category: 'foresty-seeds', name: 'Sandalwood Tree Seeds', price: 499, rating: 5, image: forest1, date: '2026-01-28', inStock: true, space: 'outdoors' },
    { id: 'seed-forest-2', category: 'foresty-seeds', name: 'Teak Wood Seeds', price: 399, rating: 4, image: forest2, date: '2026-01-29', inStock: true, space: 'outdoors' },
    { id: 'seed-forest-3', category: 'foresty-seeds', name: 'Bamboo Forest Seeds', price: 299, originalPrice: 399, discount: '-25%', rating: 5, image: forest3, date: '2026-01-30', inStock: true, space: 'outdoors' },
    { id: 'seed-forest-4', category: 'foresty-seeds', name: 'Mahogany Tree Seeds', price: 349, rating: 4, image: forest4, date: '2026-01-31', inStock: true, space: 'outdoors' },
    { id: 'seed-forest-5', category: 'foresty-seeds', name: 'Neem Tree Seeds', price: 149, rating: 5, image: forest5, date: '2026-02-01', inStock: false, space: 'outdoors' },

    // Lawn Seeds
    { id: 'seed-ls-1', category: 'lawn-seeds', name: 'Bermuda Grass Seeds', price: 199, rating: 4, image: ls1, date: '2026-02-02', inStock: true, space: 'outdoors' },
    { id: 'seed-ls-2', category: 'lawn-seeds', name: 'Kentucky Bluegrass Seeds', price: 249, originalPrice: 299, discount: '-16%', rating: 5, image: ls2, date: '2026-02-03', inStock: true, space: 'outdoors' }
];

const seedCategories = [
    { id: 'all', name: 'All Seeds' },
    { id: 'flower-seeds', name: 'Flower Seeds' },
    { id: 'vegetable-seeds', name: 'Vegetable Seeds' },
    { id: 'herb-seeds', name: 'Herb Seeds' },
    { id: 'flower-bulbs', name: 'Flower Bulbs' },
    { id: 'foresty-seeds', name: 'Foresty Seeds' },
    { id: 'lawn-seeds', name: 'Lawn Seeds' }
];

function Seeds() {
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
    const [maxPrice, setMaxPrice] = useState(1000); // Seeds are generally lower cost than large plants, max is 1000
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
    const filteredProducts = seedProducts.filter(product => {
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
    });

    // Pagination slicing
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const paginatedProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Dynamic counts for stock and space filters based on active Category
    const categoryProducts = activeCategory === 'all'
        ? seedProducts
        : seedProducts.filter(p => p.category === activeCategory);

    const inStockCount = categoryProducts.filter(p => p.inStock).length;
    const outOfStockCount = categoryProducts.filter(p => !p.inStock).length;
    const indoorsCount = categoryProducts.filter(p => p.space === 'indoors').length;
    const outdoorsCount = categoryProducts.filter(p => p.space === 'outdoors').length;

    return (
        <div className="seeds-page-wrapper text-[#1c2c21]">

            {/* Left Aligned Breadcrumbs and Title Section */}
            <section className="seeds-header-section pt-16 pb-12">
                <div className="container">
                    <div className="seeds-breadcrumbs text-xs text-gray-400 mb-3">
                        <Link to="/" className="hover:underline text-gray-400">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-600">Seeds</span>
                    </div>

                    <h1 className="seeds-page-title text-xl font-normal mb-3 text-[#1c2c21]">
                        {activeCategory === 'all'
                            ? 'All Seeds'
                            : seedCategories.find(c => c.id === activeCategory)?.name || 'Seeds'}
                    </h1>

                    <p className="seeds-page-description font-[var(--font-family-base)] text-sm text-[#4b5563] max-w-[800px] leading-relaxed">
                        Explore our premium range of organic seeds. Buy high-quality flower seeds, organic vegetable seeds, herb seeds, exotic flower bulbs, forestry tree seeds, and lush green lawn grass seeds online with guaranteed germination.
                    </p>
                </div>
            </section>

            {/* Main Catalog Workspace */}
            <section className="seeds-catalog-section py-12">
                <div className="container seeds-layout-container">

                    {/* Left Column: Sidebar Filters */}
                    <div className="seeds-sidebar">

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
                                    <div className="seeds-category-list">
                                        {seedCategories.map((cat) => {
                                            const count = cat.id === 'all'
                                                ? seedProducts.length
                                                : seedProducts.filter(p => p.category === cat.id).length;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className={`seeds-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
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
                                            setMaxPrice(1000);
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
                                                    max="1000"
                                                    step="10"
                                                    value={minPrice}
                                                    onChange={(e) => {
                                                        const val = Math.min(Number(e.target.value), maxPrice - 50);
                                                        setMinPrice(val);
                                                    }}
                                                    className="slider-thumb slider-thumb-left"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000"
                                                    step="10"
                                                    value={maxPrice}
                                                    onChange={(e) => {
                                                        const val = Math.max(Number(e.target.value), minPrice + 50);
                                                        setMaxPrice(val);
                                                    }}
                                                    className="slider-thumb slider-thumb-right"
                                                />
                                                <div className="slider-track" />
                                                <div
                                                    className="slider-range-bar"
                                                    style={{
                                                        left: `${(minPrice / 1000) * 100}%`,
                                                        right: `${100 - (maxPrice / 1000) * 100}%`
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
                    <div className="seeds-main-content">

                        {/* Toolbar Area */}
                        <div className="seeds-toolbar mb-8">
                            <span className="seeds-count-text text-sm text-gray-500 font-[var(--font-family-base)]">
                                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'pack' : 'packs'}
                            </span>

                            <div className="seeds-sort-container">
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
                        <div className="product-grid seeds-grid">
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
                                No seeds matches the selected filter options. Please try resetting some filters.
                            </div>
                        )}

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Seeds;
