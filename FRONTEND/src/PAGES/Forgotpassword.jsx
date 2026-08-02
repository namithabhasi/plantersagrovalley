import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

function Forgotpassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = () => {
        if (!email.trim()) {
            setError('Email address is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail()) return;

        toast.success('Password reset link has been sent to your email.');

        // Simulate API delay, then redirect to sign in
        setTimeout(() => {
            navigate('/signin');
        }, 2000);
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
                        Forgot Password
                    </div>
                </div>

                {/* Info Description */}
                <p className="text-[11.5px] text-gray-800 font-normal text-center leading-relaxed">
                    Please enter your email address below. We will send you a link to reset your password.
                </p>

                {/* Form Container */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-black">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="name@example.com"
                            className={`w-full bg-[#fcfcfc] border px-3.5 py-2.5 text-xs focus:bg-white outline-none rounded-none transition-colors duration-200 text-gray-800 placeholder-gray-300 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#06492D]'
                                }`}
                        />
                        {error && (
                            <span className="text-[10px] text-red-600 mt-0.5">{error}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary rounded-none w-full py-3 text-xs font-normal transition-all duration-300 uppercase tracking-[2px] mt-2"
                    >
                        Reset Password
                    </button>
                </form>

                {/* Back to Sign In Link */}
                <div className="text-center pt-2">
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
