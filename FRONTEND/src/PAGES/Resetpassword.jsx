import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import axiosInstance from '../api/axiosInstance';

function Resetpassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/';]).{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Password does not meet complexity requirements';
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/reset-password', {
        token,
        password,
      });

      if (data.success) {
        toast.success(data.message || 'Password reset successfully! Please sign in.');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired password reset link.');
    } finally {
      setLoading(false);
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
            Set New Password
          </div>
        </div>

        {/* Info Description */}
        <p className="text-[11.5px] text-gray-800 font-normal text-center leading-relaxed">
          Please enter your new password below to reset your account credentials.
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
              New Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Enter new password"
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

            {/* Password Requirements Checklist */}
            <div className="mt-1.5 p-2 bg-gray-50 border border-gray-200 rounded-none text-[11px]">
              <p className="font-semibold text-gray-700 mb-1">Password Requirements:</p>
              <div className="space-y-0.5">
                {[
                  { label: "At least 8 characters", met: password.length >= 8 },
                  { label: "1 uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
                  { label: "1 lowercase letter (a-z)", met: /[a-z]/.test(password) },
                  { label: "1 number (0-9)", met: /[0-9]/.test(password) },
                  { label: "1 special character (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/';]/.test(password) }
                ].map((req, idx) => (
                  <div key={idx} className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-200 ${req.met ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                    <span className={`inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold rounded-full ${req.met ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {req.met ? '✓' : '✕'}
                    </span>
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
              Confirm New Password
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirm new password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary rounded-none w-full py-3 text-xs font-normal transition-all duration-300 uppercase tracking-[2px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : 'Submit New Password'}
          </button>
        </form>

        {/* Back to Sign In Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-800 font-normal">
            Back to{' '}
            <Link
              to="/signin"
              className="text-[#06492D] font-semibold cursor-pointer focus:outline-none ml-1 hover:text-[var(--color-primary-light)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;
