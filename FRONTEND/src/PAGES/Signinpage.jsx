import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

function Signinpage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    rememberMe: false,
  });

  // Error States for Inline Cautions
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFormToggle = () => {
    setIsRegister(!isRegister);
    // Reset passwords & errors
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    }));
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isRegister) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password does not meet complexity requirements';
      }
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!validateRegister()) return;
      toast.success('Registration successful! Please sign in.');
      setIsRegister(false);
    } else {
      if (!validateLogin()) return;
      toast.success('Welcome back! Signed in successfully.');
      navigate('/');
    }
  };

  const cardContent = (
    <div
      className={`w-full max-w-[380px] bg-white border border-[#e2e8f0] rounded-none shadow-sm flex flex-col transition-all duration-300 ${isRegister ? 'gap-4' : 'gap-6'}`}
      style={{ padding: isRegister ? '16px 40px' : '40px' }}
    >

      {/* Logo Section */}
      <div className="flex flex-col items-center gap-2">
        <Link to="/" className="flex justify-center items-center">
          <img
            src={logo}
            alt="Planters Logo"
            style={{ height: '36px', width: 'auto', maxHeight: '36px', objectFit: 'contain' }}
            className="!h-[36px] !w-auto object-contain"
          />
        </Link>
        <div className="text-base font-[var(--font-family-heading)] font-semibold tracking-[2px] text-[#2c3e50] uppercase text-center mt-1">
          {isRegister ? 'Register' : 'Sign In'}
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} noValidate className={`flex flex-col w-full ${isRegister ? 'gap-3' : 'gap-4'}`}>
        {isRegister && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                }`}
            />
            {errors.name && (
              <span className="text-[10px] text-red-600 mt-0.5">{errors.name}</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@example.com"
            className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
              }`}
          />
          {errors.email && (
            <span className="text-[10px] text-red-600 mt-0.5">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholder={isRegister ? 'Choose password' : 'Enter password'}
              className={`w-full bg-[#fcfcfc] border pl-3.5 pr-10 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#06492D] cursor-pointer focus:outline-none flex items-center justify-center shrink-0"
            >
              {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
            </button>
          </div>
          {isRegister && isPasswordFocused && (
            <p className="text-[9.5px] text-red-600 font-medium leading-normal mt-1">
              Password must be min 8 characters, with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.
            </p>
          )}
          {errors.password && (
            <span className="text-[10px] text-red-600 mt-0.5">{errors.password}</span>
          )}
        </div>

        {isRegister && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={`w-full bg-[#fcfcfc] border pl-3.5 pr-10 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#06492D] cursor-pointer focus:outline-none flex items-center justify-center shrink-0"
              >
                {showConfirmPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] text-red-600 mt-0.5">{errors.confirmPassword}</span>
            )}
          </div>
        )}

        {/* Checkbox / Forgot Password */}
        <div className="w-full mt-1">
          {isRegister ? (
            <div className="flex flex-col gap-1.5 w-full">
              <label className="flex items-center gap-2.5 cursor-pointer group text-gray-800 font-normal text-[11.5px]">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 shrink-0 flex items-center justify-center border rounded-none transition-all duration-200 ${formData.agreeTerms ? 'bg-[#06492D] border-[#06492D] text-white' : 'border-gray-200 group-hover:border-gray-300'}`}>
                  {formData.agreeTerms && (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
                <span>
                  Agree to{' '}
                  <Link to="/terms-conditions" className="text-[#06492D] font-semibold hover:text-[var(--color-primary-light)] transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="text-[10px] text-red-600 block">{errors.agreeTerms}</span>
              )}
            </div>
          ) : (
            <div className="flex justify-end text-[11.5px] w-full">
              <Link
                to="/forgot-password"
                className="text-[#06492D] hover:text-[var(--color-primary-light)] font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary rounded-none w-full py-3 text-xs font-normal transition-all duration-300 uppercase tracking-[2px] mt-2"
        >
          {isRegister ? 'Register' : 'Sign In'}
        </button>
      </form>

      {/* Toggle Account Action */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-800 font-normal">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={handleFormToggle}
            className="text-[#06492D] font-semibold hover:text-[var(--color-primary-light)] cursor-pointer focus:outline-none ml-1"
          >
            {isRegister ? 'Sign in here' : 'Register here'}
          </button>
        </p>
      </div>

    </div>
  );

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] select-none font-[var(--font-family-base)] ${isRegister ? 'page-section' : 'px-4 py-12'}`}>
      {isRegister ? (
        <div className="container flex justify-center">
          {cardContent}
        </div>
      ) : (
        cardContent
      )}
    </div>
  );
}

export default Signinpage;
