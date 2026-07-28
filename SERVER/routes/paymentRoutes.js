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
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * All payment routes require authentication
 */
router.use(authenticate);

/**
 * @route POST /api/payment/create-order
 * @desc Create Razorpay Order
 * @access Customer
 */
router.post(
  "/create-order",
  authorizeRoles("customer"),
  createRazorpayOrderValidator,
  validationMiddleware,
  createRazorpayOrder
);

/**
 * @route POST /api/payment/verify
 * @desc Verify Razorpay Payment
 * @access Customer
 */
router.post(
  "/verify",
  authorizeRoles("customer"),
  verifyPaymentValidator,
  validationMiddleware,
  verifyPayment
);

export default router;