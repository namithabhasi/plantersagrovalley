import { body } from "express-validator";

/**
 * Create Razorpay Order Validator
 */
export const createRazorpayOrderValidator = [
  body("couponCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Invalid coupon code."),

  body("cartItems")
    .optional()
    .isArray()
    .withMessage("Cart items must be an array."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Enter a valid email address."),

  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Enter a valid phone number."),
];

/**
 * Verify Razorpay Payment Validator
 */
export const verifyPaymentValidator = [
  body("razorpay_order_id")
    .notEmpty()
    .withMessage("Razorpay Order ID is required.")
    .isString()
    .withMessage("Invalid Razorpay Order ID."),

  body("razorpay_payment_id")
    .notEmpty()
    .withMessage("Razorpay Payment ID is required.")
    .isString()
    .withMessage("Invalid Razorpay Payment ID."),

  body("razorpay_signature")
    .notEmpty()
    .withMessage("Razorpay Signature is required.")
    .isString()
    .withMessage("Invalid Razorpay Signature."),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required.")
    .isObject()
    .withMessage("Shipping address must be an object."),

  body("shippingAddress.receiverName")
    .trim()
    .notEmpty()
    .withMessage("Receiver name is required."),

  body("shippingAddress.phone")
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Enter a valid phone number."),

  body("shippingAddress.addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address line 1 is required."),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required."),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required."),

  body("shippingAddress.postalCode")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("Invalid postal code."),

  body("couponCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Invalid coupon code."),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Enter a valid email address."),

  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Enter a valid phone number."),

  body("cartItems")
    .optional()
    .isArray()
    .withMessage("Cart items must be an array."),
];