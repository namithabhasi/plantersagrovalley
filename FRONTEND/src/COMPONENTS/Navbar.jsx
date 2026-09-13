import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/logo.png'; // The text logo is saved in logo.png
import bush from '../assets/image.png'; // Background bush growing from the bottom-left corner
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight, FiChevronDown, FiLayout, FiLogOut, FiHeart, FiShoppingBag, FiMapPin, FiNavigation, FiRotateCcw, FiTruck, FiCheckCircle, FiLayers } from 'react-icons/fi';
import { FaMagic } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from '../api/axiosInstance';
import { openAuthModal, clearUser } from '../redux/auth/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forceClose, setForceClose] = useState(false);
  const { openCart, cartTotalCount } = useCart();
  const [dbLogo, setDbLogo] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchInputRef = React.useRef(null);
  const mobileSearchInputRef = React.useRef(null);
  const location = useLocation();

  // Delivery Pincode & Location (Geomapping) State - Default to North Paravur (683513)
  const [userPincode, setUserPincode] = useState(() => localStorage.getItem('planters_user_pincode') || '683513');
  const [userCity, setUserCity] = useState(() => localStorage.getItem('planters_user_city') || 'North Paravur, Ernakulam, Kerala');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [inputPincode, setInputPincode] = useState(userPincode);
  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => sessionStorage.getItem('planters_top_banner_dismissed') === 'true');

  const handleCheckPincode = async (codeToTest) => {
    const targetCode = codeToTest || inputPincode;
    if (!targetCode || !/^\d{6}$/.test(targetCode.trim())) {
      setPincodeInfo({ error: "Please enter a valid 6-digit Indian Pincode." });
      return;
    }
    setIsGeoLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${targetCode.trim()}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const detectedCity = po.District || po.Name || "India";
        const detectedState = po.State || "";
        const cityStateStr = `${detectedCity}${detectedState ? ', ' + detectedState : ''}`;
        
        setUserPincode(targetCode.trim());
        setUserCity(cityStateStr);
        localStorage.setItem('planters_user_pincode', targetCode.trim());
        localStorage.setItem('planters_user_city', cityStateStr);
        
        setPincodeInfo({
          success: true,
          city: cityStateStr,
          pincode: targetCode.trim(),
          deliveryEst: "Standard 2 - 3 Days Delivery",
          cod: "Cash on Delivery Available",
          freeShip: "Eligible for Free Shipping above ₹499"
        });
      } else {
        const cityStr = `PIN ${targetCode.trim()}`;
        setUserPincode(targetCode.trim());
        setUserCity(cityStr);
        localStorage.setItem('planters_user_pincode', targetCode.trim());
        localStorage.setItem('planters_user_city', cityStr);
        setPincodeInfo({
          success: true,
          city: cityStr,
          pincode: targetCode.trim(),
          deliveryEst: "Standard 3 - 4 Days Delivery",
          cod: "Cash on Delivery Available",
          freeShip: "Eligible for Free Shipping above ₹499"
        });
      }
    } catch (err) {
      const cityStr = `PIN ${targetCode.trim()}`;
      setUserPincode(targetCode.trim());
      setUserCity(cityStr);
      localStorage.setItem('planters_user_pincode', targetCode.trim());
      localStorage.setItem('planters_user_city', cityStr);
      setPincodeInfo({
        success: true,
        city: cityStr,
        pincode: targetCode.trim(),
        deliveryEst: "Standard 3 - 4 Days Delivery",
        cod: "Cash on Delivery Available",
        freeShip: "Eligible for Free Shipping above ₹499"
      });
    } finally {
      setIsGeoLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setPincodeInfo({ error: "Geolocation is not supported by your browser." });
      return;
    }
    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const geoData = await response.json();
          const postcode = geoData.address?.postcode || '560001';
          
          const cleanPin = postcode.replace(/\s+/g, '').slice(0, 6);
          const validPin = /^\d{6}$/.test(cleanPin) ? cleanPin : '560001';
          
          setInputPincode(validPin);
          handleCheckPincode(validPin);
        } catch (e) {
          setInputPincode('560001');
          handleCheckPincode('560001');
        }
      },
      (error) => {
        setIsGeoLoading(false);
        setPincodeInfo({ error: "Could not detect location automatically. Please enter pincode." });
      }
    );
  };

  const handleResetLocation = () => {
    localStorage.removeItem('planters_user_pincode');
    localStorage.removeItem('planters_user_city');
    setUserPincode('683513');
    setUserCity('North Paravur, Ernakulam, Kerala');
    setInputPincode('683513');
    setPincodeInfo({
      success: true,
      city: 'North Paravur, Ernakulam, Kerala',
      pincode: '683513',
      deliveryEst: "Standard 2 - 3 Days Delivery",
      cod: "Cash on Delivery Available",
      freeShip: "Eligible for Free Shipping above ₹499",
      isReset: true
    });
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    sessionStorage.setItem('planters_top_banner_dismissed', 'true');
  };

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const q = params.get('q') || '';
      setSearchOpen(true);
      setSearchVal(q);
    } else {
      setSearchOpen(false);
      setSearchVal('');
    }
  }, [location]);

  useEffect(() => {
    if (searchOpen) {
      if (searchInputRef.current) searchInputRef.current.focus();
      if (mobileSearchInputRef.current) mobileSearchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchVal('');
    navigate('/search?q=');
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (!user) {
      dispatch(openAuthModal("login"));
    } else {
      setProfileDropdownOpen(!profileDropdownOpen);
    }
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(clearUser());
      navigate("/");
    }
  };

  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleOutsideClick = () => setProfileDropdownOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [profileDropdownOpen]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await axios.get('/settings');
        if (data.success && data.settings?.storeLogo?.url) {
          setDbLogo(data.settings.storeLogo.url);
        }
      } catch (error) {
        console.error('Failed to load store logo in navbar', error);
      }
    };
    fetchLogo();
  }, []);

  const handleLinkClick = () => {
    setForceClose(true);
    setTimeout(() => setForceClose(false), 300);
  };

  return (
    <header className="planters-header select-none relative">
      {/* Background growing bush illusion */}
      <img src={bush} alt="" className="planters-nav-bush" />

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-4 min-[1024px]:hidden">
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-3">
            <FiSearch size={20} className="text-[var(--color-primary-dark)] flex-shrink-0" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search plants, seeds, planters..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full py-1.5 font-[var(--font-family-base)] text-sm border-b border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none bg-white text-[var(--color-text-main)]"
            />
            {searchVal && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                aria-label="Clear text"
              >
                <FiX size={16} />
              </button>
            )}
            <button 
              type="button" 
              onClick={() => setSearchOpen(false)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] text-xs font-semibold uppercase tracking-wider flex-shrink-0"
              aria-label="Close search"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="container">

        {/* Left Side: Logo */}
        <Link to="/" className="planters-logo-container">
          <img
            src={dbLogo || logo}
            alt="Planters Logo"
            className="planters-logo"
          />
        </Link>

        {/* Center: Desktop Navigation Links (Clean layout with proper spacing and no line separators) */}
        <nav className="planters-nav">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-[350px] lg:w-[480px] gap-2">
              <div className="relative flex-grow">
                <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for plants, seeds, planters, fertilizers..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{ paddingLeft: '42px', paddingRight: '36px' }}
                  className="w-full py-1.5 font-[var(--font-family-base)] text-sm border border-[var(--color-border)] rounded-[var(--radius-xs)] outline-none focus:border-[var(--color-primary)] bg-white text-[var(--color-text-main)] transition-all"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                    aria-label="Clear search text"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors text-xs font-semibold uppercase tracking-wider"
                aria-label="Close search"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="planters-nav-links">
              <div className="navbar-item-with-dropdown">
                <NavLink to="/plants" className="navbar-link">
                  Plants
                </NavLink>

                {/* Mega Dropdown Menu */}
                <div className={`planters-mega-dropdown ${forceClose ? 'force-close' : ''}`} onClick={handleLinkClick}>
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
                        <li><Link to="/plants?category=flowering-plants">Top 10 Flowering Plants</Link></li>
                        <li><Link to="/plants?category=fragrant-plants">Top 10 Fragrant Plants</Link></li>
                        <li><Link to="/plants?category=outdoor-plants">Top 10 Hardy Plants</Link></li>
                      </ul>
                    </div>

                  </div>
                </div>
              </div>

              {/* Seeds dropdown */}
              <div className="navbar-item-with-simple-dropdown">
                <NavLink to="/seeds" className="navbar-link">
                  Seeds
                </NavLink>
                <div className={`planters-simple-dropdown ${forceClose ? 'force-close' : ''}`} onClick={handleLinkClick}>
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

              {/* Planters dropdown */}
              <div className="navbar-item-with-simple-dropdown">
                <NavLink to="/planters" className="navbar-link">
                  Planters
                </NavLink>
                <div className={`planters-simple-dropdown ${forceClose ? 'force-close' : ''}`} onClick={handleLinkClick}>
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

              {/* Fertilizers dropdown */}
              <div className="navbar-item-with-simple-dropdown">
                <NavLink to="/fertilizers" className="navbar-link">
                  Fertilizers
                </NavLink>
                <div className={`planters-simple-dropdown ${forceClose ? 'force-close' : ''}`} onClick={handleLinkClick}>
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

              {/* Garden Decor dropdown */}
              <div className="navbar-item-with-simple-dropdown">
                <NavLink to="/garden-decor" className="navbar-link">
                  Garden Decor
                </NavLink>
                <div className={`planters-simple-dropdown ${forceClose ? 'force-close' : ''}`} onClick={handleLinkClick}>
                  <Link to="/garden-decor?category=bird-houses" className="simple-dropdown-item">
                    <span>Bird Houses</span>
                  </Link>
                  <Link to="/garden-decor?category=fairy-garden" className="simple-dropdown-item">
                    <span>Fairy Garden</span>
                  </Link>
                  <Link to="/garden-decor?category=garden-fountains" className="simple-dropdown-item">
                    <span>Garden Fountains</span>
                  </Link>
                  <Link to="/garden-decor?category=garden-tools" className="simple-dropdown-item">
                    <span>Garden Tools</span>
                  </Link>
                  <Link to="/garden-decor?category=pebbles" className="simple-dropdown-item">
                    <span>Pebbles</span>
                  </Link>
                  <Link to="/garden-decor?category=pot-stands" className="simple-dropdown-item">
                    <span>Pot Stands</span>
                  </Link>
                  <Link to="/garden-decor?category=terrarium-garden" className="simple-dropdown-item">
                    <span>Terrarium Garden</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Right Side: Thin Outline Action Icons */}
        <div className="planters-actions">
          {/* Location Pin Icon */}
          <button 
            onClick={() => navigate('/suggestions')} 
            className="navbar-action-btn flex items-center gap-1 cursor-pointer" 
            aria-label="Plant Recommendations & Delivery Location"
            title={`Plants that love your place - ${userPincode} (${userCity.split(',')[0]})`}
          >
            <FiMapPin size={21} />
          </button>

          {/* Search Icon */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="navbar-action-btn" 
            aria-label="Search"
          >
            <FiSearch size={22} />
          </button>

          {/* Profile Action */}
          <div className="relative planters-profile-wrapper">
            {user ? (
              <button
                onClick={handleProfileClick}
                className="navbar-action-btn planters-profile-btn flex items-center justify-center relative cursor-pointer p-0"
                style={{ padding: 0, border: 'none', background: 'transparent' }}
                aria-label="Account Menu"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full object-cover border border-[#06492d20] shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-dark)] text-white flex items-center justify-center text-sm font-semibold uppercase shadow-sm border border-[#06492d20]">
                    {user.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </button>
            ) : (
              <Link
                to="/signin"
                className="navbar-action-btn planters-profile-btn flex items-center justify-center"
                aria-label="Account"
              >
                <FiUser size={22} />
              </Link>
            )}

            {/* Profile Dropdown Menu */}
            {user && profileDropdownOpen && (
              <div className="planters-profile-dropdown">
                <div className="planters-profile-dropdown-header">
                  <p className="planters-profile-dropdown-name truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="planters-profile-dropdown-email truncate">
                    {user.email}
                  </p>
                </div>
                <div className="planters-profile-dropdown-items">
                  {user.role && (user.role === 'admin' || user.role === 'super-admin' || user.role === 'shipping-manager') && (
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="planters-profile-dropdown-item"
                    >
                      <FiLayout size={14} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="planters-profile-dropdown-item"
                  >
                    <FiUser size={14} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="planters-profile-dropdown-item"
                  >
                    <FiHeart size={14} />
                    <span>Wishlist</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="planters-profile-dropdown-item"
                  >
                    <FiShoppingBag size={14} />
                    <span>Orders</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="planters-profile-dropdown-item logout-btn"
                  >
                    <FiLogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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
            <img src={dbLogo || logo} alt="Planters Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
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
              to="/custom-plant"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link font-semibold text-[#06492D] bg-[#06492d0d]"
            >
              <span className="flex items-center gap-2">🌿 Custom Garden Kit</span>
              <FiChevronRight size={18} />
            </NavLink>
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
              to="/fertilizers"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-link planters-drawer-link"
            >
              <span>Fertilizers</span>
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

          {/* Mobile Profile & Logout Section */}
          <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.firstName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-dark)] text-white flex items-center justify-center text-base font-semibold shadow-sm uppercase border border-gray-100">
                      {user.firstName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.role && (user.role === 'admin' || user.role === 'super-admin' || user.role === 'shipping-manager') && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-semibold text-[#06492D] bg-[#06492d0d] hover:bg-[#06492d1a]"
                  >
                    Go to Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <FiUser size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <FiHeart size={16} />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <FiShoppingBag size={16} />
                  <span>Orders</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer border-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#06492D] hover:bg-[#053e26] border-none"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="auth-modal-overlay" style={{ display: 'flex' }} onClick={() => setShowLogoutConfirm(false)}>
          <div className="auth-modal-card" style={{ maxWidth: '360px', padding: '24px', textAlign: 'center', gap: '16px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#06492D', margin: 0 }}>Confirm Logout</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Are you sure you want to log out of your account?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  background: 'transparent',
                  color: '#666',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#06492D',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location & Delivery Estimator Modal */}
      {locationModalOpen && (
        <div className="auth-modal-overlay" style={{ display: 'flex' }} onClick={() => setLocationModalOpen(false)}>
          <div 
            className="auth-modal-card" 
            style={{ maxWidth: '440px', padding: '24px', borderRadius: '16px', position: 'relative' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setLocationModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#888' }}
              aria-label="Close Location Modal"
            >
              <FiX size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#06492d15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06492D', flexShrink: 0 }}>
                <FiMapPin size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#06492D', margin: 0 }}>Delivery Location Estimator</h3>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Check delivery speed & COD availability for your pincode</p>
              </div>
            </div>

            {/* Input & Check form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckPincode();
              }}
              style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}
            >
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                value={inputPincode}
                onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isGeoLoading}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#06492D',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: isGeoLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isGeoLoading ? 'Checking...' : 'Check'}
              </button>
            </form>

            {/* Auto detect location button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isGeoLoading}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                border: '1px dashed #06492D',
                background: '#06492d08',
                color: '#06492D',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '16px'
              }}
            >
              <FiNavigation size={14} />
              <span>{isGeoLoading ? 'Detecting Location...' : 'Use My Current Location'}</span>
            </button>

            {/* Pincode Info Card */}
            {pincodeInfo && (
              <div style={{ padding: '14px', borderRadius: '10px', background: pincodeInfo.error ? '#fef2f2' : '#f0fdf4', border: `1px solid ${pincodeInfo.error ? '#fecaca' : '#bbf7d0'}`, marginBottom: '16px' }}>
                {pincodeInfo.error ? (
                  <p style={{ color: '#dc2626', fontSize: '13px', margin: 0, fontWeight: 500 }}>{pincodeInfo.error}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#06492D' }}>
                        📍 {pincodeInfo.city} ({pincodeInfo.pincode})
                      </span>
                      <span style={{ fontSize: '11px', background: '#06492D', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#166534' }}>
                      <FiTruck size={14} />
                      <span>{pincodeInfo.deliveryEst}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#166534' }}>
                      <FiCheckCircle size={14} />
                      <span>{pincodeInfo.cod}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#166534' }}>
                      <FiCheckCircle size={14} />
                      <span>{pincodeInfo.freeShip}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action & Undo Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #eee' }}>
              <button
                type="button"
                onClick={handleResetLocation}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  background: 'transparent',
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Reset location back to default Bengaluru"
              >
                <FiRotateCcw size={12} />
                <span>Reset Location (Undo)</span>
              </button>

              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#06492D',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
