import React, { useState, useEffect } from 'react';
import { useCart, getMongoIdFromMockId } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { FiTruck, FiArrowLeft, FiLock, FiUnlock, FiTag, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/logo.png';
import './Payment.css';
import { createPaymentOrder, verifyPayment } from '../api/paymentApi';
import { setUser, openAuthModal } from '../redux/auth/authSlice';
import axiosInstance from '../api/axiosInstance';

// Dynamically load Razorpay SDK Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Payment() {
  const { cartItems, cartSubtotal, clearCart, openCart, syncLocalCartToBackend } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Form states
  const [email, setEmail] = useState('');
  const [emailMarketing, setEmailMarketing] = useState(true);
  const [country, setCountry] = useState('India');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('Kerala');
  const [pinCode, setPinCode] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');

  // Lock / Unlock toggle for logged-in user address
  const [isAddressLocked, setIsAddressLocked] = useState(true);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Policy checkbox
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields if user is logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ')[1] || '');
      setPhone(user.phone || '');

      // Populate address details if available
      const savedAddress = user.address || user.streetAddress || user.addresses?.[0]?.street || '';
      const savedApartment = user.apartment || user.addresses?.[0]?.apartment || '';
      const savedCity = user.city || user.addresses?.[0]?.city || '';
      const savedState = user.state || user.addresses?.[0]?.state || 'Kerala';
      const savedPincode = user.pinCode || user.pincode || user.addresses?.[0]?.pincode || '';

      setAddress(savedAddress);
      setApartment(savedApartment);
      setCity(savedCity);
      setStateVal(savedState);
      setPinCode(savedPincode);
    }
  }, [user]);

  // Handle Coupon Apply
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');

    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    // Supported coupons logic
    if (cleanCode === 'PLANTERS10') {
      setAppliedCoupon({ code: 'PLANTERS10', type: 'percent', value: 0.10, desc: '10% OFF Discount Applied' });
      toast.success('Coupon PLANTERS10 applied (10% OFF)!');
    } else if (cleanCode === 'WELCOME20') {
      setAppliedCoupon({ code: 'WELCOME20', type: 'percent', value: 0.20, desc: '20% OFF Welcome Discount Applied' });
      toast.success('Coupon WELCOME20 applied (20% OFF)!');
    } else if (cleanCode === 'FREESHIP' || cleanCode === 'SAVE100') {
      setAppliedCoupon({ code: 'SAVE100', type: 'flat', value: 100, desc: '₹100 Flat Discount Applied' });
      toast.success('Coupon SAVE100 applied (₹100 OFF)!');
    } else {
      setCouponError('Invalid coupon code. Try PLANTERS10, WELCOME20, or SAVE100.');
      toast.error('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    toast.info('Coupon removed.');
  };

  // Dynamic Estimated Delivery Calculation Logic (Current Date + 3 to 5 business days)
  const getDynamicEstimatedDelivery = () => {
    const now = new Date();
    const minDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const minFormatted = minDate.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
    const maxFormatted = maxDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    return `${minFormatted} - ${maxFormatted}`;
  };

  // Real cart items (NO fallback mock items when cart is empty)
  const displayItems = cartItems;
  
  // Calculate pricing values
  const subtotal = cartSubtotal;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = subtotal * appliedCoupon.value;
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const gst = subtotalAfterDiscount * 0.05;
  const total = subtotalAfterDiscount + gst;

  const handleReturnToCart = (e) => {
    e.preventDefault();
    openCart();
    navigate('/');
  };

  const handleSignInPrompt = (e) => {
    e.preventDefault();
    dispatch(openAuthModal("login"));
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }
    
    // Clear old errors
    setErrors({});

    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!stateVal) newErrors.stateVal = 'State is required';
    if (!pinCode) newErrors.pinCode = 'PIN code is required';
    if (!phone) newErrors.phone = 'Phone number is required';

    if (!acceptTerms) {
      newErrors.acceptTerms = 'You must accept the privacy policy and terms & conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Load Razorpay script dynamically
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      // 2. Prepare payload for create-order
      const cleanPhone = (countryCode + phone).replace(/\+/g, '').trim();
      const payload = {
        couponCode: appliedCoupon?.code || undefined,
      };

      if (!user) {
        payload.email = email;
        payload.phone = cleanPhone;
        payload.firstName = firstName;
        payload.lastName = lastName;
        payload.cartItems = displayItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }));
      } else {
        await syncLocalCartToBackend(cartItems);
      }

      // 3. Create order on backend
      const { data } = await createPaymentOrder(payload);

      if (!data.success) {
        toast.error(data.message || "Failed to create order on server.");
        setIsSubmitting(false);
        return;
      }

      // 4. Configure Razorpay options
      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "Planters Agro Valley",
        description: "Purchase Plants & Garden items",
        image: logo,
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            // 5. Verify payment and finalize order
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: {
                receiverName: `${firstName} ${lastName}`,
                phone: cleanPhone,
                addressLine1: address,
                addressLine2: apartment,
                city: city,
                state: stateVal,
                country: country,
                postalCode: pinCode,
              },
              couponCode: appliedCoupon?.code || undefined,
              notes: "",
              emailMarketing: emailMarketing,
            };

            if (!user) {
              verifyPayload.email = email;
              verifyPayload.phone = cleanPhone;
              verifyPayload.firstName = firstName;
              verifyPayload.lastName = lastName;
              verifyPayload.cartItems = displayItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }));
            }

            const verifyRes = await verifyPayment(verifyPayload);

             if (verifyRes.data.success) {
              toast.success("Payment successful! Your order has been placed.");
              
              if (verifyRes.data.user) {
                dispatch(setUser(verifyRes.data.user));
              }

              // Remove purchased products from Wishlist
              try {
                for (const item of displayItems) {
                  const itemId = item.id || item._id;
                  if (itemId) {
                    const mongoId = getMongoIdFromMockId(itemId);
                    await axiosInstance.delete(`/wishlist/${mongoId}`).catch(() => {});
                  }
                }
              } catch (e) {
                console.warn("Could not remove items from wishlist after payment:", e);
              }

              clearCart();
              navigate("/my-orders");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error(err.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: cleanPhone,
        },
        theme: {
          color: "#06331F",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Readonly flag for logged-in users
  const isReadOnly = Boolean(user) && isAddressLocked;

  return (
    <div className="checkout-page-wrapper">
      {/* Checkout custom header */}
      <header className="checkout-simple-header">
        <div className="container checkout-header-container">
          <div className="checkout-logo-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Planters Agro Valley" className="checkout-logo-img" />
          </div>
          <button onClick={handleReturnToCart} className="checkout-nav-link-btn">
            <FiArrowLeft size={16} style={{ marginRight: '6px' }} />
            View Cart
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full bg-[#f3f8f3] flex-1 flex flex-col justify-center items-center px-4 py-6">
        {cartItems.length === 0 ? (
          /* Empty Cart Banner on Checkout Page - Green BG Page with White Centered Box & 20px Padding */
          <div className="w-full min-h-[calc(100vh-180px)] flex flex-col items-center justify-center">
            <div 
              style={{ padding: '20px' }}
              className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-[4px] text-center flex flex-col items-center justify-center gap-3 shadow-xs my-auto"
            >
              <div className="w-12 h-12 bg-[#edf3ed] text-[#06492D] rounded-full flex items-center justify-center shadow-xs">
                <FiTruck size={22} />
              </div>
              <h2 className="text-xl font-bold text-[#06492D] m-0 uppercase tracking-wide">Your Cart is Empty</h2>
              <p className="text-xs text-gray-700 max-w-md m-0 leading-relaxed font-normal">
                You don't have any items in your shopping cart to checkout. Explore our wide range of healthy plants and nursery supplies.
              </p>
              <Link
                to="/plants"
                className="btn btn-primary px-6 py-2.5 uppercase text-xs tracking-wider mt-1"
                style={{ borderRadius: '3px' }}
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="checkout-layout-grid" noValidate>
            
            {/* Left Column: Forms */}
            <div className="checkout-forms-column">
              
              {/* Account Sign In Prompt */}
              {!user && (
                <div className="checkout-card account-prompt-card">
                  <div className="account-prompt-text">
                    <span className="account-prompt-title">Already have an account?</span>
                    <span className="account-prompt-subtitle">Sign in to checkout faster</span>
                  </div>
                  <a href="#signin" onClick={handleSignInPrompt} className="account-prompt-link">
                    Sign in &rarr;
                  </a>
                </div>
              )}

              {/* Saved Account Notice for Logged-In Users */}
              {user && (
                <div className="bg-[#edf3ed] border border-[#06492D]/20 p-4 rounded-[4px] flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[#06492D] font-semibold">
                    <FiLock size={15} />
                    <span>Saved Account Address ({isAddressLocked ? 'Locked for Security' : 'Editable Mode'})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddressLocked(!isAddressLocked)}
                    className="text-xs text-[#06492D] underline font-semibold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                  >
                    {isAddressLocked ? (
                      <>
                        <FiUnlock size={12} />
                        <span>Unlock to Edit</span>
                      </>
                    ) : (
                      <>
                        <FiLock size={12} />
                        <span>Lock Address</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Contact Details */}
              <div className="checkout-card">
                <h3 className="checkout-section-title">Contact</h3>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email address"
                    value={email}
                    readOnly={isReadOnly}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="checkout-error-text">{errors.email}</span>}
                </div>
                <label className="checkout-checkbox-label">
                  <input
                    type="checkbox"
                    checked={emailMarketing}
                    onChange={(e) => setEmailMarketing(e.target.checked)}
                    className="checkout-checkbox"
                  />
                  Email me with news and offers
                </label>
              </div>

              {/* Delivery Address */}
              <div className="checkout-card">
                <h3 className="checkout-section-title">Delivery Address</h3>
                
                <div className="form-group">
                  <label className="input-label-hidden" htmlFor="country">Country / Region</label>
                  <select
                    id="country"
                    value={country}
                    disabled={isReadOnly}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`checkout-select ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''}`}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>

                <div className="checkout-input-row double">
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="First name"
                      value={firstName}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                      }}
                      className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.firstName ? 'input-error' : ''}`}
                    />
                    {errors.firstName && <span className="checkout-error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                      }}
                      className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.lastName ? 'input-error' : ''}`}
                    />
                    {errors.lastName && <span className="checkout-error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="address"
                    placeholder="Address (House no., Building, Street)"
                    value={address}
                    readOnly={isReadOnly}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.address ? 'input-error' : ''}`}
                  />
                  {errors.address && <span className="checkout-error-text">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={apartment}
                    readOnly={isReadOnly}
                    onChange={(e) => setApartment(e.target.value)}
                    className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="checkout-input-row triple">
                  <div className="form-group" style={{ flex: 1.5, marginBottom: 0 }}>
                    <input
                      type="text"
                      id="city"
                      placeholder="City"
                      value={city}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                      }}
                      className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.city ? 'input-error' : ''}`}
                    />
                    {errors.city && <span className="checkout-error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group" style={{ flex: 1.2, marginBottom: 0 }}>
                    <select
                      id="stateVal"
                      value={stateVal}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        setStateVal(e.target.value);
                        if (errors.stateVal) setErrors((prev) => ({ ...prev, stateVal: '' }));
                      }}
                      className={`checkout-select ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.stateVal ? 'input-error' : ''}`}
                    >
                      <option value="" disabled>State</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    {errors.stateVal && <span className="checkout-error-text">{errors.stateVal}</span>}
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input
                      type="text"
                      id="pinCode"
                      placeholder="PIN code"
                      value={pinCode}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        setPinCode(e.target.value);
                        if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: '' }));
                      }}
                      className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.pinCode ? 'input-error' : ''}`}
                    />
                    {errors.pinCode && <span className="checkout-error-text">{errors.pinCode}</span>}
                  </div>
                </div>

                {/* Phone with Country Code Dropdown */}
                <div className="form-group">
                  <div className="checkout-input-row" style={{ display: 'flex', gap: '8px', marginBottom: 0 }}>
                    <select
                      value={countryCode}
                      disabled={isReadOnly}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`checkout-select ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''}`}
                      style={{ width: '100px', flexShrink: 0 }}
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971 (AE)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+81">+81 (JP)</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Phone number"
                      value={phone}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`checkout-input ${isReadOnly ? 'bg-gray-100/70 text-gray-700 cursor-not-allowed' : ''} ${errors.phone ? 'input-error' : ''}`}
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                  {errors.phone && <span className="checkout-error-text">{errors.phone}</span>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <div className="checkout-card-header-row">
                  <div>
                    <h3 className="checkout-section-title" style={{ marginBottom: '2px' }}>Payment Method</h3>
                    <p className="checkout-section-subtitle">All transactions are secure and encrypted</p>
                  </div>
                </div>

                <div className="payment-method-box">
                  <div className="payment-method-header">
                    <div className="payment-radio-wrap">
                      <input
                        type="radio"
                        id="cc"
                        name="paymentMethod"
                        checked
                        readOnly
                        className="checkout-radio"
                      />
                      <label htmlFor="cc" className="payment-radio-label">
                        <strong>Razorpay Secure Checkout</strong>
                        <span className="payment-radio-desc">Pay securely using UPI, Cards, Netbanking, or Wallets</span>
                      </label>
                    </div>
                    <div className="payment-brand-logos">
                      <span className="brand-logo-txt visa">VISA</span>
                      <span className="brand-logo-txt mc">Mastercard</span>
                      <span className="brand-logo-txt rupay">RuPay</span>
                    </div>
                  </div>

                  <div className="payment-method-body" style={{ padding: 'var(--space-5)', backgroundColor: '#fcfdfd' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: 0 }}>
                      After clicking "Proceed to Pay", you will open the secure Razorpay Checkout modal overlay to complete your transaction online.
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Footer Links Row */}
              <div className="checkout-policies-footer">
                <a href="#refund" className="policy-link">Refund policy</a>
                <a href="#shipping" className="policy-link">Shipping policy</a>
                <a href="#privacy" className="policy-link">Privacy policy</a>
                <a href="#terms" className="policy-link">Terms of service</a>
                <a href="#contact" className="policy-link">Contact information</a>
              </div>

            </div>

            {/* Right Column: Order Summary & Action Buttons */}
            <div className="checkout-summary-column">
              
              {/* Summary Card */}
              <div className="summary-sticky-card">
                <h3 className="summary-card-title">Order Summary</h3>
                
                {/* Product Listing */}
                <div className="summary-items-list">
                  {displayItems.map((item) => (
                    <div key={item.id} className="summary-item-row">
                      <div className="summary-item-img-container">
                        <img src={item.image} alt={item.name} className="summary-item-img" />
                        <span className="summary-item-qty">{item.quantity}</span>
                      </div>
                      <div className="summary-item-details">
                        <span className="summary-item-name">{item.name}</span>
                        <span className="summary-item-cat">{item.category || 'Live Plant'}</span>
                      </div>
                      <span className="summary-item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="border-t border-b border-gray-100 py-3 my-3">
                  <label className="text-xs font-semibold text-[#06492D] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <FiTag size={13} />
                    <span>Apply Coupon Code</span>
                  </label>
                  
                  {appliedCoupon ? (
                    <div className="flex justify-between items-center bg-[#edf3ed] border border-[#06492D]/30 p-2.5 rounded-[3px] text-xs">
                      <div className="flex items-center gap-1.5 text-[#06492D] font-semibold">
                        <FiCheck size={14} />
                        <span>{appliedCoupon.code} ({appliedCoupon.desc})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-800 text-[11px] font-semibold underline cursor-pointer bg-transparent border-none p-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Coupon (e.g. PLANTERS10)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponError) setCouponError('');
                        }}
                        className="checkout-input flex-1 uppercase text-xs tracking-wider"
                        style={{ borderRadius: '3px', textTransform: 'uppercase' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="btn btn-primary text-xs uppercase cursor-pointer"
                        style={{ padding: '6px 16px', borderRadius: '3px' }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[11px] text-red-600 mt-1 m-0">{couponError}</p>}
                </div>

                {/* Totals Breakdown */}
                <div className="summary-breakdown">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-row text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>- ₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="shipping-free">FREE</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (5%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row total-row">
                    <div className="total-label-wrap">
                      <span className="total-label">Total Amount</span>
                      <span className="total-label-sub">(Inclusive of all taxes)</span>
                    </div>
                    <span className="total-value">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estimated Delivery Section with Dynamic Logic */}
                <div className="summary-delivery-box">
                  <div className="delivery-icon-wrap">
                    <FiTruck size={24} className="delivery-truck-icon" />
                  </div>
                  <div className="delivery-text-wrap">
                    <span className="delivery-title">Estimated Delivery</span>
                    <span className="delivery-date">{getDynamicEstimatedDelivery()}</span>
                    <span className="delivery-location">Delivering to {pinCode || user?.pincode || user?.pinCode || '560001'}</span>
                  </div>
                  <a href="#change" onClick={(e) => { e.preventDefault(); setIsAddressLocked(false); }} className="delivery-change-link">
                    Change
                  </a>
                </div>

                {/* Security guarantees list (NO ICONS) */}
                <div className="guarantees-list">
                  <div className="guarantee-item">
                    <div className="guarantee-text">
                      <strong>Secure Payments</strong>
                      <span>Your payments are 100% safe with us.</span>
                    </div>
                  </div>
                  <div className="guarantee-item">
                    <div className="guarantee-text">
                      <strong>7 Days Easy Returns</strong>
                      <span>Not satisfied? Return within 7 days.</span>
                    </div>
                  </div>
                  <div className="guarantee-item">
                    <div className="guarantee-text">
                      <strong>Genuine & Healthy Plants</strong>
                      <span>We deliver premium quality plants.</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Policy & Terms Checkbox */}
                <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                  <label className="checkout-checkbox-label" style={{ alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      id="acceptTerms"
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (errors.acceptTerms) setErrors((prev) => ({ ...prev, acceptTerms: '' }));
                      }}
                      className="checkout-checkbox"
                      style={{ marginTop: '3px' }}
                    />
                    <span style={{ fontSize: '13px', lineHeight: '1.4' }}>
                      I accept the <a href="#privacy" style={{ textDecoration: 'underline', color: 'var(--color-primary-dark)' }}>Privacy Policy</a> and <a href="#terms" style={{ textDecoration: 'underline', color: 'var(--color-primary-dark)' }}>Terms and Conditions</a>
                    </span>
                  </label>
                  {errors.acceptTerms && <span className="checkout-error-text" style={{ marginTop: '6px' }}>{errors.acceptTerms}</span>}
                </div>

                {/* Submit Proceed to Pay button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: '3px' }}
                >
                  {isSubmitting ? 'Processing...' : `Proceed to Pay  ₹${total.toFixed(2)}`}
                </button>
              </div>

            </div>

          </form>
        )}
      </main>
    </div>
  );
}

export default Payment;
