import { body, param } from "express-validator";

/**
 * Validate Add to Wishlist
 */
export const addToWishlistValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid Product ID."),
];

/**
 * Validate Remove from Wishlist
 */
export const removeFromWishlistValidator = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid Product ID."),
];