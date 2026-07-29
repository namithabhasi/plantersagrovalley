import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoArrowForward, IoArrowUp } from "react-icons/io5";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="w-full bg-[#042817] text-white font-[var(--font-family-base)] select-none">
      
      <div className="container mx-auto">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Company */}
          <div>
            <h3 className="uppercase tracking-[2px] text-xs sm:text-sm font-normal text-white mb-6">
              Company
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link to="/about" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="uppercase tracking-[2px] text-xs sm:text-sm font-normal text-white mb-6">
              Get Help
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link to="/track-order" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/cancel-refund" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Cancel &amp; Refund
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="uppercase tracking-[2px] text-xs sm:text-sm font-normal text-white mb-6">
              Services
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link to="/corporate-gifting" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Corporate Gifting
                </Link>
              </li>
              <li>
                <Link to="/plant-rental" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Plant Rental
                </Link>
              </li>
              <li>
                <Link to="/garden-maintenance" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Garden Maintenance
                </Link>
              </li>
              <li>
                <Link to="/vertical-garden" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Vertical Garden
                </Link>
              </li>
              <li>
                <Link to="/balcony-garden" className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors duration-200">
                  Balcony Garden
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="uppercase tracking-[2px] text-xs sm:text-sm font-normal text-white mb-6">
              Exclusive Benefits
            </h3>
            
            <div className="footer-newsletter-input-wrapper flex items-center border-b border-white/20 pb-2.5 focus-within:border-white/50 transition-colors mt-3 sm:mt-4">
              <input
                type="email"
                placeholder="Enter email here"
                className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-white/50 text-white !border-none !p-0"
              />
              <button className="text-white hover:text-white/80 transition-colors ml-3">
                <IoArrowForward size={18} />
              </button>
            </div>

            <p className="footer-newsletter-text mt-6 leading-relaxed font-light">
              Apply for our free membership to receive exclusive deals, news, and events.
            </p>

            <div className="footer-newsletter-socials flex gap-5 mt-8 text-[18px] text-white">
              <FaFacebookF className="cursor-pointer hover:text-white/80 transition-colors duration-200" />
              <FaXTwitter className="cursor-pointer hover:text-white/80 transition-colors duration-200" />
              <FaPinterestP className="cursor-pointer hover:text-white/80 transition-colors duration-200" />
              <FaInstagram className="cursor-pointer hover:text-white/80 transition-colors duration-200" />
              <FaLinkedinIn className="cursor-pointer hover:text-white/80 transition-colors duration-200" />
              <FaYoutube className="cursor-pointer hover:text-white/80 transition-colors duration-200" />
            </div>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-[11px] font-light tracking-wide">
            &copy; 2026, Planters Agro Valley. All rights reserved.
          </p>
        </div>

      </div>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 rounded-full bg-[#1b7a42] text-white shadow-lg hover:bg-[#2da15d] transition-all duration-300 flex items-center justify-center cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <IoArrowUp size={20} />
        </button>
      )}

    </footer>
  );
};

export default Footer;