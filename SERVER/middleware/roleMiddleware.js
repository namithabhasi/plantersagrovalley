import Role from "../models/Role.js";

const normalizeRole = (roleStr) => {
  if (!roleStr) return "";
  const clean = String(roleStr).toLowerCase().trim().replace(/[-_]/g, "");
  if (clean === "superadmin") return "super-admin";
  if (clean === "shippingmanager") return "shipping-manager";
  return clean;
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure authMiddleware has already run
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const userRoleNorm = normalizeRole(req.user.role);
    const allowedNorm = allowedRoles.map(normalizeRole);

    // Super-admin always has unrestricted access
    if (userRoleNorm === "super-admin" || allowedNorm.includes(userRoleNorm)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "You do not have permission to access this resource.",
    });
  };
};

export const checkPermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }

      const roleNorm = normalizeRole(req.user.role);

      // Super-admin always has unrestricted access
      if (roleNorm === "super-admin") {
        return next();
      }

      // Query database for user's role configuration
      const userRole = await Role.findOne({
        $or: [
          { code: req.user.role },
          { code: roleNorm },
          { name: { $regex: new RegExp(`^${req.user.role}$`, "i") } },
        ],
      });

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Role permissions configuration not found.",
        });
      }

      if (userRole.permissions && userRole.permissions[permissionKey] === "ALLOW") {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Access denied. '${permissionKey}' permission is disabled for your role.`,
      });
    } catch (error) {
      console.error("Check Permission Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to verify permission access.",
      });
    }
  };
};

export default authorizeRoles;