import express from "express";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Plan from "../models/Plan.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, adminOnly);

// ── GET /api/admin/stats ───────────────────────────────────────
router.get("/stats", async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalResumes,
      proUsers,
      freeUsers,
      newUsersToday,
      newUsersThisMonth,
      totalDownloads,
    ] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      User.countDocuments({ "subscription.plan": { $in: ["pro", "enterprise"] } }),
      User.countDocuments({ "subscription.plan": "free" }),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
      Resume.aggregate([{ $group: { _id: null, total: { $sum: "$downloads" } } }]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        proUsers,
        freeUsers,
        newUsersToday,
        newUsersThisMonth,
        totalDownloads: totalDownloads[0]?.total || 0,
        conversionRate: totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/users ───────────────────────────────────────
router.get("/users", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      plan = "",
      role = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (plan) query["subscription.plan"] = plan;
    if (role) query.role = role;

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select("-password"),
      User.countDocuments(query),
    ]);

    // Attach resume count to each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const resumeCount = await Resume.countDocuments({ user: user._id });
        return { ...user.toObject(), resumeCount };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/users/:id ───────────────────────────────────
router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("subscription.grantedBy", "name email");
    if (!user) return res.status(404).json({ error: "User not found." });

    const resumes = await Resume.find({ user: user._id }).sort({ updatedAt: -1 });

    res.json({ success: true, user, resumes });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/role ───────────────────────────
router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'." });
    }

    // Prevent demoting yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot change your own role." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ success: true, user, message: `User role updated to ${role}.` });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/subscription ───────────────────
// Admin can grant/revoke/change any user's subscription
router.patch("/users/:id/subscription", async (req, res, next) => {
  try {
    const { plan, status = "active", reason } = req.body;
    const validPlans = ["free", "pro", "enterprise"];

    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: `Invalid plan. Must be: ${validPlans.join(", ")}` });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    user.subscription.plan = plan;
    user.subscription.status = status;
    user.subscription.grantedByAdmin = true;
    user.subscription.grantedAt = new Date();
    user.subscription.grantedBy = req.user._id;

    // Set limits based on plan
    if (plan === "free") {
      user.usage.aiCreditsLimit = 5;
      user.usage.downloadsLimit = 3;
      user.usage.resumesLimit = 2;
    } else if (plan === "pro") {
      user.usage.aiCreditsLimit = 100;
      user.usage.downloadsLimit = 9999;
      user.usage.resumesLimit = 9999;
    } else if (plan === "enterprise") {
      user.usage.aiCreditsLimit = 9999;
      user.usage.downloadsLimit = 9999;
      user.usage.resumesLimit = 9999;
    }

    await user.save();

    res.json({
      success: true,
      user,
      message: `Subscription updated to ${plan} for ${user.name}.`,
    });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/status ─────────────────────────
router.patch("/users/:id/status", async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot deactivate your own account." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({
      success: true,
      user,
      message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
    });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/users/:id/credits ────────────────────────
// Admin can reset or set AI credits for any user
router.patch("/users/:id/credits", async (req, res, next) => {
  try {
    const { aiCreditsUsed = 0, aiCreditsLimit } = req.body;

    const update = { "usage.aiCreditsUsed": aiCreditsUsed };
    if (aiCreditsLimit !== undefined) update["usage.aiCreditsLimit"] = aiCreditsLimit;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ success: true, user, message: "Credits updated." });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/admin/users/:id ────────────────────────────────
router.delete("/users/:id", async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Delete all their resumes too
    await Resume.deleteMany({ user: req.params.id });

    res.json({ success: true, message: `User ${user.name} and all their data deleted.` });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/resumes ─────────────────────────────────────
router.get("/resumes", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [resumes, total] = await Promise.all([
      Resume.find()
        .populate("user", "name email subscription.plan")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Resume.countDocuments(),
    ]);
    res.json({ success: true, resumes, total });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/plans ───────────────────────────────────────
router.get("/plans", async (req, res, next) => {
  try {
    const plans = await Plan.find().sort({ displayOrder: 1 });
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/plans ──────────────────────────────────────
router.post("/plans", async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, plan });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/plans/:name ──────────────────────────────
router.patch("/plans/:name", async (req, res, next) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ error: "Plan not found." });
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/activity ────────────────────────────────────
router.get("/activity", async (req, res, next) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email role subscription.plan createdAt");

    const recentResumes = await Resume.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .select("title templateId createdAt user");

    res.json({ success: true, recentUsers, recentResumes });
  } catch (err) {
    next(err);
  }
});

export default router;
