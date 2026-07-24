import { body, param } from "express-validator";

/**
 * Validate Add to Cart
 */
export const addToCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid Product ID."),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),
];

/**
 * Validate Update Cart
 */
export const updateCartValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid Product ID."),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),
];

/**
 * Validate Remove Cart Item
 */
export const removeCartItemValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid Product ID."),
];