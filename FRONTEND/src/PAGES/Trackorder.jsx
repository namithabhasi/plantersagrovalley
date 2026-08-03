import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import axios from '../api/axiosInstance';

function Trackorder() {
  const [trackingId, setTrackingId] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedData, setTrackedData] = useState(null);
  const [error, setError] = useState('');
  const [trackingIdError, setTrackingIdError] = useState('');
  const [contactInfoError, setContactInfoError] = useState('');

  const handleTrackingIdChange = (val) => {
    setTrackingId(val);
    if (trackingIdError) setTrackingIdError('');
  };

  const handleContactInfoChange = (val) => {
    setContactInfo(val);
    if (contactInfoError) setContactInfoError('');
  };

  const handleTrack = (e) => {
    e.preventDefault();
    setError('');
    setTrackingIdError('');
    setContactInfoError('');

    let hasError = false;
    if (!trackingId.trim()) {
      setTrackingIdError('Tracking ID is required.');
      hasError = true;
    }
    if (!contactInfo.trim()) {
      setContactInfoError('Email or Phone number is required.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setTrackedData(null);
    setLoading(true);

    axios.post("/orders/track", {
      trackingId: trackingId.trim(),
      contactInfo: contactInfo.trim()
    })
      .then(response => {
        setLoading(false);
        if (response.data && response.data.success) {
          setTrackedData(response.data.data);
        } else {
          setError(response.data.message || 'Could not retrieve tracking details.');
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.response?.data?.message || 'Order not found or invalid details provided.');
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-8 md:py-12 font-[var(--font-family-base)]">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex justify-center items-center">
          <img
            src={logo}
            alt="Planters Logo"
            style={{ height: '65px', width: 'auto', maxHeight: '65px', objectFit: 'contain' }}
            className="!h-[65px] !w-auto object-contain"
          />
        </Link>

        {/* Form Container */}
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="text-[26px] font-[var(--font-family-heading)] font-normal tracking-wide text-gray-900 leading-tight">
              Track Your Order
            </h1>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Just enter your Tracking ID & it's done.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleTrack} className="flex flex-col gap-4">

            {/* Inputs with 3px border-radius and no icons */}
            <div className="flex flex-col gap-3">
              <div>
                <input
                  required
                  type="text"
                  placeholder="Enter Tracking ID (e.g. PLA-XXXX)"
                  value={trackingId}
                  onChange={(e) => handleTrackingIdChange(e.target.value)}
                  style={{ borderRadius: '3px' }}
                  className={`w-full px-3.5 py-2.5 border outline-none text-gray-800 placeholder-gray-400 text-xs font-light transition-all ${
                    trackingIdError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#06492D] focus:ring-[#06492D]'
                  }`}
                />
                {trackingIdError && (
                  <p className="text-[10px] text-red-500 font-light mt-1 pl-1 text-left">
                    {trackingIdError}
                  </p>
                )}
              </div>

              <div>
                <input
                  required
                  type="text"
                  placeholder="Enter Email/Phone"
                  value={contactInfo}
                  onChange={(e) => handleContactInfoChange(e.target.value)}
                  style={{ borderRadius: '3px' }}
                  className={`w-full px-3.5 py-2.5 border outline-none text-gray-800 placeholder-gray-400 text-xs font-light transition-all ${
                    contactInfoError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#06492D] focus:ring-[#06492D]'
                  }`}
                />
                {contactInfoError && (
                  <p className="text-[10px] text-red-500 font-light mt-1 pl-1 text-left">
                    {contactInfoError}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-[11px] text-red-600 font-light text-center">
                {error}
              </p>
            )}

            {/* Track Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 text-xs !font-normal transition-all duration-300 select-none flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              style={{ borderRadius: '3px', height: '40px' }}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Results Section */}
          {trackedData && (
            <div 
              style={{ borderRadius: '3px' }} 
              className="w-full border border-gray-200 p-5 mt-4 bg-[#fbfdfb] flex flex-col gap-5 transition-all duration-300 animate-fadeIn"
            >
              {/* Header Status */}
              <div className="border-b border-gray-100 pb-3 flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-light">
                    Status: {trackedData.status}
                  </span>
                  <span className="text-xs text-gray-500 font-light">
                    Est. Delivery: {trackedData.estimatedDelivery}
                  </span>
                </div>
                <h2 className="text-base text-gray-800 font-normal mt-1">
                  ID: <span className="font-mono text-sm text-gray-600">{trackedData.orderId}</span>
                </h2>
                <p className="text-xs text-gray-500 font-light mt-1 leading-relaxed">
                  {trackedData.statusText}
                </p>
              </div>

              {/* Progress Timeline (Simple, professional, plain text, no heavy icons) */}
              <div className="flex flex-col gap-4 py-2">
                {trackedData.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative">
                    {/* Line connecter */}
                    {idx < trackedData.steps.length - 1 && (
                      <div 
                        className={`absolute left-[7px] top-[14px] w-[1px] h-full ${
                          step.completed && trackedData.steps[idx + 1].completed 
                            ? 'bg-[#06492D]' 
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                    
                    {/* Dot */}
                    <div 
                      className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 flex items-center justify-center transition-all ${
                        step.completed 
                          ? 'bg-[#06492D] ring-2 ring-[#e8f5e9]' 
                          : 'border border-gray-300 bg-white'
                      }`}
                    />
                    
                    {/* Step details */}
                    <div className="flex flex-col">
                      <span className={`text-sm font-light ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[11px] text-gray-400 font-light">
                        {step.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Items details */}
              <div className="border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-light block mb-2">
                  Items in this package
                </span>
                <div className="flex flex-col gap-2">
                  {trackedData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-gray-600 font-light">
                      <span>
                        {item.name} <span className="text-gray-400 text-[10px]">({item.category})</span>
                      </span>
                      <span className="font-mono">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-1 text-xs text-gray-500 font-light">
                <div>
                  <span className="text-gray-400">Shipped To: </span>
                  <span className="text-gray-700">{trackedData.receiverName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Destination: </span>
                  <span className="text-gray-700">{trackedData.deliveryCity}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Trackorder;
