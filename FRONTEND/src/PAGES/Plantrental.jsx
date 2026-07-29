import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheck,
  FaHeadset,
  FaClipboardList,
  FaRegCheckSquare,
  FaPlus,
  FaMinus,
  FaPaperPlane,
  FaGoogle,
  FaMicrosoft,
  FaApple,
  FaAmazon,
  FaSalesforce,
  FaGithub
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';

// Import Assets
import leavesBg from '../assets/PLANTRENTAL/leaves_bg.jpg';
import officeImg from '../assets/INDOORPLANTS/Indoor Plants Ideas For Beginners_ Transform Your Home Into A Green Paradise.jpg';
import eventImg from '../assets/INDOORPLANTS/Humidity-Loving Plants_ Transform Your Bathroom with Tropical Vibes - Quiet Minimal.jpg';
import shortImg from '../assets/INDOORPLANTS/11 Inspiring Secrets To Thriving Indoor Bamboo_ Choosing the Right Environment.jpg';

function Plantrental() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [activeFaq, setActiveFaq] = useState(null);

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
      toast.success('Your plant rental enquiry has been submitted successfully!');
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

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'WHAT IS YOUR PLANT ON RENT SERVICE?',
      a: 'Our plant rental service provides customized green styling solutions for office spaces, commercial complexes, and events. We select, deliver, install, and regularly maintain high-quality indoor and outdoor plants to ensure your space remains vibrant and healthy without any hassle.',
    },
    {
      q: 'WHAT IF ONE OF THE RENTAL PLANTS DIES?',
      a: 'As part of our premium maintenance plan, we conduct routine quality checks. If any plant loses its health or vitality, our horticulturists will promptly replace it at no additional cost to you.',
    },
    {
      q: 'HOW CAN PLANTS BENEFIT MY OFFICE SPACE?',
      a: 'Plants significantly improve indoor air quality by absorbing pollutants, increase productivity and concentration, reduce stress levels, and elevate the aesthetic value of your workplace, making it highly inviting for clients and employees alike.',
    },
    {
      q: 'IS IT BETTER TO BUY OR HIRE OFFICE PLANTS?',
      a: 'Hiring plants is far superior because it includes professional ongoing maintenance. You don\'t have to worry about watering, fertilizing, or replacing dying plants, and you can periodically rotate plant varieties to refresh your office aesthetics.',
    },
    {
      q: 'DO I HIRE PLANTS FOR EVENTS OR SHORT TERM?',
      a: 'Yes, we offer flexible short-term rental solutions tailored for events, exhibitions, corporate launches, and weddings, complete with prompt setup and removal service.',
    },
    {
      q: 'WHAT ARE SOME LOW MAINTENANCE OFFICE PLANTS?',
      a: 'Excellent low-maintenance options include Snake Plants, ZZ Plants, Peace Lilies, Pothos, and Aglaonema. These varieties thrive in low-light office environments and require minimal watering.',
    },
  ];

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
      <section 
        className="border-b border-gray-100 relative overflow-hidden bg-white" 
        style={{ 
          backgroundImage: `url(${leavesBg})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          paddingTop: '100px',
          paddingBottom: '100px'
        }}
      >
        <div className="container mx-auto relative z-10 flex justify-center">
          <div className="max-w-2xl w-full text-center bg-white/75 backdrop-blur-md p-8 md:p-12 border border-white/40 shadow-lg rounded-sm mt-8">
            <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-500 mb-2 block">
              Plant Rental
            </span>
            <h1 
              className="font-[var(--font-family-heading)] text-3xl md:text-[42px] font-normal leading-tight text-[var(--color-primary-dark)]"
              style={{ marginBottom: '20px' }}
            >
              GREENER SPACES, WITHOUT THE HASSLE.
            </h1>
            <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg mx-auto">
              Bring natural freshness and beautiful aesthetics to your home, office or corporate events — on flexible rental plans.
            </p>
            <div className="flex justify-center" style={{ marginTop: '16px', marginBottom: '12px' }}>
              <a
                href="#contact-form-section"
                onClick={handleScrollToContact}
                className="btn btn-primary px-10 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-none hover:scale-[1.01] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
                style={{ width: '180px' }}
              >
                <FaPaperPlane size={11} /> Contact Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR CLIENTS Section with Infinite Auto-Scrolling Marquee */}
      <section className="bg-white border-b border-gray-100" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
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

      {/* 3. Plant Rental Offerings Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container mx-auto">
          <div className="text-center">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)]"
              style={{ marginBottom: '48px' }}
            >
              PLANT RENTAL OFFERINGS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto justify-items-center">
            {/* Offering 1 */}
            <div className="product-card-wrapper max-w-[var(--card-max-width)] w-full">
              <div className="product-card w-full">
                <div className="product-card-image">
                  <img src={officeImg} alt="Office Plant Styling" />
                </div>
                <div className="product-card-content text-center">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                    OFFICE PLANT STYLING
                  </h4>
                  <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Transform your workspace with low-maintenance, air-purifying indoor plants that boost productivity and reduce stress.
                  </p>
                </div>
              </div>
            </div>

            {/* Offering 2 */}
            <div className="product-card-wrapper max-w-[var(--card-max-width)] w-full">
              <div className="product-card w-full">
                <div className="product-card-image">
                  <img src={eventImg} alt="Event Greenery" />
                </div>
                <div className="product-card-content text-center">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                    EVENT GREENERY
                  </h4>
                  <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Make your conferences, product launches, or annual meetings stand out with custom-designed green accents.
                  </p>
                </div>
              </div>
            </div>

            {/* Offering 3 */}
            <div className="product-card-wrapper max-w-[var(--card-max-width)] w-full">
              <div className="product-card w-full">
                <div className="product-card-image">
                  <img src={shortImg} alt="Short-Term Rental" />
                </div>
                <div className="product-card-content text-center">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                    SHORT-TERM RENTAL
                  </h4>
                  <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Flexible options for retail displays, weddings, exhibitions, and photoshoots, complete with fast setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white border-b border-gray-100" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="text-center">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)]"
              style={{ marginBottom: '48px' }}
            >
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto w-full justify-items-center justify-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[var(--color-primary-dark)] text-lg mb-5 shadow-sm">
                <FaHeadset />
              </div>
              <h4 className="font-[var(--font-family-heading)] text-xs font-semibold tracking-wider text-gray-800 uppercase mb-3">
                SITE VISIT
              </h4>
              <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                Upon receiving a site visit request, our executive schedules a visit to conduct a survey and understand your requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[var(--color-primary-dark)] text-lg mb-5 shadow-sm">
                <FaClipboardList />
              </div>
              <h4 className="font-[var(--font-family-heading)] text-xs font-semibold tracking-wider text-gray-800 uppercase mb-3">
                PLANNING
              </h4>
              <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                Our horticulture expert will provide tailored plantscaping ideas based on your requirements and share them with you for approval.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[var(--color-primary-dark)] text-lg mb-5 shadow-sm">
                <FaRegCheckSquare />
              </div>
              <h4 className="font-[var(--font-family-heading)] text-xs font-semibold tracking-wider text-gray-800 uppercase mb-3">
                INSTALLATION
              </h4>
              <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                Installation carried out by skilled technicians and horticultural experts for a flawless result.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Plant Rental FAQs Section */}
      <section className="bg-[#fbfdfc] border-b border-gray-100" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container mx-auto max-w-[850px] px-6">
          <div className="text-left">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)] tracking-wide"
              style={{ marginBottom: '48px' }}
            >
              PLANT RENTAL FAQ'S
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left py-3.5 focus:outline-none group"
                  >
                    <span className="font-[var(--font-family-heading)] text-xs md:text-sm font-semibold tracking-wider text-gray-700 uppercase group-hover:text-[var(--color-primary-dark)] transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-gray-400 group-hover:text-[var(--color-primary-dark)] ml-4 transition-colors">
                      {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <p className="font-[var(--font-family-base)] text-xs leading-relaxed text-gray-500 max-w-3xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Contact Form Section */}
      <section id="contact-form-section" className="bg-[#f5f7f6]" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container mx-auto max-w-[800px]">
          <div className="text-left">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[#2c3e50] tracking-wide uppercase"
              style={{ marginBottom: '40px' }}
            >
              CONTACT US!
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
                  className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                  className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 resize-none ${errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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

export default Plantrental;
