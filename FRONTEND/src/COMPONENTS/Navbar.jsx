import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // The text logo is saved in logo.png
import bush from '../assets/image.png'; // Background bush growing from the bottom-left corner
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, cartTotalCount } = useCart();

  return (
    <header className="planters-header select-none">
      {/* Background growing bush illusion */}
      <img src={bush} alt="" className="planters-nav-bush" />

      <div className="container">

        {/* Left Side: Logo */}
        <Link to="/" className="planters-logo-container">
          <img
            src={logo}
            alt="Planters Logo"
            className="planters-logo"
          />
        </Link>

        {/* Center: Desktop Navigation Links (Clean layout with proper spacing and no line separators) */}
        <nav className="planters-nav">
          <div className="planters-nav-links">
            <div className="navbar-item-with-dropdown">
              <NavLink to="/plants" className="navbar-link">
                Plants
              </NavLink>

              {/* Mega Dropdown Menu */}
              <div className="planters-mega-dropdown">
                <div className="container mega-dropdown-grid">

                  {/* Column 1: Plants by Type */}
                  <div className="mega-dropdown-col">
                    <h4 className="mega-dropdown-title">Plants By Type</h4>
                    <ul className="mega-dropdown-list">
                      <li><Link to="/plants?category=air-plants">Air Plants</Link></li>
                      <li><Link to="/plants?category=aquatic-plants">Aquatic Plants</Link></li>
                      <li><Link to="/plants?category=avenue-trees">Avenue Trees</Link></li>
                      <li><Link to="/plants?category=bamboos">Bamboos</Link></li>
                    </ul>
                  </div>

                  {/* Column 2: Plants by Feature */}
                  <div className="mega-dropdown-col">
                    <h4 className="mega-dropdown-title">Plants By Feature</h4>
                    <ul className="mega-dropdown-list">
                      <li><Link to="/plants?category=indoor-plants">Air Purifier Plants</Link></li>
                      <li><Link to="/plants?category=fragrant-plants">Fragrant Plants</Link></li>
                      <li><Link to="/plants?category=outdoor-plants">Insect Repellents Plants</Link></li>
                      <li><Link to="/plants?category=bamboos">Lucky Bamboos</Link></li>
                    </ul>
                  </div>

                  {/* Column 3: Plants by Location */}
                  <div className="mega-dropdown-col">
                    <h4 className="mega-dropdown-title">Plants By Location</h4>
                    <ul className="mega-dropdown-list">
                      <li><Link to="/plants?category=indoor-plants">Indoor Plants</Link></li>
                      <li><Link to="/plants?category=outdoor-plants">Outdoor Plants</Link></li>
                      <li><Link to="/plants?category=balcony">Plants For Balcony</Link></li>
                      <li><Link to="/plants?category=indoor-plants">Plants for Bedroom</Link></li>
                    </ul>
                  </div>

                  {/* Column 4: Seasonal Plants */}
                  <div className="mega-dropdown-col">
                    <h4 className="mega-dropdown-title">Seasonal Plants</h4>
                    <ul className="mega-dropdown-list">
                      <li><Link to="/plants?category=summer-flowers">Annual Flower Plants</Link></li>
                      <li><Link to="/plants?category=monsoon-flowers">Monsoon Flower Plants</Link></li>
                      <li><Link to="/plants?category=outdoor-plants">Winter Flower Plants</Link></li>
                      <li><Link to="/plants?category=summer-flowers">Summer Flower Plants</Link></li>
                    </ul>
                  </div>

                  {/* Column 5: Top 10 Plants */}
                  <div className="mega-dropdown-col">
                    <h4 className="mega-dropdown-title">Top 10 Plants</h4>
                    <ul className="mega-dropdown-list">
                      <li><Link to="/plants?category=indoor-plants">Top 10 Air Purifier Plants</Link></li>
                      <li><Link to="/plants?category=summer-flowers">Top 10 Flowering Plants</Link></li>
                      <li><Link to="/plants?category=fragrant-plants">Top 10 Fragrant Plants</Link></li>
                      <li><Link to="/plants?category=outdoor-plants">Top 10 Hardy Plants</Link></li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>

            <div className="navbar-item-with-simple-dropdown">
              <NavLink to="/seeds" className="navbar-link">
                Seeds
              </NavLink>
              
              {/* Seeds Simple Dropdown Menu */}
              <div className="planters-simple-dropdown">
                <Link to="/seeds?category=flower-seeds" className="simple-dropdown-item">
                  <span>Flower Seeds</span>
                </Link>
                <Link to="/seeds?category=vegetable-seeds" className="simple-dropdown-item">
                  <span>Vegetable Seeds</span>
                </Link>
                <Link to="/seeds?category=herb-seeds" className="simple-dropdown-item">
                  <span>Herb Seeds</span>
                </Link>
                <Link to="/seeds?category=flower-bulbs" className="simple-dropdown-item">
                  <span>Flower Bulbs</span>
                </Link>
                <Link to="/seeds?category=foresty-seeds" className="simple-dropdown-item">
                  <span>Foresty Seeds</span>
                </Link>
                <Link to="/seeds?category=lawn-seeds" className="simple-dropdown-item">
                  <span>Lawn Seeds</span>
                </Link>
              </div>
            </div>
            <div className="navbar-item-with-simple-dropdown">
              <NavLink to="/planters" className="navbar-link">
                Planters
              </NavLink>
              
              {/* Planters Simple Dropdown Menu */}
              <div className="planters-simple-dropdown">
                <Link to="/planters?category=plastic-pots" className="simple-dropdown-item">
                  <span>Plastic Pots</span>
                </Link>
                <Link to="/planters?category=metal-pots" className="simple-dropdown-item">
                  <span>Metal Pots</span>
                </Link>
                <Link to="/planters?category=ceramic-pots" className="simple-dropdown-item">
                  <span>Ceramic Pots</span>
                </Link>
                <Link to="/planters?category=hanging-basket" className="simple-dropdown-item">
                  <span>Hanging Basket</span>
                </Link>
                <Link to="/planters?category=grill-pots" className="simple-dropdown-item">
                  <span>Grill/Railing Pots</span>
                </Link>
                <Link to="/planters?category=tower-planters" className="simple-dropdown-item">
                  <span>Tower Planters</span>
                </Link>
                <Link to="/planters?category=germination-tray" className="simple-dropdown-item">
                  <span>Germination Tray</span>
                </Link>
                <Link to="/planters?category=grow-bags" className="simple-dropdown-item">
                  <span>Grow Bags</span>
                </Link>
              </div>
            </div>
            <div className="navbar-item-with-simple-dropdown">
              <NavLink to="/fertilizers" className="navbar-link">
                Fertilizers
              </NavLink>
              
              {/* Fertilizers Simple Dropdown Menu */}
              <div className="planters-simple-dropdown">
                <Link to="/fertilizers?category=coco-bricks" className="simple-dropdown-item">
                  <span>Coco Bricks</span>
                </Link>
                <Link to="/fertilizers?category=compost" className="simple-dropdown-item">
                  <span>Compost</span>
                </Link>
                <Link to="/fertilizers?category=cow-manure" className="simple-dropdown-item">
                  <span>Cow Manure</span>
                </Link>
                <Link to="/fertilizers?category=moist-ball" className="simple-dropdown-item">
                  <span>Moist Ball</span>
                </Link>
                <Link to="/fertilizers?category=moss-stick" className="simple-dropdown-item">
                  <span>Moss Stick</span>
                </Link>
                <Link to="/fertilizers?category=plant-food" className="simple-dropdown-item">
                  <span>Plant Food</span>
                </Link>
              </div>
            </div>
            <NavLink to="/garden-decor" className="navbar-link">
              Garden Decor
            </NavLink>
          </div>
        </nav>

        {/* Right Side: Thin Outline Action Icons */}
        <div className="planters-actions">
          {/* Search Icon */}
          <button className="navbar-action-btn" aria-label="Search">
            <FiSearch size={22} />
          </button>

          {/* Profile Icon */}
          <button className="navbar-action-btn planters-profile-btn" aria-label="Account">
            <FiUser size={22} />
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={openCart}
            className="navbar-action-btn planters-cart-btn"
            aria-label="Cart"
          >
            <FiShoppingCart size={22} />
            <span className="navbar-cart-badge">{cartTotalCount}</span>
          </button>

          {/* Hamburger Menu Toggle (Mobile/Tablet viewports) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="navbar-action-btn planters-hamburger"
            aria-label="Open Menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <div
        className="planters-drawer-overlay"
        style={{ display: mobileMenuOpen ? 'block' : 'none' }}
      >
        {/* Dark backdrop overlay */}
        <div
          className="planters-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer panel */}
        <div
          className="planters-drawer-panel"
          style={{ transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          {/* Header */}
          <div className="planters-drawer-header">
            <img src={logo} alt="Planters Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-action-btn"
              aria-label="Close Menu"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Links list */}
          <nav className="planters-drawer-nav">
            <NavLink
              to="/plants"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link"
            >
              <span>Plants</span>
              <FiChevronRight size={18} />
            </NavLink>
            <NavLink
              to="/seeds"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link"
            >
              <span>Seeds</span>
              <FiChevronRight size={18} />
            </NavLink>
            <NavLink
              to="/planters"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link"
            >
              <span>Planters</span>
              <FiChevronRight size={18} />
            </NavLink>
            <NavLink
              to="/fertilizer"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link"
            >
              <span>Fertilizer</span>
              <FiChevronRight size={18} />
            </NavLink>
            <NavLink
              to="/garden-decor"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link"
            >
              <span>Garden Decor</span>
              <FiChevronRight size={18} />
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
