import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheck, 
  FaGoogle, 
  FaLeaf, 
  FaBuilding, 
  FaNetworkWired, 
  FaLaptopCode, 
  FaCompass, 
  FaGlobe, 
  FaMicrochip, 
  FaCogs, 
  FaRocket 
} from 'react-icons/fa';
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
  const [dynamicServices, setDynamicServices] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [expandedServiceIds, setExpandedServiceIds] = useState([]);
  const [showAllCustomServices, setShowAllCustomServices] = useState(false);

  const toggleExpandService = (id) => {
    setExpandedServiceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const { data } = await axios.get('/services?activeOnly=true&serviceType=corporate-gifting');
        if (data.success) {
          setDynamicServices(data.services || []);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic services", err);
      }
    };
    fetchDynamicServices();
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.getAttribute('data-step'), 10);
          if (!isNaN(stepIndex)) {
            setActiveStepIndex((prev) => Math.max(prev, stepIndex));
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const stepElements = document.querySelectorAll('.vertical-step-row');
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const stepsData = [
    {
      number: '01',
      tag: 'STEP 1',
      title: 'CHOOSE YOUR PRODUCT',
      description: "Choose Plant, Pot, as well as the soil mix that you like the most. We'll guide you through choosing the perfect plant gifts to fit your corporate needs."
    },
    {
      number: '02',
      tag: 'STEP 2',
      title: 'CUSTOMIZE IT',
      description: 'Make your gifts even more meaningful by customizing the pot with your logo, a personalized card with message, or even packaging box. You can add plant accessories as well.'
    },
    {
      number: '03',
      tag: 'STEP 3',
      title: 'SIT BACK AND RELAX',
      description: 'We will hand-deliver your order to your recipient list, right to their doorstep. We ensure that your corporate gifts have a great trip to their destination.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    
    // Restrict phone field to 10 numeric digits only
    if (name === 'phone') {
      val = value.replace(/\D/g, '').slice(0, 10);
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
    
    // Valid email address regex check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Strict 10-digit Indian mobile number validation
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
        toast.success('Thank you for your corporate enquiry, we will get back to you soon!');
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
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100 flex items-center" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

            {/* Left Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1
                className="section-title text-center md:text-left"
                style={{ marginBottom: '30px' }}
              >
                CORPORATE PLANT GIFTS [BULK]
              </h1>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mb-8 max-w-lg corporate-description">
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
      <section className="bg-white border-b border-gray-100" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto flex flex-col items-center">
          <h2
            className="section-title"
            style={{ marginBottom: '30px' }}
          >
            OUR CLIENTS
          </h2>

          {/* Auto Scrolling Marquee container */}
          <div className="w-full overflow-hidden relative py-6 bg-[#06492D]/5 border-y border-[#06492D]/10">
            <div className="animate-marquee flex items-center gap-12 md:gap-20">

              {/* First Track */}
              <div className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20">
                {[
                  { name: 'PENOFT', icon: <FaLeaf size={16} /> },
                  { name: 'EY', icon: <FaBuilding size={16} /> },
                  { name: 'TCS', icon: <FaLaptopCode size={16} /> },
                  { name: 'WIPRO', icon: <FaNetworkWired size={16} /> },
                  { name: 'INFOSYS', icon: <FaRocket size={16} /> },
                  { name: 'STRADA', icon: <FaCompass size={16} /> },
                  { name: 'UST GLOBAL', icon: <FaGlobe size={16} /> },
                  { name: 'GOOGLE', icon: <FaGoogle size={16} /> },
                  { name: 'JOHN TURING', icon: <FaMicrochip size={16} /> },
                  { name: 'EXPERION TECHNOLOGIES', icon: <FaCogs size={16} /> }
                ].map((client, idx) => (
                  <span key={`client-1-${idx}`} className="text-[var(--font-size-md)] font-bold tracking-[3px] uppercase text-[#06492D] hover:opacity-75 transition-opacity duration-200 cursor-default whitespace-nowrap select-none flex items-center gap-2.5">
                    {client.icon}
                    {client.name}
                  </span>
                ))}
              </div>

              {/* Second Loop Track (Duplicate for seamless infinite marquee) */}
              <div className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20">
                {[
                  { name: 'PENOFT', icon: <FaLeaf size={16} /> },
                  { name: 'EY', icon: <FaBuilding size={16} /> },
                  { name: 'TCS', icon: <FaLaptopCode size={16} /> },
                  { name: 'WIPRO', icon: <FaNetworkWired size={16} /> },
                  { name: 'INFOSYS', icon: <FaRocket size={16} /> },
                  { name: 'STRADA', icon: <FaCompass size={16} /> },
                  { name: 'UST GLOBAL', icon: <FaGlobe size={16} /> },
                  { name: 'GOOGLE', icon: <FaGoogle size={16} /> },
                  { name: 'JOHN TURING', icon: <FaMicrochip size={16} /> },
                  { name: 'EXPERION TECHNOLOGIES', icon: <FaCogs size={16} /> }
                ].map((client, idx) => (
                  <span key={`client-2-${idx}`} className="text-[var(--font-size-md)] font-bold tracking-[3px] uppercase text-[#06492D] hover:opacity-75 transition-opacity duration-200 cursor-default whitespace-nowrap select-none flex items-center gap-2.5">
                    {client.icon}
                    {client.name}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Plant Gifts Customization Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100 overflow-hidden" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl w-full">
          <div className="text-center">
            <h2
              className="section-title"
              style={{ marginBottom: '30px' }}
            >
              PLANT GIFTS CUSTOMIZATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch justify-items-center w-full">
            {/* Customization 1 */}
            <div className="product-card-wrapper w-full flex justify-center">
              <div className="product-card w-full max-w-[340px] flex flex-col h-full bg-white shadow-sm border border-gray-100">
                <div className="product-card-image w-full h-56 md:h-60 overflow-hidden flex-shrink-0">
                  <img src={engraveImg} alt="Engrave Logo & Sticker" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center p-6 flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-[var(--font-size-md)] font-semibold text-[#06492D] mb-3 text-center">
                    Engrave Logo &amp; Sticker
                  </h4>
                  <p 
                    className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed line-clamp-4 overflow-hidden text-ellipsis"
                    style={{
                      textAlign: 'justify',
                      textJustify: 'inter-word',
                      textAlignLast: 'left',
                      wordBreak: 'break-word',
                      letterSpacing: '-0.01em',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    Select from a wide range of plants &amp; pots. Add your corporate logo and brand sticker on the product.
                  </p>
                </div>
              </div>
            </div>

            {/* Customization 2 */}
            <div className="product-card-wrapper w-full flex justify-center">
              <div className="product-card w-full max-w-[340px] flex flex-col h-full bg-white shadow-sm border border-gray-100">
                <div className="product-card-image w-full h-56 md:h-60 overflow-hidden flex-shrink-0">
                  <img src={cardImg} alt="Personalised Message Card" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center p-6 flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-[var(--font-size-md)] font-semibold text-[#06492D] mb-3 text-center">
                    Personalised Message Card
                  </h4>
                  <p 
                    className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed line-clamp-4 overflow-hidden text-ellipsis"
                    style={{
                      textAlign: 'justify',
                      textJustify: 'inter-word',
                      textAlignLast: 'left',
                      wordBreak: 'break-word',
                      letterSpacing: '-0.01em',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    Feel happy your employee and partner on special company occasions with a personalized card.
                  </p>
                </div>
              </div>
            </div>

            {/* Customization 3 */}
            <div className="product-card-wrapper w-full flex justify-center">
              <div className="product-card w-full max-w-[340px] flex flex-col h-full bg-white shadow-sm border border-gray-100">
                <div className="product-card-image w-full h-56 md:h-60 overflow-hidden flex-shrink-0">
                  <img src={boxImg} alt="Customize Packaging Box" className="w-full h-full object-cover" />
                </div>
                <div className="product-card-content text-center p-6 flex-grow flex flex-col">
                  <h4 className="product-title uppercase tracking-wider text-[var(--font-size-md)] font-semibold text-[#06492D] mb-3 text-center">
                    Customize Packaging Box
                  </h4>
                  <p 
                    className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed line-clamp-4 overflow-hidden text-ellipsis"
                    style={{
                      textAlign: 'justify',
                      textJustify: 'inter-word',
                      textAlignLast: 'left',
                      wordBreak: 'break-word',
                      letterSpacing: '-0.01em',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    Fully customized gift box as per requirement, including custom printing &amp; package designing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white border-b border-gray-100 overflow-hidden select-none" style={{ padding: '30px' }}>
        <div className="container mx-auto px-4 max-w-5xl w-full">
          <div className="text-center">
            <h2 className="section-title" style={{ marginBottom: '30px' }}>
              HOW IT WORKS
            </h2>
          </div>

          {/* MOBILE VIEW: Clean Step Cards (< md screens) */}
          <div className="flex flex-col gap-5 md:hidden w-full">
            {stepsData.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-[#fcfcfc] border border-gray-100/80 p-5 rounded-none shadow-sm flex flex-col gap-2"
                style={idx === 1 ? { margin: '20px 0' } : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold tracking-[3px] uppercase text-[#06492D]">
                    {step.tag}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#06492D] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-[var(--font-family-heading)] text-base font-semibold tracking-wider text-gray-900 uppercase">
                  {step.title}
                </h3>
                <p className="font-[var(--font-family-base)] text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Central Stepper (>= md screens) */}
          <div className="relative hidden md:block">
            {/* Center vertical background line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-12 w-0.5 bg-gray-200 z-0"></div>
            
            {/* Center vertical animated progress line */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-4 w-0.5 bg-[#06492D] transition-all duration-700 ease-out z-0"
              style={{
                height: activeStepIndex >= 2 ? 'calc(100% - 48px)' : activeStepIndex === 1 ? '55%' : activeStepIndex === 0 ? '15%' : '0%'
              }}
            ></div>

            {/* Stepper Rows Container */}
            <div className="flex flex-col gap-20">
              {stepsData.map((step, idx) => {
                const isVisible = activeStepIndex >= idx;
                const isEven = idx % 2 === 0; // 0 = Left side (Step 1 & 3), 1 = Right side (Step 2)

                return (
                  <div
                    key={idx}
                    data-step={idx}
                    className="vertical-step-row grid grid-cols-[1fr_80px_1fr] items-start relative z-10 w-full"
                  >
                    {/* LEFT TRACK (1fr) */}
                    <div className="w-full pr-4">
                      {isEven ? (
                        <div
                          className={`w-full max-w-sm ml-auto text-left pt-1 transition-all duration-700 ease-out transform ${
                            isVisible 
                              ? 'translate-y-0 opacity-100' 
                              : 'translate-y-8 opacity-0'
                          }`}
                        >
                          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-[#06492D] mb-1">
                            {step.tag}
                          </span>
                          <h3 className="font-[var(--font-family-heading)] text-xl font-semibold tracking-wider text-gray-900 uppercase mb-2">
                            {step.title}
                          </h3>
                          <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* CENTER BADGE TRACK (80px) */}
                    <div className="w-[80px] flex justify-center items-start z-20">
                      <div
                        className={`transition-all duration-700 ease-out transform ${
                          isVisible 
                            ? 'scale-100 opacity-100 translate-y-0' 
                            : 'scale-50 opacity-0 translate-y-6'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-full bg-[#06492D] text-white flex items-center justify-center font-bold text-xl ring-8 ring-[#06492D]/15 shadow-md border-2 border-white">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT TRACK (1fr) */}
                    <div className="w-full pl-4">
                      {!isEven ? (
                        <div
                          className={`w-full max-w-sm mr-auto text-left pt-1 transition-all duration-700 ease-out transform ${
                            isVisible 
                              ? 'translate-y-0 opacity-100' 
                              : 'translate-y-8 opacity-0'
                          }`}
                          style={{ padding: '20px' }}
                        >
                          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-[#06492D] mb-1">
                            {step.tag}
                          </span>
                          <h3 className="font-[var(--font-family-heading)] text-xl font-semibold tracking-wider text-gray-900 uppercase mb-2">
                            {step.title}
                          </h3>
                          <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic & Fallback Services Section */}
      {(() => {
        const fallbackCustomServices = [
          {
            _id: 'static-1',
            title: 'ELEVATE YOUR WORKSPACE',
            image: engraveImg,
            description: 'Enhance office productivity and indoor air quality with curated desk plants, terrariums, and custom pots tailored to your corporate identity and office branding aesthetic.'
          },
          {
            _id: 'static-2',
            title: 'BULK EVENT GIFTING',
            image: boxImg,
            description: 'Specialized bulk gifting for annual meetups, corporate milestones, client appreciation, and festive celebrations with nationwide white-glove doorstep delivery.'
          }
        ];

        const allCustomServices = dynamicServices.length > 0 
          ? [...dynamicServices, ...fallbackCustomServices] 
          : fallbackCustomServices;

        const displayedCustomServices = showAllCustomServices 
          ? allCustomServices 
          : allCustomServices.slice(0, 3);

        return (
          <section className="bg-white border-b border-gray-100 overflow-hidden" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <div className="container mx-auto px-4 md:px-6 max-w-6xl w-full">
              <div className="relative flex flex-col md:flex-row items-center justify-center w-full mb-[30px]">
                <h2 className="section-title text-center" style={{ marginBottom: 0 }}>
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
                  const isExpanded = expandedServiceIds.includes(service._id);
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
                            className={`font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed ${
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
                            onClick={() => toggleExpandService(service._id)}
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

      {/* 5. Contact Form Section */}
      <section id="contact-form-section" className="bg-[var(--color-primary-bg)] overflow-hidden" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto px-4 max-w-[720px] w-full">
          <div className="text-center">
            <h2
              className="section-title"
              style={{ marginBottom: '30px', color: '#06492D' }}
            >
              CONTACT US!
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
                  className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${
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
                  className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${
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
                className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 ${
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
                className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 resize-none ${
                  errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                }`}
              />
              {errors.comment && <span className="text-xs text-red-500 mt-1 font-medium text-left">{errors.comment}</span>}
            </div>

            {/* Privacy Checkbox with Spacing & High Visibility */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="flex items-center gap-3.5 cursor-pointer group text-gray-800 font-normal text-[var(--font-size-md)] select-none">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-4 h-4 flex-shrink-0 flex items-center justify-center border rounded-none transition-all duration-200 ${formData.agreePrivacy ? 'bg-[#06492D] border-[#06492D] text-white' : 'bg-white border-gray-400 group-hover:border-[#06492D]'}`}>
                  {formData.agreePrivacy && (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
                <span>
                  I agree to the{' '}
                  <Link to="/privacy-policy" className="underline text-[#06492D] font-medium hover:opacity-80 transition-colors">
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

export default Corporategift;
