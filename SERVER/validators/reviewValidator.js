import { body, param } from "express-validator";

export const addReviewValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Valid product ID is required."),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required.")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters."),
];

export const updateReviewValidator = [
  param("reviewId")
    .isMongoId()
    .withMessage("Invalid review ID."),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required.")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters."),
];

export const deleteReviewValidator = [
  param("reviewId")
    .isMongoId()
    .withMessage("Invalid review ID."),
];

export const getProductReviewsValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID."),
];