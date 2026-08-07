import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiTruck, FiCalendar, FiChevronRight, FiChevronLeft, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";
import { useSelector } from "react-redux";
import haworthiaImg from "../assets/Haworthia.jpg";

function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

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
                <h2 className="text-3xl font-[var(--font-family-heading)] font-normal text-[var(--color-primary-dark)] uppercase tracking-wide">
                  My Orders
                </h2>
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
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-none border border-gray-200/80 p-4 sm:p-5 flex flex-col gap-4 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {/* Order Top Bar Info */}
                    <div className="bg-gray-50/60 p-3 sm:p-4 border border-gray-100 flex flex-wrap gap-4 justify-between items-center text-xs">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Order Number</p>
                          <p className="font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Date Placed</p>
                          <p className="font-semibold text-gray-700 flex items-center gap-1">
                            <FiCalendar size={13} className="text-[#06492D]" />
                            {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Total Amount</p>
                          <p className="font-bold text-[#06492D] text-sm">
                            Rs. {order.totalAmount}.00
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold border rounded-none ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-2.5 py-1 text-[11px] font-semibold border rounded-none ${order.paymentStatus === "Paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col gap-3 py-1">
                      {order.items.map((item, index) => {
                        const itemImage = item.image || haworthiaImg;
                        return (
                          <div key={index} className="flex gap-4 items-center">
                            <div className="w-14 h-14 bg-white border border-gray-200 rounded-none overflow-hidden shrink-0">
                              <img
                                src={itemImage}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-800 truncate mb-0.5">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × Rs. {item.price}.00
                              </p>
                            </div>
                            <div className="text-right text-sm font-semibold text-gray-900">
                              Rs. {item.subtotal}.00
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Row (No Top Line Divider) */}
                    <div className="pt-2 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <div className="text-gray-600 font-medium flex items-center gap-1.5">
                        <FiTruck size={14} className="text-[#06492D]" />
                        <span>Payment Method: <span className="font-bold text-gray-800">{order.paymentMethod}</span></span>
                      </div>
                      <Link
                        to={`/track-order?orderId=${order._id}`}
                        className="bg-transparent hover:bg-emerald-50 text-[#06492D] border-none rounded-none px-2 py-1 text-sm font-semibold flex items-center gap-1.5 transition-all text-decoration-none cursor-pointer"
                      >
                        <span>Track Order</span>
                        <FiChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}

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
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-none border transition-all cursor-pointer ${
                            isActive
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
    </div>
  );
}

export default MyOrders;
