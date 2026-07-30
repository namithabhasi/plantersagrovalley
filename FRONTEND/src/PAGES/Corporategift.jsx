import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaGoogle, FaMicrosoft, FaApple, FaAmazon, FaSalesforce, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';

// Import Assets
import corporateGiftImg from '../assets/corporategift.png';
import engraveImg from '../assets/corporate/image.png';
import cardImg from '../assets/corporate/image copy.png';
import boxImg from '../assets/corporate/image copy 2.png';

function Corporategift() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    }
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = 'You must agree to the Privacy Policy';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      toast.success('Your corporate enquiry has been submitted successfully!');
      setFormData({ name: '', email: '', phone: '', comment: '', agreePrivacy: false });
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again.');
    }
  };

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-form-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white font-[var(--font-family-base)] select-none">

      {/* Dynamic Scrolling Animation Styling */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. Hero / Title Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100 flex items-center" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

            {/* Left Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1
                className="font-[var(--font-family-heading)] text-3xl md:text-[40px] font-normal leading-tight text-[var(--color-primary-dark)]"
                style={{ marginBottom: '24px' }}
              >
                Corporate Plant Gifts [Bulk]
              </h1>
              <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg">
                Stand out with corporate plant gifts for employees and clients.
                Customize gift plants with your logo on pots, cards, and packaging.
                Book now for meaningful green gifting!
              </p>
              <div className="w-full md:w-auto" style={{ marginTop: '32px' }}>
                <a
                  href="#contact-form-section"
                  onClick={handleScrollToContact}
                  className="btn btn-primary w-full md:w-auto px-10 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-none hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Send Enquiry!
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full flex justify-center">
              <img
                src={corporateGiftImg}
                alt="Corporate Plant Gifts Hero"
                className="w-full max-w-[500px] h-auto object-cover rounded-none shadow-sm border border-gray-100"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Our Clients Section with Infinite Auto-Scrolling Marquee */}
      <section className="bg-white border-b border-gray-100" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container mx-auto flex flex-col items-center">
          <h2
            className="font-[var(--font-family-heading)] text-xl md:text-2xl font-semibold tracking-wide text-[#2c3e50] uppercase text-center"
            style={{ marginBottom: '48px' }}
          >
            OUR CLIENTS
          </h2>

          {/* Auto Scrolling Marquee container */}
          <div className="w-full overflow-hidden relative py-6 bg-gray-50/50 border-y border-gray-100/60">
            <div className="animate-marquee flex items-center gap-16 md:gap-24">

              {/* First Logo Track */}
              <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#4285F4] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaGoogle size={20} /> GOOGLE
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#F25022] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaMicrosoft size={18} /> MICROSOFT
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#A2AAAD] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaApple size={20} /> APPLE
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#FF9900] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaAmazon size={20} /> AMAZON
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#00a1e0] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaSalesforce size={22} /> SALESFORCE
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#333333] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaGithub size={20} /> GITHUB
                </span>
              </div>

              {/* Second Loop Logo Track (Duplicate for seamless loop) */}
              <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#4285F4] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaGoogle size={20} /> GOOGLE
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#F25022] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaMicrosoft size={18} /> MICROSOFT
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#A2AAAD] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaApple size={20} /> APPLE
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#FF9900] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaAmazon size={20} /> AMAZON
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#00a1e0] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaSalesforce size={22} /> SALESFORCE
                </span>
                <span className="text-sm font-semibold tracking-[4px] uppercase text-gray-400 hover:text-[#333333] transition-colors duration-200 cursor-default flex items-center gap-3 select-none">
                  <FaGithub size={20} /> GITHUB
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Plant Gifts Customization Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container mx-auto">
          <div className="text-center">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)]"
              style={{ marginBottom: '48px' }}
            >
              Plant Gifts Customization
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto justify-items-center">
            {/* Customization 1 */}
            <div className="product-card-wrapper max-w-[var(--card-max-width)] w-full">
              <div className="product-card w-full">
                <div className="product-card-image">
                  <img src={engraveImg} alt="Engrave Logo & Sticker" />
                </div>
                <div className="product-card-content text-center">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                    Engrave Logo &amp; Sticker
                  </h4>
                  <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Select from wide range of plants &amp; pots. Add your corporate identity on the product.
                  </p>
                </div>
              </div>
            </div>

            {/* Customization 2 */}
            <div className="product-card-wrapper max-w-[var(--card-max-width)] w-full">
              <div className="product-card w-full">
                <div className="product-card-image">
                  <img src={cardImg} alt="Personalised Message Card" />
                </div>
                <div className="product-card-content text-center">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                    Personalised Message Card
                  </h4>
                  <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Feel happy your employee and partner on special occasions by personalized card.
                  </p>
                </div>
              </div>
            </div>

            {/* Customization 3 */}
            <div className="product-card-wrapper max-w-[var(--card-max-width)] w-full">
              <div className="product-card w-full">
                <div className="product-card-image">
                  <img src={boxImg} alt="Customize Packaging Box" />
                </div>
                <div className="product-card-content text-center">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                    Customize Packaging Box
                  </h4>
                  <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Fully customized gift box as per requirement, including printing &amp; designing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white border-b border-gray-100" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="text-center">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)]"
              style={{ marginBottom: '48px' }}
            >
              How It Works
            </h2>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-stretch gap-10 md:gap-6 max-w-5xl mx-auto w-full mt-4">
            {/* Desktop Connecting Line (horizontal) */}
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-[2px] border-t-2 border-dashed border-[var(--color-primary-light)]/40 z-0"></div>

            {/* Mobile Connecting Line (vertical, left side) */}
            <div className="md:hidden absolute top-8 bottom-8 left-[31px] w-[2px] border-l-2 border-dashed border-[var(--color-primary-light)]/40 z-0"></div>

            {/* Step 1 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-5 md:gap-0 w-full relative z-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-dark)] font-bold text-lg mb-0 md:mb-5 shadow-sm">
                1
              </div>
              <div className="flex flex-col">
                <h4 className="font-[var(--font-family-heading)] text-sm md:text-xs font-semibold tracking-wider text-gray-800 uppercase mb-2 md:mb-3">
                  Choose Your Product
                </h4>
                <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                  Choose Plant, Pot, as well as the soil mix that you like the most. We'll guide you through choosing the perfect plant gifts to fit your corporate needs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-5 md:gap-0 w-full relative z-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-dark)] font-bold text-lg mb-0 md:mb-5 shadow-sm">
                2
              </div>
              <div className="flex flex-col">
                <h4 className="font-[var(--font-family-heading)] text-sm md:text-xs font-semibold tracking-wider text-gray-800 uppercase mb-2 md:mb-3">
                  Customize It
                </h4>
                <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                  Make your gifts even more meaningful by customizing the pot with your logo, a personalized card with message, or even packaging box. You can add plants accessories as well.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-5 md:gap-0 w-full relative z-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-dark)] font-bold text-lg mb-0 md:mb-5 shadow-sm">
                3
              </div>
              <div className="flex flex-col">
                <h4 className="font-[var(--font-family-heading)] text-sm md:text-xs font-semibold tracking-wider text-gray-800 uppercase mb-2 md:mb-3">
                  Sit Back and Relax
                </h4>
                <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                  We will hand-deliver your order to your recipient list, right to their doorstep. We ensures that your corporate gifts have a great trip to their destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Form Section */}
      <section id="contact-form-section" className="bg-[var(--color-primary-bg)]" style={{ paddingTop: '100px', paddingBottom: '120px' }}>
        <div className="container mx-auto max-w-[800px]">
          <div className="text-left">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[#2c3e50] tracking-wide uppercase"
              style={{ marginBottom: '40px' }}
            >
              Contact Us!
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className={`w-full bg-white border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 focus:border-[#06492D] ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.name && <span className="text-[10px] text-red-600 mt-0.5">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full bg-white border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 focus:border-[#06492D] ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.email && <span className="text-[10px] text-red-600 mt-0.5">{errors.email}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className={`w-full bg-white border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 focus:border-[#06492D] ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                  }`}
              />
              {errors.phone && <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <textarea
                name="comment"
                rows={6}
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Comment"
                className={`w-full bg-white border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 resize-none focus:border-[#06492D] ${errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                  }`}
              />
              {errors.comment && <span className="text-[10px] text-red-600 mt-0.5">{errors.comment}</span>}
            </div>

            {/* Privacy Checkbox */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer group text-gray-400 font-light text-[11px]">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 flex items-center justify-center border rounded-none transition-all duration-200 ${formData.agreePrivacy ? 'bg-[#06492D] border-[#06492D] text-white' : 'border-gray-200 group-hover:border-gray-300'}`}>
                  {formData.agreePrivacy && (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
                <span>
                  I agree to the{' '}
                  <Link to="/privacy-policy" className="underline hover:text-[#06492D] transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreePrivacy && (
                <span className="text-[10px] text-red-600 block">{errors.agreePrivacy}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary rounded-none w-full max-w-[180px] py-3.5 text-xs font-semibold tracking-wider uppercase hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

export default Corporategift;
