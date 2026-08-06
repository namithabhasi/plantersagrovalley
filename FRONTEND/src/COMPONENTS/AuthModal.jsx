import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { setUser, closeAuthModal, openAuthModal } from "../redux/auth/authSlice";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Sync isLogin state when authModalTab from Redux changes
  React.useEffect(() => {
    setIsLogin(authModalTab === "login");
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in email and password.");
      return;
    }

    if (!isLogin && (!firstName || !lastName || !phone)) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email, password }
        : { firstName, lastName, email, password, phone };

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
      toast.success(`Welcome, ${userName}!`);
      
      // Clear form inputs
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");

      // Close modal
      handleClose();

      // Check for pending redirect
      const pendingRedirect = sessionStorage.getItem("postLoginRedirect");
      if (pendingRedirect) {
        sessionStorage.removeItem("postLoginRedirect");
        navigate(pendingRedirect);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close-btn" onClick={handleClose}>
          <FiX size={20} />
        </button>

        <div className="auth-modal-header">
          <img src={logo} alt="Planters Agro Valley" className="auth-modal-logo" />
          <div className="auth-modal-tabs">
            <button
              className={`auth-modal-tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`auth-modal-tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
        </div>

        <div className="auth-modal-body">
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="auth-input-row">
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label>First Name</label>
                    <input
                      type="text"
                      className="checkout-input"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="auth-input-group" style={{ flex: 1 }}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="checkout-input"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="checkout-input"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="checkout-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                className="checkout-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Register"}
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
