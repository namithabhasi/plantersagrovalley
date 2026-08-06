import { body } from "express-validator";
import { validate } from "./authValidator.js";

export const blogValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Blog title is required."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("summary")
    .trim()
    .notEmpty()
    .withMessage("Summary is required."),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required."),

  body("readTime")
    .optional()
    .trim(),

  body("author")
    .optional()
    .trim(),

  validate,
];
