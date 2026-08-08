import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { FaPaperPlane } from 'react-icons/fa';

// Import Assets
import img1 from '../assets/verticalgarden/image.png';
import img2 from '../assets/verticalgarden/image copy.png';
import img3 from '../assets/verticalgarden/image copy 2.png';
import img4 from '../assets/verticalgarden/image copy 3.png';
import img5 from '../assets/verticalgarden/image copy 4.png';
import img6 from '../assets/verticalgarden/image copy 5.png';
import img7 from '../assets/verticalgarden/image copy 6.png';
import img8 from '../assets/verticalgarden/image copy 7.png';

const galleryItems = [
  {
    id: 1,
    image: img1,
    title: 'Outdoor House Entrance',
    description: 'Stunning outdoor vertical garden accentuating a modern residential facade with lush plants.'
  },
  {
    id: 2,
    image: img2,
    title: 'Office Executive Cabin',
    description: 'Lush indoor green wall with ambient lighting for a peaceful executive cabin environment.'
  },
  {
    id: 3,
    image: img3,
    title: 'Living Room Feature Wall',
    description: 'A beautiful natural focal point designed to elevate modern urban living room interiors.'
  },
  {
    id: 4,
    image: img4,
    title: 'Corporate Office Lobby',
    description: 'A grand multi-story indoor vertical garden welcoming clients to corporate office lobbies.'
  },
  {
    id: 5,
    image: img5,
    title: 'Balcony Privacy Screen',
    description: 'Eco-friendly and lush plant partition providing natural cooling and enhanced privacy.'
  },
  {
    id: 6,
    image: img6,
    title: 'Commercial Retail Display',
    description: 'Inviting green wall display designed for retail stores to enhance shopping experiences.'
  },
  {
    id: 7,
    image: img7,
    title: 'Modern Patio Green Wall',
    description: 'Outdoor patio green wall feature using vibrant, hardy leafy plants for all seasons.'
  },
  {
    id: 8,
    image: img8,
    title: 'Residential Dining Wall',
    description: 'Seamless indoor green wall bringing living nature directly into modern dining spaces.'
  }
];

