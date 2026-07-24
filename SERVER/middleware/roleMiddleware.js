const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure authMiddleware has already run
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

export default authorizeRoles;