import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { IoArrowForward } from 'react-icons/io5';

function Signinpage() {
  const [email, setEmail] = useState('');
  const [emailMe, setEmailMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signing in with: ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 py-12 select-none font-[var(--font-family-base)]">
      <div className="w-full max-w-[440px] flex flex-col items-center gap-8">
        
        {/* Brand Logo - Fixed size with inline styles to override global resets */}
        <Link to="/" className="flex justify-center items-center">
          <img
            src={logo}
            alt="Planters Logo"
            style={{ height: '90px', width: 'auto', maxHeight: '90px', objectFit: 'contain' }}
            className="!h-[90px] !w-auto object-contain"
          />
        </Link>

        {/* Sign In Form Container */}
        <div className="w-full bg-white text-[#2c3e50] flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-[var(--font-family-heading)] font-semibold tracking-wide text-gray-900">
              Sign in
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Sign in or create an account
            </p>
          </div>

          {/* Continue with Shop Button - styled with btn-primary from index.css */}
          <button 
            className="btn btn-primary w-full py-4 text-sm font-semibold transition-all duration-300 select-none shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            style={{ borderRadius: '9999px', backgroundColor: 'var(--color-primary-dark)' }}
          >
            Continue with shop
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center my-2">
            <div className="border-b border-gray-200 flex-grow"></div>
            <span className="px-4 text-sm text-gray-400 font-light bg-white">or</span>
            <div className="border-b border-gray-200 flex-grow"></div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative flex items-center justify-between border border-[#06492D] rounded-xl px-4 py-3.5 focus-within:ring-1 focus-within:ring-[#06492D] transition-all duration-300">
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent !border-none !outline-none !p-0 !bg-transparent text-gray-800 placeholder-gray-400 w-full text-base font-[var(--font-family-base)]"
              />
              <button 
                type="submit" 
                className="text-gray-900 hover:text-[var(--color-primary)] ml-2 cursor-pointer flex items-center justify-center shrink-0 transition-colors"
                aria-label="Submit Email"
              >
                <IoArrowForward size={20} />
              </button>
            </div>

            {/* Email offers checkbox wrapper */}
            <label className="flex items-center space-x-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={emailMe}
                onChange={(e) => setEmailMe(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${emailMe ? 'bg-[#06492D] border-[#06492D] text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                {emailMe && (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 font-light">
                Email me with news and offers
              </span>
            </label>
          </form>

          {/* Terms footer info */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-400 font-light font-[var(--font-family-base)]">
              By continuing, you agree to our{' '}
              <Link to="/terms-conditions" className="underline text-gray-500 hover:text-gray-700 transition-colors">
                Terms of service
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Signinpage;
