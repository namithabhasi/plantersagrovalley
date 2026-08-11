import React from 'react';
import { FiX, FiShield, FiRefreshCw, FiTruck, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const ReturnPolicyModal = ({ isOpen, onClose, cutoffDate = null }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-[4px] shadow-2xl max-w-xl w-full text-left leading-relaxed flex flex-col border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#06492D] text-white p-4 sm:p-5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <FiShield size={22} className="text-[#ffd814]" />
            <div>
              <h3 className="text-base sm:text-lg font-bold m-0 tracking-wide text-white uppercase">
                7-Day Easy Return Policy
              </h3>
              <p className="text-xs text-green-100 m-0 mt-0.5 font-normal">
                Hassle-Free Returns • Doorstep Pickup • 100% Refund
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white font-bold text-xl cursor-pointer border-none bg-transparent p-1 leading-none transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          
          {cutoffDate && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3.5 flex items-center gap-3">
              <FiCheckCircle size={20} className="text-green-700 shrink-0" />
              <div className="text-xs sm:text-sm text-green-900 leading-snug">
                <span className="font-semibold">Current Order Eligible:</span> Return window remains active for 7 days post-delivery through <span className="font-bold text-green-950 underline">{cutoffDate}</span>.
              </div>
            </div>
          )}

          {/* Grid Policy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center flex flex-col items-center gap-1.5">
              <FiRefreshCw size={20} className="text-[#06492D]" />
              <h4 className="text-xs font-bold text-gray-900 m-0 uppercase">7 Days Window</h4>
              <p className="text-[11px] text-gray-600 m-0 leading-tight">Request return within 7 days of delivery</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center flex flex-col items-center gap-1.5">
              <FiTruck size={20} className="text-[#06492D]" />
              <h4 className="text-xs font-bold text-gray-900 m-0 uppercase">Free Pickup</h4>
              <p className="text-[11px] text-gray-600 m-0 leading-tight">Zero pick-up charges at your doorstep</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center flex flex-col items-center gap-1.5">
              <FiCreditCard size={20} className="text-[#06492D]" />
              <h4 className="text-xs font-bold text-gray-900 m-0 uppercase">100% Refund</h4>
              <p className="text-[11px] text-gray-600 m-0 leading-tight">Direct credit to original payment mode</p>
            </div>
          </div>

          {/* Guidelines List */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide m-0 border-b border-gray-100 pb-1">
              Return Guidelines & Conditions
            </h4>
            
            <ul style={{ fontSize: 'var(--font-size-md)' }} className="text-[var(--color-charcoal-medium)] space-y-2.5 pl-4 m-0 list-disc leading-relaxed font-normal">
              <li>
                <strong className="text-[var(--color-charcoal-dark)] font-semibold">Return Window:</strong> Returns must be initiated within exactly 7 calendar days after delivery. Beyond 7 days, the return window automatically closes.
              </li>
              <li>
                <strong className="text-[var(--color-charcoal-dark)] font-semibold">Item Condition:</strong> Plants, planters, pots, seeds, and fertilizers must be returned in their original packaging condition with any included accessories.
              </li>
              <li>
                <strong className="text-[var(--color-charcoal-dark)] font-semibold">Damaged or Disliked Items:</strong> If plants arrive damaged, defective, or incorrect, instant replacement or full refund is issued upon pickup verification.
              </li>
              <li>
                <strong className="text-[var(--color-charcoal-dark)] font-semibold">Refund Processing:</strong> Refunds are initiated immediately upon pickup verification and reflect in your bank account within 24-48 hours.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#06492D] hover:bg-[#04331f] text-white text-xs font-bold uppercase rounded-[3px] transition-colors cursor-pointer shadow-xs"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReturnPolicyModal;
