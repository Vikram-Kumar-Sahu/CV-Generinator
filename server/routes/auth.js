import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { protect, sendTokenResponse } from "../middleware/auth.js";

const router = express.Router();

// ── Validation rules ───────────────────────────────────────────
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── POST /api/auth/register ────────────────────────────────────
router.post("/register", registerValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // First user ever becomes admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const user = await User.create({ name, email, password, role });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ───────────────────────────────────────
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Your account has been deactivated. Contact support." });
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me ───────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// ── POST /api/auth/logout ──────────────────────────────────────
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.json({ success: true, message: "Logged out successfully." });
});

// ── PATCH /api/auth/profile ────────────────────────────────────
router.patch("/profile", protect, async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/auth/password ───────────────────────────────────
router.patch("/password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
});

export default router;
