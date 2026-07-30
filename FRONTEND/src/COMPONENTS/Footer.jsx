import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaPinterestP, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { FaXTwitter, FaArrowRight } from 'react-icons/fa6'
import axios from '../api/axiosInstance'
import { IoArrowForward } from "react-icons/io5";
function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    pinterest: '',
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const { data } = await axios.get('/settings');
        if (data.success && data.settings?.socialLinks) {
          setSocialLinks(data.settings.socialLinks);
        }
      } catch (error) {
        console.error('Failed to load social links in footer', error);
      }
    };
    fetchSocialLinks();
  }, []);

  return (
    <footer className="w-full bg-[#063B22] text-white">

      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-[70px] py-[70px]">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">

          {/* Company */}
          <div>
            <h3 className="uppercase tracking-[3px] text-[15px] font-semibold mb-8">
              Company
            </h3>

            <ul className="space-y-5">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/our-story" className="text-gray-300 hover:text-white">Our Story</Link></li>
              <li><Link to="/faqs" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link to="/blogs" className="text-gray-300 hover:text-white">Blogs</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="uppercase tracking-[3px] text-[15px] font-semibold mb-8">
              Get Help
            </h3>

            <ul className="space-y-5">
              <li><Link to="/track-order" className="text-gray-300 hover:text-white">Track Order</Link></li>
              <li><Link to="/cancel-refund" className="text-gray-300 hover:text-white">Cancel & Refund</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="uppercase tracking-[3px] text-[15px] font-semibold mb-8">
              Services
            </h3>

            <ul className="space-y-5">
              <li><Link to="/corporate-gifting" className="text-gray-300 hover:text-white">Corporate Gifting</Link></li>
              <li><Link to="/plant-rental" className="text-gray-300 hover:text-white">Plant Rental</Link></li>
              <li><Link to="/garden-maintenance" className="text-gray-300 hover:text-white">Garden Maintenance</Link></li>
              <li><Link to="/vertical-garden" className="text-gray-300 hover:text-white">Vertical Garden</Link></li>
              <li><Link to="/balcony-garden" className="text-gray-300 hover:text-white">Balcony Garden</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>

            <h3 className="uppercase tracking-[3px] text-[15px] font-semibold mb-8">
              Exclusive Benefits
            </h3>

            <div className="flex items-center border-b border-white/40 pb-3">

              <input
                type="email"
                placeholder="Enter email here"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-300 text-white !border-none !p-0"
              />

              <button className="ml-3">
                <IoArrowForward size={20} />
              </button>

            </div>

            <p className="mt-6 text-gray-300 leading-8">
              Apply for our free membership to receive exclusive
              deals, news and events.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-6 text-lg text-[#cbd5e1]">
              <a href={socialLinks.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF size={16} />
              </a>
              <a href={socialLinks.twitter || "https://x.com"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X (Twitter)">
                <FaXTwitter size={16} />
              </a>
              <a href={socialLinks.pinterest || "https://pinterest.com"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Pinterest">
                <FaPinterestP size={16} />
              </a>
              <a href={socialLinks.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href={socialLinks.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedinIn size={16} />
              </a>
              <a href={socialLinks.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
                <FaYoutube size={16} />
              </a>
            </div>

          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/10">
          <p className="text-gray-300 text-sm">
            © 2026, Planters Agro Valley. All rights reserved.
          </p>
        </div>

      </div>

    </footer>
  );
};

export default Footer;