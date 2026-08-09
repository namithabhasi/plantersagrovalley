import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiRefreshCw, FiTruck, FiCalendar, FiCreditCard, FiArrowLeft, FiRotateCcw, FiPrinter, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import Anthurium from '../assets/Anthurium.png';
import haworthiaImg from '../assets/Haworthia.jpg';
import logo from '../assets/logo.png';
import { getItemImage } from '../utils/itemImageHelper';
import OrderTrackingModal from '../COMPONENTS/OrderTrackingModal';
import InvoiceModal from '../COMPONENTS/InvoiceModal';

function Orderdetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId") || searchParams.get("id");
  const targetOrderId = id || orderIdFromQuery;

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(() => searchParams.get("print") === "true");

  useEffect(() => {
    setIsPrintMode(searchParams.get("print") === "true");
  }, [searchParams]);

  const [returnedOrders, setReturnedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('planters_returned_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (targetOrderId) {
          const { data } = await axios.get(`/orders/${targetOrderId}`);
          if (data.success && data.order) {
            setOrder(data.order);
            setLoading(false);
            return;
          }
        }
        // Fallback: fetch most recent order if no ID specified
        const { data: myOrdersData } = await axios.get('/orders/my-orders?limit=1');
        if (myOrdersData.success && myOrdersData.orders && myOrdersData.orders.length > 0) {
          setOrder(myOrdersData.orders[0]);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [targetOrderId]);

  useEffect(() => {
    const closeDropdown = () => {
      setShowInvoiceDropdown(false);
    };
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("Item damaged / Quality issue");

  const handleOpenReturnModal = (orderToReturn) => {
    const isAlreadyReturned = returnedOrders.some(r => r._id === orderToReturn._id || r.orderNumber === orderToReturn.orderNumber);
    if (isAlreadyReturned) {
      toast.info("A return request for this order is already active.");
      navigate('/profile');
      return;
    }
    setSelectedReturnOrder(orderToReturn);
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

    const updatedList = [returnedObj, ...returnedOrders];
    setReturnedOrders(updatedList);
    localStorage.setItem('planters_returned_orders', JSON.stringify(updatedList));

    if (order && (order._id === selectedReturnOrder._id || order.orderNumber === selectedReturnOrder.orderNumber)) {
      setOrder({ ...order, orderStatus: 'Returned' });
    }

    setIsReturnModalOpen(false);
    toast.success("Return request submitted! You can view it under Returns & Refunds in your Profile.");
  };

  if (loading) {
    return (
      <div  className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#06492D]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-bg)] py-12 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order Found</h2>
        <p className="text-gray-600 mb-6 max-w-md">We couldn't retrieve the details for this order. Please check your orders history.</p>
        <Link to="/my-orders" className="btn btn-primary rounded-none">
          Back to My Orders
        </Link>
      </div>
    );
  }

  // Calculations for dynamic 7-day return window
  const orderDate = new Date(order.createdAt || Date.now());
  const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
  const returnCutoffDate = new Date(deliveryDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const isReturnOpen = now <= returnCutoffDate && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned';
  const isAlreadyReturned = returnedOrders.some(r => r._id === order._id || r.orderNumber === order.orderNumber);

  const formattedOrderDate = orderDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  const formattedCutoffDate = returnCutoffDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const itemsSubtotal = order.totalAmount ? Number(order.totalAmount) : 0;
  const shippingFee = 0;
  const marketplaceFee = 5;
  const grandTotal = itemsSubtotal + shippingFee + marketplaceFee;

  if (isPrintMode) {
    return (
      <div style={{ padding: '0px 20px 40px 20px' }} className="min-h-[calc(100vh-80px)] bg-[#f3f8f3] text-[#1c2c21] flex justify-center items-start print:bg-white print:p-0">
        <div className="w-full max-w-5xl space-y-4 pb-6">
          
          <div  className=" flex justify-between items-center bg-white p-3 rounded-sm shadow-xs print:hidden">
            <button
              type="button"
              onClick={() => setIsPrintMode(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06492D] hover:underline cursor-pointer border-none bg-transparent"
            >
              <FiArrowLeft size={14} />
              <span>Back to Order Details</span>
            </button>

            <span style={{padding:'30px'}}
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06492D] hover:underline cursor-pointer print:hidden"
            >
              <FiDownload size={15} />
              <span>Download</span>
            </span>
          </div>

          <div 
            style={{ padding: '30px' }}
            className="bg-white rounded-sm shadow-lg w-full text-left font-sans text-gray-800 space-y-6 print:shadow-none print:m-0 print:w-full print:max-w-none print:p-0 printable-sheet"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start pb-4 gap-4">
              <div className="flex flex-col items-start">
                <img 
                  src={logo} 
                  alt="Planters Agro Valley" 
                  style={{ height: '42px', width: 'auto', maxWidth: '170px', objectFit: 'contain', display: 'block', marginBottom: '6px' }}
                />
                <p className="font-bold text-xs text-[#06492D] uppercase tracking-wide m-0">
                  Planters Agro Valley Pvt. Ltd.
                </p>
                <p className="text-[11px] text-gray-600 m-0 leading-tight">Official Order Summary & Purchase Receipt</p>
                <p className="text-[11px] text-gray-600 m-0 leading-tight">GSTIN: 32AAACP1234F1Z5 | Support: +91 8304004975</p>
              </div>

              <div className="text-left sm:text-right">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-tight m-0">
                  ORDER SUMMARY
                </h2>
                <p className="mt-1 m-0 text-xs text-gray-700">
                  <span className="font-semibold">Order Number:</span> <span className="font-mono text-gray-900 font-bold">{order.orderNumber}</span>
                </p>
                <p className="m-0 text-xs text-gray-700">
                  <span className="font-semibold">Order Date:</span> {formattedOrderDate}
                </p>
                <p className="m-0 text-xs text-gray-700">
                  <span className="font-semibold">Order Status:</span> <span className="font-semibold text-green-700">{order.orderStatus || 'Delivered'}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              
              <div style={{ padding: '12px' }} className="bg-gray-50/80 rounded space-y-1">
                <p className="font-bold text-[#06492D] uppercase tracking-wider text-[11px] mb-1">
                  SHIP TO
                </p>
                <p className="font-semibold text-gray-900 uppercase m-0 text-xs">
                  {order.shippingAddress?.fullName || order.shippingAddress?.name || "NAMITHA BHASI"}
                </p>
                <div className="text-gray-700 text-[11px] space-y-0.5 leading-snug">
                  <p className="m-0">{order.shippingAddress?.address || "KATHANAPARAMBIL HOUSE,"}</p>
                  <p className="m-0">{order.shippingAddress?.city ? `${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}` : "ELENTHIKKARA PO, PUTHENVELIKARA"}</p>
                  <p className="m-0">PANDIPADAM ROAD ,NEAR malavana</p>
                  <p className="m-0">VISHNUMAYA TEMPLE</p>
                  <p className="m-0 font-medium text-gray-800">Ernakulam, KERALA 683594, India</p>
                </div>
              </div>

              <div style={{ padding: '12px' }} className="bg-gray-50/80 rounded space-y-1">
                <p className="font-bold text-[#06492D] uppercase tracking-wider text-[11px] mb-1">
                  PAYMENT METHOD
                </p>
                <p className="font-semibold text-gray-900 m-0 text-xs">
                  {order.paymentMethod || 'Razorpay Online Checkout'}
                </p>
                <p className="text-gray-700 m-0 text-[11px] leading-tight">
                  Status: <span className="font-semibold text-green-700">{order.paymentStatus || 'Paid'}</span>
                </p>
                <p className="text-gray-500 m-0 text-[10px] pt-2 italic">
                  All transactions are encrypted and secured.
                </p>
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#06492D] text-white font-semibold text-[11px] uppercase tracking-wider">
                    <th className="p-2.5 w-12 text-center">#</th>
                    <th className="p-2.5">Items Ordered</th>
                    <th className="p-2.5 text-center w-16">Qty</th>
                    <th className="p-2.5 text-right w-24">Price</th>
                    <th className="p-2.5 text-right w-28">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => {
                      const price = Number(item.price || 0);
                      const qty = Number(item.quantity || 1);
                      const itemTotal = price * qty;

                      return (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="p-2.5 text-center font-mono text-[11px]">{idx + 1}</td>
                          <td className="p-2.5 font-medium text-gray-900 text-xs">
                            {item.name}
                          </td>
                          <td className="p-2.5 text-center font-mono text-[11px]">{qty}</td>
                          <td className="p-2.5 text-right font-mono text-[11px]">₹{price.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-mono font-semibold text-gray-900 text-xs">₹{itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="p-2.5 text-center font-mono text-[11px]">1</td>
                      <td className="p-2.5 font-medium text-gray-900 text-xs">Wisteria Flowering Vine</td>
                      <td className="p-2.5 text-center font-mono text-[11px]">1</td>
                      <td className="p-2.5 text-right font-mono text-[11px]">₹499.00</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-gray-900 text-xs">₹499.00</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4">
              <div>
                <p className="text-[11px] text-gray-600 m-0 font-medium">
                  Thank you for choosing Planters Agro Valley!
                </p>
                <p className="text-[10px] text-gray-500 m-0">
                  This document serves as an official receipt of your purchase.
                </p>
              </div>

              <div style={{ padding: '12px' }} className="w-full sm:w-72 space-y-1.5 text-xs text-gray-800 bg-gray-50 rounded-sm">
                <div className="flex justify-between text-[11px]">
                  <span>Item(s) Subtotal:</span>
                  <span className="font-mono">₹{itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Shipping:</span>
                  <span className="font-mono">₹{shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Marketplace Fee:</span>
                  <span className="font-mono">₹{marketplaceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#06492D] pt-1.5 mt-1.5">
                  <span>Grand Total:</span>
                  <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{padding:'40px'}} className="min-h-screen bg-[#f3f8f3] py-8 text-[#1c2c21]">
      <div className="container">
        <div className="flex flex-col gap-6 text-left">
        
        <div>
          <Link to="/my-orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06492D] hover:underline mb-2">
            <FiArrowLeft size={14} />
            <span>Back to My Orders</span>
          </Link>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 pb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight m-0 uppercase">
              {isPrintMode ? 'ORDER SUMMARY' : 'ORDER DETAILS'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-900 mt-1 m-0 leading-relaxed">
              <span>Order placed {formattedOrderDate}</span>
              <span className="mx-2 text-gray-400">|</span>
              <span>Order number <span className="font-mono text-gray-800">{order.orderNumber}</span></span>
            </p>
          </div>

          {isPrintMode && (
            <div className="text-right relative print:hidden">
              <span 
                onClick={() => window.print()} 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06492D] hover:underline cursor-pointer print:hidden"
              >
                <FiDownload size={15} />
                <span>Download</span>
              </span>
            </div>
          )}
        </div>

        <div 
          style={{ padding: '10px' }} 
          className="bg-white rounded-xl shadow-xs p-4 sm:p-5 text-left leading-relaxed"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-gray-900 text-sm m-0">SHIP TO</h4>
              <p className="font-semibold text-gray-900 m-0 uppercase tracking-wide">
                {order.shippingAddress?.fullName || order.shippingAddress?.name || "NAMITHA BHASI"}
              </p>
              <div className="text-sm text-gray-900 space-y-0.5 leading-snug">
                <p className="m-0">{order.shippingAddress?.address || "KATHANAPARAMBIL HOUSE,"}</p>
                <p className="m-0">{order.shippingAddress?.city ? `${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}` : "ELENTHIKKARA PO, PUTHENVELIKARA"}</p>
                <p className="m-0">PANDIPADAM ROAD ,NEAR malavana</p>
                <p className="m-0">VISHNUMAYA TEMPLE</p>
                <p className="m-0">Ernakulam, KERALA 683594</p>
                <p className="m-0 font-medium text-gray-700">India</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-gray-900 text-sm m-0">PAYMENT METHOD</h4>
              <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                <div className="w-9 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] font-mono font-bold text-gray-700 shrink-0">
                  <FiCreditCard size={14} className="text-[#06492D]" />
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-gray-900 m-0">{order.paymentMethod || "Razorpay Online Payment"}</p>
                  <p className="text-[11px] text-gray-900 m-0">Status: <span className="font-medium text-green-700">{order.paymentStatus || "Paid"}</span></p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-4 md:pt-0 md:pl-6">
              <h4 className="font-bold text-gray-900 text-sm m-0">ORDER SUMMARY</h4>
              <div className="flex flex-col gap-1.5 text-xs text-gray-900 mt-1">
                <div className="flex justify-between items-center">
                  <span>Item(s) Subtotal:</span>
                  <span className="font-medium text-gray-800">₹{itemsSubtotal}.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  <span className="font-medium text-gray-800">₹{shippingFee}.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Marketplace Fee:</span>
                  <span className="font-medium text-gray-800">₹{marketplaceFee}.00</span>
                </div>
                <div className="flex justify-between items-center text-gray-900 font-semibold pt-1">
                  <span>Total:</span>
                  <span>₹{grandTotal}.00</span>
                </div>
                <div className="flex justify-between items-center text-gray-900 font-bold text-sm pt-0.5">
                  <span>Grand Total:</span>
                  <span className="text-[#06492D]">₹{grandTotal}.00</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div 
          style={{ padding: '10px' }} 
          className="bg-white rounded-xl shadow-xs p-4 sm:p-5 text-left leading-relaxed flex flex-col gap-5"
        >
          <div>
            <h2 className={`text-lg sm:text-xl font-bold m-0 leading-snug uppercase ${order.orderStatus === 'Return Approved' ? 'text-green-700' : order.orderStatus === 'Returned' || order.orderStatus === 'Return Requested' ? 'text-purple-700' : 'text-gray-900'}`}>
              {order.orderStatus === 'Delivered' 
                ? `DELIVERED ${formattedDeliveryDate.toUpperCase()}` 
                : order.orderStatus === 'Return Approved'
                ? 'STATUS: RETURN APPROVED'
                : order.orderStatus === 'Returned' || order.orderStatus === 'Return Requested'
                ? 'STATUS: RETURN REQUESTED'
                : `STATUS: ${order.orderStatus.toUpperCase()}`}
            </h2>
            <p className="text-sm text-gray-700 mt-0.5 m-0 leading-normal">
              {order.orderStatus === 'Delivered' 
                ? "Package was handed to resident" 
                : `Order Status: ${order.orderStatus} • Payment Method: ${order.paymentMethod}`}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {order.items && order.items.map((item, idx) => {
              const itemImage = getItemImage(item);
              return (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pb-5">
                  
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-md overflow-hidden shrink-0 p-1">
                      <img src={itemImage} alt={item.name} className="w-full h-full object-cover rounded-sm" />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0 leading-snug">
                      <Link 
                        to={`/product/${item.product || item._id}`} 
                        className="text-sm sm:text-base font-medium text-blue-700 hover:text-orange-600 hover:underline leading-snug truncate-2-lines text-decoration-none"
                      >
                        {item.name}
                      </Link>
                      
                      <p className="text-sm text-gray-700 m-0">
                        Sold by: <span className="text-gray-700 font-medium">Cocoblu Retail / Planters Agro</span>
                      </p>

                      <p className="text-sm text-gray-700 mt-1 m-0 font-normal leading-relaxed">
                        {isAlreadyReturned ? (
                          <span className="text-purple-700 font-semibold">Return requested on this item</span>
                        ) : isReturnOpen ? (
                          <span className="text-gray-700">Return window open through <span className="font-semibold text-gray-900">{formattedCutoffDate}</span></span>
                        ) : (
                          <span className="text-gray-700">Return window closed on <span className="font-medium">{formattedCutoffDate}</span></span>
                        )}
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-0.5 m-0">
                        ₹{item.price || item.subtotal}.00
                      </p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button 
                          style={{ padding: '6px 14px', borderRadius: '3px' }}
                          onClick={() => addToCart({ _id: item.product || item._id, name: item.name, price: item.price, image: itemImage })}
                          className="bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 font-medium text-sm px-4 border-none transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FiRefreshCw size={13} />
                          Buy it again
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
                      onClick={() => setIsTrackingModalOpen(true)}
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
    </div>

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
      order={order}
    />

    {/* Tax Invoice Modal */}
    <InvoiceModal
      isOpen={isInvoiceModalOpen}
      onClose={() => setIsInvoiceModalOpen(false)}
      order={order}
    />
  </div>
  );
}

export default Orderdetails;
