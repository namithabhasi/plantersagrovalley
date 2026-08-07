import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/logo.png';
import './Payment.css';
import { createPaymentOrder, verifyPayment } from '../api/paymentApi';
import { setUser, openAuthModal } from '../redux/auth/authSlice';
import axiosInstance from '../api/axiosInstance';

// Fallback mock items to match design when cart is empty
import monsteraImg from '../assets/Crassula Ovata Green Succulent.jpg';
import snakePlantImg from '../assets/Golden Hahnii Snake Plant Seeds Sansevieria Birds Nest.jpg';
import potImg from '../assets/pots and planters.jpg';

const MOCK_ITEMS = [
  {
    id: 'mock-1',
    name: 'Monstera Deliciosa',
    category: 'Live Plant',
    price: 899,
    quantity: 1,
    image: monsteraImg,
  },
  {
    id: 'mock-2',
    name: 'Snake Plant',
    category: 'Live Plant',
    price: 699,
    quantity: 1,
    image: snakePlantImg,
  },
  {
    id: 'mock-3',
    name: 'Ceramic Pot (White)',
    category: 'Accessories',
    price: 399,
    quantity: 1,
    image: potImg,
  },
];

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
  const [stateVal, setStateVal] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');

  // Policy checkbox
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields if user is logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Determine items to display (real cart items or fallback mock design items)
  const displayItems = cartItems.length > 0 ? cartItems : MOCK_ITEMS;
  
  // Calculate pricing values
  const subtotal = cartItems.length > 0 ? cartSubtotal : displayItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

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
      // Smooth scroll to the first error input
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
        couponCode: undefined, // Coupon input is not present in checkout form yet
      };

      if (!user) {
        // Guest checkout needs details and cart items sent in request
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
        // Sync logged-in cart to DB first
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
              couponCode: undefined,
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
              
              // Automatically sign in guest user if they checked out as guest
              if (verifyRes.data.user) {
                dispatch(setUser(verifyRes.data.user));
              }

              clearCart();
              navigate("/");
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
          color: "#06331F", // Theme dark green
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
      <main className="container checkout-main-content">
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

            {/* Contact Details */}
            <div className="checkout-card">
              <h3 className="checkout-section-title">Contact</h3>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`checkout-input ${errors.email ? 'input-error' : ''}`}
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
                  onChange={(e) => setCountry(e.target.value)}
                  className="checkout-select"
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
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                    }}
                    className={`checkout-input ${errors.firstName ? 'input-error' : ''}`}
                  />
                  {errors.firstName && <span className="checkout-error-text">{errors.firstName}</span>}
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                    }}
                    className={`checkout-input ${errors.lastName ? 'input-error' : ''}`}
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
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  className={`checkout-input ${errors.address ? 'input-error' : ''}`}
                />
                {errors.address && <span className="checkout-error-text">{errors.address}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="checkout-input"
                />
              </div>

              <div className="checkout-input-row triple">
                <div className="form-group" style={{ flex: 1.5, marginBottom: 0 }}>
                  <input
                    type="text"
                    id="city"
                    placeholder="City"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    className={`checkout-input ${errors.city ? 'input-error' : ''}`}
                  />
                  {errors.city && <span className="checkout-error-text">{errors.city}</span>}
                </div>
                <div className="form-group" style={{ flex: 1.2, marginBottom: 0 }}>
                  <select
                    id="stateVal"
                    value={stateVal}
                    onChange={(e) => {
                      setStateVal(e.target.value);
                      if (errors.stateVal) setErrors((prev) => ({ ...prev, stateVal: '' }));
                    }}
                    className={`checkout-select ${errors.stateVal ? 'input-error' : ''}`}
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
                    onChange={(e) => {
                      setPinCode(e.target.value);
                      if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: '' }));
                    }}
                    className={`checkout-input ${errors.pinCode ? 'input-error' : ''}`}
                  />
                  {errors.pinCode && <span className="checkout-error-text">{errors.pinCode}</span>}
                </div>
              </div>

              {/* Phone with Country Code Dropdown */}
              <div className="form-group">
                <div className="checkout-input-row" style={{ display: 'flex', gap: '8px', marginBottom: 0 }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="checkout-select"
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
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    className={`checkout-input ${errors.phone ? 'input-error' : ''}`}
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

              {/* Totals Breakdown */}
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
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

              {/* Estimated Delivery Section */}
              <div className="summary-delivery-box">
                <div className="delivery-icon-wrap">
                  <FiTruck size={24} className="delivery-truck-icon" />
                </div>
                <div className="delivery-text-wrap">
                  <span className="delivery-title">Estimated Delivery</span>
                  <span className="delivery-date">29 July - 31 July, 2026</span>
                  <span className="delivery-location">Delivering to 560001</span>
                </div>
                <a href="#change" className="delivery-change-link">
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
      </main>
    </div>
  );
}

export default Payment;
