import { body } from "express-validator";
import { validate } from "./authValidator.js";

export const categoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required."),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required."),

  body("description")
    .optional()
    .trim(),

  body("image")
    .optional()
    .trim(),

  validate,
];