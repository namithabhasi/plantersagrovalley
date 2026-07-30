import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaPinterestP, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
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
    const val = type === 'checkbox' ? checked : value;
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
      // Simulate sending enquiry message
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', phone: '', comment: '', agreePrivacy: false });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white select-none font-[var(--font-family-base)]">
      {/* Small Banner / Hero Page Header */}
      <div className="w-full bg-[#f8f9fa] border-b border-gray-100 py-10 md:py-14 text-center">
        <div className="container mx-auto">
          <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-400">
            Get in touch
          </span>
          <h1 className="text-2xl md:text-3xl font-[var(--font-family-heading)] font-normal text-[#2c3e50] tracking-wide mt-2">
            CONTACT US
          </h1>
        </div>
      </div>

      <div className="container mx-auto pt-12 pb-24 md:pt-20 md:pb-36 min-h-[65vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Form Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
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
                {errors.name && <span className="text-[10px] text-red-600 mt-0.5">{errors.name}</span>}
              </div>

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
                {errors.email && <span className="text-[10px] text-red-600 mt-0.5">{errors.email}</span>}
              </div>

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
                {errors.phone && <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <textarea
                  name="comment"
                  rows={6}
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Comment"
                  className={`w-full bg-[#fcfcfc] border px-4 py-3.5 text-xs outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-400 resize-none ${
                    errors.comment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                  }`}
                />
                {errors.comment && <span className="text-[10px] text-red-600 mt-0.5">{errors.comment}</span>}
              </div>

              {/* Privacy Policy Checkbox */}
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
                className="btn btn-primary rounded-none w-full max-w-[180px] py-3.5 text-xs font-semibold tracking-wider uppercase hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Info Column */}
          <div className="lg:col-span-4 flex flex-col gap-5 text-left lg:border-l lg:border-gray-100 lg:pl-12 pl-0 pb-10 lg:pb-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-[var(--font-family-heading)] text-lg font-normal text-[#2c3e50] tracking-wide uppercase text-xs">
                Information
              </h3>
              <a href={`mailto:${contactInfo.infoEmail}`} className="text-xs sm:text-sm text-gray-500 hover:text-[#06492D] transition-colors underline break-all font-light font-[var(--font-family-base)]">
                {contactInfo.infoEmail}
              </a>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-[var(--font-family-heading)] text-lg font-normal text-[#2c3e50] tracking-wide uppercase text-xs">
                Care
              </h3>
              <a href={`mailto:${contactInfo.careEmail}`} className="text-xs sm:text-sm text-gray-500 hover:text-[#06492D] transition-colors underline break-all font-light font-[var(--font-family-base)]">
                {contactInfo.careEmail}
              </a>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-[var(--font-family-heading)] text-lg font-normal text-[#2c3e50] tracking-wide uppercase text-xs">
                Mobile
              </h3>
              <a href={`tel:${contactInfo.mobile}`} className="text-xs sm:text-sm text-gray-500 hover:text-[#06492D] transition-colors hover:underline font-light font-[var(--font-family-base)]">
                {contactInfo.mobile}
              </a>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-[var(--font-family-heading)] text-lg font-normal text-[#2c3e50] tracking-wide uppercase text-xs">
                Office Time
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-light font-[var(--font-family-base)]">
                {contactInfo.officeTime}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-[var(--font-family-heading)] text-lg font-normal text-[#2c3e50] tracking-wide uppercase text-xs">
                Follow us
              </h3>
              <div className="flex items-center text-[#2c3e50] mt-2" style={{ gap: '20px' }}>
                <a href={contactInfo.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="Facebook">
                  <FaFacebookF size={15} />
                </a>
                <a href={contactInfo.twitter || "https://x.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="X (Twitter)">
                  <FaXTwitter size={15} />
                </a>
                <a href={contactInfo.pinterest || "https://pinterest.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="Pinterest">
                  <FaPinterestP size={15} />
                </a>
                <a href={contactInfo.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="Instagram">
                  <FaInstagram size={15} />
                </a>
                <a href={contactInfo.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="LinkedIn">
                  <FaLinkedinIn size={15} />
                </a>
                <a href={contactInfo.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="hover:text-[#06492D] transition-colors" aria-label="YouTube">
                  <FaYoutube size={15} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Getintouch;
