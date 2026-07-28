import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // The text logo is saved in logo.png
import bush from '../assets/image.png'; // Background bush growing from the bottom-left corner
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
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
            <NavLink to="/plants" className="navbar-link">
              Plants
            </NavLink>
            <NavLink to="/seeds" className="navbar-link">
              Seeds
            </NavLink>
            <NavLink to="/planters" className="navbar-link">
              Planters
            </NavLink>
            <NavLink to="/fertilizer" className="navbar-link">
              Fertilizer
            </NavLink>
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
