import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

import {
  addToCartValidator,
  updateCartValidator,
  removeCartItemValidator,
} from "../validators/cartValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Only customers can access cart
router.use(authorizeRoles("customer"));

/**
 * @route POST /api/cart
 * @desc Add product to cart
 */
router.post(
  "/",
  addToCartValidator,
  validationMiddleware,
  addToCart
);

/**
 * @route GET /api/cart
 * @desc Get logged-in user's cart
 */
router.get(
  "/",
  getCart
);

/**
 * @route PUT /api/cart/:productId
 * @desc Update cart item quantity
 */
router.put(
  "/:productId",
  updateCartValidator,
  validationMiddleware,
  updateCart
);

/**
 * @route DELETE /api/cart/:productId
 * @desc Remove product from cart
 */
router.delete(
  "/:productId",
  removeCartItemValidator,
  validationMiddleware,
  removeCartItem
);

/**
 * @route DELETE /api/cart
 * @desc Clear cart
 */
router.delete(
  "/",
  clearCart
);

export default router;