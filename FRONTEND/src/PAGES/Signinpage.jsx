import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/auth/authSlice';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
];

function Signinpage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [countryCode, setCountryCode] = useState('+91');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  const { cartItems, addToCart } = useCart();

  // Helper to process pending custom garden kit & post-login redirect
  const processPostLogin = () => {
    const pendingAddToCartRaw = sessionStorage.getItem('pendingAddToCart');
    if (pendingAddToCartRaw) {
      try {
        const pendingItem = JSON.parse(pendingAddToCartRaw);
        addToCart(pendingItem, 1);
        toast.success(`🛒 ${pendingItem.name || 'Product'} added to your cart!`);
      } catch (e) {
        console.error('Failed to parse pending add to cart item:', e);
      }
      sessionStorage.removeItem('pendingAddToCart');
    }

    const pendingKitRaw = sessionStorage.getItem('pendingCustomKit');
    if (pendingKitRaw) {
      try {
        const pendingKit = JSON.parse(pendingKitRaw);
        addToCart(pendingKit);
        toast.success('🌿 Your Custom Garden Kit has been added to your cart!');
      } catch (e) {
        console.error('Failed to parse pending kit:', e);
      }
      sessionStorage.removeItem('pendingCustomKit');
    }

    const redirectPath = sessionStorage.getItem('postLoginRedirect') || '/cart';
    sessionStorage.removeItem('postLoginRedirect');
    navigate(redirectPath);
  };

  const dispatch = useDispatch();


  // Form States
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    rememberMe: false,
  });

  // Error States
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || isRegister || loginMethod === 'otp') return;

    const initializeGoogleSignIn = () => {
      const container = document.getElementById("google-signin-btn");
      if (window.google?.accounts?.id && container) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });

        container.innerHTML = "";
        const btnWidth = Math.min(container.clientWidth || 280, 300);

        window.google.accounts.id.renderButton(
          container,
          {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: btnWidth || 280
          }
        );
      }
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initializeGoogleSignIn();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRegister, loginMethod]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      const token = response.credential;
      const { data } = await axiosInstance.post("/auth/google", { token });

      if (data.success) {
        dispatch(setUser({ user: data.user, token: data.token }));
        const userName = data.user?.firstName || data.user?.name || data.user?.email?.split('@')[0] || 'User';
        toast.success(`Welcome ${userName}!`);
        processPostLogin();
      } else {
        toast.error(data.message || "Google Authentication failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong during Google Login."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'phone' && typeof val === 'string') {
      val = val.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFormToggle = () => {
    setIsRegister(!isRegister);
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    }));
    setErrors({});
    setOtpSent(false);
    setPhoneOtp('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSendPhoneOTP = async () => {
    const rawPhone = formData.phone ? formData.phone.trim() : '';
    const cleanDigits = rawPhone.replace(/\D/g, '');

    if (!rawPhone || cleanDigits.length < 7 || cleanDigits.length > 15) {
      setErrors({ phone: 'Please enter a valid mobile number' });
      return;
    }

    const fullPhone = rawPhone.startsWith('+') ? rawPhone : (countryCode + cleanDigits);

    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/send-phone-otp', { phone: fullPhone, isRegister });
      if (data.success) {
        toast.success(data.message || 'OTP sent to your phone.');
        setOtpSent(true);
        setResendTimer(45);
        setErrors({});
      } else {
        toast.error(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setErrors({ phoneOtp: 'Please enter the 6-digit OTP code' });
      return;
    }

    const rawPhone = formData.phone ? formData.phone.trim() : '';
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const fullPhone = rawPhone.startsWith('+') ? rawPhone : (countryCode + cleanDigits);

    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/verify-phone-otp', {
        phone: fullPhone,
        otp: phoneOtp.trim(),
      });

      if (data.success) {
        dispatch(setUser({ user: data.user, token: data.token }));
        const loginUserName = data.user?.firstName || 'User';
        toast.success(`Welcome ${loginUserName}!`);
        sessionStorage.removeItem("postLoginRedirect");
        navigate('/');
      } else {
        toast.error(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
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
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (formData.phone.trim().replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/';]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password does not meet complexity requirements';
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!validateRegister()) return;
      try {
        setLoading(true);
        const nameParts = formData.name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
        const fullPhone = countryCode + formData.phone.trim();

        const payload = {
          firstName,
          lastName,
          email: formData.email.trim(),
          password: formData.password,
          phone: fullPhone,
        };
        const { data } = await axiosInstance.post('/auth/register', payload);
        if (data.success) {
          toast.success('Registration successful! Please sign in with your credentials.');
          setFormData((prev) => ({
            ...prev,
            password: '',
            confirmPassword: '',
            agreeTerms: false,
          }));
          setErrors({});
          setIsRegister(false);
        } else {
          toast.error(data.message || 'Registration failed.');
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Something went wrong during registration.'
        );
      } finally {
        setLoading(false);
      }
    } else {
      if (loginMethod === 'otp') {
        if (!otpSent) {
          handleSendPhoneOTP();
        } else {
          handleVerifyPhoneOTP();
        }
        return;
      }

      if (!validateLogin()) return;
      try {
        setLoading(true);
        const payload = {
          email: formData.email.trim(),
          password: formData.password,
        };
        const { data } = await axiosInstance.post('/auth/login', payload);
        if (data.success) {
          dispatch(setUser({ user: data.user, token: data.token }));
          const loginUserName = data.user?.firstName || data.user?.name || data.user?.email?.split('@')[0] || 'User';
          toast.success(`Welcome ${loginUserName}!`);
          processPostLogin();
        } else {
          toast.error(data.message || 'Login failed.');
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Something went wrong during sign in.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const cardContent = (
    <div
      className={`w-full max-w-[380px] bg-white border border-[#e2e8f0] rounded-none shadow-sm flex flex-col transition-all duration-300 ${isRegister ? 'gap-2' : 'gap-4'}`}
      style={{ padding: isRegister ? '18px 32px' : '32px' }}
    >
      <style>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Logo Section */}
      <div className="flex flex-col items-center gap-0.5">
        <Link to="/" className="flex justify-center items-center">
          <img
            src={logo}
            alt="Planters Logo"
            style={{ height: isRegister ? '28px' : '32px', width: 'auto', maxHeight: '32px', objectFit: 'contain' }}
            className="!w-auto object-contain"
          />
        </Link>
        <div className="text-[var(--font-size-md)] font-[var(--font-family-heading)] font-semibold tracking-[2px] text-[#2c3e50] uppercase text-center mt-0.5">
          {isRegister ? 'Register' : 'Sign In'}
        </div>
      </div>

      {/* Sign In Method Toggle */}
      {!isRegister && (
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className={`flex-1 py-1.5 text-[10.5px] font-semibold tracking-wider uppercase transition-colors ${loginMethod === 'password' ? 'border-b-2 border-[#06492D] text-[#06492D]' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => {
              setLoginMethod('password');
              setErrors({});
            }}
          >
            Password Sign-In
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 text-[10.5px] font-semibold tracking-wider uppercase transition-colors ${loginMethod === 'otp' ? 'border-b-2 border-[#06492D] text-[#06492D]' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => {
              setLoginMethod('otp');
              setOtpSent(false);
              setErrors({});
            }}
          >
            Phone OTP Sign-In
          </button>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} noValidate className={`flex flex-col w-full ${isRegister ? 'gap-1.5' : 'gap-3'}`}>
        {isRegister ? (
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={`w-full bg-[#fcfcfc] border px-3 py-1.5 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
              />
              {errors.name && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Mobile Number
              </label>
              <div className="flex gap-1.5 w-full">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-[#fcfcfc] border border-gray-200 px-1.5 py-1.5 text-xs outline-none text-gray-800 font-medium focus:border-[#06492D]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className={`flex-1 w-full bg-[#fcfcfc] border px-3 py-1.5 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                />
              </div>
              {errors.phone && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className={`w-full bg-[#fcfcfc] border px-3 py-1.5 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
              />
              {errors.email && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Choose password"
                  className={`w-full bg-[#fcfcfc] border pl-3 pr-10 py-1.5 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#06492D]"
                >
                  {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.password}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
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
                  className={`w-full bg-[#fcfcfc] border pl-3 pr-10 py-1.5 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#06492D]"
                >
                  {showConfirmPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="w-full mt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-gray-800 text-[11.5px]">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 flex items-center justify-center border rounded-none ${formData.agreeTerms ? 'bg-[#06492D] border-[#06492D] text-white' : 'border-gray-200'}`}>
                  {formData.agreeTerms && (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
                <span>
                  Agree to{' '}
                  <Link to="/terms-conditions" className="text-[#06492D] font-semibold">
                    Terms &amp; Conditions
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="text-[10px] text-red-600 block">{errors.agreeTerms}</span>
              )}
            </div>
          </>
        ) : loginMethod === 'otp' ? (
          /* PHONE OTP SIGN-IN MODE */
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Mobile Number
              </label>
              <div className="flex gap-1.5 w-full">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={otpSent}
                  className="bg-[#fcfcfc] border border-gray-200 px-1.5 py-2 text-xs outline-none text-gray-800 font-medium focus:border-[#06492D]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={otpSent}
                  placeholder="10-digit mobile number"
                  className={`flex-1 w-full bg-[#fcfcfc] border px-3 py-2 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                />
              </div>
              {errors.phone && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>
              )}
            </div>

            {otpSent && (
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                    6-Digit OTP Code
                  </label>
                  {resendTimer > 0 ? (
                    <span className="text-[10px] text-gray-400 font-semibold">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPhoneOTP}
                      className="text-[10px] text-[#06492D] font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(e) => {
                    setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (errors.phoneOtp) setErrors((prev) => ({ ...prev, phoneOtp: '' }));
                  }}
                  placeholder="123456"
                  className={`w-full bg-[#fcfcfc] border px-3 py-2 text-xs font-mono text-center tracking-[4px] font-bold focus:bg-white outline-none rounded-none ${errors.phoneOtp ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                />
                {errors.phoneOtp && (
                  <span className="text-[10px] text-red-600 mt-0.5">{errors.phoneOtp}</span>
                )}
              </div>
            )}
          </>
        ) : (
          /* STANDARD EMAIL/PASSWORD SIGN-IN MODE */
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className={`w-full bg-[#fcfcfc] border px-3 py-2 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
              />
              {errors.email && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`w-full bg-[#fcfcfc] border pl-3 pr-10 py-2 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#06492D]"
                >
                  {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.password}</span>
              )}
            </div>

            <div className="flex justify-end text-[11.5px] w-full mt-0.5">
              <Link
                to="/forgot-password"
                className="text-[#06492D] hover:text-[var(--color-primary-light)] font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary rounded-none w-full text-xs font-semibold py-2.5 uppercase tracking-[2px] mt-1 disabled:opacity-50"
        >
          {loading
            ? 'Please wait...'
            : isRegister
              ? 'Register'
              : loginMethod === 'otp'
                ? otpSent
                  ? 'Sign In with OTP'
                  : 'Send OTP'
                : 'Sign In'}
        </button>

        {/* Google Sign In Button - Only for Sign In mode */}
        {!isRegister && loginMethod === 'password' && (
          <>
            <div className="flex items-center my-0.5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-gray-400 text-[10px] uppercase tracking-wider font-semibold">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="w-full flex justify-center">
              <div id="google-signin-btn" className="w-full flex justify-center"></div>
            </div>
          </>
        )}
      </form>

      {/* Toggle Account Action */}
      <div className="text-center pt-0.5">
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] select-none font-[var(--font-family-base)] py-6 px-4">
      {cardContent}
    </div>
  );
}

export default Signinpage;
