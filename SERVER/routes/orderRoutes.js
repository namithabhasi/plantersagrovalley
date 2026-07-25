import express from "express";

import {
  placeOrder,
  validateCoupon,
  validateStock,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";


import validationMiddleware from "../middleware/validationMiddleware.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  placeOrderValidator,
  validateCouponValidator,
  updateOrderStatusValidator,
  orderIdValidator,
} from "../validators/orderValidator.js";

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

/**
 * Customer Specific Routes
 */

// Place Order
router.post(
  "/",
  authorizeRoles("customer"),
  placeOrderValidator,
  validationMiddleware,
  placeOrder
);

// Validate Coupon
router.post(
  "/validate-coupon",
  authorizeRoles("customer"),
  validateCouponValidator,
  validationMiddleware,
  validateCoupon
);

// Validate Stock
router.get(
  "/validate-stock",
  authorizeRoles("customer"),
  validateStock
);

// Get Logged-in Customer's Orders
router.get(
  "/my-orders",
  authorizeRoles("customer"),
  getMyOrders
);

/**
 * Shared / Role Restricted Routes
 */

// Get Order Details (Customer Owner, Admin, Shipping Manager)
router.get(
  "/:id",
  orderIdValidator,
  validationMiddleware,
  getOrderById
);

router.put(
  "/:id/cancel",
  orderIdValidator,
  validationMiddleware,
  cancelOrder
);

router.delete(
  "/:id",
  authorizeRoles("super-admin"),
  orderIdValidator,
  validationMiddleware,
  deleteOrder
);

/**
 * Admin / Shipping Manager Routes
 */

// Get All Orders (Admin, Shipping Manager)
router.get(
  "/",
  authorizeRoles("super-admin", "admin", "shipping-manager"),
  getAllOrders
);

// Update Order Status (Admin, Shipping Manager)
router.put(
  "/:id/status",
  authorizeRoles("super-admin", "admin", "shipping-manager"),
  updateOrderStatusValidator,
  validationMiddleware,
  updateOrderStatus
);



export default router;
