import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import {
  addToWishlistValidator,
  removeFromWishlistValidator,
} from "../validators/wishlistValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/wishlist
 * @desc    Add product to wishlist
 * @access  Private (Customer)
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("customer"),
  addToWishlistValidator,
  validationMiddleware,
  addToWishlist
);

/**
 * @route   GET /api/wishlist
 * @desc    Get logged-in user's wishlist
 * @access  Private (Customer)
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("customer"),
  getWishlist
);

/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Remove product from wishlist
 * @access  Private (Customer)
 */
router.delete(
  "/:productId",
  authenticate,
  authorizeRoles("customer"),
  removeFromWishlistValidator,
  validationMiddleware,
  removeFromWishlist
);

/**
 * @route   DELETE /api/wishlist
 * @desc    Clear wishlist
 * @access  Private (Customer)
 */
router.delete(
  "/",
  authenticate,
  authorizeRoles("customer"),
  clearWishlist
);

export default router;
