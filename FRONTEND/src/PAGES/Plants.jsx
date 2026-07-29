import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Plants.css';

// Air Plants
import air1 from '../assets/AIRPLANTS/Alocasia macrorrhizos Variegata.jpg';
import air2 from '../assets/AIRPLANTS/Aspidistra elatior.jpg';
import air3 from '../assets/AIRPLANTS/How to Grow and Care for Air Plants_ No Soil Required.jpg';
import air4 from '../assets/AIRPLANTS/Peace Lily Air Purifying Plant Indoors Easy Care.jpg';

// Aquatic Plants
import aq1 from '../assets/AQUATICPLANTS/25 Indoor Plants That Thrive on Coffee Grounds - Simple List.jpg';
import aq2 from '../assets/AQUATICPLANTS/Best Quality Freshwater Aquarium Plants Largest Aquatic Plant Nursery Florida — Florida Aquatic Nurseries.jpg';
import aq3 from '../assets/AQUATICPLANTS/water lilies.jpg';

// Avenue Trees
import av1 from '../assets/AVENUETREES/Download Callistemon Viminalis Tree Isolated on Clear Background for free.jpg';
import av2 from '../assets/AVENUETREES/Foto Arbusto de flores vermelhas isolado em fundo branco  do Stock _ Adobe Stock.jpg';
import av3 from '../assets/AVENUETREES/Is Bamboo a Tree_ _ Sarai Chinwag.jpg';
import av4 from '../assets/AVENUETREES/download (8).jpg';
import av5 from '../assets/AVENUETREES/photoshop brush trees _ T_l_charger Liriope spicata buisson isol_ sur transparent Contexte grat.jpg';

// Balcony
import bal1 from '../assets/BALCONY/53 Stunning Spring Decor Ideas For Your Terrace To Elevate Outdoor Living.jpg';
import bal2 from '../assets/BALCONY/Gardening tips_ 9 easy ways to grow Lavender plants indoors in a pot.jpg';
import bal3 from '../assets/BALCONY/download (20).jpg';
import bal4 from '../assets/BALCONY/download (21).jpg';

// Bamboo
import bam1 from '../assets/BAMBOO/24 Perennial Vegetables That Regrow Every Season - plantbrilliant_com.jpg';
import bam2 from '../assets/BAMBOO/Pokok Buluh Hijau Dengan Daun Yang Rimbun _ Elemen Grafik JPG percuma muat turun - Pikbest.jpg';
import bam3 from '../assets/BAMBOO/download (9).jpg';

// Fragrant
import frag1 from '../assets/FRAGRANTPLANTS/Orange Jasmine.jpg';
import frag2 from '../assets/FRAGRANTPLANTS/tuberose_flowers.jpg';
import frag3 from '../assets/FRAGRANTPLANTS/mogra flower.jpg';
import frag4 from '../assets/FRAGRANTPLANTS/download (10).jpg';

// Indoor
import ind1 from '../assets/INDOORPLANTS/11 Inspiring Secrets To Thriving Indoor Bamboo_ Choosing the Right Environment.jpg';
import ind2 from '../assets/INDOORPLANTS/Humidity-Loving Plants_ Transform Your Bathroom with Tropical Vibes - Quiet Minimal.jpg';
import ind3 from '../assets/INDOORPLANTS/Indoor Plants Ideas For Beginners_ Transform Your Home Into A Green Paradise.jpg';

// Monsoon
import mon1 from '../assets/MONSSONFLOWRS/download (16).jpg';
import mon2 from '../assets/MONSSONFLOWRS/download (17).jpg';
import mon3 from '../assets/MONSSONFLOWRS/download (18).jpg';
import mon4 from '../assets/MONSSONFLOWRS/download (19).jpg';

// Outdoor
import out1 from '../assets/OUTDOORPLANTS/How to Use Plumeria in a Florida Garden Design.jpg';
import out2 from '../assets/OUTDOORPLANTS/download (11).jpg';
import out3 from '../assets/OUTDOORPLANTS/download (12).jpg';
import out4 from '../assets/OUTDOORPLANTS/outdoor_rose.jpg';

// Summer
import sum1 from '../assets/SUMMERFLOWERPLANTS/download (13).jpg';
import sum2 from '../assets/SUMMERFLOWERPLANTS/download (14).jpg';
import sum3 from '../assets/SUMMERFLOWERPLANTS/download (15).jpg';
import sum4 from '../assets/SUMMERFLOWERPLANTS/sadabahar_periwinkle.jpg';

