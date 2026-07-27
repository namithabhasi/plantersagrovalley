
import React, { useState } from "react";
import Navbar from "../COMPONENTS/Navbar";
import Footer from "../COMPONENTS/Footer";

// Fallback high-quality mock products if API fails
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Premium Coconut Coir Pith Block",
    discount: "20% OFF",
    oldPrice: "$24.99",
    newPrice: "$19.99",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Organic Worm Castings Fertilizer",
    discount: "15% OFF",
    oldPrice: "$18.50",
    newPrice: "$15.75",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Neem Cake Organic Plant Food",
    discount: "10% OFF",
    oldPrice: "$12.00",
    newPrice: "$10.80",
    image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Perlite Soil Mix Conditioner",
    discount: "25% OFF",
    oldPrice: "$16.00",
    newPrice: "$12.00",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=60"
  }
];

function Home() {
  const [products] = useState(MOCK_PRODUCTS);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-main text-left">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative w-full h-[500px] overflow-hidden bg-gray-900 flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1600&auto=format&fit=crop&q=80" 
            alt="Agro Valley Hero" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="category-overlay-title block text-lg font-bold tracking-widest text-[#EBF3EC] mb-2 uppercase">
            Nurture Your Crops Naturally
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight max-w-4xl mx-auto mb-6">
            Premium Soil & Organic Farming Solutions
          </h1>
          <p className="text-lg sm:text-xl text-[#EBF3EC] max-w-2xl mx-auto mb-8 font-light">
            We supply high-grade organic fertilizers, soils, and natural amendments to grow healthy, nutrient-rich crops.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="#products" 
              className="bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold py-3 px-8 rounded shadow-lg transition-colors text-sm uppercase tracking-wider"
            >
              Shop Collection
            </a>
            <a 
              href="#benefits" 
              className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded border border-white transition-colors text-sm uppercase tracking-wider"
            >
              Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* Shipping / Microcopy Caption */}
      <div className="w-full bg-[#EBF3EC] py-4 text-center border-b border-[#2E7D32]/10">
        <span className="shipping-caption text-xs uppercase font-bold tracking-widest text-[#06331F]">
          🚚 Same day dispatch on all orders placed before 2:00 PM CST
        </span>
      </div>

      {/* Featured Products Grid */}
      <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="section-title mb-12">
          Featured Agro Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {products.map((product) => (
            <div key={product.id} className="product-card border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Product Media */}
              <div className="product-media relative">
                {product.discount && (
                  <span className="discount-badge">
                    {product.discount}
                  </span>
                )}
                <img src={product.image} alt={product.name} />
              </div>

              {/* Product Info */}
              <div className="product-info p-4 flex flex-col justify-between flex-grow">
                <div>
                  <a href={`/products/${product.id}`} className="product-title font-semibold text-lg hover:underline block mb-2">
                    {product.name}
                  </a>

                  {/* Pricing Row */}
                  <div className="product-price-row flex items-center gap-3">
                    <span className="price-old">{product.oldPrice}</span>
                    <span className="price-new text-xl">{product.newPrice}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="button--small w-full flex items-center justify-center rounded">
                    ADD TO CART
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Benefits and Checklist Section */}
      <section id="benefits" className="py-20 bg-[#EBF3EC]/40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text and visual presentation */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#06331F] leading-tight">
              Empowering Sustainable Agriculture With Natural Nutrition
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At Planters Agro Valley, our commitment lies in restoring soil health and providing farmers with organic alternatives that boost crop yield without harmful environmental effects.
            </p>
            <div className="p-6 bg-white rounded-lg border border-[#2E7D32]/10 shadow-sm flex items-start gap-4">
              <span className="text-3xl">🌱</span>
              <div>
                <h4 className="font-bold text-[#06331F] text-base mb-1">100% Environmentally Safe</h4>
                <p className="text-sm text-gray-600">All of our soil mixtures and products are processed naturally without chemical additives.</p>
              </div>
            </div>
          </div>

          {/* Benefits Section styled exactly as index.css specified */}
          <div className="flex justify-center lg:justify-end">
            <div className="benefits-section w-full max-w-[465px] bg-[#EBF3EC] border border-[#2E7D32]/20 shadow-lg">
              <h3 className="benefits-title mb-6">
                PLANTERS AGRO VALLEY GUARANTEE
              </h3>
              
              <ul className="benefits-list space-y-4">
                <li className="feature-list-item flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>100% Organic & Chemical Free</span>
                </li>
                <li className="feature-list-item flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>High Water-Retention Formulas</span>
                </li>
                <li className="feature-list-item flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Enriched with Micro-nutrients</span>
                </li>
                <li className="feature-list-item flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Tested & Approved by Agri-Experts</span>
                </li>
                <li className="feature-list-item flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Eco-friendly Degradable Bags</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
