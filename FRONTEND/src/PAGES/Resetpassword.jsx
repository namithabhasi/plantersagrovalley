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

  const validate = () => {
    const newErrors = {};

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!password) {
      newErrors.password = 'New password is required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password does not meet complexity requirements';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/reset-password', {
        token,
        password,
      });

      if (data.success) {
        toast.success(data.message || 'Password reset successful!');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        toast.error(data.message || 'Password reset failed.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Password reset token is invalid or has expired.';
      toast.error(serverMsg);
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
            Reset Password
          </div>
        </div>

        {/* Info Description */}
        <p className="text-[11.5px] text-gray-800 font-normal text-center leading-relaxed">
          Please enter your new password below to reset your account security credentials.
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
              New Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-red-600 mt-0.5">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
              Confirm New Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="••••••••"
                className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                }}
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
            className="btn btn-primary rounded-none w-full py-3 text-xs font-normal transition-all duration-300 uppercase tracking-[2px] mt-2 disabled:opacity-50"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
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
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;
