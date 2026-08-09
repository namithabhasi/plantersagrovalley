import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiCalendar, FiChevronLeft, FiChevronRight, FiArrowRight, FiShoppingBag, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";
import { useSelector } from "react-redux";
import haworthiaImg from "../assets/Haworthia.jpg";
import { getItemImage } from "../utils/itemImageHelper";
import ReturnTrackingModal from "../COMPONENTS/ReturnTrackingModal";

function Return() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [returnedOrders, setReturnedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('planters_returned_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const [selectedReturnStatusOrder, setSelectedReturnStatusOrder] = useState(null);
  const [isReturnTrackingModalOpen, setIsReturnTrackingModalOpen] = useState(false);

  const handleOpenReturnStatusModal = (order) => {
    setSelectedReturnStatusOrder(order);
    setIsReturnTrackingModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('planters_returned_orders', JSON.stringify(returnedOrders));
    } catch (e) {
      console.error("Error saving returned orders:", e);
    }
  }, [returnedOrders]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-bg)]">
        <section className="page-section !bg-[var(--color-primary-bg)]">
          <div className="container flex justify-center">
            <div className="w-full max-w-[800px] flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-none flex items-center justify-center text-gray-400 mb-4">
                <FiRefreshCw size={30} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
              <p className="text-gray-500 mb-4 max-w-sm">Please log in to view your return requests.</p>
              <Link to="/signin" className="btn btn-primary rounded-none">
                Sign In Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const totalPages = Math.ceil(returnedOrders.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedReturns = returnedOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)]">
      <section className="page-section !bg-[var(--color-primary-bg)]">
        <div className="container flex justify-center">
          <div className="w-full max-w-[800px] flex flex-col gap-6">

            {/* Page Header (Matching My Orders Design) */}
            <div className="pb-2 text-left flex justify-between items-end border-b border-gray-200">
              <div>
                <h4 className="text-3xl font-[var(--font-family-heading)] font-normal text-[var(--color-primary-dark)] uppercase tracking-wide m-0">
                  Returns & Refunds
                </h4>
                <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] font-normal mt-1 tracking-wider m-0">
                  {returnedOrders.length} {returnedOrders.length === 1 ? "return request in progress" : "return requests in progress"}
                </p>
              </div>
              <Link to="/my-orders" className="text-xs font-semibold text-[#06492D] hover:underline uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-decoration-none">
                <span>View Orders</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            {/* Empty State vs Returns List */}
            {returnedOrders.length === 0 ? (
              <div style={{ padding: "20px" }} className="bg-white p-12 text-center flex flex-col items-center justify-center border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-[#edf3ed] text-[#06492D] flex items-center justify-center mb-3 rounded-full">
                  <FiRefreshCw size={28} />
                </div>
                <h3 style={{ marginTop: "15px", marginBottom: "10px" }} className="text-lg font-bold text-gray-800">
                  No active return requests
                </h3>
                <p style={{ marginTop: "5px", marginBottom: "15px" }} className="text-sm text-gray-600 max-w-sm leading-relaxed">
                  You don't have any active return requests right now. You can request returns on delivered orders within 7 days.
                </p>
                <Link
                  to="/my-orders"
                  className="btn btn-primary rounded-none inline-flex items-center gap-2"
                >
                  <span>Check Orders</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {paginatedReturns.map((ret) => {
                  const formattedReturnDate = new Date(ret.returnDate || ret.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                  const isApproved = ret.orderStatus === 'Return Approved' || ret.returnStatus === 'Return Approved';

                  return (
                    <div 
                      style={{ padding: '10px' }} 
                      key={ret._id || ret.orderNumber}
                      className="bg-white rounded-lg border border-gray-300 overflow-hidden text-left flex flex-col gap-0 shadow-xs transition-all duration-200 hover:shadow-md"
                    >
                      {/* Top Bar Header (Matching My Orders) */}
                      <div style={{ padding: '10px' }} className="bg-[#f6f6f6] border-b border-gray-200 flex flex-wrap justify-between items-center text-sm gap-3 py-2.5 px-3.5 sm:px-4 text-gray-700 leading-tight rounded-t-md">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                          <div>
                            <p className="uppercase text-xs font-semibold text-gray-700 tracking-wide m-0">REQUESTED DATE</p>
                            <p className="font-medium text-gray-800 text-sm mt-0.5 m-0">{formattedReturnDate}</p>
                          </div>
                          <div>
                            <p className="uppercase text-xs font-semibold text-gray-700 tracking-wide m-0">REFUND AMOUNT</p>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5 m-0">₹{ret.totalAmount || 499}.00</p>
                          </div>
                          <div>
                            <p className="uppercase text-xs font-semibold text-gray-700 tracking-wide m-0">RETURN STATUS</p>
                            <p className={`font-semibold text-sm mt-0.5 m-0 ${isApproved ? 'text-green-700' : 'text-purple-700'}`}>
                              {ret.returnStatus || ret.orderStatus || 'Return Requested'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-start sm:items-end gap-1">
                          <p className="text-xs font-semibold text-gray-700 tracking-wide m-0 uppercase">
                            ORDER # <span className="text-gray-700 font-mono">{ret.orderNumber}</span>
                          </p>
                          <Link to={`/order-details?orderId=${ret._id}`} className="hover:underline text-blue-700 font-semibold text-xs text-decoration-none">
                            View order details
                          </Link>
                        </div>
                      </div>

                      {/* Main Body Content */}
                      <div style={{ padding: '10px' }} className="p-3.5 sm:p-5 flex flex-col gap-4 text-left leading-relaxed">
                        <div>
                          <h3 className={`text-base sm:text-lg font-bold m-0 leading-snug uppercase ${isApproved ? 'text-green-700' : 'text-purple-800'}`}>
                            {isApproved ? 'RETURN APPROVED' : 'RETURN IN PROGRESS'}
                          </h3>
                          <p className="text-sm text-gray-700 mt-0.5 m-0 leading-normal">
                            <span className="font-semibold text-[#06492D]">Reason for Return: </span>{ret.returnReason || "Item damaged / Quality issue"}
                          </p>
                        </div>

                        {/* Items List */}
                        <div className="flex flex-col gap-5">
                          {ret.items && ret.items.map((item, idx) => {
                            const itemImage = getItemImage(item);
                            return (
                              <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-gray-200 rounded-md overflow-hidden shrink-0 p-1">
                                    <img src={itemImage} alt={item.name} className="w-full h-full object-cover rounded-sm" />
                                  </div>

                                  <div className="flex flex-col gap-1 flex-1 min-w-0 leading-snug">
                                    <Link 
                                      to={`/product/${item.product || item._id}`} 
                                      className="text-sm sm:text-base font-medium text-blue-700 hover:text-orange-600 hover:underline leading-snug truncate-2-lines text-decoration-none"
                                    >
                                      {item.name}
                                    </Link>
                                    
                                    <p className="text-sm text-gray-700 m-0 font-medium">
                                      Qty: {item.quantity} × ₹{item.price}.00
                                    </p>

                                    <p className="text-xs text-purple-700 font-medium mt-1">
                                      Refund Status: <span className="font-semibold">{ret.refundStatus || 'Refund Pending'}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full sm:w-52 shrink-0">
                                  <button 
                                    onClick={() => handleOpenReturnStatusModal(ret)} 
                                    className="order-action-btn cursor-pointer text-center"
                                  >
                                    View Return Status
                                  </button>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {returnedOrders.length > itemsPerPage && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <FiChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-sm text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Next
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Return Tracking Modal */}
      <ReturnTrackingModal
        isOpen={isReturnTrackingModalOpen}
        onClose={() => setIsReturnTrackingModalOpen(false)}
        returnOrder={selectedReturnStatusOrder}
      />
    </div>
  );
}

export default Return;
