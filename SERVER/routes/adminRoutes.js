import express from "express";
import { getUsers, createUser, updateUser, deleteUser, purgeUser, getAuditLogs, globalSearch } from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles, checkPermission } from "../middleware/roleMiddleware.js";

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
 * @access  Private (Requires userManagement permission)
 */
router.get(
  "/users",
  authenticate,
  checkPermission("userManagement"),
  getUsers
);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user
 * @access  Private (Requires userManagement permission)
 */
router.post(
  "/users",
  authenticate,
  checkPermission("userManagement"),
  createUser
);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update a user
 * @access  Private (Requires userManagement permission)
 */
router.put(
  "/users/:id",
  authenticate,
  checkPermission("userManagement"),
  updateUser
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Requires userManagement permission)
 */
router.delete(
  "/users/:id",
  authenticate,
  checkPermission("userManagement"),
  deleteUser
);

/**
 * @route   DELETE /api/admin/users/:id/purge
 * @desc    Hard purge a user from database (Super Admin Only)
 * @access  Private (Super Admin Only)
 */
router.delete(
  "/users/:id/purge",
  authenticate,
  authorizeRoles("super-admin"),
  purgeUser
);

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get system audit logs
 * @access  Private (Requires systemGovernance permission)
 */
router.get(
  "/audit-logs",
  authenticate,
  checkPermission("systemGovernance"),
  getAuditLogs
);

export default router;
