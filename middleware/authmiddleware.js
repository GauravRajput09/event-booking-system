const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
require("dotenv").config();

// Protect routes middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECERET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("fond user:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - user not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before accessing this route",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized - invalid token",
    });
  }
};

// Role based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
