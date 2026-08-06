import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiRefreshCw, FiHeart, FiHeadphones, FiMapPin, FiChevronRight, FiEdit2, FiPhone, FiMail, FiCalendar, FiTruck, FiShoppingBag, FiCamera, FiBarChart2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import Anthurium from '../assets/Anthurium.png';
import './Plants.css';

const NAV_ITEMS = [
  { key: 'profile', label: 'My Profile', icon: FiUser },
  { key: 'orders', label: 'My Orders', icon: FiPackage },
  { key: 'returns', label: 'Returns & Refunds', icon: FiRefreshCw },
  { key: 'wishlist', label: 'Wishlist', icon: FiHeart },
];

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5 text-left mb-4">
      <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">{label}</span>
      <span className="text-sm text-[#2c3e50] font-semibold leading-relaxed">{value}</span>
    </div>
  );
}

function Profile() {
  const { addToCart } = useCart();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [active, setActive] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showStatsDropdown, setShowStatsDropdown] = useState(false);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatsDropdown(false);
      }
    };
    if (showStatsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatsDropdown]);

  // Local user state (no Redux)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    return {
      firstName: 'Namitha',
      lastName: 'Bhasi',
      email: 'namitha3@gmail.com',
      phone: '8304004975',
      address: 'Ernakulam, Kerala\nIndia - 682001',
    };
  });

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phone: currentUser.phone || '',
    address: currentUser.address || '',
  });

  const [loading, setLoading] = useState(false);

  // Lists and Pagination state
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [returnsCount, setReturnsCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPagination, setOrdersPagination] = useState(null);

  // Fetch counts on load
  const fetchCounts = async () => {
    try {
      const { data: wishlistData } = await axios.get('/wishlist');
      if (wishlistData?.success && wishlistData?.wishlist?.products) {
        setWishlistCount(wishlistData.wishlist.products.length);
      }
    } catch (e) {
      console.error('Error fetching wishlist count:', e);
    }
    try {
      const { data: ordersData } = await axios.get('/orders/my-orders?limit=1');
      if (ordersData?.success && ordersData?.pagination) {
        setOrdersCount(ordersData.pagination.totalOrders || 0);
      }
    } catch (e) {
      console.error('Error fetching orders count:', e);
    }
  };

  // Fetch detailed orders list
  const fetchOrdersList = async (pageNumber = 1) => {
    try {
      setOrdersLoading(true);
      const { data } = await axios.get(`/orders/my-orders?page=${pageNumber}&limit=5`);
      if (data.success) {
        setOrders(data.orders || []);
        setOrdersPagination(data.pagination);
        setOrdersCount(data.pagination.totalOrders || 0);
      }
    } catch (error) {
      console.error('Error fetching orders list:', error);
      toast.error('Failed to load orders.');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch detailed wishlist
  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const { data } = await axios.get('/wishlist');
      if (data.success && data.wishlist) {
        setWishlistItems(data.wishlist.products || []);
        setWishlistCount(data.wishlist.products.length);
      }
    } catch (error) {
      console.error('Error fetching detailed wishlist:', error);
      toast.error('Failed to load wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (active === 'profile') {
      fetchCounts();
    } else if (active === 'orders') {
      fetchOrdersList(ordersPage);
    } else if (active === 'wishlist') {
      fetchWishlist();
    }
  }, [active, ordersPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = {
        ...currentUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  // Profile Picture Upload Handler
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = {
          ...currentUser,
          profilePic: reader.result,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(`/wishlist/${productId}`);
      if (data.success) {
        toast.success('Removed from wishlist');
        setWishlistItems(data.wishlist.products || []);
        setWishlistCount(data.wishlist.products.length);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item.');
    }
  };

  const handleAddToCart = (product) => {
    const productImage = product.images && product.images[0] ? product.images[0].url : Anthurium;
    const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

    addToCart({
      id: product._id,
      name: product.name,
      price: price,
      image: productImage
    });
    toast.success(`${product.name} added to cart!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'Confirmed':
      case 'Processing':
      case 'Packed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getInitials = () => {
    const first = currentUser.firstName?.charAt(0) || '';
    const last = currentUser.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'NB';
  };

  // Render stats block component
  const StatBlock = ({ icon: Icon, value, label, link }) => {
    return (
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-[#1b7a42]" />
        </div>
        <div>
          <p className="font-heading uppercase font-semibold text-gray-800 leading-none mb-0.5">{value}</p>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
          <button className="text-[10px] font-bold text-[#1b7a42] hover:text-[#0b633e] bg-transparent border-none p-0 cursor-pointer flex items-center gap-0.5">
            <span>{link}</span>
            <span>&gt;</span>
          </button>
        </div>
      </div>
    );
  };

  // Render orders panel
  const renderOrders = () => {
    if (ordersLoading) {
      return (
        <div className="py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06492D]"></div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="w-full text-left">
          <div className="mb-4">
            <p className="font-heading font-semibold text-[#06492D] text-sm tracking-wider uppercase m-0">
              MY ORDERS
            </p>
          </div>
          <div style={{marginTop:'80px'}} className="bg-white  p-10 sm:p-12 text-center flex flex-col items-center justify-center w-full ">
            <div style={{marginBottom:'20px'}}className="w-25 h-16 bg-[#edf3ed] text-[#06492D] flex items-center justify-center mb-10 ">
             <img src="https://classroomclipart.com/image/static2/preview/protect-the-environment-grow-plants-30370.gif" alt="" />
            </div>
            <h3 className="text-2xl font-bold mb-1">No orders placed yet</h3>
            <p style={{padding:'20px'}} className=" max-w-xs  leading-relaxed ">
              You haven't placed any orders yet. Browse our plants nursery to place an order.
            </p>
            <Link
              to="/plants"
              className="btn btn-primary !w-auto inline-flex px-6 py-2.5 whitespace-nowrap text-decoration-none"
            >
              START SHOPPING
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-6 text-left">
        <div>
          <div className="mb-4">
            <p className="font-heading font-semibold text-[#06492D] text-sm tracking-wider uppercase m-0">
              MY ORDERS
            </p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-[#e2e8f0] overflow-hidden rounded-none shadow-sm text-left">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center text-xs">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5" style={{ fontSize: '9px' }}>Order Number</p>
                      <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5" style={{ fontSize: '9px' }}>Date Placed</p>
                      <p className="font-semibold text-gray-700 flex items-center gap-1.5">
                        <FiCalendar size={13} className="text-[#06492D]" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5" style={{ fontSize: '9px' }}>Total Amount</p>
                      <p className="font-bold text-[#06492D] text-sm">Rs. {order.totalAmount}.00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold border rounded-none uppercase ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        <img src={item.image || Anthurium} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-semibold text-gray-800 truncate mb-0.5">{item.name}</h4>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} × Rs. {item.price}.00</p>
                      </div>
                      <div className="text-right text-xs font-semibold text-gray-800">Rs. {item.subtotal}.00</div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/10 flex justify-between items-center text-xs">
                  <div className="text-gray-500 font-medium flex items-center gap-1.5">
                    <FiTruck size={14} className="text-[#06492D]" />
                    <span>Method: <span className="font-bold text-gray-700">{order.paymentMethod}</span></span>
                  </div>
                  <Link to={`/track-order?orderId=${order._id}`} className="flex items-center gap-1 text-[#06492D] hover:text-[#0b633e] font-semibold transition-colors text-decoration-none">
                    <span>Track Order</span>
                    <FiChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render returns panel
  const renderReturns = () => {
    return (
      <div className="w-full text-left">
        <div className="mb-4">
          <p className="font-heading font-semibold text-[#06492D] text-sm tracking-wider uppercase m-0">
            RETURNS & REFUNDS
          </p>
        </div>
        <div style={{marginTop:"70px"}} className="bg-white  p-8 sm:p-12 text-center flex flex-col items-center justify-center w-full box-sizing-border">
          <div className="w-12 h-12 bg-[#edf3ed] text-[#06492D] flex items-center justify-center mb-3 rounded-full">
            <FiRefreshCw size={22} />
          </div>
          <h3 style={{padding:'20px'}} className="text-sm font-bold text-gray-800 mb-1">No active return requests</h3>
          <p className="max-w-xs mb-5 leading-relaxed">
            You don't have any active return requests right now.
          </p>
          <button style={{marginTop:'20px'}}  onClick={() => setActive('orders')} className="btn btn-primary !w-auto inline-flex px-6 py-2.5">
            CHECK ORDERS
          </button>
        </div>
      </div>
    );
  };

  // Render wishlist panel
  const renderWishlist = () => {
    if (wishlistLoading) {
      return (
        <div className="py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06492D]"></div>
        </div>
      );
    }

    if (wishlistItems.length === 0) {
      return (
        <div className="w-full text-left">
          <div className="mb-4">
            <p className="font-heading font-semibold text-[#06492D] text-sm tracking-wider uppercase m-0">
              WISHLIST ITEMS
            </p>
          </div>
          <div style={{marginTop:'70px'}} className="bg-white  p-8 sm:p-12 text-center flex flex-col items-center justify-center w-full box-sizing-border">
            <div className="w-12 h-12 bg-[#edf3ed] text-[#06492D] flex items-center justify-center mb-3 rounded-full">
              <FiHeart size={22} />
            </div>
            <h3 className=" font-bold  mb-1">Your wishlist is empty</h3>
            <p style={{marginTop:'20px'}}className=" max-w-xs mb-5 leading-relaxed">
              Save items to purchase them later. Discover beautiful plants nursery now!
            </p>
            <Link style={{marginTop:'20px'}} to="/plants" className="btn btn-primary !w-auto inline-flex px-6 py-2.5 whitespace-nowrap text-decoration-none">
              START SHOPPING
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-between h-full space-y-6 text-left">
        <div>
          <div className="mb-6">
            <p className="font-heading font-bold text-gray-800 text-sm tracking-wider uppercase">
              WISHLIST ITEMS
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistItems.map((product) => {
              const productImage = product.images && product.images[0] ? product.images[0].url : Anthurium;
              const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

              return (
                <div key={product._id} className="bg-white border border-[#e2e8f0] rounded-none flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div className="relative">
                    <div className="aspect-square bg-gray-50 border-b border-gray-150 flex items-center justify-center overflow-hidden">
                      <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <button onClick={() => handleRemoveWishlist(product._id)} className="absolute top-2 right-2 w-8 h-8 bg-white border border-[#e2e8f0] flex items-center justify-center text-red-500 hover:bg-red-50 cursor-pointer rounded-none border-none" title="Remove from wishlist">&times;</button>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{product.name}</h4>
                      <span className="text-xs font-extrabold text-[#06492D]">Rs. {price}.00</span>
                    </div>
                    <button onClick={() => handleAddToCart(product)} className="w-full py-2 bg-[#06492D] hover:bg-[#0b633e] text-white text-xs font-bold border border-[#06492D] rounded-none cursor-pointer transition-colors">Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const formatAddress = (addr) => {
    if (!addr) {
      return { line1: 'Ernakulam, Kerala', line2: 'India - 682001' };
    }
    const lines = addr.split('\n').map(s => s.trim()).filter(Boolean);
    if (lines.length >= 2) {
      return { line1: lines[0], line2: lines.slice(1).join(', ') };
    }
    const commaParts = addr.split(',');
    if (commaParts.length >= 2) {
      const line1 = commaParts.slice(0, Math.min(2, commaParts.length - 1)).join(',').trim();
      const line2 = commaParts.slice(Math.min(2, commaParts.length - 1)).join(',').trim();
      return { line1, line2 };
    }
    return { line1: addr, line2: '' };
  };
  const renderProfile = () => {
    const addressFormatted = formatAddress(currentUser.address);

    return (
      <div className="flex flex-col gap-4 sm:gap-6 text-left w-full">
        {/* Top Action Bar: Shopping Bag Notification Icon + Dropdown & Edit Profile */}
        {!isEditing && (
          <div className="flex justify-between sm:justify-end items-center gap-3 w-full relative">
            {/* Breadcrumb path for small screens */}
            <div className="block sm:hidden text-left">
              <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <span>Account</span>
                <span>/</span>
                <span className="text-[#06492D] font-bold">Profile</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Shopping Bag Notification Icon Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowStatsDropdown((prev) => !prev)}
                  title="My Orders & Shopping Activity"
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#06492D',
                    cursor: 'pointer',
                    borderRadius: '0px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <FiShoppingBag size={17} />
                  {ordersCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: '#06492D',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: '700',
                        minWidth: '16px',
                        height: '16px',
                        padding: '0 3px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1.5px solid #ffffff',
                        lineHeight: '1',
                      }}
                    >
                      {ordersCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu Centered Directly Below Icon Button */}
                {showStatsDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: 'calc(100% + 8px)',
                      width: '240px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                      zIndex: 999,
                      padding: '14px 16px',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                    }}
                  >
                    <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06492D' }}>MY SHOPPING</span>
                    </div>

                    <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: '#06492D', display: 'block', marginBottom: '2px' }}>TOTAL ORDERS</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>{ordersCount}</span>
                      </div>
                      <button
                        onClick={() => { setActive('orders'); setShowStatsDropdown(false); }}
                        style={{ fontSize: '11px', color: '#06492D', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600', padding: '0' }}
                      >
                        View Orders &gt;
                      </button>
                    </div>

                    <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: '#06492D', display: 'block', marginBottom: '2px' }}>RETURN REQUESTS</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>{returnsCount}</span>
                      </div>
                      <button
                        onClick={() => { setActive('returns'); setShowStatsDropdown(false); }}
                        style={{ fontSize: '11px', color: '#06492D', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600', padding: '0' }}
                      >
                        View Returns &gt;
                      </button>
                    </div>

                    <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: '#06492D', display: 'block', marginBottom: '2px' }}>WISHLIST ITEMS</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>{wishlistCount}</span>
                      </div>
                      <button
                        onClick={() => { setActive('wishlist'); setShowStatsDropdown(false); }}
                        style={{ fontSize: '11px', color: '#06492D', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600', padding: '0' }}
                      >
                        View Wishlist &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Profile button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    phone: currentUser.phone || '',
                    address: currentUser.address || '',
                  });
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#06492D] hover:text-[#0b633e] font-semibold bg-transparent border-none p-0 cursor-pointer transition-colors whitespace-nowrap"
              >
                <FiEdit2 size={13} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* Card 1: ACCOUNT DETAILS & SHIPPING ADDRESS (Always Stable Height) */}
        <div style={{ padding: '24px 28px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0px', width: '100%', boxSizing: 'border-box' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Left Column: ACCOUNT DETAILS */}
            <div className="md:pr-6 space-y-6 pt-2 md:pt-0">
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06492D', margin: '0 0 16px 0' }}>ACCOUNT DETAILS</p>
              </div>

              <div className="flex flex-col gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06492D' }}>FULL NAME:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: '400', color: '#000000' }}>{currentUser.firstName} {currentUser.lastName}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06492D' }}>EMAIL ADDRESS:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: '400', color: '#000000' }}>{currentUser.email}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06492D' }}>PHONE NUMBER:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: '400', color: '#000000' }}>{currentUser.phone || '8304004975'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: SHIPPING ADDRESS */}
            <div className="md:pl-6 space-y-6 pt-6 md:pt-0">
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#06492D', margin: '0 0 16px 0' }}>SHIPPING ADDRESS</p>
              </div>

              <div className="pt-1">
                <p style={{ fontSize: '13.5px', fontWeight: '400', color: '#000000', lineHeight: '1.6', margin: '0' }}>
                  {addressFormatted.line1}
                </p>
                {addressFormatted.line2 && (
                  <p style={{ fontSize: '13.5px', fontWeight: '400', color: '#000000', lineHeight: '1.6', margin: '4px 0 0 0' }}>
                    {addressFormatted.line2}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal Dialog */}
        {isEditing && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(3px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={() => setIsEditing(false)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                width: '100%',
                maxWidth: '540px',
                padding: '28px 32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                position: 'relative',
                boxSizing: 'border-box',
                borderRadius: '0px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '22px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#06492D', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  EDIT PROFILE DETAILS
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ color: '#94a3b8', fontSize: '20px', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#06492D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', borderRadius: '0px', backgroundColor: '#ffffff' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#06492D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', borderRadius: '0px', backgroundColor: '#ffffff' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#06492D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#94a3b8', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box', borderRadius: '0px', cursor: 'not-allowed' }}
                      disabled
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#06492D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', borderRadius: '0px', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#06492D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Shipping Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', borderRadius: '0px', backgroundColor: '#ffffff', minHeight: '80px', resize: 'vertical' }}
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '18px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="modal-save-btn"
                    style={{ opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Card 2: Bottom Banner */}
        <div style={{ padding: '18px 24px', backgroundColor: '#eef7ee', border: '1px solid #d5ead5', borderRadius: '0px', width: '100%', boxSizing: 'border-box' }} className="flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="z-10 max-w-md">
            <h3 className="text-sm sm:text-base font-medium text-black mb-0.5 flex items-center gap-1.5">
              <span>Love gardening? So do we!</span>
              <span>🌿</span>
            </h3>
            <p className="text-xs text-gray-600 font-normal leading-relaxed">
              Stay updated with new plants, care tips and exclusive offers.
            </p>
          </div>
          <div className="z-10 flex items-center gap-4 flex-shrink-0">
            <Link
              to="/plants"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06492D] hover:text-[#0b633e] transition-colors text-decoration-none whitespace-nowrap"
            >
              <span>Explore Plants</span>
              <FiChevronRight size={14} />
            </Link>
            <div className="hidden sm:block w-16 h-16 flex-shrink-0">
              <img src={Anthurium} alt="Plant" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPanel = () => {
    switch (active) {
      case 'profile':
        return renderProfile();
      case 'orders':
        return renderOrders();
      case 'returns':
        return renderReturns();
      case 'wishlist':
        return renderWishlist();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="plants-page-wrapper text-[#1c2c21]">

    

      {/* Hidden file input for uploading profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePicChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <section className="plants-catalog-section pb-12" style={{ paddingTop: '0px' }}>
        <div className="container profile-layout-container">

          {/* Left Sidebar (Desktop Only: > 992px) */}
          <aside className="profile-sidebar-wrapper hidden lg:flex" style={{ borderRadius: '0px' }}>
            <div className="w-full flex flex-col gap-3">

              {/* Top client card */}
              <div className="flex flex-col items-center gap-1 border-b border-gray-200 pb-2.5 w-full" style={{ marginTop: '0px' }}>
                <div
                  className="profile-avatar-container w-10 h-10 bg-white text-[#1b7a42] flex items-center justify-center text-xs font-bold uppercase rounded-full shadow-sm"
                  onClick={() => fileInputRef.current.click()}
                  title="Click to update profile picture"
                >
                  {currentUser.profilePic ? (
                    <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    getInitials()
                  )}
                  <div className="profile-avatar-overlay">
                    <FiCamera size={12} />
                  </div>
                </div>
                <p className="text-[11.5px] font-semibold text-gray-800 capitalize">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
              </div>

              {/* Menu Buttons (Simplified Text-only, Single Line) */}
              <div className="profile-menu-list w-full">
                {NAV_ITEMS.map(({ key, label }) => {
                  const isActive = active === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActive(key);
                        setIsEditing(false);
                      }}
                      className={`profile-menu-btn ${isActive ? 'active' : ''}`}
                      style={{ borderRadius: '0px' }}
                    >
                      <span>{label.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Need help block naturally placed directly below menu list */}
            <div className="flex flex-col items-center gap-1 w-full text-center pt-3 border-t border-gray-200" style={{ marginTop: '60px' }}>
              <p className="font-heading font-semibold text-[#06492D] text-[10.5px] uppercase tracking-wider margin-0">
                NEED HELP?
              </p>
              <p className="text-[10px] text-[#2c3e50] leading-normal font-semibold mb-0.5 block">
                We're here for you
              </p>
              <a
                href={`mailto:support@plantersagrovalley.com?subject=Support%20Request%20-%20${currentUser.firstName}%20${currentUser.lastName}`}
                className="text-[10.5px] font-semibold text-[#06492D] hover:text-[#1b7a42] flex items-center justify-center gap-1 transition-colors text-decoration-none"
              >
                <FiHeadphones size={11} />
                <span>CONTACT SUPPORT</span>
                <FiChevronRight size={12} />
              </a>
            </div>
          </aside>

          {/* Right Column: Main Content (switches dynamically on item click) */}
          <main className="profile-main-content-wrapper flex flex-col justify-start">
            
            {/* Mobile / Tablet Select Navigation Dropdown (< 993px) with margin-top */}
            <div className="block lg:hidden w-full mb-4 mt-4 pt-2">
              <div className="flex items-center justify-between bg-[#f3f8f3] border border-[#e2e8f0] p-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 bg-white text-[#06492D] rounded-full flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {currentUser.profilePic ? (
                      <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      getInitials()
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#06492D] capitalize">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={active}
                    onChange={(e) => {
                      setActive(e.target.value);
                      setIsEditing(false);
                    }}
                    className="bg-white border border-[#06492D] text-[#06492D] font-semibold text-xs py-1.5 pl-3 pr-8 rounded-none outline-none cursor-pointer uppercase tracking-wider appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2306492D' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 6px center',
                      backgroundSize: '16px',
                    }}
                  >
                    {NAV_ITEMS.map(({ key, label }) => (
                      <option key={key} value={key} className="bg-white text-black py-2">
                        {label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {renderPanel()}
          </main>

        </div>
      </section>
    </div>
  );
}

export default Profile;
