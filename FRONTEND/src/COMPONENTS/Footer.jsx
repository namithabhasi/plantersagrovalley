import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";

const Footer = () => {
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

            <div className="flex gap-6 mt-8 text-2xl">

              <FaFacebookF className="cursor-pointer hover:text-white" />
              <FaXTwitter className="cursor-pointer hover:text-white" />
              <FaPinterestP className="cursor-pointer hover:text-white" />
              <FaInstagram className="cursor-pointer hover:text-white" />
              <FaLinkedinIn className="cursor-pointer hover:text-white" />
              <FaYoutube className="cursor-pointer hover:text-white" />

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