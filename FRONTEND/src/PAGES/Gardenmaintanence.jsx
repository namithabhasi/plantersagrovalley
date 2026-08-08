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
  FaPaperPlane,
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

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
  const [expandedServices, setExpandedServices] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    infoEmail: 'info@plantersagrovalley.com',
    careEmail: 'care@plantersagrovalley.com',
    mobile: '+91-8468888666',
    officeTime: '10:00 AM - 6:00 PM (Mon-Sat)',
    facebook: '',
    twitter: '',
    pinterest: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  });

  const toggleServiceExpand = (id) => {
    setExpandedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/settings');
        if (data.success && data.settings) {
          setContactInfo(prev => ({
            ...prev,
            ...data.settings,
            ...(data.settings.socialLinks || {})
          }));
        }
      } catch (error) {
        console.error('Failed to fetch contact settings', error);
      }
    };

    fetchDynamicServices();
    fetchSettings();
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
    } else if (formData.phone.trim().length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
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
      <section className="bg-[#fcfdfc] flex items-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
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
              <span className="text-[var(--font-size-md)] font-semibold uppercase tracking-[3px] text-gray-500 mb-2 block">
                Garden Maintenance
              </span>
              <h1 
                className="section-title text-center md:text-left"
                style={{ marginBottom: '30px' }}
              >
                WE CARE FOR YOUR GARDEN, YOU ENJOY IT
              </h1>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg">
                Professional care for a healthy, vibrant and beautiful garden all year round. Our experienced team handles everything from lawn mowing and pruning to cleanup.
              </p>
              <div className="w-full md:w-auto flex justify-center md:justify-start">
                <a
                  href="#contact-form-section"
                  onClick={handleScrollToContact}
                  className="btn btn-primary px-10 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-none hover:scale-[1.01] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
                  style={{ width: '180px', marginTop: '10px' }}
                >
                  <FaPaperPlane size={11} /> Contact Now
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Features Bullet Bar with Left-to-Right Scrolling Ticker */}
      <section className="bg-[#fbfdfb] py-5 overflow-hidden">
        <div className="w-full relative">
          <div className="animate-marquee-ltr flex items-center gap-16 md:gap-24">
            
            {/* First Track Loop */}
            <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaLeaf size={14} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">EXPERT GARDENERS</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaRegCheckCircle size={14} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">RELIABLE &amp; SAFE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaClock size={13} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">REGULAR MAINTENANCE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaSeedling size={14} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">HEALTHY &amp; GREEN</span>
              </div>
            </div>

            {/* Second Track Loop (Duplicate for seamless loop) */}
            <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaLeaf size={14} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">EXPERT GARDENERS</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaRegCheckCircle size={14} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">RELIABLE &amp; SAFE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaClock size={13} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">REGULAR MAINTENANCE</span>
              </div>
              <div className="flex items-center gap-3 flex-row select-none">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm flex-shrink-0">
                  <FaSeedling size={14} />
                </div>
                <span className="font-semibold text-[var(--font-size-md)] text-gray-800 uppercase tracking-wide whitespace-nowrap">HEALTHY &amp; GREEN</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Services List Section */}
      <section className="bg-[var(--color-primary-bg)]" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container mx-auto">
          <div className="text-center">
            <h2 
              className="section-title"
              style={{ marginBottom: '30px' }}
            >
              OUR GARDEN MAINTENANCE SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto justify-items-center px-2 w-full">
            
            {/* Service 1 */}
            <div className="product-card-wrapper max-w-[230px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image w-full h-44 overflow-hidden flex-shrink-0">
                  <img src={lawnImg} alt="Lawn Care" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-3 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-[#06492D] mb-2 text-center whitespace-nowrap">
                    LAWN CARE
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-[195px] mx-auto">
                    Complete mowing, edging, and lawn treatment for a lush green lawn.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="product-card-wrapper max-w-[230px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image w-full h-44 overflow-hidden flex-shrink-0">
                  <img src={pruningImg} alt="Pruning & Trimming" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-3 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-[#06492D] mb-2 text-center whitespace-nowrap">
                    PRUNING &amp; TRIMMING
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-[195px] mx-auto">
                    Expert pruning and trimming to keep all your plants healthy and shaped.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="product-card-wrapper max-w-[230px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image w-full h-44 overflow-hidden flex-shrink-0">
                  <img src={plantImg} alt="Plant Care" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-3 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-[#06492D] mb-2 text-center whitespace-nowrap">
                    PLANT CARE
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-[195px] mx-auto">
                    We nurture your plants with proper nutrition, watering, and expert care.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="product-card-wrapper max-w-[230px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image w-full h-44 overflow-hidden flex-shrink-0">
                  <img src={fertImg} alt="Fertilizing" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-3 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-[#06492D] mb-2 text-center whitespace-nowrap">
                    FERTILIZING
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-[195px] mx-auto">
                    Proper organic feeding for strong root systems and vibrant plant growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div className="product-card-wrapper max-w-[230px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image w-full h-44 overflow-hidden flex-shrink-0">
                  <img src={cleanupImg} alt="Garden Clean-up" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-3 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-xs font-semibold text-[#06492D] mb-2 text-center whitespace-nowrap">
                    GARDEN CLEAN-UP
                  </h4>
                  <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-[195px] mx-auto">
                    We keep your garden clean, tidy, weed-free, and protected from pests.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic & Fallback Custom Services Section */}
      {(() => {
        const fallbackCustomServices = [
          {
            _id: 'static-garden-1',
            title: 'LANDSCAPE DESIGN & INSTALLATION',
            image: pruningImg,
            description: 'Custom garden landscape planning, lawn creation, vertical garden setup, and professional plant arrangement tailored for residential and commercial spaces.'
          },
          {
            _id: 'static-garden-2',
            title: 'SEASONAL GARDEN RENOVATION & RECOVERY',
            image: plantImg,
            description: 'Complete soil enrichment, organic fertilization, flower bed rejuvenation, and deep garden cleanup to restore overgrown or damaged gardens.'
          }
        ];

        const allCustomServices = dynamicServices.length > 0 
          ? [...dynamicServices, ...fallbackCustomServices] 
          : fallbackCustomServices;

        return (
          <section className="bg-white overflow-hidden" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <div className="container mx-auto px-4 md:px-6 max-w-6xl w-full">
              <div className="relative flex flex-col md:flex-row items-center justify-center w-full mb-[30px]">
                <h2 className="section-title text-center" style={{ marginBottom: '10px' }}>
                  OUR CUSTOM SERVICES
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const allIds = allCustomServices.map(s => s._id);
                    setExpandedServices(prev => prev.length === allIds.length ? [] : allIds);
                  }}
                  className="md:absolute right-0 text-xs font-semibold tracking-wider text-[#06492D] hover:underline uppercase cursor-pointer transition-colors flex items-center gap-1 mt-2 md:mt-0"
                >
                  {expandedServices.length === allCustomServices.map(s => s._id).length ? 'VIEW LESS ↑' : 'VIEW ALL →'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch justify-items-center w-full">
                {allCustomServices.map((service) => {
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
                            className={`font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed mt-auto ${
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

      {/* 4. Contact Form Section: Regular Contact Form */}
      <section id="contact-form-section" className="bg-[var(--color-primary-bg)]" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start max-w-5xl mx-auto">
            {/* Left Column: Let's Keep Your Garden Beautiful Together */}
            <div className="flex flex-col text-center md:text-left">
              <h2 
                className="section-title text-center md:text-left"
                style={{ marginBottom: '30px' }}
              >
                LET'S KEEP YOUR GARDEN BEAUTIFUL TOGETHER
              </h2>
              <p style={{ marginBottom: '20px', textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'left' }} className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-gray-700 leading-relaxed mb-10 max-w-sm">
                Get in touch with us for customized plant inquiries, garden maintenance, or any support needed.
              </p>

              {/* Contact Details List */}
              <div className="flex flex-col gap-6 text-[var(--color-text-main)] text-[var(--font-size-md)] mb-6">
                <a href={`tel:${contactInfo.mobile || "+918468888666"}`} className="flex items-center gap-3 justify-center md:justify-start text-[var(--color-text-main)] hover:text-[#06492D] transition-colors text-decoration-none">
                  <FaPhoneAlt className="text-[var(--color-primary-dark)]" size={15} />
                  <span>{contactInfo.mobile || "+91-8468888666"}</span>
                </a>
                <a href={`mailto:${contactInfo.infoEmail || "info@plantersagrovalley.com"}`} className="flex items-center gap-3 justify-center md:justify-start text-[var(--color-text-main)] hover:text-[#06492D] transition-colors text-decoration-none">
                  <FaEnvelope className="text-[var(--color-primary-dark)]" size={15} />
                  <span>{contactInfo.infoEmail || "info@plantersagrovalley.com"}</span>
                </a>
                <a 
                  href="https://maps.google.com/?q=Planters+Agro+Valley,+Ernakulam,+Kerala,+India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 justify-center md:justify-start text-[var(--color-text-main)] hover:text-[#06492D] hover:underline cursor-pointer text-decoration-none transition-colors"
                >
                  <FaMapMarkerAlt className="text-[var(--color-primary-dark)]" size={15} />
                  <span>Planters Agro Valley, Ernakulam, Kerala, India</span>
                </a>
              </div>

              {/* Social Media Links with marginTop: 10px */}
              <div className="pt-4 flex flex-col gap-4 items-center md:items-start" style={{ marginTop: '10px' }}>
                <span className="text-[var(--font-size-md)] font-semibold text-[var(--color-text-main)] uppercase tracking-wider">Follow Us</span>
                <div className="flex items-center gap-5 text-[var(--color-text-main)]">
                  <a href={contactInfo.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="Facebook">
                    <FaFacebookF size={16} />
                  </a>
                  <a href={contactInfo.twitter || "https://x.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="X (Twitter)">
                    <FaXTwitter size={16} />
                  </a>
                  <a href={contactInfo.pinterest || "https://pinterest.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="Pinterest">
                    <FaPinterestP size={16} />
                  </a>
                  <a href={contactInfo.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="Instagram">
                    <FaInstagram size={16} />
                  </a>
                  <a href={contactInfo.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="LinkedIn">
                    <FaLinkedinIn size={16} />
                  </a>
                  <a href={contactInfo.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="YouTube">
                    <FaYoutube size={16} />
                  </a>
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
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[var(--font-size-md)] text-red-500 mt-1 font-light text-left">
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
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[var(--font-size-md)] text-red-500 mt-1 font-light text-left">
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
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[var(--font-size-md)] text-red-500 mt-1 font-light text-left">
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
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-[var(--color-text-main)] placeholder-gray-400 resize-none ${
                      errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.comment && (
                    <span className="text-[var(--font-size-md)] text-red-500 mt-1 font-light text-left">
                      {errors.comment}
                    </span>
                  )}
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
                    <div className={`w-4 h-4 flex items-center justify-center border rounded-none transition-all duration-200 ${formData.agreePrivacy ? 'bg-[#06492D] border-[#06492D] text-white' : 'bg-white border-gray-300 group-hover:border-[#06492D]'}`}>
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
                    <span className="text-[var(--font-size-md)] text-red-500 mt-1 font-light text-left">
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
