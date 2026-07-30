import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // No token, proceed as guest (req.user remains undefined)
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // If verification fails, proceed as guest
    next();
  }
};
