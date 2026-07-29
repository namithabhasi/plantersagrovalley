import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Gardendecors.css';

// Import Assets
import birdHouseImg from '../assets/GARDENDECORS/image.png';
import fairyGardenImg from '../assets/GARDENDECORS/image copy.png';
import fountainImg from '../assets/GARDENDECORS/image copy 2.png';
import toolsImg from '../assets/GARDENDECORS/image copy 3.png';
import pebblesImg from '../assets/GARDENDECORS/image copy 4.png';
import standImg from '../assets/GARDENDECORS/image copy 5.png';
import terrariumImg from '../assets/GARDENDECORS/image copy 6.png';
import nestImg from '../assets/GARDENDECORS/image copy 7.png';
import swingImg from '../assets/GARDENDECORS/image copy 8.png';
import zenImg from '../assets/GARDENDECORS/image copy 9.png';
import rakeImg from '../assets/GARDENDECORS/image copy 10.png';
import whitePebblesImg from '../assets/GARDENDECORS/image copy 11.png';
import bambooStandImg from '../assets/GARDENDECORS/image copy 12.png';
import geomTerrariumImg from '../assets/GARDENDECORS/image copy 13.png';

const gardenCategories = [
    { id: 'all', name: 'All Garden Decors' },
    { id: 'bird-houses', name: 'Bird Houses' },
    { id: 'fairy-garden', name: 'Fairy Garden' },
    { id: 'garden-fountains', name: 'Garden Fountains' },
    { id: 'garden-tools', name: 'Garden Tools' },
    { id: 'pebbles', name: 'Pebbles' },
    { id: 'pot-stands', name: 'Pot Stands' },
    { id: 'terrarium-garden', name: 'Terrarium Garden' }
];

const gardenProducts = [
    {
        id: 'g1',
        name: 'Premium Wooden Bird House',
        category: 'bird-houses',
        price: 599,
        oldPrice: 799,
        image: birdHouseImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.8,
        reviews: 74,
        description: 'Charming weatherproof wooden bird house for balconies and garden trees.'
    },
    {
        id: 'g2',
        name: 'Fairy Garden Miniature Castle',
        category: 'fairy-garden',
        price: 449,
        oldPrice: 599,
        image: fairyGardenImg,
        inStock: true,
        space: 'indoors',
        rating: 4.6,
        reviews: 42,
        description: 'Intricately detailed mini resin castle kit to create a whimsical fairy landscape.'
    },
    {
        id: 'g3',
        name: 'Tiered Tabletop Water Fountain',
        category: 'garden-fountains',
        price: 1299,
        oldPrice: 1699,
        image: fountainImg,
        inStock: true,
        space: 'indoors',
        rating: 4.9,
        reviews: 110,
        description: 'Relaxing water flow fountain with LED lights for indoor spaces and desktops.'
    },
    {
        id: 'g4',
        name: 'Heavy-Duty Garden Trowel & Fork Set',
        category: 'garden-tools',
        price: 349,
        oldPrice: 499,
        image: toolsImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.7,
        reviews: 135,
        description: 'Ergonomic stainless steel hand tools for easy digging, planting, and weeding.'
    },
    {
        id: 'g5',
        name: 'Polished River Pebbles - Mixed (5kg)',
        category: 'pebbles',
        price: 299,
        oldPrice: 399,
        image: pebblesImg,
        inStock: true,
        space: 'indoors',
        rating: 4.5,
        reviews: 215,
        description: 'Smooth natural polished pebbles for plant pots, aquariums, and tray styling.'
    },
    {
        id: 'g6',
        name: 'Multi-Tier Iron Pot Stand',
        category: 'pot-stands',
        price: 1499,
        oldPrice: 1999,
        image: standImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.8,
        reviews: 82,
        description: 'Sturdy black powder-coated iron step stand to organize and display multiple planters.'
    },
    {
        id: 'g7',
        name: 'Closed Glass Jar Terrarium Kit',
        category: 'terrarium-garden',
        price: 799,
        oldPrice: 999,
        image: terrariumImg,
        inStock: true,
        space: 'indoors',
        rating: 4.7,
        reviews: 61,
        description: 'Complete DIY starter kit including glass container, soil, moss, and charcoal.'
    },
    {
        id: 'g8',
        name: 'Hanging Coconut Fiber Bird Nest',
        category: 'bird-houses',
        price: 249,
        oldPrice: 350,
        image: nestImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.4,
        reviews: 28,
        description: 'Eco-friendly hand-woven coconut coir nest providing shelter for small birds.'
    },
    {
        id: 'g9',
        name: 'Miniature Fairy Garden Swing & Pathway',
        category: 'fairy-garden',
        price: 199,
        oldPrice: 299,
        image: swingImg,
        inStock: false,
        space: 'indoors',
        rating: 4.3,
        reviews: 19,
        description: 'Tiny wooden swing and stepping stones accessories for miniature moss gardens.'
    },
    {
        id: 'g10',
        name: 'Zen Buddhist Resin Water Fountain',
        category: 'garden-fountains',
        price: 1899,
        oldPrice: 2499,
        image: zenImg,
        inStock: true,
        space: 'indoors',
        rating: 4.9,
        reviews: 53,
        description: 'Decorative meditative fountain producing calm trickling water sounds.'
    },
    {
        id: 'g11',
        name: 'Premium Stainless Steel Rake',
        category: 'garden-tools',
        price: 450,
        oldPrice: 599,
        image: rakeImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.6,
        reviews: 44,
        description: 'Comfortable hand rake designed for cleaning leaves and loosening soil bed.'
    },
    {
        id: 'g12',
        name: 'Snow White Marble Pebbles (5kg)',
        category: 'pebbles',
        price: 350,
        oldPrice: 450,
        image: whitePebblesImg,
        inStock: true,
        space: 'outdoors',
        rating: 4.7,
        reviews: 180,
        description: 'Pristine white marble stones to create clean borders or highlights around plants.'
    },
    {
        id: 'g13',
        name: 'Bamboo Double Pot Stand',
        category: 'pot-stands',
        price: 690,
        oldPrice: 850,
        image: bambooStandImg,
        inStock: true,
        space: 'indoors',
        rating: 4.5,
        reviews: 37,
        description: 'Elegant dual-level lightweight bamboo pot stand for modern home aesthetics.'
    },
    {
        id: 'g14',
        name: 'DIY Geometric Glass Terrarium',
        category: 'terrarium-garden',
        price: 950,
        oldPrice: 1200,
        image: geomTerrariumImg,
        inStock: true,
        space: 'indoors',
        rating: 4.8,
        reviews: 29,
        description: 'Polyhedron-shaped brass framed glass container for succulents and airplants.'
    }
];

