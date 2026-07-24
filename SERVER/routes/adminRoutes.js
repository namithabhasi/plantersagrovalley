import express from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/adminController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with search, filters, and pagination
 * @access  Private (Super Admin, Admin)
 */
router.get(
  "/users",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  getUsers
);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user
 * @access  Private (Super Admin, Admin)
 */
router.post(
  "/users",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  createUser
);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update a user
 * @access  Private (Super Admin, Admin)
 */
router.put(
  "/users/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  updateUser
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Super Admin, Admin)
 */
router.delete(
  "/users/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  deleteUser
);

export default router;
