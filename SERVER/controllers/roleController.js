import Role from "../models/Role.js";
import { logAudit } from "../utils/auditLogger.js";

// Default System Roles definition for seeding if database has no roles
const DEFAULT_SYSTEM_ROLES = [
  {
    name: "Super Admin",
    code: "super-admin",
    description: "Full system governance and unconstrained administration access",
    isSystemRole: true,
    permissions: {
      userManagement: "ALLOW",
      roleManagement: "ALLOW",
      systemGovernance: "ALLOW",
      catalogManagement: "ALLOW",
      inventoryControl: "ALLOW",
      orderLifecycle: "ALLOW",
      fulfillmentShipping: "ALLOW",
      marketingSales: "ALLOW",
      reportsDashboard: "ALLOW",
      crmSupport: "ALLOW",
    },
  },
  {
    name: "Administrator",
    code: "admin",
    description: "General operational administrator",
    isSystemRole: true,
    permissions: {
      userManagement: "DENY",
      roleManagement: "DENY",
      systemGovernance: "DENY",
      catalogManagement: "ALLOW",
      inventoryControl: "ALLOW",
      orderLifecycle: "ALLOW",
      fulfillmentShipping: "ALLOW",
      marketingSales: "ALLOW",
      reportsDashboard: "ALLOW",
      crmSupport: "ALLOW",
    },
  },
  {
    name: "Shipping Manager",
    code: "shipping-manager",
    description: "Dedicated logistics, fulfillment, AWB tracking, and manifest management",
    isSystemRole: true,
    permissions: {
      userManagement: "DENY",
      roleManagement: "DENY",
      systemGovernance: "DENY",
      catalogManagement: "DENY",
      inventoryControl: "ALLOW",
      orderLifecycle: "ALLOW",
      fulfillmentShipping: "ALLOW",
      marketingSales: "DENY",
      reportsDashboard: "ALLOW",
      crmSupport: "ALLOW",
    },
  },
  {
    name: "Customer",
    code: "customer",
    description: "Standard end-user retail buyer",
    isSystemRole: true,
    permissions: {
      userManagement: "DENY",
      roleManagement: "DENY",
      systemGovernance: "DENY",
      catalogManagement: "DENY",
      inventoryControl: "DENY",
      orderLifecycle: "DENY",
      fulfillmentShipping: "DENY",
      marketingSales: "DENY",
      reportsDashboard: "DENY",
      crmSupport: "DENY",
    },
  },
];

/**
 * @desc    Get all active roles (Auto-seeds default roles if none exist)
 * @route   GET /api/roles
 * @access  Private (Super Admin)
 */
export const getRoles = async (req, res) => {
  try {
    let roles = await Role.find().sort({ createdAt: 1 });

    if (roles.length === 0) {
      await Role.insertMany(DEFAULT_SYSTEM_ROLES);
      roles = await Role.find().sort({ createdAt: 1 });
    }

    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch role configurations.",
      error: error.message,
    });
  }
};

/**
 * @desc    Create custom role
 * @route   POST /api/roles
 * @access  Private (Super Admin)
 */
export const createRole = async (req, res) => {
  try {
    const { name, code, description, permissions } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Role name and role code are required.",
      });
    }

    const normalizedCode = code.trim().toLowerCase().replace(/\s+/g, "-");

    const existingRole = await Role.findOne({
      $or: [{ name: name.trim() }, { code: normalizedCode }],
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "A role with this name or code already exists.",
      });
    }

    const role = new Role({
      name: name.trim(),
      code: normalizedCode,
      description: description || "",
      isSystemRole: false,
      permissions: permissions || {},
    });

    await role.save();

    await logAudit(req, "CREATE_ROLE", "Role Management", {
      roleId: role._id,
      roleCode: role.code,
      roleName: role.name,
    });

    return res.status(201).json({
      success: true,
      message: `Role '${role.name}' created successfully.`,
      role,
    });
  } catch (error) {
    console.error("Create Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create role.",
      error: error.message,
    });
  }
};

/**
 * @desc    Update custom role permissions or details
 * @route   PUT /api/roles/:id
 * @access  Private (Super Admin)
 */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    if (name && !role.isSystemRole) {
      role.name = name.trim();
    }
    if (description !== undefined) {
      role.description = description;
    }
    if (permissions) {
      role.permissions = { ...role.permissions, ...permissions };
    }

    await role.save();

    await logAudit(req, "UPDATE_ROLE", "Role Management", {
      roleId: role._id,
      roleCode: role.code,
      roleName: role.name,
    });

    return res.status(200).json({
      success: true,
      message: `Role '${role.name}' updated successfully.`,
      role,
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update role.",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete custom role
 * @route   DELETE /api/roles/:id
 * @access  Private (Super Admin)
 */
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    if (role.isSystemRole) {
      return res.status(403).json({
        success: false,
        message: "System roles cannot be deleted.",
      });
    }

    await Role.findByIdAndDelete(id);

    await logAudit(req, "DELETE_ROLE", "Role Management", {
      roleId: id,
      roleCode: role.code,
      roleName: role.name,
    });

    return res.status(200).json({
      success: true,
      message: `Role '${role.name}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete role.",
      error: error.message,
    });
  }
};
