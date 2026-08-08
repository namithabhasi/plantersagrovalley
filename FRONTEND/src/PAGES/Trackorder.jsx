import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import axios from '../api/axiosInstance';
import OrderTrackingModal from '../COMPONENTS/OrderTrackingModal';

function Trackorder() {
  const [searchParams] = useSearchParams();
  const paramOrderId = searchParams.get('orderId') || searchParams.get('trackingId');

  const [trackingId, setTrackingId] = useState(paramOrderId || '');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedData, setTrackedData] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(paramOrderId || null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(Boolean(paramOrderId));
  const [error, setError] = useState('');
  const [trackingIdError, setTrackingIdError] = useState('');
  const [contactInfoError, setContactInfoError] = useState('');

  useEffect(() => {
    if (paramOrderId) {
      setActiveOrderId(paramOrderId);
      setIsTrackingModalOpen(true);
    }
  }, [paramOrderId]);

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
    setActiveOrderId(null);
    setLoading(true);

    axios.post("/orders/track", {
      trackingId: trackingId.trim(),
      contactInfo: contactInfo.trim()
    })
      .then(response => {
        setLoading(false);
        if (response.data && response.data.success) {
          setTrackedData(response.data.data);
          setIsTrackingModalOpen(true);
        } else {
          setError(response.data.message || 'Could not retrieve tracking details.');
        }
      })
      .catch(err => {
        setLoading(false);
        setTrackedData(null);
        setError(err.response?.data?.message || 'Order not found with the provided Tracking ID and contact details.');
      });
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center bg-[#f3f8f3] px-4 py-6 font-[var(--font-family-base)]">
      {/* Outer Card */}
      <div 
        style={{ padding: '24px 32px' }}
        className="w-full max-w-[380px] sm:max-w-[420px] bg-white border border-[#e2e8f0] rounded-none shadow-sm flex flex-col gap-4 transition-all duration-300"
      >
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center gap-1.5">
          <Link to="/" className="flex justify-center items-center">
            <img
              src={logo}
              alt="Planters Logo"
              style={{ height: '32px', width: 'auto', maxHeight: '32px', objectFit: 'contain' }}
              className="!h-[32px] !w-auto object-contain"
            />
          </Link>
          <div className="text-center mt-0.5">
            <h3 className="text-sm sm:text-base font-[var(--font-family-heading)] font-semibold uppercase tracking-[1.5px] text-[#06492D] whitespace-nowrap m-0">
              Track Your Order
            </h3>
            <p className="text-xs text-gray-900 font-normal mt-0.5 leading-relaxed">
              Just enter your Tracking ID & it's done.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleTrack} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-900 block mb-1">
                Tracking ID
              </label>
              <input
                required
                type="text"
                placeholder="Enter Tracking ID (e.g. PLA-XXXX)"
                value={trackingId}
                onChange={(e) => handleTrackingIdChange(e.target.value)}
                style={{ borderRadius: '3px' }}
                className={`w-full px-3.5 py-2.5 border outline-none text-gray-900 placeholder-gray-500 text-xs font-light transition-all ${
                  trackingIdError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                }`}
              />
              {trackingIdError && (
                <p className="text-[10px] text-red-500 font-light mt-1 text-left">
                  {trackingIdError}
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-900 block mb-1">
                Email or Phone
              </label>
              <input
                required
                type="text"
                placeholder="Enter Email/Phone"
                value={contactInfo}
                onChange={(e) => handleContactInfoChange(e.target.value)}
                style={{ borderRadius: '3px' }}
                className={`w-full px-3.5 py-2.5 border outline-none text-gray-900 placeholder-gray-500 text-xs font-light transition-all ${
                  contactInfoError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#06492D]'
                }`}
              />
              {contactInfoError && (
                <p className="text-[10px] text-red-500 font-light mt-1 text-left">
                  {contactInfoError}
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[11px] text-red-600 font-light text-center bg-red-50 p-2 rounded-[3px] border border-red-100">
              {error}
            </p>
          )}

          {/* Track Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            style={{ borderRadius: '3px', height: '42px' }}
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {/* Tracking Updates Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        trackedData={trackedData}
        orderId={activeOrderId}
      />
    </div>
  );
}

export default Trackorder;
