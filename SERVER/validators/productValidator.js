import { body } from "express-validator";
import { validate } from "./authValidator.js";

export const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters."),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("SKU must be between 3 and 30 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters."),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Short description cannot exceed 200 characters."),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0."),

  body("salePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Sale price must be greater than or equal to 0.")
    .custom((value, { req }) => {
      if (Number(value) > Number(req.body.price)) {
        throw new Error("Sale price cannot be greater than the regular price.");
      }
      return true;
    }),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative."),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand cannot exceed 100 characters."),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array."),

  body("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a valid string."),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array."),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each tag cannot exceed 50 characters."),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false."),

  validate,
];