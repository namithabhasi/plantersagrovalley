import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { setUser, closeAuthModal } from "../redux/auth/authSlice";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";
import "./AuthModal.css";

function AuthModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalTab } = useSelector((state) => state.auth);
  const { cartItems, syncLocalCartToBackend } = useCart();

  const [isLogin, setIsLogin] = useState(authModalTab === "login");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Inline Validation Errors State
  const [errors, setErrors] = useState({});

  // Sync isLogin state when authModalTab from Redux changes
  React.useEffect(() => {
    setIsLogin(authModalTab === "login");
    setErrors({});
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
    setErrors({});
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!isLogin) {
      if (!firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!phone.trim()) {
        newErrors.phone = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(phone.trim())) {
        newErrors.phone = "Mobile number must be exactly 10 digits";
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/';]).{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = "Password does not meet complexity requirements";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: email.trim(), password }
        : { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, phone: phone.trim() };

      const { data } = await axiosInstance.post(endpoint, payload);

      if (!data.success) {
        toast.error(data.message || "Authentication failed.");
        return;
      }

      // Save user to Redux state & localStorage
      dispatch(setUser({ user: data.user, token: data.token }));

      // Synchronize local cart to database
      await syncLocalCartToBackend(cartItems);

      const userName = data.user?.firstName || data.user?.name || data.user?.email?.split('@')[0] || 'User';
      toast.success(`Welcome ${userName}!`);
      
      // Clear form inputs
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setErrors({});

      // Close modal
      handleClose();

      // Check for pending redirect
      const pendingRedirect = sessionStorage.getItem("postLoginRedirect");
      if (pendingRedirect) {
        sessionStorage.removeItem("postLoginRedirect");
        navigate(pendingRedirect);
      }
    } catch (error) {
      const serverMsg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-card" style={{ borderRadius: "0px" }} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close-btn" onClick={handleClose}>
          <FiX size={20} />
        </button>

        <div className="auth-modal-header">
          <img src={logo} alt="Planters Agro Valley" className="auth-modal-logo" />
          <div className="auth-modal-tabs">
            <button
              className={`auth-modal-tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => handleToggleMode()}
            >
              SIGN IN
            </button>
            <button
              className={`auth-modal-tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => handleToggleMode()}
            >
              REGISTER
            </button>
          </div>
        </div>

        <div className="auth-modal-body">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <>
                <div className="auth-input-row">
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label>First Name</label>
                    <input
                      type="text"
                      className="checkout-input"
                      style={{ borderRadius: "0px" }}
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                      }}
                    />
                    {errors.firstName && (
                      <span className="text-[10px] text-red-600 mt-0.5">{errors.firstName}</span>
                    )}
                  </div>
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="checkout-input"
                      style={{ borderRadius: "0px" }}
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                      }}
                    />
                    {errors.lastName && (
                      <span className="text-[10px] text-red-600 mt-0.5">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="checkout-input"
                    style={{ borderRadius: "0px" }}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>
                  )}
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="checkout-input"
                style={{ borderRadius: "0px" }}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {errors.email && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.email}</span>
              )}
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="checkout-input"
                  style={{ borderRadius: "0px", width: "100%", paddingRight: "40px" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-600 mt-0.5">{errors.password}</span>
              )}

              {!isLogin && (
                <div className="mt-1.5 p-2 bg-gray-50 border border-gray-200 rounded-none text-[11px]">
                  <p className="font-semibold text-gray-700 mb-1">Password Requirements:</p>
                  <div className="space-y-0.5">
                    {[
                      { label: "At least 8 characters", met: password.length >= 8 },
                      { label: "1 uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
                      { label: "1 lowercase letter (a-z)", met: /[a-z]/.test(password) },
                      { label: "1 number (0-9)", met: /[0-9]/.test(password) },
                      { label: "1 special character (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/';]/.test(password) }
                    ].map((req, idx) => (
                      <div key={idx} className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-200 ${req.met ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                        <span className={`inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold rounded-full ${req.met ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {req.met ? '✓' : '✕'}
                        </span>
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="auth-input-group">
                <label>Confirm Password</label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="checkout-input"
                    style={{ borderRadius: "0px", width: "100%", paddingRight: "40px" }}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#6b7280",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showConfirmPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-[10px] text-red-600 mt-0.5">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" style={{ borderRadius: "0px" }} disabled={loading}>
              {loading ? "PLEASE WAIT..." : isLogin ? "SIGN IN" : "REGISTER"}
            </button>
          </form>

          <p className="auth-toggle-prompt">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="auth-toggle-link" onClick={handleToggleMode}>
              {isLogin ? "Register here" : "Sign in here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
