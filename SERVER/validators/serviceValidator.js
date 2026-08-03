import { body } from "express-validator";
import { validate } from "./authValidator.js";

export const serviceValidator = [
  body("serviceType")
    .trim()
    .notEmpty()
    .withMessage("Service type is required.")
    .isIn([
      "corporate-gifting",
      "plant-rental",
      "garden-maintenance",
      "vertical-garden",
      "balcony-garden",
    ])
    .withMessage("Invalid service type."),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  validate,
];
