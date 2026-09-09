import AuditLog from "../models/AuditLog.js";

export const logAudit = async (req, action, moduleName, details = {}) => {
  try {
    if (!req || !req.user) return;

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "";

    const userName = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || req.user.email;

    await AuditLog.create({
      user: req.user._id,
      userName,
      role: req.user.role || "customer",
      action,
      module: moduleName,
      details,
      ipAddress: String(ipAddress),
    });
  } catch (error) {
    console.error("Audit Logger Error:", error.message);
  }
};
