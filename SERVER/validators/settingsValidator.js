import { body } from "express-validator";

export const updateSettingsValidator = [
  body("storeName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Store name cannot be empty.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Store name must be between 2 and 100 characters."),

  body("storeEmail")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid store email address."),

  body("storePhone")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please enter a valid phone number (10 to 15 digits)."),

  body("taxPercentage")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Tax percentage must be a non-negative number."),

  body("shippingCharge")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Shipping charge must be a non-negative number."),

  body("freeShippingMinimumOrder")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Free shipping threshold must be a non-negative number."),

  body("maintenanceMode")
    .optional()
    .isBoolean()
    .withMessage("maintenanceMode must be a boolean."),

  body("productsPerPage")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("productsPerPage must be an integer between 1 and 100."),
];
