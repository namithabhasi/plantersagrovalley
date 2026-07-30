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


];
