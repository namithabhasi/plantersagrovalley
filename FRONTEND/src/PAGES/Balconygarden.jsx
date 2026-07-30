import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';

// Import Assets
import img1 from '../assets/Balconygarden/image.png';
import img2 from '../assets/Balconygarden/image copy.png';
import img3 from '../assets/Balconygarden/image copy 2.png';
import img4 from '../assets/Balconygarden/image copy 3.png';
import img5 from '../assets/Balconygarden/image copy 4.png';
import img6 from '../assets/Balconygarden/image copy 5.png';
import img7 from '../assets/Balconygarden/image copy 6.png';
import img8 from '../assets/Balconygarden/image copy 7.png';
import img9 from '../assets/Balconygarden/image copy 8.png';
import img10 from '../assets/Balconygarden/image copy 9.png';

const galleryItems = [
  {
    id: 1,
    image: img1,
    title: 'Modern Minimalist Balcony',
    description: 'Sleek, clean line planters with structural plants enhancing modern apartment life.'
  },
  {
    id: 2,
    image: img2,
    title: 'Urban Oasis Escape',
    description: 'Lush layering of multi-height foliage plants creating a private natural escape.'
  },
  {
    id: 3,
    image: img3,
    title: 'Cozy Pocket Garden',
    description: 'Intimate balcony corner setup featuring climbers and compact hanging pots.'
  },
  {
    id: 4,
    image: img4,
    title: 'Vertical Privacy Screen',
    description: 'Eco-friendly barrier of thick leafy climbers providing shade and privacy.'
  },
  {
    id: 5,
    image: img5,
    title: 'Minimalist Zen Retreat',
    description: 'Serene landscape featuring structural green outlines and pebble detailing.'
  },
  {
    id: 6,
    image: img6,
    title: 'Compact Railing Planters',
    description: 'Maximizing vertical boundaries with trailing florals and kitchen herb pots.'
  },
  {
    id: 7,
    image: img7,
    title: 'High-Rise Tropical Oasis',
    description: 'Elevated balcony featuring large palms and comfortable matching furniture.'
  },
  {
    id: 8,
    image: img8,
    title: 'Modern Wooden Deck Accent',
    description: 'Warm natural wood floors combined with premium potted houseplants.'
  },
  {
    id: 9,
    image: img9,
    title: 'Herb & Edible Kitchen Patch',
    description: 'Fresh organic greens and herbs grown right at your fingertips.'
  },
  {
    id: 10,
    image: img10,
    title: 'Cascading Flowering Balcony',
    description: 'Stunning curtain of bright blossoms spilling over a residential deck.'
  }
];

function Balconygarden() {
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
      toast.success('Your balcony garden enquiry has been submitted successfully!');
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
      
      {/* 1. Hero / Title Section: Left image and Right text */}
      <section className="bg-[#fcfdfc] border-b border-gray-100 flex items-center" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Left Image */}
            <div className="w-full flex justify-center md:justify-start overflow-hidden">
              <img
                src={img1}
                alt="Balcony Garden Hero"
                className="w-full max-w-[500px] h-[200px]! md:h-[250px]! object-cover rounded-none shadow-sm border border-gray-100"
              />
            </div>

            {/* Right Text */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-500 mb-2 block">
                Premium Balcony Styling
              </span>
              <h1
                className="font-[var(--font-family-heading)] text-3xl md:text-[40px] font-normal leading-tight text-[var(--color-primary-dark)] uppercase"
                style={{ marginBottom: '24px' }}
              >
                Balcony Garden Services
              </h1>
              <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg">
                Breathe life into your balcony with our custom balcony garden styling. 
                Whether a cozy compact space or a large high-rise deck, we design vertical privacy screens, 
                self-watering planter grids, custom seating backdrops, and select stunning greenery 
                that stands up to outdoor conditions.
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
            <h2 className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[var(--color-primary-dark)] uppercase">
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
                    <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="font-[var(--font-family-base)] text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Contact Form Section */}
      <section id="contact-form-section" className="bg-[#fcfdfc]" style={{ paddingTop: '100px', paddingBottom: '120px' }}>
        <div className="container max-w-[800px]">
          <div className="text-left">
            <h2
              className="font-[var(--font-family-heading)] text-2xl md:text-3xl font-normal text-[#2c3e50] tracking-wide uppercase"
              style={{ marginBottom: '40px' }}
            >
              Get in touch
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
                  className={`w-full bg-[#f5f7f6] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 focus:bg-white ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                  className={`w-full bg-[#f5f7f6] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 focus:bg-white ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                className={`w-full bg-[#f5f7f6] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 focus:bg-white ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                className={`w-full bg-[#f5f7f6] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 resize-none focus:bg-white ${
                  errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                <div className={`w-3.5 h-3.5 flex items-center justify-center border rounded-none transition-all duration-200 ${
                  formData.agreePrivacy ? 'bg-[#06492D] border-[#06492D] text-white' : 'border-gray-200 group-hover:border-gray-300'
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

export default Balconygarden;
