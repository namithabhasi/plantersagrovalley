import express from "express";

import {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
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

// Protected Routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

export default router;