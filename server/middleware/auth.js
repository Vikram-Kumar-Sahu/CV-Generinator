import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Verify JWT ─────────────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first, then cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Not authenticated. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Your account has been deactivated." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    next(err);
  }
};

// ── Require specific role(s) ───────────────────────────────────
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

// ── Require admin ──────────────────────────────────────────────
export const adminOnly = requireRole("admin");

// ── Check Pro subscription ─────────────────────────────────────
export const requirePro = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  if (!req.user.isPro) {
    return res.status(403).json({
      error: "This feature requires a Pro subscription.",
      code: "UPGRADE_REQUIRED",
    });
  }
  next();
};

// ── Check AI credits ───────────────────────────────────────────
export const checkAICredits = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Reset monthly if needed
  const now = new Date();
  const lastReset = new Date(user.usage.lastResetDate);
  if (
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    user.usage.aiCreditsUsed = 0;
    user.usage.lastResetDate = now;
    await user.save();
  }

  if (user.usage.aiCreditsUsed >= user.usage.aiCreditsLimit) {
    return res.status(403).json({
      error: `AI credit limit reached (${user.usage.aiCreditsLimit}/month).`,
      code: "AI_LIMIT_REACHED",
      used: user.usage.aiCreditsUsed,
      limit: user.usage.aiCreditsLimit,
    });
  }

  req.user = user;
  next();
};

// ── Generate JWT ───────────────────────────────────────────────
export const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ── Send token as cookie + response ───────────────────────────
export const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("token", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
