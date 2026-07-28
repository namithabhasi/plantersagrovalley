import express from "express";
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import {
  createCouponValidator,
  updateCouponValidator,
  couponIdValidator,
} from "../validators/couponValidator.js";

const router = express.Router();

// All coupon routes require authentication and admin/super-admin roles
router.use(authenticate);
router.use(authorizeRoles("super-admin", "admin"));

// Create Coupon
router.post(
  "/",
  createCouponValidator,
  validationMiddleware,
  createCoupon
);

// Get All Coupons
router.get("/", getCoupons);

// Get Coupon by ID
router.get(
  "/:id",
  couponIdValidator,
  validationMiddleware,
  getCouponById
);

// Update Coupon
router.put(
  "/:id",
  updateCouponValidator,
  validationMiddleware,
  updateCoupon
);

// Delete Coupon (Soft Delete)
router.delete(
  "/:id",
  couponIdValidator,
  validationMiddleware,
  deleteCoupon
);

export default router;
