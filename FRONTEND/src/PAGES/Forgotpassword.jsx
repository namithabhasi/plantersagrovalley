import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
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

function Forgotpassword() {
    const [resetMode, setResetMode] = useState('otp'); // 'link' or 'otp'
    const [countryCode, setCountryCode] = useState('+91');
    const [identifier, setIdentifier] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Mode A: Email Reset Link
    const handleSendLink = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            setErrors({ identifier: 'Email address is required' });
            return;
        } else if (!/\S+@\S+\.\S+/.test(identifier.trim())) {
            setErrors({ identifier: 'Please enter a valid email address' });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/auth/forgot-password', { email: identifier.trim() });
            if (data.success) {
                toast.success(data.message || 'Password reset link sent to your email.');
                setIdentifier('');
                setTimeout(() => navigate('/signin'), 3000);
            } else {
                toast.error(data.message || 'Failed to send reset link.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Mode B Step 1: Send OTP to Phone or Email
    const handleSendResetOTP = async (e) => {
        e.preventDefault();
        const clean = identifier.trim();

        if (!clean) {
            setErrors({ identifier: 'Email or mobile number is required' });
            return;
        }

        const cleanDigits = clean.replace(/\D/g, '');
        const isPhone = !clean.includes('@') && (cleanDigits.length > 0 || /^\+?\d+$/.test(clean));

        if (isPhone) {
            if (!cleanDigits || cleanDigits.length < 7 || cleanDigits.length > 10) {
                setErrors({ identifier: 'Please enter a valid 10-digit mobile number' });
                return;
            }
        }

        const fullIdentifier = isPhone ? (clean.startsWith('+') ? clean : (countryCode + cleanDigits)) : clean;

        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/auth/send-reset-otp', { identifier: fullIdentifier });
            if (data.success) {
                toast.success(data.message || 'Reset OTP sent successfully!');
                setOtpSent(true);
                setErrors({});
            } else {
                toast.error(data.message || 'Failed to send reset OTP.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    // Mode B Step 2: Verify OTP & Set New Password
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!otpCode.trim() || otpCode.trim().length !== 6) {
            newErrors.otpCode = 'Please enter the 6-digit OTP code';
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/';]).{8,}$/;
        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (!passwordRegex.test(newPassword)) {
            newErrors.newPassword = 'Password does not meet complexity requirements';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const clean = identifier.trim();
        const cleanDigits = clean.replace(/\D/g, '');
        const isPhone = cleanDigits.length >= 7 && !clean.includes('@');
        const fullIdentifier = isPhone ? (clean.startsWith('+') ? clean : (countryCode + cleanDigits)) : clean;

        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/auth/verify-reset-otp', {
                identifier: fullIdentifier,
                otp: otpCode.trim(),
                newPassword,
            });

            if (data.success) {
                toast.success(data.message || 'Password reset successfully! Please sign in.');
                setTimeout(() => navigate('/signin'), 2000);
            } else {
                toast.error(data.message || 'Verification failed.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired OTP code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] px-4 py-12 select-none font-[var(--font-family-base)]">
            <div
                className="w-full max-w-[380px] bg-white border border-[#e2e8f0] rounded-none shadow-sm flex flex-col gap-5 transition-all duration-300"
                style={{ padding: '36px' }}
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
                    <div className="text-sm font-[var(--font-family-heading)] font-semibold tracking-[2px] text-[#2c3e50] uppercase text-center mt-1">
                        Forgot Password
                    </div>
                </div>

                {/* Reset Mode Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-[11px] font-semibold tracking-wider uppercase transition-colors ${resetMode === 'otp' ? 'border-b-2 border-[#06492D] text-[#06492D]' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => {
                            setResetMode('otp');
                            setOtpSent(false);
                            setErrors({});
                        }}
                    >
                        Reset via OTP
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-[11px] font-semibold tracking-wider uppercase transition-colors ${resetMode === 'link' ? 'border-b-2 border-[#06492D] text-[#06492D]' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => {
                            setResetMode('link');
                            setOtpSent(false);
                            setErrors({});
                        }}
                    >
                        Email Link
                    </button>
                </div>

                {resetMode === 'link' ? (
                    <form onSubmit={handleSendLink} noValidate className="flex flex-col gap-4 w-full">
                        <p className="text-[11.5px] text-gray-600 text-center leading-relaxed">
                            Enter your registered email address to receive a password reset link.
                        </p>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value);
                                    if (errors.identifier) setErrors({});
                                }}
                                placeholder="name@example.com"
                                className={`w-full bg-[#fcfcfc] border px-3.5 py-2 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.identifier ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                            />
                            {errors.identifier && (
                                <span className="text-[10px] text-red-600 mt-0.5">{errors.identifier}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary rounded-none w-full py-2.5 text-xs font-semibold transition-all uppercase tracking-[2px] mt-1 disabled:opacity-50"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={otpSent ? handleVerifyOTP : handleSendResetOTP} noValidate className="flex flex-col gap-3.5 w-full">
                        <p className="text-[11.5px] text-gray-600 text-center leading-relaxed">
                            {otpSent
                                ? 'Enter the 6-digit OTP code sent to your phone/email and set your new password.'
                                : 'Enter your registered email address or mobile number to receive a 6-digit OTP.'}
                        </p>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                                Email or Mobile Number
                            </label>
                            <div className="flex gap-1.5 w-full">
                                {/^[0-9]*$/.test(identifier.trim()) && (
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
                                )}
                                <input
                                    type="text"
                                    value={identifier}
                                    disabled={otpSent}
                                    maxLength={/^\d+$/.test(identifier.trim()) ? 10 : 80}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d+$/.test(val) && val.length > 10) return;
                                        setIdentifier(val);
                                        if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
                                    }}
                                    placeholder="Email or mobile number"
                                    className={`flex-1 w-full bg-[#fcfcfc] border px-3.5 py-2 text-xs focus:bg-white outline-none rounded-none transition-colors text-gray-800 placeholder-gray-300 ${errors.identifier ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                                />
                            </div>
                            {errors.identifier && (
                                <span className="text-[10px] text-red-600 mt-0.5">{errors.identifier}</span>
                            )}
                        </div>

                        {otpSent && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                                            6-Digit OTP Code
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            className="text-[10px] text-[#06492D] font-semibold hover:underline"
                                        >
                                            Change Entry
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => {
                                            setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                            if (errors.otpCode) setErrors((prev) => ({ ...prev, otpCode: '' }));
                                        }}
                                        placeholder="123456"
                                        className={`w-full bg-[#fcfcfc] border px-3.5 py-2 text-xs font-mono text-center tracking-[4px] font-bold focus:bg-white outline-none rounded-none ${errors.otpCode ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                                    />
                                    {errors.otpCode && (
                                        <span className="text-[10px] text-red-600 mt-0.5">{errors.otpCode}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                                        New Password
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                                            }}
                                            placeholder="Enter new password"
                                            className={`w-full bg-[#fcfcfc] border pl-3.5 pr-10 py-2 text-xs focus:bg-white outline-none rounded-none ${errors.newPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#06492D]"
                                        >
                                            {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <span className="text-[10px] text-red-600 mt-0.5">{errors.newPassword}</span>
                                    )}
                                </div>

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
                                            className={`w-full bg-[#fcfcfc] border pl-3.5 pr-10 py-2 text-xs focus:bg-white outline-none rounded-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#06492D]'}`}
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
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary rounded-none w-full py-2.5 text-xs font-semibold transition-all uppercase tracking-[2px] mt-1 disabled:opacity-50"
                        >
                            {loading ? 'Please wait...' : otpSent ? 'Update Password' : 'Send Reset OTP'}
                        </button>
                    </form>
                )}

                <div className="text-center pt-1 border-t border-gray-100">
                    <p className="text-xs text-gray-800 font-normal">
                        Remember your password?{' '}
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

export default Forgotpassword;
