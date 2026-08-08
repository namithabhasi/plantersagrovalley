import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiTruck, FiCalendar, FiChevronRight, FiChevronLeft, FiArrowRight, FiRotateCcw, FiRefreshCw, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";
import { useSelector } from "react-redux";
import { useCart } from "../context/CartContext";
import haworthiaImg from "../assets/Haworthia.jpg";
import OrderTrackingModal from "../COMPONENTS/OrderTrackingModal";

function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const [returnedOrders, setReturnedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('planters_returned_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('planters_returned_orders', JSON.stringify(returnedOrders));
    } catch (e) {
      console.error("Error saving returned orders:", e);
    }
  }, [returnedOrders]);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("Item damaged / Quality issue");

  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const handleOpenTrackingModal = (order) => {
    setSelectedTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleOpenReturnModal = (order) => {
    const isAlreadyReturned = returnedOrders.some(r => r._id === order._id || r.orderNumber === order.orderNumber);
    if (isAlreadyReturned) {
      toast.info("A return request for this order is already active.");
      navigate('/profile');
      return;
    }
    setSelectedReturnOrder(order);
    setReturnReason("Item damaged / Quality issue");
    setIsReturnModalOpen(true);
  };

  const handleSubmitReturn = () => {
    if (!selectedReturnOrder) return;

    const returnedObj = {
      ...selectedReturnOrder,
      returnReason: returnReason || "Return requested by customer",
      returnDate: new Date().toISOString(),
      returnStatus: "Return Requested",
      refundStatus: "Refund Pending"
    };

    setReturnedOrders(prev => [returnedObj, ...prev]);

    setOrders(prev => prev.map(o => (o._id === selectedReturnOrder._id || o.orderNumber === selectedReturnOrder.orderNumber) ? { ...o, orderStatus: 'Returned' } : o));

    setIsReturnModalOpen(false);
    toast.success("Return request submitted! You can view it under Returns & Refunds in your Profile.");
  };

  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/orders/my-orders?page=${pageNumber}&limit=${itemsPerPage}`);
      if (data.success) {
        setOrders(data.orders || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders(page);
    } else {
      setLoading(false);
    }
  }, [user, page]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-bg)]">
        <section className="page-section !bg-[var(--color-primary-bg)]">
          <div className="container flex justify-center">
            <div className="w-full max-w-[800px] flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-none flex items-center justify-center text-gray-400 mb-4">
                <FiShoppingBag size={30} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
              <p className="text-gray-500 mb-4 max-w-sm">Please log in to view your order history.</p>
              <Link to="/signin" className="btn btn-primary rounded-none">
                Sign In Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center">
        <div className="animate-spin rounded-none h-10 w-10 border-b-2 border-[#06492D]"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Confirmed":
      case "Processing":
      case "Packed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const totalPages = pagination ? pagination.totalPages : Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)]">
      <section className="page-section !bg-[var(--color-primary-bg)]">
        <div className="container flex justify-center">
          <div className="w-full max-w-[800px] flex flex-col gap-6">

            {/* Page Header (Only rendered when orders exist) */}
            {orders.length > 0 && (
              <div className="pb-2 text-left">
                <h4 className="text-3xl font-[var(--font-family-heading)] font-normal text-[var(--color-primary-dark)] uppercase tracking-wide">
                  My Orders
                </h4>
                <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] font-normal mt-1 tracking-wider">
                  {pagination?.totalOrders || orders.length} {orders.length === 1 ? "order" : "orders"} placed
                </p>
              </div>
            )}

            {/* Empty State vs Orders List */}
            {orders.length === 0 ? (
              <div style={{ padding: "20px" }} className="bg-white p-12 text-center flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-green-50 text-[#06492D] rounded-none flex items-center justify-center mb-4 overflow-hidden">
                  <img src="https://media.tenor.com/q2lP9vEriZUAAAAM/party-plants.gif" alt="No Orders" className="w-full h-full object-cover" />
                </div>
                <h3 style={{ marginTop: "20px", marginBottom: "10px" }} className="text-lg font-bold text-gray-800 mb-2">
                  No orders placed yet
                </h3>
                <p style={{ marginTop: "5px", marginBottom: "5px" }} className="text-sm text-gray-700 max-w-sm mb-6">
                  You haven't ordered anything yet. Browse our selection and add products to your cart to place an order.
                </p>
                <Link
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                  to="/plants"
                  className="btn btn-primary rounded-none"
                >
                  <span>Start Shopping</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {orders.map((order) => {
                  const orderDate = new Date(order.createdAt || Date.now());
                  const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
                  const returnCutoffDate = new Date(deliveryDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                  const now = new Date();
                  const isReturnOpen = now <= returnCutoffDate && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned';
                  const isAlreadyReturned = returnedOrders.some(r => r._id === order._id || r.orderNumber === order.orderNumber);

                  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
                  const formattedCutoffDate = returnCutoffDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

                  return (
                    <div 
                      style={{ padding: '10px' }} 
                      key={order._id}
                      className="bg-white rounded-lg border border-gray-300 overflow-hidden text-left flex flex-col gap-0 shadow-xs transition-all duration-200 hover:shadow-md"
                    >
                      {/* Top Bar Header (Light Gray Box) */}
                      <div style={{ padding: '10px' }} className="bg-[#f6f6f6] border-b border-gray-200 flex flex-wrap justify-between items-center text-sm gap-3 py-2.5 px-3.5 sm:px-4 text-gray-700 leading-tight rounded-t-md">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                          <div>
                            <p className="uppercase text-xs font-semibold text-gray-700 tracking-wide m-0">ORDER PLACED</p>
                            <p className="font-medium text-gray-800 text-sm mt-0.5 m-0">{formattedOrderDate}</p>
                          </div>
                          <div>
                            <p className="uppercase text-xs font-semibold text-gray-700 tracking-wide m-0">TOTAL</p>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5 m-0">₹{order.totalAmount}.00</p>
                          </div>
                          <div>
                            <p className="uppercase text-xs font-semibold text-gray-700 tracking-wide m-0">SHIP TO</p>
                            <p className="font-semibold text-blue-700 hover:underline cursor-pointer text-sm mt-0.5 flex items-center gap-0.5 m-0">
                              <span>{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.toUpperCase() : "NAMITHA BHASI"}</span>
                              <FiChevronDown size={14} />
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-start sm:items-end gap-1">
                          <p className="text-xs font-semibold text-gray-700 tracking-wide m-0 uppercase">
                            ORDER # <span className="text-gray-700 font-mono">{order.orderNumber}</span>
                          </p>
                          <div className="flex items-center gap-2 text-sm text-blue-700 font-semibold">
                            <Link to={`/order-details?orderId=${order._id}`} className="hover:underline text-blue-700 font-semibold text-decoration-none">
                              View order details
                            </Link>
                            <span className="text-gray-300 font-normal">|</span>
                            <span className="hover:underline cursor-pointer text-blue-700 font-semibold flex items-center gap-0.5">
                              Invoice <FiChevronDown size={12} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Main Body Content */}
                      <div style={{ padding: '10px' }} className="p-3.5 sm:p-5 flex flex-col gap-4 text-left leading-relaxed">
                        {/* Status Heading Line */}
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 m-0 leading-snug uppercase">
                            {order.orderStatus === 'Delivered' ? `DELIVERED ${formattedDeliveryDate.toUpperCase()}` : `STATUS: ${order.orderStatus.toUpperCase()}`}
                          </h3>
                          <p className="text-sm text-gray-700 mt-0.5 m-0 leading-normal">
                            {order.orderStatus === 'Delivered' 
                              ? "Package was handed to resident" 
                              : `Payment Status: ${order.paymentStatus} • Payment Method: ${order.paymentMethod}`}
                          </p>
                        </div>

                        {/* Products List & Side Action Stack */}
                        <div className="flex flex-col gap-5">
                          {order.items.map((item, idx) => {
                            const itemImage = item.image || haworthiaImg;
                            return (
                              <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                
                                {/* Product Info (Thumbnail + Text Details) */}
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

                                    {/* Dynamic 7-Day Return Window Text */}
                                    <p className="text-sm text-gray-700 mt-1 m-0 font-normal leading-relaxed">
                                      {isAlreadyReturned ? (
                                        <span className="text-purple-700 font-semibold">Return requested on this item</span>
                                      ) : isReturnOpen ? (
                                        <span className="text-gray-700">Return window open through <span className="font-semibold text-gray-900">{formattedCutoffDate}</span></span>
                                      ) : (
                                        <span className="text-gray-700">Return window closed on <span className="font-medium">{formattedCutoffDate}</span></span>
                                      )}
                                    </p>

                                    {/* Inner Action Pill Buttons */}
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <button 
                                        style={{ padding: '6px 14px', borderRadius: '3px' }}
                                        onClick={() => addToCart({ _id: item.product || item._id, name: item.name, price: item.price, image: itemImage })}
                                        className="bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 font-medium text-sm px-4 border border-[#fcd814] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                      >
                                        <FiRefreshCw size={13} />
                                        <span>Buy it again</span>
                                      </button>

                                      <Link 
                                        to={`/product/${item.product || item._id}`}
                                        className="order-action-btn order-action-btn-inline"
                                      >
                                        View your item
                                      </Link>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Action Stack */}
                                <div className="flex flex-col gap-2 w-full sm:w-52 shrink-0">
                                  <button
                                    onClick={() => handleOpenTrackingModal(order)}
                                    className="order-action-btn cursor-pointer"
                                  >
                                    Track package
                                  </button>

                                  {isAlreadyReturned ? (
                                    <button
                                      onClick={() => navigate('/profile')}
                                      className="order-action-btn-purple"
                                    >
                                      View Return Status
                                    </button>
                                  ) : isReturnOpen ? (
                                    <button
                                      onClick={() => handleOpenReturnModal(order)}
                                      className="order-action-btn-red"
                                    >
                                      Return item
                                    </button>
                                  ) : (
                                    <Link
                                      to={`/product/${item.product || item._id}/review`}
                                      state={{ product: { _id: item.product || item._id, name: item.name, image: itemImage } }}
                                      className="order-action-btn"
                                    >
                                      Leave seller feedback
                                    </Link>
                                  )}

                                  <Link
                                    to={`/product/${item.product || item._id}/review`}
                                    state={{ product: { _id: item.product || item._id, name: item.name, image: itemImage } }}
                                    className="order-action-btn"
                                  >
                                    Leave delivery feedback
                                  </Link>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-4">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="p-2 bg-white border border-gray-300 rounded-none disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer text-gray-700"
                      title="Previous Page"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === page;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-none border transition-all cursor-pointer ${isActive
                              ? "bg-[#06492D] text-white border-[#06492D]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 bg-white border border-gray-300 rounded-none disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer text-gray-700"
                      title="Next Page"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Return Item Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            style={{ padding: '10px' }} 
            className="bg-white rounded-[3px] shadow-2xl max-w-xl w-full text-left leading-relaxed flex flex-col gap-6 border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#06492D] m-0 uppercase tracking-wide">
                Return Item Request
              </h3>
              <button 
                onClick={() => setIsReturnModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl leading-none cursor-pointer border-none bg-transparent p-1"
              >
                ×
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 m-0 leading-relaxed">
              Please select the reason for returning this item (Order #<span className="font-mono font-semibold text-gray-800">{selectedReturnOrder?.orderNumber}</span>):
            </p>

            {/* Dropdown select for return reason */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#06492D] uppercase tracking-wide">
                Reason for Return
              </label>
              <select 
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-[3px] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#06492D] transition-all cursor-pointer shadow-xs"
              >
                <option value="Item damaged / Quality issue">Item damaged / Quality issue</option>
                <option value="Wrong item received">Wrong item received</option>
                <option value="Defective / Not working">Defective / Not working</option>
                <option value="Size / Specification mismatch">Size / Specification mismatch</option>
                <option value="Found better price elsewhere">Found better price elsewhere</option>
                <option value="No longer needed">No longer needed</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                style={{ padding: '8px 20px', borderRadius: '3px' }}
                onClick={() => setIsReturnModalOpen(false)}
                className="btn btn-wishlist text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button 
                style={{ padding: '8px 22px', borderRadius: '3px' }}
                onClick={handleSubmitReturn}
                className="btn btn-primary text-xs uppercase cursor-pointer"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        order={selectedTrackingOrder}
      />
    </div>
  );
}

export default MyOrders;
