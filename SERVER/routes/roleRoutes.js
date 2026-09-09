import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controllers/roleController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);

// GET /api/roles allowed for all authenticated users to read their permissions matrix
router.get("/", getRoles);

// Operations to create, update, or delete roles require roleManagement permission
router.post("/", checkPermission("roleManagement"), createRole);
router.put("/:id", checkPermission("roleManagement"), updateRole);
router.delete("/:id", checkPermission("roleManagement"), deleteRole);

export default router;
