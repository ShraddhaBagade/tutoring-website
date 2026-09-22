import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please log in to continue.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      message: "Your session is invalid or has expired.",
    });
  }
};

export const authorizeRoles = (...allowedAccountTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Please log in to continue.",
      });
    }

    if (!allowedAccountTypes.includes(req.user.accountType)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};