import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheck,
  FaHeadset,
  FaClipboardList,
  FaRegCheckSquare,
  FaPlus,
  FaMinus,
  FaPaperPlane,
  FaLeaf,
  FaBuilding,
  FaLaptopCode,
  FaNetworkWired,
  FaRocket,
  FaCompass,
  FaGlobe,
  FaGoogle,
  FaMicrochip,
  FaCogs
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
  const [dynamicServices, setDynamicServices] = useState([]);

  const [expandedOfferings, setExpandedOfferings] = useState([]);
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [expandedServices, setExpandedServices] = useState([]);
  const [showAllCustomServices, setShowAllCustomServices] = useState(false);

  const toggleOfferingExpand = (id) => {
    setExpandedOfferings(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleStepExpand = (idx) => {
    setExpandedSteps(prev => 
      prev.includes(idx) ? prev.filter(item => item !== idx) : [...prev, idx]
    );
  };

  const toggleServiceExpand = (id) => {
    setExpandedServices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const { data } = await axios.get('/services?activeOnly=true&serviceType=plant-rental');
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
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
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
        toast.success('Thank you for your plant rental enquiry, we will get back to you soon!');
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
          paddingTop: '50px',
          paddingBottom: '50px'
        }}
      >
        <div className="container mx-auto relative z-10 flex justify-center items-center">
          <div className="max-w-2xl w-full text-center bg-white/75 backdrop-blur-md p-8 md:p-12 border border-white/40 shadow-lg rounded-sm my-auto flex flex-col items-center justify-center">
            <span className="text-[var(--font-size-md)] font-semibold uppercase tracking-[3px] text-black mb-2 block text-center w-full">
              Plant Rental
            </span>
            <h1 
              className="font-[var(--font-family-heading)] text-3xl md:text-[42px] font-normal leading-tight text-[var(--color-primary-dark)] text-center w-full"
              style={{ marginBottom: '20px', textAlign: 'center' }}
            >
              GREENER SPACES, WITHOUT THE HASSLE.
            </h1>
            <p 
              className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-black font-normal leading-relaxed text-center mb-8 max-w-lg mx-auto w-full"
              style={{ textAlign: 'center' }}
            >
              Bring natural freshness and beautiful aesthetics to your home, office or corporate events — on flexible rental plans.
            </p>
            <div className="flex justify-center w-full" style={{ marginTop: '16px', marginBottom: '12px' }}>
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

      {/* 3. Plant Rental Offerings Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto">
          <div className="text-center">
            <h2
              className="section-title"
              style={{ marginBottom: '30px' }}
            >
              PLANT RENTAL OFFERINGS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center">
            {/* Offering 1 */}
            <div className="product-card-wrapper max-w-[340px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image">
                  <img src={officeImg} alt="Office Plant Styling" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-5 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-[#06492D] mb-2 text-center">
                    OFFICE PLANT STYLING
                  </h4>
                  <p 
                    className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed max-w-[280px] mx-auto text-center"
                    style={{ textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'center', wordBreak: 'break-word', letterSpacing: '-0.01em' }}
                  >
                    Transform your office workspace with low-maintenance, air-purifying indoor plants that boost productivity and reduce stress.
                  </p>
                </div>
              </div>
            </div>

            {/* Offering 2 */}
            <div className="product-card-wrapper max-w-[340px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image">
                  <img src={eventImg} alt="Event Greenery" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-5 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-[#06492D] mb-2 text-center">
                    EVENT GREENERY
                  </h4>
                  <p 
                    className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed max-w-[280px] mx-auto text-center"
                    style={{ textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'center', wordBreak: 'break-word', letterSpacing: '-0.01em' }}
                  >
                    Make your corporate conferences, product launches, and annual events stand out with custom-designed green accents.
                  </p>
                </div>
              </div>
            </div>

            {/* Offering 3 */}
            <div className="product-card-wrapper max-w-[340px] w-full flex flex-col h-full bg-white shadow-sm border border-gray-100">
              <div className="product-card w-full flex flex-col h-full">
                <div className="product-card-image">
                  <img src={shortImg} alt="Short-Term Rental" />
                </div>
                <div className="product-card-content text-center flex-grow flex flex-col items-center justify-center p-5 my-auto">
                  <h4 className="product-title uppercase tracking-wider text-sm font-semibold text-[#06492D] mb-2 text-center">
                    SHORT-TERM RENTAL
                  </h4>
                  <p 
                    className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed max-w-[280px] mx-auto text-center"
                    style={{ textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'center', wordBreak: 'break-word', letterSpacing: '-0.01em' }}
                  >
                    Flexible rental options for retail displays, weddings, exhibitions, and photoshoots, complete with fast setup and removal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white border-b border-gray-100" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="text-center">
            <h2
              className="section-title"
              style={{ marginBottom: '30px' }}
            >
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto w-full justify-items-center justify-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[var(--color-primary-dark)] text-lg mb-6 shadow-sm">
                <FaHeadset />
              </div>
              <h4 
                className="font-[var(--font-family-heading)] text-sm font-semibold tracking-wider text-[#06492D] uppercase"
                style={{ marginBottom: '16px' }}
              >
                SITE VISIT
              </h4>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-xs">
                Schedule a site visit with our experts. We survey your space to assess lighting and select the ideal plants.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[var(--color-primary-dark)] text-lg mb-6 shadow-sm">
                <FaClipboardList />
              </div>
              <h4 
                className="font-[var(--font-family-heading)] text-sm font-semibold tracking-wider text-[#06492D] uppercase"
                style={{ marginBottom: '16px' }}
              >
                PLANNING
              </h4>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-xs">
                Receive custom plantscaping ideas and layouts tailored to elevate your space for quick approval.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[var(--color-primary-dark)] text-lg mb-6 shadow-sm">
                <FaRegCheckSquare />
              </div>
              <h4 
                className="font-[var(--font-family-heading)] text-sm font-semibold tracking-wider text-[#06492D] uppercase"
                style={{ marginBottom: '16px' }}
              >
                INSTALLATION
              </h4>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed text-center max-w-xs">
                Flawless installation by our skilled team. We deliver and arrange every planter for a vibrant space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Plant Rental FAQs Section */}
      <section className="bg-[var(--color-primary-bg)] border-b border-gray-100" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto max-w-[850px] px-6">
          <div className="text-center">
            <h2
              className="section-title"
              style={{ marginBottom: '30px' }}
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
                    <span className="font-[var(--font-family-heading)] text-xs md:text-sm font-semibold tracking-wider text-[#06492D] uppercase group-hover:text-[var(--color-primary-dark)] transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-[#06492D] group-hover:text-[var(--color-primary-dark)] ml-4 transition-colors">
                      {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <p 
                      className="font-[var(--font-family-base)] text-[var(--font-size-md)] leading-relaxed text-gray-600 max-w-3xl"
                      style={{ textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'left', wordBreak: 'break-word', letterSpacing: '-0.01em' }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic & Fallback Custom Services Section */}
      {(() => {
        const fallbackCustomServices = [
          {
            _id: 'static-rental-1',
            title: 'OFFICE LANDSCAPING & MAINTENANCE',
            image: officeImg,
            description: 'Complete green styling and routine plant maintenance for office spaces, corporate lobbies, and commercial buildings with zero hassle.'
          },
          {
            _id: 'static-rental-2',
            title: 'EVENT & SHORT-TERM PLANT RENTAL',
            image: eventImg,
            description: 'Custom plant rental solutions tailored for corporate conferences, exhibitions, product launches, and special events with fast installation.'
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

      {/* 6. Contact Form Section */}
      <section id="contact-form-section" className="bg-[var(--color-primary-bg)] overflow-hidden" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="container mx-auto px-4 max-w-[720px] w-full">
          <div className="text-center">
            <h2
              className="section-title"
              style={{ marginBottom: '30px', color: '#06492D' }}
            >
              VISIT US!
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

export default Plantrental;
