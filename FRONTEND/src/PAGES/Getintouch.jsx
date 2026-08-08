import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaPinterestP, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';

function Getintouch() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
    agreePrivacy: false
  });

  const [errors, setErrors] = useState({});
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

  useEffect(() => {
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
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment.trim()
      };
      const { data } = await axios.post('/enquiries', payload);
      if (data.success) {
        toast.success(data.message || 'Your message has been sent successfully!');
        setFormData({ name: '', email: '', phone: '', comment: '', agreePrivacy: false });
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send message. Please try again.'
      );
    }
  };

  return (
    <div className="w-full bg-white select-none font-[var(--font-family-base)]">
      {/* Redesigned Contact Section matching Gardenmaintanence.jsx padding, spacing and layout */}
      <section id="contact-form-section" className="bg-[var(--color-primary-bg)] px-4 md:px-6" style={{ paddingTop: '50px', paddingBottom: '70px' }}>
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
              <p style={{ marginBottom: '20px', textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'left' }} className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-gray-700 leading-relaxed mb-10 max-w-sm">
                Get in touch with us for customized plant inquiries, garden maintenance, or any support needed.
              </p>

              {/* Contact Details List */}
              <div className="flex flex-col gap-6 text-gray-700 text-[var(--font-size-md)] mb-10">
                <a href={`tel:${contactInfo.mobile || "+918468888666"}`} className="flex items-center gap-3 justify-center md:justify-start text-gray-700 hover:text-[#06492D] transition-colors text-decoration-none">
                  <FaPhoneAlt className="text-[var(--color-primary-dark)]" size={15} />
                  <span>{contactInfo.mobile || "+91 8468888666"}</span>
                </a>
                <a href={`mailto:${contactInfo.infoEmail || "hello@plantersagrovalley.com"}`} className="flex items-center gap-3 justify-center md:justify-start text-gray-700 hover:text-[#06492D] transition-colors text-decoration-none">
                  <FaEnvelope className="text-[var(--color-primary-dark)]" size={15} />
                  <span>{contactInfo.infoEmail || "hello@plantersagrovalley.com"}</span>
                </a>
                <a 
                  href="https://maps.google.com/?q=Planters+Agro+Valley,+Ernakulam,+Kerala,+India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 justify-center md:justify-start text-gray-700 hover:text-[#06492D] hover:underline cursor-pointer text-decoration-none transition-colors"
                >
                  <FaMapMarkerAlt className="text-[var(--color-primary-dark)]" size={15} />
                  <span>Planters Agro Valley, Ernakulam, Kerala, India</span>
                </a>
              </div>

              {/* Social Media Links with Spacing */}
              <div className="mt-6 pt-4 flex flex-col gap-4 items-center md:items-start">
                <span className="text-[var(--font-size-md)] font-semibold text-gray-700 uppercase tracking-wider">Follow Us</span>
                <div className="flex items-center gap-5 text-gray-700">
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

            {/* Right Column: Contact Form */}
            <div className="w-full flex justify-center md:justify-start">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 w-full max-w-[400px]">
                
                {/* Name Input */}
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1 font-medium text-left">
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
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1 font-medium text-left">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone Input */}
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Phone number"
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-700 placeholder-gray-400 ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-500 mt-1 font-medium text-left">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex flex-col gap-1 w-full">
                  <textarea
                    name="comment"
                    rows={4}
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Comment"
                    className={`w-full bg-white border px-4 py-3.5 text-[var(--font-size-md)] outline-none rounded-none transition-colors duration-200 text-gray-700 placeholder-gray-400 resize-none ${
                      errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.comment && (
                    <span className="text-xs text-red-500 mt-1 font-medium text-left">
                      {errors.comment}
                    </span>
                  )}
                </div>

                {/* Privacy Checkbox with Extra Spacing */}
                <div className="flex flex-col gap-1 mt-1 relative">
                  <label className="flex items-center gap-3 cursor-pointer group text-gray-700 text-[var(--font-size-md)] text-left">
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 flex items-center justify-center border rounded-none shrink-0 transition-all duration-200 ${formData.agreePrivacy ? 'bg-[#06492D] border-[#06492D] text-white' : 'bg-white border-gray-300 group-hover:border-[#06492D]'}`}>
                      {formData.agreePrivacy && (
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
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
                    <span className="text-xs text-red-500 mt-1 font-medium text-left">
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

export default Getintouch;
