import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

export function formatReturnTrackingData(ret) {
  if (!ret) return null;

  const orderNumber = ret.orderNumber || ret._id || 'N/A';
  const status = ret.returnStatus || ret.orderStatus || 'Return Requested';
  const isApproved = status === 'Return Approved' || ret.orderStatus === 'Return Approved';
  const isRefunded = ret.refundStatus === 'Refunded' || ret.paymentStatus === 'Refunded';

  let statusText = '';
  if (isRefunded) {
    statusText = 'Refund has been successfully issued to your original payment method.';
  } else if (isApproved) {
    statusText = 'Return request has been approved. Courier pickup is being scheduled.';
  } else {
    statusText = 'Return request submitted. Our team is inspecting your return request.';
  }

  const returnDate = ret.returnDate || ret.createdAt || Date.now();
  const formattedReturnDate = new Date(returnDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const returnSteps = [
    {
      label: 'Return Requested',
      subtext: 'Return request submitted by customer',
      date: formattedReturnDate,
      completed: true
    },
    {
      label: 'Return Approved',
      subtext: 'Request inspected & approved by seller',
      date: isApproved ? 'Completed' : 'Pending Approval',
      completed: isApproved || isRefunded
    },
    {
      label: 'Item Pickup & Quality Check',
      subtext: 'Package collected & verified at nursery',
      date: isApproved ? 'Scheduled' : 'Pending',
      completed: isRefunded
    },
    {
      label: 'Refund Processed',
      subtext: `Refund of ₹${ret.totalAmount || 499}.00 credited`,
      date: isRefunded ? 'Completed' : 'Processing',
      completed: isRefunded
    }
  ];

  const items = Array.isArray(ret.items)
    ? ret.items.map((item) => ({
        name: item.name || item.product?.name || 'Returned Plant Item',
        quantity: item.quantity || 1,
        price: item.price || 0
      }))
    : [];

  return {
    orderNumber,
    status: isApproved ? 'RETURN APPROVED' : 'RETURN IN PROGRESS',
    statusText,
    refundAmount: ret.totalAmount || 499,
    refundStatus: ret.refundStatus || 'Refund Pending',
    returnReason: ret.returnReason || 'Item damaged / Quality issue',
    steps: returnSteps,
    items
  };
}

const ReturnTrackingModal = ({ isOpen, onClose, returnOrder }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen && returnOrder) {
      setData(formatReturnTrackingData(returnOrder));
    }
  }, [isOpen, returnOrder]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/65 backdrop-blur-xs z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        style={{ padding: '30px' }} 
        className="bg-white rounded-[3px] shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto text-left leading-relaxed flex flex-col gap-4 text-gray-900 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (No divider border) */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-purple-800 m-0 uppercase tracking-wide">
              Return & Refund Status
            </h3>
            {data?.orderNumber && (
              <p className="text-xs text-gray-900 m-0 font-mono font-semibold mt-0.5">
                ORDER #: {data.orderNumber}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 font-bold text-xl leading-none cursor-pointer border-none bg-transparent p-1"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        {data && (
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-gray-900">
            {/* Status & Refund Text (Clean inline without box container) */}
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-purple-800 uppercase tracking-wide">
                STATUS: {data.status}
              </span>
              <span className="text-gray-900 font-semibold">
                Refund: ₹{data.refundAmount}.00
              </span>
            </div>

            <p className="m-0 text-gray-800 leading-relaxed text-sm">
              {data.statusText}
            </p>

            {/* Reason for Return Text (Clean inline without box container) */}
            <p className="m-0 text-xs text-gray-700">
              <span className="font-bold text-[#06492D]">Reason for Return: </span>
              <span>{data.returnReason}</span>
            </p>

            {/* Timeline Steps (Clean without top divider line) */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Return Progress Timeline
              </span>
              {data.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start relative">
                  <div 
                    className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      step.completed 
                        ? 'bg-purple-700 ring-2 ring-purple-100' 
                        : 'border border-gray-400 bg-white'
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className={`font-semibold text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight mt-0.5">
                      {step.subtext}
                    </span>
                    <span className="text-xs text-purple-700 font-medium leading-normal mt-0.5">
                      {step.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Items List (Clean without top divider line) */}
            {data.items && data.items.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-[#06492D] uppercase tracking-wide block mb-1.5">
                  Items in Return Request
                </span>
                <div className="flex flex-col gap-1.5">
                  {data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm text-gray-900">
                      <span>{item.name}</span>
                      <span className="font-mono font-semibold">Qty: {item.quantity} × ₹{item.price}.00</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refund Status Note (Clean without top divider line) */}
            <div className="pt-1 text-xs text-gray-600 flex justify-between items-center">
              <span>Refund Status: <strong className="text-purple-700">{data.refundStatus}</strong></span>
              <span>Est. Processing: 2 - 3 Days</span>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-1">
          <button 
            style={{ padding: '8px 22px', borderRadius: '3px' }}
            onClick={onClose}
            className="btn btn-primary text-sm uppercase cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnTrackingModal;
