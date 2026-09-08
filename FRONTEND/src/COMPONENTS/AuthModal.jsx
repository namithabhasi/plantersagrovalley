import React, { useState, useEffect } from "react";
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

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
];

function AuthModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalTab } = useSelector((state) => state.auth);
  const { cartItems } = useCart();

  const [isLogin, setIsLogin] = useState(authModalTab === "login");
  const [loginMethod, setLoginMethod] = useState("password");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  React.useEffect(() => {
    setIsLogin(authModalTab === "login");
    setErrors({});
    setOtpSent(false);
    setPhoneOtp("");
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
    setErrors({});
    setOtpSent(false);
    setPhoneOtp("");
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setOtpSent(false);
    setPhoneOtp("");
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSendPhoneOTP = async () => {
    const rawPhone = phone ? phone.trim() : '';
    const cleanDigits = rawPhone.replace(/\D/g, '');

    if (!rawPhone || cleanDigits.length < 7 || cleanDigits.length > 15) {
      setErrors({ phone: "Please enter a valid mobile number" });
      return;
    }

    const fullPhone = rawPhone.startsWith('+') ? rawPhone : (countryCode + cleanDigits);

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/send-phone-otp", { phone: fullPhone, isRegister: !isLogin });
      if (data.success) {
        toast.success(data.message || "OTP sent to your phone.");
        setOtpSent(true);
        setResendTimer(45);
        setErrors({});
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setErrors({ phoneOtp: "Please enter the 6-digit OTP code" });
      return;
    }

    const rawPhone = phone ? phone.trim() : '';
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const fullPhone = rawPhone.startsWith('+') ? rawPhone : (countryCode + cleanDigits);

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/verify-phone-otp", {
        phone: fullPhone,
        otp: phoneOtp.trim(),
      });

      if (data.success) {
        dispatch(setUser({ user: data.user, token: data.token }));
        const userName = data.user?.firstName || "User";
        toast.success(`Welcome ${userName}!`);
        handleClose();
        sessionStorage.removeItem("postLoginRedirect");
        navigate("/");
      } else {
        toast.error(data.message || "OTP verification failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLogin && loginMethod === "otp") {
      const cleanDigits = phone ? phone.trim().replace(/\D/g, '') : '';
      if (!cleanDigits || cleanDigits.length < 7) {
        newErrors.phone = "Valid mobile number is required";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

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
      } else if (phone.trim().replace(/\D/g, '').length < 7) {
        newErrors.phone = "Please enter a valid mobile number";
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

    if (isLogin && loginMethod === "otp") {
      if (!otpSent) {
        handleSendPhoneOTP();
      } else {
        handleVerifyPhoneOTP();
      }
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (!isLogin) {
        const fullPhone = countryCode + phone.trim();
        const payload = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: fullPhone,
        };

        const { data } = await axiosInstance.post("/auth/register", payload);

        if (!data.success) {
          toast.error(data.message || "Registration failed.");
          return;
        }

        toast.success("Registration successful! Please sign in with your credentials.");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setErrors({});
        setIsLogin(true);
      } else {
        const payload = { email: email.trim(), password };
        const { data } = await axiosInstance.post("/auth/login", payload);

        if (!data.success) {
          toast.error(data.message || "Authentication failed.");
          return;
        }

        dispatch(setUser({ user: data.user, token: data.token }));

        const userName = data.user?.firstName || data.user?.name || data.user?.email?.split('@')[0] || 'User';
        toast.success(`Welcome ${userName}!`);

        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setErrors({});

        handleClose();
        sessionStorage.removeItem("postLoginRedirect");
        navigate("/");
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

        {isLogin && (
          <div className="flex border-b border-gray-200 mt-2 px-6">
            <button
              type="button"
              className={`flex-1 py-1.5 text-[10.5px] font-semibold tracking-wider uppercase transition-colors ${loginMethod === 'password' ? 'border-b-2 border-[#06492D] text-[#06492D]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => {
                setLoginMethod('password');
                setErrors({});
              }}
            >
              Password
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-[10.5px] font-semibold tracking-wider uppercase transition-colors ${loginMethod === 'otp' ? 'border-b-2 border-[#06492D] text-[#06492D]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => {
                setLoginMethod('otp');
                setOtpSent(false);
                setErrors({});
              }}
            >
              Phone OTP
            </button>
          </div>
        )}

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
                  <div className="flex gap-1.5 w-full">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-[#fcfcfc] border border-gray-200 px-1.5 py-2 text-xs outline-none text-gray-800 font-medium focus:border-[#06492D]"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="checkout-input flex-1"
                      style={{ borderRadius: "0px" }}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>
                  )}
                </div>
              </>
            )}

            {isLogin && loginMethod === "otp" ? (
              <>
                <div className="auth-input-group">
                  <label>Mobile Number</label>
                  <div className="flex gap-1.5 w-full">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={otpSent}
                      className="bg-[#fcfcfc] border border-gray-200 px-1.5 py-2 text-xs outline-none text-gray-800 font-medium focus:border-[#06492D]"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      disabled={otpSent}
                      className="checkout-input flex-1"
                      style={{ borderRadius: "0px" }}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>
                  )}
                </div>

                {otpSent && (
                  <div className="auth-input-group">
                    <div className="flex justify-between items-center">
                      <label>6-Digit OTP Code</label>
                      {resendTimer > 0 ? (
                        <span className="text-[10px] text-gray-400 font-semibold">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendPhoneOTP}
                          className="text-[10px] text-[#06492D] font-semibold hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      className="checkout-input text-center tracking-[4px] font-mono font-bold"
                      style={{ borderRadius: "0px" }}
                      placeholder="123456"
                      value={phoneOtp}
                      onChange={(e) => {
                        setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (errors.phoneOtp) setErrors((prev) => ({ ...prev, phoneOtp: "" }));
                      }}
                    />
                    {errors.phoneOtp && (
                      <span className="text-[10px] text-red-600 mt-0.5">{errors.phoneOtp}</span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
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
                </div>
              </>
            )}

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
              {loading
                ? "PLEASE WAIT..."
                : isLogin
                  ? loginMethod === "otp"
                    ? otpSent
                      ? "SIGN IN WITH OTP"
                      : "SEND OTP"
                    : "SIGN IN"
                  : "REGISTER"}
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
