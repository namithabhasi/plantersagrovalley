import { body, param } from "express-validator";

/**
 * Validate Place Order
 */
export const placeOrderValidator = [
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required.")
    .isObject()
    .withMessage("Shipping address must be an object."),

  body("shippingAddress.receiverName")
    .notEmpty()
    .withMessage("Receiver name is required.")
    .trim(),

  body("shippingAddress.phone")
  .trim()
  .matches(/^[0-9]{10,15}$/)
  .withMessage("Enter a valid phone number."),

  body("shippingAddress.addressLine1")
    .notEmpty()
    .withMessage("Address line 1 is required.")
    .trim(),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required.")
    .trim(),

  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required.")
    .trim(),

  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required.")
    .trim(),

 body("shippingAddress.postalCode")
  .trim()
  .isLength({ min: 4, max: 10 })
  .withMessage("Invalid postal code."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required.")
    .isIn(["COD", "Razorpay", "Stripe"])
    .withMessage("Invalid payment method. Must be COD, Razorpay, or Stripe."),

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
];

/**
 * Validate Coupon Code Request
 */
export const validateCouponValidator = [
  body("couponCode")
    .notEmpty()
    .withMessage("Coupon code is required.")
    .isString()
    .withMessage("Coupon code must be a string.")
    .trim(),
];

/**
 * Validate Order Status Update
 */
export const updateOrderStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID."),

  body("orderStatus")
    .optional()
    .isIn(["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid order status."),

  body("paymentStatus")
    .optional()
    .isIn(["Pending", "Paid", "Failed", "Refunded"])
    .withMessage("Invalid payment status."),

  body("trackingNumber")
    
    .optional()
.trim()
.isLength({ max: 100 })
.withMessage("Tracking number is too long."),
   

  body("estimatedDelivery")
    .optional()
.isISO8601()
.toDate()
    .withMessage("Estimated delivery must be a valid date."),
];
export const orderIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID."),
];