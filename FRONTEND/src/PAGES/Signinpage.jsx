import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/auth/authSlice';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';

function Signinpage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, syncLocalCartToBackend } = useCart();

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    rememberMe: false,
  });

  // Error States for Inline Cautions
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "square"
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
  }, [isRegister]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      const token = response.credential;
      const { data } = await axiosInstance.post("/auth/google", { token });
      
      if (data.success) {
        dispatch(setUser({ user: data.user, token: data.token }));
        try {
          await syncLocalCartToBackend(cartItems);
        } catch (err) {
          console.error("Cart sync error:", err);
        }
        toast.success("Signed in successfully via Google!");
        navigate("/");
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
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2 || formData.firstName.trim().length > 50) {
      newErrors.firstName = 'First name must be between 2 and 50 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2 || formData.lastName.trim().length > 50) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
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
        const payload = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
        };
        const { data } = await axiosInstance.post('/auth/register', payload);
        if (data.success) {
          dispatch(setUser({ user: data.user, token: data.token }));
          try {
            await syncLocalCartToBackend(cartItems);
          } catch (err) {
            console.error('Cart sync error:', err);
          }
          toast.success('Registration successful! Welcome.');
          navigate('/');
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
          try {
            await syncLocalCartToBackend(cartItems);
          } catch (err) {
            console.error('Cart sync error:', err);
          }
          toast.success('Welcome back! Signed in successfully.');
          navigate('/');
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] px-4 py-12 select-none font-[var(--font-family-base)]">
      <div 
        className="w-full max-w-[380px] bg-white border border-[#e2e8f0] rounded-none shadow-sm flex flex-col gap-6 transition-all duration-300"
        style={{ padding: '40px' }}
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
          {isRegister && (
            <>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-[10px] text-red-600 mt-0.5">{errors.firstName}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                    }`}
                  />
                  {errors.lastName && (
                    <span className="text-[10px] text-red-600 mt-0.5">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                  }`}
                />
                {errors.phone && (
                  <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>
                )}
              </div>
            </>
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
              className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                placeholder={isRegister ? 'Choose password' : 'Enter password'}
                className={`w-full bg-[#fcfcfc] border pl-3.5 pr-10 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                  className={`w-full bg-[#fcfcfc] border pl-3.5 pr-10 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
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
                <label className="flex items-center space-x-2 cursor-pointer group text-gray-400 font-light text-[11px]">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 flex items-center justify-center border rounded-none transition-all duration-200 ${formData.agreeTerms ? 'bg-[#06492D] border-[#06492D] text-white' : 'border-gray-200 group-hover:border-gray-300'}`}>
                    {formData.agreeTerms && (
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                  <span>
                    Agree to{' '}
                    <Link to="/terms-conditions" className="underline hover:text-[#06492D] transition-colors">
                      Terms &amp; Conditions
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <span className="text-[10px] text-red-600 block">{errors.agreeTerms}</span>
                )}
              </div>
            ) : (
              <div className="flex justify-end text-[11px] w-full">
                <Link
                  to="/faqs"
                  className="text-gray-400 hover:text-[#06492D] transition-colors underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary rounded-none w-full py-3 text-xs font-normal transition-all duration-300 uppercase tracking-[2px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-light tracking-wider">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <div id="google-signin-btn" className="w-full flex justify-center mt-1"></div>
        ) : (
          <button
            type="button"
            onClick={() => toast.warning("Google Login is not configured. Please add VITE_GOOGLE_CLIENT_ID to your FRONTEND/.env file.")}
            className="w-full border border-gray-200 py-2.5 text-xs text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 mt-1 rounded-none cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.62 15.02 1 12 1 7.28 1 3.26 3.73 1.34 7.73l3.96 3.07C6.26 7.79 8.9 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.45 12.3c0-.82-.07-1.6-.21-2.3H12v4.38h6.43c-.28 1.44-1.1 2.66-2.33 3.48l3.6 2.8c2.1-1.94 3.75-4.8 3.75-8.36z" />
              <path fill="#FBBC05" d="M5.3 14.73A7.16 7.16 0 0 1 4.9 12c0-.96.17-1.88.47-2.73L1.4 6.2C.5 8 0 10 0 12s.5 4 1.4 5.8l3.9-3.07z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.6-2.8c-1 .67-2.28 1.07-3.6 1.07-3.1 0-5.74-2.75-6.7-5.76L1.1 15.67C3.02 19.67 7.04 23 12 23z" />
            </svg>
            Sign in with Google
          </button>
        )}

        {/* Toggle Account Action */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 font-light">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={handleFormToggle}
              className="text-[#06492D] font-normal hover:underline cursor-pointer focus:outline-none ml-1"
            >
              {isRegister ? 'Sign in here' : 'Register here'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signinpage;