function Gardendecors() {
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
    const [maxPrice, setMaxPrice] = useState(2000);
    const [indoorsChecked, setIndoorsChecked] = useState(false);
    const [outdoorsChecked, setOutdoorsChecked] = useState(false);

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
    const filteredProducts = gardenProducts.filter(product => {
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
            return b.reviews - a.reviews;
        }
        return b.rating - a.rating;
    });

    // Dynamic counts
    const inStockCount = gardenProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && p.inStock
    ).length;

    const outOfStockCount = gardenProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && !p.inStock
    ).length;

    const indoorsCount = gardenProducts.filter(
        p => (activeCategory === 'all' || p.category === activeCategory) && p.space === 'indoors'
    ).length;

    const outdoorsCount = gardenProducts.filter(
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
        <div className="gardendecors-page-wrapper text-[#1c2c21]">
            
            {/* Breadcrumbs & Description Section */}
            <section className="gardendecors-header-section pt-16 pb-12">
                <div className="container">
                    <div className="gardendecors-breadcrumbs text-xs text-gray-400 mb-3">
                        <Link to="/" className="hover:underline text-gray-400">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-600">Garden Decor</span>
                    </div>

                    <h1 className="gardendecors-page-title text-xl font-normal mb-3 text-[#1c2c21]">
                        {activeCategory === 'all' 
                            ? 'All Garden Decors' 
                            : gardenCategories.find(c => c.id === activeCategory)?.name || 'Garden Decor'}
                    </h1>

                    <p className="gardendecors-page-description font-[var(--font-family-base)] text-sm text-[#4b5563] max-w-[800px] leading-relaxed">
                        Create your dream garden with our selection of decorative ornaments. Choose from whimsical fairy garden castles, relaxing indoor water fountains, polished pebbles, bird houses, double pot stands, and geometric glass terrariums.
                    </p>
                </div>
            </section>

            {/* Main Catalog Workspace */}
            <section className="gardendecors-catalog-section py-12">
                <div className="container gardendecors-layout-container">

                    {/* Left Sidebar: Filters */}
                    <div className="gardendecors-sidebar">

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
                                    <div className="gardendecors-category-list">
                                        {gardenCategories.map((cat) => {
                                            const count = cat.id === 'all'
                                                ? gardenProducts.length
                                                : gardenProducts.filter(p => p.category === cat.id).length;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className={`gardendecors-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
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
                                                        left: `${(minPrice / 2000) * 100}%`,
                                                        right: `${100 - (maxPrice / 2000) * 100}%`
                                                    }}
                                                />
                                                <input 
                                                    type="range"
                                                    min="0"
                                                    max="2000"
                                                    value={minPrice}
                                                    onChange={(e) => handlePriceChange(e, 'min')}
                                                    className="slider-thumb"
                                                />
                                                <input 
                                                    type="range"
                                                    min="0"
                                                    max="2000"
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
                    <div className="gardendecors-main-content">

                        {/* Toolbar Area */}
                        <div className="gardendecors-toolbar mb-8">
                            <span className="gardendecors-count-text text-sm text-gray-500 font-[var(--font-family-base)]">
                                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
                            </span>

                            <div className="gardendecors-sort-container">
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
                        <div className="product-grid gardendecors-grid">
                            {sortedProducts.map((product) => (
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
                                        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
                                        className="btn btn-primary"
                                        style={{ borderRadius: '3px' }}
                                        disabled={!product.inStock}
                                    >
                                        {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {sortedProducts.length === 0 && (
                            <div className="text-center py-16 text-gray-500 font-[var(--font-family-base)]">
                                No garden decors matches the selected filter options. Please try resetting some filters.
                            </div>
                        )}

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Gardendecors;
