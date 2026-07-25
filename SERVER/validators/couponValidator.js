import { body, param } from "express-validator";

export const createCouponValidator = [
  body("code")
    .notEmpty()
    .withMessage("Coupon code is required.")
    .isString()
    .withMessage("Coupon code must be a string.")
    .trim()
    .toUpperCase()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters."),

  body("name")
    .notEmpty()
    .withMessage("Coupon name is required.")
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Coupon name must be between 3 and 100 characters."),

  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required.")
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be either percentage or fixed."),

  body("discountValue")
    .notEmpty()
    .withMessage("Discount value is required.")
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a non-negative number.")
    .custom((value, { req }) => {
      if (req.body.discountType === "percentage" && Number(value) > 100) {
        throw new Error("Percentage discount value cannot exceed 100%.");
      }
      return true;
    }),

  body("minimumOrderAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order amount must be a non-negative number."),

  body("maximumDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount amount must be a non-negative number."),

  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be a non-negative integer."),

  body("usagePerUser")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage per user must be a positive integer."),

  body("validFrom")
    .notEmpty()
    .withMessage("validFrom date is required.")
    .isISO8601()
    .toDate()
    .withMessage("validFrom must be a valid ISO8601 date."),

  body("validUntil")
    .notEmpty()
    .withMessage("validUntil date is required.")
    .isISO8601()
    .toDate()
    .withMessage("validUntil must be a valid ISO8601 date.")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error("Expiry date (validUntil) must be after activation date (validFrom).");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value."),
];

export const updateCouponValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon ID."),

  body("code")
    .optional()
    .isString()
    .trim()
    .toUpperCase()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters."),

  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Coupon name must be between 3 and 100 characters."),

  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be either percentage or fixed."),

  body("discountValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a non-negative number.")
    .custom((value, { req }) => {
      if (req.body.discountType === "percentage" && Number(value) > 100) {
        throw new Error("Percentage discount value cannot exceed 100%.");
      }
      return true;
    }),

  body("minimumOrderAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order amount must be a non-negative number."),

  body("maximumDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount amount must be a non-negative number."),

  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be a non-negative integer."),

  body("usagePerUser")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage per user must be a positive integer."),

  body("validFrom")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("validFrom must be a valid ISO8601 date."),

  body("validUntil")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("validUntil must be a valid ISO8601 date.")
    .custom((value, { req }) => {
      if (req.body.validFrom && new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error("Expiry date (validUntil) must be after activation date (validFrom).");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value."),
];

export const couponIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon ID."),
];
