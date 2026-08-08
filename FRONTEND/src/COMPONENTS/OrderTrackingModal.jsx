import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

export function formatOrderTrackingData(order, customTrackedData) {
  if (customTrackedData) return customTrackedData;
  if (!order) return null;

  const orderNumber = order.orderNumber || order._id || 'N/A';
  const status = order.orderStatus || 'Pending';

  let statusText = '';
  switch (status) {
    case 'Pending':
      statusText = 'Your order is currently pending confirmation.';
      break;
    case 'Confirmed':
      statusText = 'Your order has been confirmed and payment verified.';
      break;
    case 'Processing':
      statusText = 'Your order is being processed and prepared.';
      break;
    case 'Packed':
      statusText = 'Your order has been packed and is ready for shipment.';
      break;
    case 'Shipped':
      statusText = 'Your package is on the way and scheduled for delivery.';
      break;
    case 'Delivered':
      statusText = 'Your order has been delivered successfully. Thank you for shopping with us!';
      break;
    case 'Cancelled':
      statusText = 'Your order has been cancelled.';
      break;
    case 'Returned':
      statusText = 'Return process has been initiated for this order.';
      break;
    default:
      statusText = 'Your order status has been updated.';
  }

  const standardSteps = [
    { label: 'Order Placed', key: 'Pending' },
    { label: 'Payment Confirmed', key: 'Confirmed' },
    { label: 'Packed & Dispatched', key: 'Packed' },
    { label: 'In Transit', key: 'Shipped' },
    { label: 'Delivered', key: 'Delivered' }
  ];

  const statusSequence = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];
  const currentIdx = statusSequence.indexOf(status);

  const historyMap = {};
  if (Array.isArray(order.statusHistory)) {
    order.statusHistory.forEach((h) => {
      if (h.status) historyMap[h.status] = h.updatedAt || h.createdAt;
    });
  }

  const steps = standardSteps.map((step) => {
    let completed = false;
    let date = 'Pending';
    const stepIdx = statusSequence.indexOf(step.key);

    if (currentIdx !== -1 && currentIdx >= stepIdx) {
      completed = true;
    }

    const matchedDate = historyMap[step.key];
    if (matchedDate) {
      date = new Date(matchedDate).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (completed) {
      if (step.key === 'Pending' && order.createdAt) {
        date = new Date(order.createdAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } else if (order.updatedAt) {
        date = new Date(order.updatedAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } else {
        date = 'Completed';
      }
    }

    return { label: step.label, date, completed };
  });

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : (order.createdAt 
        ? new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : '3 - 5 Business Days');

  const receiverName = order.shippingAddress?.receiverName 
    || (order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : '')
    || 'Valued Customer';

  const deliveryCity = order.shippingAddress 
    ? `${order.shippingAddress.city || ''}${order.shippingAddress.state ? ', ' + order.shippingAddress.state : ''}`
    : 'N/A';

  const items = Array.isArray(order.items)
    ? order.items.map((item) => ({
        name: item.name || item.product?.name || 'Plant Care Item',
        quantity: item.quantity || 1,
        category: (item.product && item.product.category && item.product.category.name) || item.category || 'General'
      }))
    : [];

  return {
    orderId: orderNumber,
    trackingNumber: order.trackingNumber || 'N/A',
    status,
    statusText,
    estimatedDelivery,
    receiverName,
    deliveryCity,
    steps,
    items
  };
}

const OrderTrackingModal = ({ isOpen, onClose, order, trackedData: customTrackedData, orderId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (customTrackedData) {
      setData(customTrackedData);
      setError('');
      return;
    }

    if (order) {
      setData(formatOrderTrackingData(order));
      setError('');
      return;
    }

    if (orderId) {
      setLoading(true);
      setError('');
      axios.get(`/orders/${orderId}`)
        .then((res) => {
          setLoading(false);
          if (res.data && res.data.order) {
            setData(formatOrderTrackingData(res.data.order));
          } else {
            setError('Could not load order tracking details.');
          }
        })
        .catch(() => {
          setLoading(false);
          setError('Could not load order tracking details.');
        });
    }
  }, [isOpen, order, customTrackedData, orderId]);

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
        className="bg-white rounded-[3px] shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto text-left leading-relaxed flex flex-col gap-4 border border-gray-200 text-gray-900 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#06492D] m-0 uppercase tracking-wide">
              Order Tracking Updates
            </h3>
            {data?.orderId && (
              <p className="text-xs text-gray-900 m-0 font-mono font-semibold mt-0.5">
                ID: {data.orderId}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 font-bold text-xl leading-none cursor-pointer border-none bg-transparent p-1"
            aria-label="Close tracking modal"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-600">
            Loading order tracking details...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-red-600 font-medium">
            {error}
          </div>
        ) : data ? (
          <div className="flex flex-col gap-3.5 text-sm leading-relaxed text-gray-900">
            {/* Status Banner */}
            <div className="flex justify-between items-center bg-[#edf3ed] p-3 rounded-[3px]">
              <span className="font-semibold text-[#06492D] uppercase tracking-wide text-sm">
                STATUS: {data.status?.toUpperCase() || 'IN TRANSIT'}
              </span>
              <span className="text-gray-900 font-semibold text-sm">
                Est. Delivery: {data.estimatedDelivery}
              </span>
            </div>

            <p className="m-0 text-gray-900 leading-relaxed font-normal text-sm">
              {data.statusText}
            </p>

            {/* Timeline Steps */}
            {data.steps && data.steps.length > 0 && (
              <div className="flex flex-col gap-3 py-1">
                {data.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start relative">
                    <div 
                      className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                        step.completed 
                          ? 'bg-[#06492D] ring-2 ring-[#e8f5e9]' 
                          : 'border border-gray-400 bg-white'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className={`font-semibold text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                      <span className="text-xs text-gray-700 leading-normal">
                        {step.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Items List */}
            {data.items && data.items.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <span className="text-sm font-semibold text-[#06492D] uppercase tracking-wide block mb-1.5">
                  Items in Package
                </span>
                <div className="flex flex-col gap-1.5">
                  {data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm text-gray-900">
                      <span>
                        {item.name} <span className="text-gray-500 text-xs">({item.category})</span>
                      </span>
                      <span className="font-mono font-semibold">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient Details */}
            <div className="border-t border-gray-100 pt-3 flex flex-wrap justify-between text-sm text-gray-900 gap-2">
              <div>
                <span className="text-gray-600">Shipped To: </span>
                <span className="font-semibold text-gray-900">{data.receiverName}</span>
              </div>
              <div>
                <span className="text-gray-600">Destination: </span>
                <span className="font-semibold text-gray-900">{data.deliveryCity}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-gray-500">
            No tracking details available.
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

export default OrderTrackingModal;