const plantProducts = [
    // Air Plants
    { id: 'air-1', category: 'air-plants', name: 'Alocasia Macrorrhizos Variegata', price: 399, rating: 5, image: air1, date: '2026-01-01', inStock: true, space: 'indoors' },
    { id: 'air-2', category: 'air-plants', name: 'Aspidistra Elatior (Cast Iron Plant)', price: 299, rating: 4, image: air2, date: '2026-01-02', inStock: false, space: 'indoors' },
    { id: 'air-3', category: 'air-plants', name: 'Tillandsia Ionantha Air Plant', price: 199, originalPrice: 249, discount: '-20%', rating: 5, image: air3, date: '2026-01-03', inStock: true, space: 'indoors' },
    { id: 'air-4', category: 'air-plants', name: 'Peace Lily Air Purifying Plant', price: 249, rating: 5, image: air4, date: '2026-01-04', inStock: true, space: 'indoors' },

    // Aquatic Plants
    { id: 'aq-1', category: 'aquatic-plants', name: 'Aquatic Anthurium Plant', price: 349, rating: 4, image: aq1, date: '2026-01-05', inStock: true, space: 'indoors' },
    { id: 'aq-2', category: 'aquatic-plants', name: 'Aquarium Freshwater Moss', price: 149, rating: 4, image: aq2, date: '2026-01-06', inStock: true, space: 'indoors' },
    { id: 'aq-3', category: 'aquatic-plants', name: 'Premium Water Lilies', price: 499, originalPrice: 599, discount: '-16%', rating: 5, image: aq3, date: '2026-01-07', inStock: true, space: 'outdoors' },

    // Avenue Trees
    { id: 'av-1', category: 'avenue-trees', name: 'Callistemon Viminalis Weeping Tree', price: 599, rating: 5, image: av1, date: '2026-01-08', inStock: true, space: 'outdoors' },
    { id: 'av-2', category: 'avenue-trees', name: 'Red Ixora Flowering Bush', price: 299, rating: 4, image: av2, date: '2026-01-09', inStock: true, space: 'outdoors' },
    { id: 'av-3', category: 'avenue-trees', name: 'Giant Timber Bamboo Culm', price: 399, rating: 5, image: av3, date: '2026-01-10', inStock: true, space: 'outdoors' },
    { id: 'av-4', category: 'avenue-trees', name: 'Golden Shower Avenue Tree', price: 449, rating: 4, image: av4, date: '2026-01-11', inStock: false, space: 'outdoors' },
    { id: 'av-5', category: 'avenue-trees', name: 'Liriope Spicata Border Grass', price: 129, originalPrice: 199, discount: '-35%', rating: 4, image: av5, date: '2026-01-12', inStock: true, space: 'outdoors' },

    // Balcony
    { id: 'bal-1', category: 'balcony', name: 'Spring Terrace Planter Set', price: 899, rating: 5, image: bal1, date: '2026-01-13', inStock: true, space: 'outdoors' },
    { id: 'bal-2', category: 'balcony', name: 'English Lavender Clay Pot', price: 299, rating: 4, image: bal2, date: '2026-01-14', inStock: true, space: 'outdoors' },
    { id: 'bal-3', category: 'balcony', name: 'Balcony Hanging Petunias', price: 249, originalPrice: 299, discount: '-16%', rating: 4, image: bal3, date: '2026-01-15', inStock: true, space: 'outdoors' },
    { id: 'bal-4', category: 'balcony', name: 'Balcony Ivy Geranium Red', price: 199, rating: 4, image: bal4, date: '2026-01-16', inStock: true, space: 'outdoors' },

    // Bamboo
    { id: 'bam-1', category: 'bamboos', name: 'Perennial Vegetable Plant Starter', price: 179, rating: 4, image: bam1, date: '2026-01-17', inStock: true, space: 'outdoors' },
    { id: 'bam-2', category: 'bamboos', name: 'Green Leafy Bamboo Plant', price: 349, rating: 5, image: bam2, date: '2026-01-18', inStock: true, space: 'outdoors' },
    { id: 'bam-3', category: 'bamboos', name: 'Lucky Bamboo Braided Sticks', price: 299, originalPrice: 399, discount: '-25%', rating: 5, image: bam3, date: '2026-01-19', inStock: true, space: 'indoors' },

    // Fragrant
    { id: 'frag-1', category: 'fragrant-plants', name: 'Orange Jasmine / Kamini Pot', price: 279, rating: 5, image: frag1, date: '2026-01-20', inStock: true, space: 'outdoors' },
    { id: 'frag-2', category: 'fragrant-plants', name: 'Tuberose / Rajnigandha Bulbs', price: 199, originalPrice: 249, discount: '-20%', rating: 5, image: frag2, date: '2026-01-21', inStock: true, space: 'outdoors' },
    { id: 'frag-3', category: 'fragrant-plants', name: 'Mogra Jasmine Fragrant Plant', price: 149, rating: 4, image: frag3, date: '2026-01-22', inStock: false, space: 'outdoors' },
    { id: 'frag-4', category: 'fragrant-plants', name: 'Scented Gardenia Flowering Plant', price: 329, rating: 4, image: frag4, date: '2026-01-23', inStock: true, space: 'outdoors' },

    // Indoor
    { id: 'ind-1', category: 'indoor-plants', name: 'Indoor House Bamboo Palm', price: 399, rating: 5, image: ind1, date: '2026-01-24', inStock: true, space: 'indoors' },
    { id: 'ind-2', category: 'indoor-plants', name: 'Bathroom Tropical Humidity Fern', price: 249, rating: 4, image: ind2, date: '2026-01-25', inStock: true, space: 'indoors' },
    { id: 'ind-3', category: 'indoor-plants', name: 'Beginner ZZ Emerald Plant', price: 349, originalPrice: 449, discount: '-22%', rating: 5, image: ind3, date: '2026-01-26', inStock: true, space: 'indoors' },

    // Monsoon
    { id: 'mon-1', category: 'monsoon-flowers', name: 'Monsoon Rain Lily Pink Flower', price: 129, rating: 5, image: mon1, date: '2026-01-27', inStock: true, space: 'outdoors' },
    { id: 'mon-2', category: 'monsoon-flowers', name: 'Monsoon Balsam Mixed Flowers', price: 149, rating: 4, image: mon2, date: '2026-01-28', inStock: false, space: 'outdoors' },
    { id: 'mon-3', category: 'monsoon-flowers', name: 'Monsoon Hibiscus Bright Red', price: 229, originalPrice: 299, discount: '-23%', rating: 4, image: mon3, date: '2026-01-29', inStock: true, space: 'outdoors' },
    { id: 'mon-4', category: 'monsoon-flowers', name: 'Monsoon Plumeria Alba White', price: 399, rating: 5, image: mon4, date: '2026-01-30', inStock: true, space: 'outdoors' },

    // Outdoor
    { id: 'out-1', category: 'outdoor-plants', name: 'Plumeria Rubra Frangipani Tree', price: 499, rating: 5, image: out1, date: '2026-01-31', inStock: true, space: 'outdoors' },
    { id: 'out-2', category: 'outdoor-plants', name: 'Outdoor Bougainvillea Specimen', price: 299, rating: 4, image: out2, date: '2026-02-01', inStock: true, space: 'outdoors' },
    { id: 'out-3', category: 'outdoor-plants', name: 'Outdoor Lush Areca Palm Tree', price: 349, originalPrice: 449, discount: '-22%', rating: 5, image: out3, date: '2026-02-02', inStock: true, space: 'outdoors' },
    { id: 'out-4', category: 'outdoor-plants', name: 'Delicate Outdoor Red Rose Pot', price: 199, rating: 4, image: out4, date: '2026-02-03', inStock: true, space: 'outdoors' },

    // Summer
    { id: 'sum-1', category: 'summer-flowers', name: 'Summer French Marigold Gold', price: 99, rating: 4, image: sum1, date: '2026-02-04', inStock: true, space: 'outdoors' },
    { id: 'sum-2', category: 'summer-flowers', name: 'Summer Cosmos Mixed Petals', price: 119, rating: 4, image: sum2, date: '2026-02-05', inStock: true, space: 'outdoors' },
    { id: 'sum-3', category: 'summer-flowers', name: 'Summer Sunflower Dwarf Sunny', price: 149, originalPrice: 199, discount: '-25%', rating: 5, image: sum3, date: '2026-02-06', inStock: true, space: 'outdoors' },
    { id: 'sum-4', category: 'summer-flowers', name: 'Summer Periwinkle Sadabahar Pink', price: 89, rating: 4, image: sum4, date: '2026-02-07', inStock: true, space: 'outdoors' }
];

