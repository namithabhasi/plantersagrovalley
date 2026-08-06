import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiCalendar, FiDollarSign, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { useSelector } from 'react-redux';
import haworthiaImg from '../assets/Haworthia.jpg';

function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/orders/my-orders?page=${pageNumber}&limit=5`);
      if (data.success) {
        setOrders(data.orders || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders.');
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <FiShoppingBag size={30} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-500 mb-4 max-w-sm">Please log in to view your order history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#06492D]"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'Confirmed':
      case 'Processing':
      case 'Packed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfc] py-12 px-4 sm:px-6 lg:px-8 font-[var(--font-family-base)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#06492D] mb-8 font-[var(--font-family-heading)]">My Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[#06492d05] text-[#06492D] rounded-full flex items-center justify-center mb-6">
              <FiShoppingBag size={36} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No orders placed yet</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              You haven't ordered anything yet. Browse our selection and add products to your cart to place an order.
            </p>
            <Link
              to="/plants"
              className="px-6 py-2.5 bg-[#06492D] text-white text-xs font-semibold rounded hover:bg-[#0b633e] transition-all border-none"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header Info */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center text-xs">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Order Number</p>
                      <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Date Placed</p>
                      <p className="font-semibold text-gray-700 flex items-center gap-1.5">
                        <FiCalendar size={13} className="text-[#06492D]" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="font-bold text-[#06492D] flex items-center gap-0.5 text-sm">
                        Rs. {order.totalAmount}.00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold border rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-semibold border rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 flex flex-col gap-4">
                  {order.items.map((item, index) => {
                    const itemImage = item.image || haworthiaImg;
                    return (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={itemImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 truncate mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity} × Rs. {item.price}.00
                          </p>
                        </div>
                        <div className="text-right text-sm font-semibold text-gray-800">
                          Rs. {item.subtotal}.00
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/10 flex justify-between items-center text-xs">
                  <div className="text-gray-500 font-medium flex items-center gap-1.5">
                    <FiTruck size={14} className="text-[#06492D]" />
                    <span>Payment Method: <span className="font-bold text-gray-700">{order.paymentMethod}</span></span>
                  </div>
                  <Link
                    to={`/track-order?orderId=${order._id}`}
                    className="flex items-center gap-1 text-[#06492D] hover:text-[#0b633e] font-semibold transition-colors"
                  >
                    <span>Track Order</span>
                    <FiChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border border-none cursor-pointer transition-colors ${page === i + 1 ? 'bg-[#06492D] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
