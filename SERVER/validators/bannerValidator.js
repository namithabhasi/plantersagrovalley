import { body } from "express-validator";
import { validate } from "./authValidator.js";

export const bannerValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Banner title is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Banner title must be between 3 and 100 characters."),

  body("subtitle")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Subtitle cannot exceed 150 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("buttonText")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Button text cannot exceed 30 characters."),

  body("buttonLink")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Button link cannot exceed 255 characters."),

  body("displayOrder")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Display order must be a positive integer."),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date."),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date.")
    .custom((value, { req }) => {
      if (
        req.body.startDate &&
        new Date(value) < new Date(req.body.startDate)
      ) {
        throw new Error("End date must be after the start date.");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false."),

  validate,
];