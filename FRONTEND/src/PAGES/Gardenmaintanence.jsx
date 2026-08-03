import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaLeaf, 
  FaRegCheckCircle, 
  FaClock, 
  FaSeedling,
  FaPaperPlane
} from 'react-icons/fa';

// Import Assets
import heroImg from '../assets/gardenmaintanence/image.png';
import lawnImg from '../assets/gardenmaintanence/image copy.png';
import pruningImg from '../assets/gardenmaintanence/image copy 2.png';
import plantImg from '../assets/gardenmaintanence/image copy 3.png';
import fertImg from '../assets/gardenmaintanence/image copy 4.png';
import cleanupImg from '../assets/gardenmaintanence/image copy 5.png';

function Gardenmaintanence() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [dynamicServices, setDynamicServices] = useState([]);

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const { data } = await axios.get('/services?activeOnly=true&serviceType=garden-maintenance');
        if (data.success) {
          setDynamicServices(data.services || []);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic services", err);
      }
    };
    fetchDynamicServices();
  }, []);

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
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    }
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = 'Agreement is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('/enquiries', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment.trim(),
      });
      if (response.data.success) {
        toast.success('Your garden maintenance enquiry has been submitted successfully!');
        setFormData({ name: '', email: '', phone: '', comment: '', agreePrivacy: false });
      } else {
        toast.error(response.data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit enquiry. Please try again.');
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

      {/* Dynamic Left-to-Right Scrolling Animation Styling */}
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-ltr {
          display: flex;
          width: max-content;
          animation: marquee-ltr 22s linear infinite;
        }
        .animate-marquee-ltr:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. Hero / Title Section: Pic Left and Text Right Layout */}
      <section className="bg-[#fcfdfc] border-b border-gray-100 flex items-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Left Column: Image */}
            <div className="w-full flex justify-center md:justify-start">
              <img
                src={heroImg}
                alt="Garden Maintenance"
                className="w-full max-w-[400px] h-[200px] md:h-[250px] object-cover rounded-none border border-gray-100 shadow-sm"
              />
            </div>

            {/* Right Column: Text Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-500 mb-2 block">
                Garden Maintenance
              </span>
              <h1 
                className="font-[var(--font-family-heading)] text-3xl md:text-[42px] font-normal leading-tight text-[var(--color-primary-dark)] uppercase"
                style={{ marginBottom: '20px' }}
              >
                WE CARE FOR YOUR GARDEN, YOU ENJOY IT
              </h1>
              <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg">
                Professional care for a healthy, vibrant and beautiful garden all year round. Our experienced team handles everything from lawn mowing and pruning to cleanup.
              </p>
              <div className="w-full md:w-auto flex justify-center md:justify-start">
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
        </div>
      </section>

      {/* 2. Features Bullet Bar with Left-to-Right Scrolling Ticker */}
      <section className="bg-[#fbfdfb] border-b border-gray-100 py-5 overflow-hidden">
        <div className="w-full relative">
          <div className="animate-marquee-ltr flex items-center gap-16 md:gap-24">
            
            {/* First Track Loop */}
            <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaLeaf size={14} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">EXPERT GARDENERS</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaRegCheckCircle size={14} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">RELIABLE &amp; SAFE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaClock size={13} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">REGULAR MAINTENANCE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaSeedling size={14} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">HEALTHY &amp; GREEN</span>
              </div>
            </div>

            {/* Second Track Loop (Duplicate for seamless loop) */}
            <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaLeaf size={14} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">EXPERT GARDENERS</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaRegCheckCircle size={14} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">RELIABLE &amp; SAFE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaClock size={13} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">REGULAR MAINTENANCE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaSeedling size={14} />
                </div>
                <span className="font-semibold text-xs text-gray-800 uppercase tracking-wide whitespace-nowrap">HEALTHY &amp; GREEN</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Services List Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container mx-auto">
          <div className="text-center">
            <h2 
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)]"
              style={{ marginBottom: '48px' }}
            >
              OUR GARDEN MAINTENANCE SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto justify-items-center">
            
            {/* Service 1 */}
            <div className="product-card-wrapper w-full flex flex-col">
              <div className="product-card w-full flex-grow flex flex-col" style={{ height: '100%' }}>
                <div className="product-card-image">
                  <img src={lawnImg} alt="Lawn Care" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-gray-800 mb-2">
                    LAWN CARE
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[11px] text-[var(--color-text-muted)] leading-relaxed mt-auto">
                    Mowing, edging and lawn treatment for a lush green lawn.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="product-card-wrapper w-full flex flex-col">
              <div className="product-card w-full flex-grow flex flex-col" style={{ height: '100%' }}>
                <div className="product-card-image">
                  <img src={pruningImg} alt="Pruning & Trimming" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-gray-800 mb-2">
                    PRUNING &amp; TRIMMING
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[11px] text-[var(--color-text-muted)] leading-relaxed mt-auto">
                    Expert pruning and trimming to keep your plants healthy and shaped.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="product-card-wrapper w-full flex flex-col">
              <div className="product-card w-full flex-grow flex flex-col" style={{ height: '100%' }}>
                <div className="product-card-image">
                  <img src={plantImg} alt="Plant Care" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-gray-800 mb-2">
                    PLANT CARE
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[11px] text-[var(--color-text-muted)] leading-relaxed mt-auto">
                    We nurture your plants with right nutrition and care.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="product-card-wrapper w-full flex flex-col">
              <div className="product-card w-full flex-grow flex flex-col" style={{ height: '100%' }}>
                <div className="product-card-image">
                  <img src={fertImg} alt="Fertilizing" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-gray-800 mb-2">
                    FERTILIZING
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[11px] text-[var(--color-text-muted)] leading-relaxed mt-auto">
                    Proper feeding for strong roots and vibrant growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div className="product-card-wrapper w-full flex flex-col">
              <div className="product-card w-full flex-grow flex flex-col" style={{ height: '100%' }}>
                <div className="product-card-image">
                  <img src={cleanupImg} alt="Garden Clean-up" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-gray-800 mb-2">
                    GARDEN CLEAN-UP
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[11px] text-[var(--color-text-muted)] leading-relaxed mt-auto">
                    We keep your garden clean, tidy and pest-free.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Services Section */}
      {dynamicServices.length > 0 && (
        <section className="bg-white border-b border-gray-100" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <div className="container mx-auto">
            <div className="text-center">
              <h2 
                className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)] uppercase"
                style={{ marginBottom: '48px' }}
              >
                OUR CUSTOM SERVICES
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-12 max-w-6xl mx-auto">
              {dynamicServices.map((service) => (
                <div key={service._id} className="product-card custom-service-card max-w-[var(--card-max-width)] w-full flex flex-col">
                  {service.image && (
                    <div className="product-card-image">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="product-card-content text-center flex-grow flex flex-col">
                    <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-gray-800 mb-2">
                      {service.title}
                    </h4>
                    <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed mt-auto">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Contact Form Section: Regular Contact Form */}
      <section id="contact-form-section" className="bg-white border-t border-gray-100" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start max-w-5xl mx-auto">
            {/* Left Column: Let's Keep Your Garden Beautiful Together */}
            <div className="flex flex-col text-center md:text-left md:pt-6">
              <h2 
                className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)] tracking-wide uppercase leading-tight"
                style={{ marginBottom: '20px' }}
              >
                LET'S KEEP YOUR GARDEN BEAUTIFUL TOGETHER
              </h2>
              <p className="font-[var(--font-family-base)] text-xs text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-sm">
                Get in touch with us for customized garden maintenance plans.
              </p>

              {/* Contact Details List */}
              <div className="flex flex-col gap-5 text-gray-700 text-xs">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <FaPhoneAlt className="text-[var(--color-primary-dark)]" size={14} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <FaEnvelope className="text-[var(--color-primary-dark)]" size={14} />
                  <span>hello@plantersagrovalley.com</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <FaMapMarkerAlt className="text-[var(--color-primary-dark)]" size={14} />
                  <span>Ernakulam, Kerala</span>
                </div>
              </div>
            </div>

            {/* Right Column: Regular Contact Form */}
            <div className="w-full flex justify-center md:justify-start">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full max-w-[400px]">
                
                {/* Name Input */}
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-500 mt-1 font-light text-left">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500 mt-1 font-light text-left">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone Input */}
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-500 mt-1 font-light text-left">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex flex-col gap-1 w-full">
                  <textarea
                    name="comment"
                    rows={5}
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Comment"
                    className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 resize-none ${
                      errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.comment && (
                    <span className="text-[10px] text-red-500 mt-1 font-light text-left">
                      {errors.comment}
                    </span>
                  )}
                </div>

                {/* Privacy Checkbox */}
                <div className="flex flex-col gap-1 mt-1 relative">
                  <label className="flex items-center space-x-2.5 cursor-pointer group text-gray-400 font-light text-[10px] text-left">
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
                    <span className="text-[10px] text-red-500 mt-1 font-light text-left">
                      {errors.agreePrivacy}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="w-full flex justify-center mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-none w-full max-w-[180px] py-3.5 text-xs font-semibold tracking-wider uppercase hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Gardenmaintanence;
