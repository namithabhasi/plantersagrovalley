import express from "express";

import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import {
  addReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getProductReviewsValidator,
} from "../validators/reviewValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("customer"),
  addReviewValidator,
  validationMiddleware,
  addReview
);

router.get(
  "/:productId",
  getProductReviewsValidator,
  validationMiddleware,
  getProductReviews
);

router.put(
  "/:reviewId",
  authenticate,
  authorizeRoles("customer"),
  updateReviewValidator,
  validationMiddleware,
  updateReview
);

router.delete(
  "/:reviewId",
  authenticate,
  authorizeRoles("customer"),
  deleteReviewValidator,
  validationMiddleware,
  deleteReview
);

export default router;