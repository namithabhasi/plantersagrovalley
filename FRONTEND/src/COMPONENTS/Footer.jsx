import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-[#06331F] text-[#EBF3EC] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#2E7D32]/20 font-main">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2 mb-4">
            🌱 PLANTERS <span className="font-extralight text-[#2E7D32]">AGRO VALLEY</span>
          </span>
          <p className="text-sm text-[#EBF3EC]/80 leading-relaxed max-w-sm">
            Planters Agro Valley brings you premium organic fertilizers, top-grade soil mixes, and elite agricultural supplies directly from nature to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Shop & Browse</h4>
          <ul className="space-y-2 text-sm text-[#EBF3EC]/85">
            <li>
              <a href="/#products" className="hover:text-white transition-colors">Featured Products</a>
            </li>
            <li>
              <a href="/#benefits" className="hover:text-white transition-colors">Our Benefits</a>
            </li>
            <li>
              <a href="/admin" className="hover:text-white transition-colors">Management Portal</a>
            </li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Info</h4>
          <ul className="space-y-2 text-sm text-[#EBF3EC]/85">
            <li>📧 support@plantersagrovalley.com</li>
            <li>📞 +1 (555) 019-2834</li>
            <li>📍 100 Valley Road, Green Hills</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#EBF3EC]/10 text-center text-xs text-[#EBF3EC]/60">
        &copy; {new Date().getFullYear()} Planters Agro Valley. All rights reserved. Made with love for nature.
      </div>
    </footer>
  );
}

export default Footer;