function Verticalgarden() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [dynamicServices, setDynamicServices] = useState([]);
  const [expandedServices, setExpandedServices] = useState([]);
  const [showAllCustomServices, setShowAllCustomServices] = useState(false);

  const toggleServiceExpand = (id) => {
    setExpandedServices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const { data } = await axios.get('/services?activeOnly=true&serviceType=vertical-garden');
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
    let val = type === 'checkbox' ? checked : value;

    if (name === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
    }

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
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
      const response = await axios.post('/enquiries', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment.trim(),
      });
      if (response.data.success) {
        toast.success('Your vertical garden enquiry has been submitted successfully!');
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
      
      {/* 1. Hero / Title Section: Left image and Right text */}
      <section className="bg-[#fcfdfc] border-b border-gray-100 flex items-center" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Left Image */}
            <div className="w-full flex justify-center md:justify-start overflow-hidden">
              <img
                src={img1}
                alt="Vertical Garden Hero"
                className="w-full max-w-[500px] h-[200px]! md:h-[250px]! object-cover rounded-none shadow-sm border border-gray-100"
              />
            </div>

            {/* Right Text */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-500 mb-2 block">
                Professional Design &amp; Installation
              </span>
              <h1
                className="section-title text-center md:text-left"
                style={{ marginBottom: '24px' }}
              >
                Vertical Garden Services
              </h1>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg">
                Bring your walls to life with our premium vertical garden installation services. 
                Whether for corporate offices, retail showrooms, luxury homes, or urban balconies, 
                our team designs custom self-watering green walls that purify the air and transform spaces.
              </p>
              <div className="w-full md:w-auto" style={{ marginTop: '32px' }}>
                <a
                  href="#contact-form-section"
                  onClick={handleScrollToContact}
                  className="btn btn-primary w-full md:w-auto px-10 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-none hover:scale-[1.01] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
                >
                  <FaPaperPlane size={11} /> Send Enquiry
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Image Gallery Showcase */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-500 mb-2 block">
              Our Portfolio
            </span>
            <h2 className="section-title" style={{ marginBottom: '30px' }}>
              Showcase of Our Works
            </h2>
          </div>

          <div className="product-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="product-card-wrapper">
                <div className="product-card" style={{ flexGrow: 1 }}>
                  <div className="product-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="product-card-content text-center">
                    <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-[#06492D] mb-2 text-center">
                      {item.title}
                    </h4>
                    <p 
                      className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed px-1"
                      style={{ textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'left' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic & Fallback Custom Services Section */}
      {(() => {
        const fallbackCustomServices = [
          {
            _id: 'static-vertical-1',
            title: 'AUTOMATED DRIP IRRIGATION SYSTEM',
            image: img2,
            description: 'Custom automated drip irrigation and fertigation setup designed specifically for vertical gardens to ensure hassle-free, optimal hydration for all plant layers.'
          },
          {
            _id: 'static-vertical-2',
            title: 'VERTICAL GARDEN LIGHTING & MAINTENANCE',
            image: img4,
            description: 'Specialized grow lights, routine foliage trimming, pest control treatments, and nutrient supplementation to keep indoor and outdoor green walls flourishing year-round.'
          }
        ];

        const allCustomServices = dynamicServices.length > 0 
          ? [...dynamicServices, ...fallbackCustomServices] 
          : fallbackCustomServices;

        const displayedCustomServices = showAllCustomServices 
          ? allCustomServices 
          : allCustomServices.slice(0, 3);

        return (
          <section className="bg-white overflow-hidden" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <div className="container mx-auto px-4 md:px-6 max-w-6xl w-full">
              <div className="relative flex flex-col md:flex-row items-center justify-center w-full mb-[30px]">
                <h2 className="section-title text-center" style={{ marginBottom: '10px' }}>
                  OUR CUSTOM SERVICES
                </h2>
                {allCustomServices.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCustomServices(prev => !prev)}
                    className="md:absolute right-0 text-xs font-semibold tracking-wider text-[#06492D] hover:underline uppercase cursor-pointer transition-colors flex items-center gap-1 mt-2 md:mt-0"
                  >
                    {showAllCustomServices ? 'VIEW LESS ↑' : 'VIEW ALL →'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch justify-items-center w-full">
                {displayedCustomServices.map((service) => {
                  const isExpanded = expandedServices.includes(service._id);
                  return (
                    <div key={service._id} className="product-card-wrapper w-full flex justify-center">
                      <div className="product-card w-full max-w-[340px] flex flex-col h-full bg-white shadow-sm border border-gray-100">
                        {service.image && (
                          <div className="product-card-image w-full h-56 md:h-60 overflow-hidden flex-shrink-0">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="product-card-content text-center p-6 flex-grow flex flex-col">
                          <h4 className="product-title uppercase tracking-wider text-[var(--font-size-md)] font-semibold text-[#06492D] mb-3 text-center">
                            {service.title}
                          </h4>
                          <p 
                            className={`font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mt-auto ${
                              !isExpanded ? 'line-clamp-3 overflow-hidden text-ellipsis' : ''
                            }`}
                            style={{
                              textAlign: 'justify',
                              textJustify: 'inter-word',
                              textAlignLast: 'left',
                              wordBreak: 'break-word',
                              letterSpacing: '-0.01em',
                              ...(!isExpanded ? {
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              } : {})
                            }}
                          >
                            {service.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleServiceExpand(service._id)}
                            className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#06492D] hover:underline cursor-pointer transition-colors self-center"
                          >
                            {isExpanded ? 'Read Less ↑' : 'Read More ↓'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 3. Contact Form Section */}
      <section id="contact-form-section" className="bg-[var(--color-primary-bg)] px-4 md:px-6" style={{ paddingTop: '50px', paddingBottom: '70px' }}>
        <div className="container mx-auto max-w-[800px]">
          <div className="text-left">
            <h2
              className="section-title text-left"
              style={{ marginBottom: '40px' }}
            >
              Get in touch
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                  }`}
                />
                {errors.name && <span className="text-xs text-red-500 mt-1 font-medium text-left">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                  }`}
                />
                {errors.email && <span className="text-xs text-red-500 mt-1 font-medium text-left">{errors.email}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <input
                type="tel"
                name="phone"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit Phone number"
                className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                }`}
              />
              {errors.phone && <span className="text-xs text-red-500 mt-1 font-medium text-left">{errors.phone}</span>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <textarea
                name="comment"
                rows={4}
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Comment"
                className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 resize-none ${
                  errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                }`}
              />
              {errors.comment && <span className="text-xs text-red-500 mt-1 font-medium text-left">{errors.comment}</span>}
            </div>

            {/* Privacy Checkbox */}
            <div className="flex flex-col gap-1 mt-1 relative">
              <label className="flex items-center gap-3 cursor-pointer group text-[var(--color-text-main)] font-light text-[var(--font-size-md)] text-left">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-4 h-4 flex items-center justify-center border rounded-none shrink-0 transition-all duration-200 ${
                  formData.agreePrivacy ? 'bg-[#06492D] border-[#06492D] text-white' : 'bg-white border-gray-300 group-hover:border-[#06492D]'
                }`}>
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
                <span className="text-xs text-red-500 mt-1 font-medium text-left block">{errors.agreePrivacy}</span>
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

export default Verticalgarden;
