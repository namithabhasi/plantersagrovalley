import React from 'react';
import { FiPrinter, FiX } from 'react-icons/fi';
import logo from '../assets/logo.png';

function OrderSummaryModal({ isOpen, onClose, order, user }) {
  if (!isOpen || !order) return null;

  const formattedOrderDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '7 August 2026';

  const items = order.items || [];
  const totalVal = Number(order.totalAmount || 504);
  const subtotal = (totalVal - 5).toFixed(2);
  const marketplaceFee = "5.00";
  const grandTotal = totalVal.toFixed(2);

  const clientName = order.shippingAddress?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'NAMITHA BHASI');
  const clientAddress = order.shippingAddress?.address || user?.address || 'Ernakulam, KERALA, India - 682001';
  const clientPhone = order.shippingAddress?.phone || user?.phone || '8304004975';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div 
        style={{ padding: '10px', maxWidth: '760px' }}
        className="bg-white rounded-sm shadow-2xl w-full text-left font-sans text-gray-800 border border-gray-300 relative my-6 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none"
      >
        
        {/* Top Control Bar (Hidden on Print) */}
        <div 
          style={{ padding: '10px' }}
          className="bg-gray-100 border-b border-gray-200 flex justify-between items-center print:hidden rounded-t-sm mb-2"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[#06492D]">
            Printable Order Summary
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="btn btn-primary text-xs uppercase px-3 py-1.5 flex items-center gap-1.5 cursor-pointer rounded-xs"
            >
              <FiPrinter size={14} />
              Print Order Summary
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl font-bold border-none bg-transparent p-1 cursor-pointer leading-none"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Printable Order Summary Content Box */}
        <div style={{ padding: '10px' }} className="space-y-4 text-xs text-gray-800 leading-relaxed bg-white">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-300 pb-3 gap-3">
            <div className="flex flex-col items-start">
              <img 
                src={logo} 
                alt="Planters Agro Valley" 
                style={{ height: '42px', width: 'auto', maxWidth: '170px', objectFit: 'contain', display: 'block', marginBottom: '4px' }}
              />
              <p className="font-bold text-xs text-[#06492D] uppercase tracking-wide m-0">
                Planters Agro Valley Pvt. Ltd.
              </p>
              <p className="text-[11px] text-gray-600 m-0 leading-tight">Official Order Summary & Receipt</p>
              <p className="text-[11px] text-gray-600 m-0 leading-tight">support@plantersagrovalley.com</p>
            </div>

            <div className="text-left sm:text-right">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight m-0">
                ORDER SUMMARY
              </h2>
              <p className="mt-0.5 m-0 text-[11px] text-gray-700">
                <span className="font-semibold">Order Number:</span> <span className="font-mono">{order.orderNumber}</span>
              </p>
              <p className="m-0 text-[11px] text-gray-700">
                <span className="font-semibold">Order Date:</span> {formattedOrderDate}
              </p>
              <p className="m-0 text-[11px] text-gray-700">
                <span className="font-semibold">Order Status:</span> <span className="font-semibold text-green-700">{order.orderStatus || 'Delivered'}</span>
              </p>
            </div>
          </div>

          {/* Shipping & Payment Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-gray-200 pb-3">
            
            {/* Ship To Address */}
            <div style={{ padding: '10px' }} className="bg-gray-50/70 rounded border border-gray-200">
              <p className="font-bold text-[#06492D] uppercase tracking-wider text-[11px] mb-1">
                Ship To
              </p>
              <p className="font-semibold text-gray-900 uppercase m-0 text-xs">{clientName}</p>
              <p className="text-gray-700 m-0 text-[11px] whitespace-pre-line leading-tight">{clientAddress}</p>
              <p className="text-gray-700 m-0 text-[11px] leading-tight">Phone: {clientPhone}</p>
            </div>

            {/* Payment Method */}
            <div style={{ padding: '10px' }} className="bg-gray-50/70 rounded border border-gray-200">
              <p className="font-bold text-[#06492D] uppercase tracking-wider text-[11px] mb-1">
                Payment Method
              </p>
              <p className="font-semibold text-gray-900 m-0 text-xs">{order.paymentMethod || 'Razorpay Online'}</p>
              <p className="text-gray-700 m-0 text-[11px] leading-tight">Status: <span className="font-semibold text-green-700">{order.paymentStatus || 'Paid'}</span></p>
            </div>

          </div>

          {/* Items Summary Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-[#06492D] text-white font-semibold text-[11px] uppercase tracking-wider">
                  <th className="p-2 border border-gray-300 w-10 text-center">#</th>
                  <th className="p-2 border border-gray-300">Items Ordered</th>
                  <th className="p-2 border border-gray-300 text-center w-14">Qty</th>
                  <th className="p-2 border border-gray-300 text-right w-24">Price</th>
                  <th className="p-2 border border-gray-300 text-right w-28">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const price = Number(item.price || 0);
                    const qty = Number(item.quantity || 1);
                    const itemTotal = price * qty;

                    return (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="p-2 border border-gray-300 text-center font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-2 border border-gray-300 font-medium text-gray-900 text-xs">
                          {item.name}
                        </td>
                        <td className="p-2 border border-gray-300 text-center font-mono text-[11px]">{qty}</td>
                        <td className="p-2 border border-gray-300 text-right font-mono text-[11px]">₹{price.toFixed(2)}</td>
                        <td className="p-2 border border-gray-300 text-right font-mono font-semibold text-gray-900 text-xs">₹{itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="p-2 border border-gray-300 text-center font-mono text-[11px]">1</td>
                    <td className="p-2 border border-gray-300 font-medium text-gray-900 text-xs">Wisteria Flowering Vine</td>
                    <td className="p-2 border border-gray-300 text-center font-mono text-[11px]">1</td>
                    <td className="p-2 border border-gray-300 text-right font-mono text-[11px]">₹499.00</td>
                    <td className="p-2 border border-gray-300 text-right font-mono font-semibold text-gray-900 text-xs">₹499.00</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Summary Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-t border-gray-300 pt-3">
            <div>
              <p className="text-[10px] text-gray-500 italic m-0">
                Thank you for ordering with Planters Agro Valley!
              </p>
            </div>

            <div style={{ padding: '10px' }} className="w-full sm:w-64 space-y-1 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded">
              <div className="flex justify-between text-[11px]">
                <span>Item(s) Subtotal:</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Shipping:</span>
                <span className="font-mono">₹0.00</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Marketplace Fee:</span>
                <span className="font-mono">₹{marketplaceFee}</span>
              </div>
              <div className="flex justify-between font-bold text-xs text-[#06492D] border-t border-gray-300 pt-1 mt-1">
                <span>Grand Total:</span>
                <span className="font-mono">₹{grandTotal}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderSummaryModal;