const plantCategories = [
    { id: 'all', name: 'All Plants' },
    { id: 'air-plants', name: 'Air Plants' },
    { id: 'aquatic-plants', name: 'Aquatic Plants' },
    { id: 'avenue-trees', name: 'Avenue Trees' },
    { id: 'balcony', name: 'Balcony Plants' },
    { id: 'bamboos', name: 'Bamboos' },
    { id: 'fragrant-plants', name: 'Fragrant Plants' },
    { id: 'indoor-plants', name: 'Indoor Plants' },
    { id: 'monsoon-flowers', name: 'Monsoon Flowers' },
    { id: 'outdoor-plants', name: 'Outdoor Plants' },
    { id: 'summer-flowers', name: 'Summer Flower Plants' }
];

function Plants() {
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
    const [maxPrice, setMaxPrice] = useState(8500);
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
    const filteredProducts = plantProducts.filter(product => {
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

    // Dynamic counts for stock and space filters based on active Category
    const categoryProducts = activeCategory === 'all'
        ? plantProducts
        : plantProducts.filter(p => p.category === activeCategory);

    const inStockCount = categoryProducts.filter(p => p.inStock).length;
    const outOfStockCount = categoryProducts.filter(p => !p.inStock).length;
    const indoorsCount = categoryProducts.filter(p => p.space === 'indoors').length;
    const outdoorsCount = categoryProducts.filter(p => p.space === 'outdoors').length;

    return (
        <div className="plants-page-wrapper text-[#1c2c21]">

            {/* Left Aligned Breadcrumbs and Title Section (pic2) */}
            <section className="plants-header-section pt-16 pb-12">
                <div className="container">
                    <div className="plants-breadcrumbs text-xs text-gray-400 mb-3">
                        <Link to="/" className="hover:underline text-gray-400">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-600">Plants</span>
                    </div>

                    <h1 className="plants-page-title text-xl font-normal mb-3 text-[#1c2c21]">
                        {activeCategory === 'all' 
                            ? 'All Plants' 
                            : plantCategories.find(c => c.id === activeCategory)?.name || 'Plants'}
                    </h1>

                    <p className="plants-page-description font-[var(--font-family-base)] text-sm text-[#4b5563] max-w-[800px] leading-relaxed">
                        Buy plants online from Plantsguru — India's most trusted <span className="underline font-semibold cursor-pointer">plant nursery</span> for healthy <span className="underline font-semibold cursor-pointer">indoor</span>, outdoor, and <span className="underline font-semibold cursor-pointer">flowering plants</span>. We deliver <span className="underline font-semibold cursor-pointer">live plants</span> across India.
                    </p>
                </div>
            </section>

            {/* Main Catalog Workspace */}
            <section className="plants-catalog-section py-12">
                <div className="container plants-layout-container">

                    {/* Left Column: Sidebar Filters */}
                    <div className="plants-sidebar">

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
                                    <div className="plants-category-list">
                                        {plantCategories.map((cat) => {
                                            const count = cat.id === 'all'
                                                ? plantProducts.length
                                                : plantProducts.filter(p => p.category === cat.id).length;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className={`plants-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
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

                        {/* 2. Availability Accordion (pic1) */}
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

                        {/* 3. Price Accordion (pic1) */}
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
                                            setMaxPrice(8500);
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
                                                    max="8500"
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
                                                    max="8500"
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
                                                        left: `${(minPrice / 8500) * 100}%`,
                                                        right: `${100 - (maxPrice / 8500) * 100}%`
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

                        {/* 4. Suitable Space Accordion (pic1) */}
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
                    <div className="plants-main-content">

                        {/* Toolbar Area */}
                        <div className="plants-toolbar mb-8">
                            <span className="plants-count-text text-sm text-gray-500 font-[var(--font-family-base)]">
                                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'plant' : 'plants'}
                            </span>

                            <div className="plants-sort-container">
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
                        <div className="product-grid plants-grid">
                            {sortedProducts.map((product) => (
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
                                No plants matches the selected filter options. Please try resetting some filters.
                            </div>
                        )}

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Plants;
