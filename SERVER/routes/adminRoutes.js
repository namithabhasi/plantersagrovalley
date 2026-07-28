import express from "express";
import { getUsers, createUser, updateUser, deleteUser, globalSearch } from "../controllers/adminController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/admin/global-search
 * @desc    Global search across all models
 * @access  Private (Super Admin, Admin, Shipping Manager)
 */
router.get(
  "/global-search",
  authenticate,
  authorizeRoles("super-admin", "admin", "shipping-manager"),
  globalSearch
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with search, filters, and pagination
 * @access  Private (Super Admin, Admin)
 */
router.get(
  "/users",
  authenticate,
  authorizeRoles("super-admin"),
  getUsers
);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user
 * @access  Private (Super Admin)
 */
router.post(
  "/users",
  authenticate,
  authorizeRoles("super-admin"),
  createUser
);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update a user
 * @access  Private (Super Admin)
 */
router.put(
  "/users/:id",
  authenticate,
  authorizeRoles("super-admin"),
  updateUser
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Super Admin)
 */
router.delete(
  "/users/:id",
  authenticate,
  authorizeRoles("super-admin"),
  deleteUser
);

export default router;
