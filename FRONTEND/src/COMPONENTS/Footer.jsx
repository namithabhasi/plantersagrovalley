import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaPinterestP, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { FaXTwitter, FaArrowRight } from 'react-icons/fa6'

function Footer() {
  return (
    <footer className="footer bg-[var(--color-primary-dark)] text-white py-16 border-t border-[var(--color-border)]">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {/* Column 1 - Company */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-family-heading)] text-xs font-bold tracking-[2px] text-white uppercase mb-6">
              COMPANY
            </h4>
            <ul className="space-y-4 font-[var(--font-family-base)] text-sm text-[#cbd5e1]">
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/our-story" className="hover:text-white transition-colors duration-200">Our Story</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors duration-200">Faqs</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors duration-200">Blogs</Link></li>
            </ul>
          </div>

          {/* Column 2 - Get Help */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-family-heading)] text-xs font-bold tracking-[2px] text-white uppercase mb-6">
              GET HELP
            </h4>
            <ul className="space-y-4 font-[var(--font-family-base)] text-sm text-[#cbd5e1]">
              <li><Link to="/track-order" className="hover:text-white transition-colors duration-200">Track Order</Link></li>
              <li><Link to="/cancel-refund" className="hover:text-white transition-colors duration-200">Cancel & Refund</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors duration-200">Terms & Conditions</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-family-heading)] text-xs font-bold tracking-[2px] text-white uppercase mb-6">
              SERVICES
            </h4>
            <ul className="space-y-4 font-[var(--font-family-base)] text-sm text-[#cbd5e1]">
              <li><Link to="/corporate-gifting" className="hover:text-white transition-colors duration-200">Corporate Gifting</Link></li>
              <li><Link to="/plant-rental" className="hover:text-white transition-colors duration-200">Plant Rental</Link></li>
              <li><Link to="/garden-maintenance" className="hover:text-white transition-colors duration-200">Garden Maintenance</Link></li>
              <li><Link to="/vertical-garden" className="hover:text-white transition-colors duration-200">Vertical Garden</Link></li>
              <li><Link to="/balcony-garden" className="hover:text-white transition-colors duration-200">Balcony Garden</Link></li>
            </ul>
          </div>

          {/* Column 4 - Exclusive Benefits */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-family-heading)] text-xs font-bold tracking-[2px] text-white uppercase mb-6">
              EXCLUSIVE BENEFITS
            </h4>
            <div className="relative border-b border-gray-500 pb-2 flex items-center justify-between mb-4 w-full max-w-[260px]">
              <input
                type="email"
                placeholder="Enter email here"
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full text-sm font-[var(--font-family-base)]"
              />
              <button className="text-white hover:text-gray-300 ml-2" aria-label="Subscribe">
                <FaArrowRight size={14} />
              </button>
            </div>
            <p className="font-[var(--font-family-base)] text-xs text-[#cbd5e1] leading-relaxed mb-6 w-full max-w-[260px]">
              Apply for our free membership to receive exclusive deals, news, and events.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-6 text-lg text-[#cbd5e1]">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF size={16} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X (Twitter)">
                <FaXTwitter size={16} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Pinterest">
                <FaPinterestP size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedinIn size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#cbd5e1] font-[var(--font-family-base)]">
          <p>&copy; {new Date().getFullYear()}, Planters Agro Valley. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
