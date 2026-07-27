import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full font-main">
      {/* Announcement Bar */}
      <div className="w-full bg-[#06331F] text-[#EBF3EC] py-2 px-4 text-center text-xs tracking-widest font-semibold uppercase">
        🌿 Free Shipping on Orders Over $50! Direct from Our Valleys 🌿
      </div>

      {/* Main Header Container */}
      <div className="w-full border-b border-[#EBF3EC] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo / Branding */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#06331F] flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              PLANTERS <span className="font-extralight text-[#2E7D32]">AGRO VALLEY</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm font-semibold text-[#06331F] hover:text-[#2E7D32] transition-colors">
              Home
            </Link>
            
            {/* Catalog Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-semibold text-[#06331F] hover:text-[#2E7D32] transition-colors focus:outline-none"
              >
                Shop Categories
                <span className="text-[10px]">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black/5 divide-y divide-gray-100 z-50">
                  <div className="py-1">
                    <Link to="/#products" className="sub-nav-item block px-4 py-2 hover:bg-[#EBF3EC]">
                      Organic Fertilizers
                    </Link>
                    <Link to="/#products" className="sub-nav-item block px-4 py-2 hover:bg-[#EBF3EC]">
                      Premium Soil Mixes
                    </Link>
                    <Link to="/#products" className="sub-nav-item block px-4 py-2 hover:bg-[#EBF3EC]">
                      Seeds & Bulbs
                    </Link>
                    <Link to="/#products" className="sub-nav-item block px-4 py-2 hover:bg-[#EBF3EC]">
                      Garden Tools
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/#benefits" className="text-sm font-semibold text-[#06331F] hover:text-[#2E7D32] transition-colors">
              Why Us
            </Link>
          </nav>

          {/* Right Header Elements */}
          <div className="flex items-center space-x-6">
            <Link to="/admin" className="text-xs font-semibold text-[#2E7D32] hover:text-[#06331F] border border-[#2E7D32] px-3 py-1.5 rounded-full transition-all">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
