import express from "express";

import {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  resetPassword,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendResetOTP,
  verifyResetOTP,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

const router = express.Router();

// Public Routes
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// OTP Routes
router.post("/send-phone-otp", sendPhoneOTP);
router.post("/verify-phone-otp", verifyPhoneOTP);
router.post("/send-reset-otp", sendResetOTP);
router.post("/verify-reset-otp", verifyResetOTP);

// Protected Routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);

export default router;