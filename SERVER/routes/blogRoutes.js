import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadCategoryImage } from "../middleware/uploadMiddleware.js";
import { blogValidator } from "../validators/blogValidator.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Admin/Super Admin protected routes
router.post(
  "/",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadCategoryImage.single("image"),
  blogValidator,
  createBlog
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  uploadCategoryImage.single("image"),
  blogValidator,
  updateBlog
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super-admin", "admin"),
  deleteBlog
);

export default router;
