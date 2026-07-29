import express from "express";

import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import {
  createRazorpayOrderValidator,
  verifyPaymentValidator,
} from "../validators/paymentValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";
import { optionalAuthenticate } from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/payment/create-order
 * @desc Create Razorpay Order
 * @access Public
 */
router.post(
  "/create-order",
  optionalAuthenticate,
  createRazorpayOrderValidator,
  validationMiddleware,
  createRazorpayOrder
);

/**
 * @route POST /api/payment/verify
 * @desc Verify Razorpay Payment
 * @access Public
 */
router.post(
  "/verify",
  optionalAuthenticate,
  verifyPaymentValidator,
  validationMiddleware,
  verifyPayment
);

export default router;