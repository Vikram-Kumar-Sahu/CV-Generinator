import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },

    // ── Role-based access ──────────────────────────────────────
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Subscription ───────────────────────────────────────────
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "canceled", "past_due", "trialing"],
        default: "active",
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      stripePriceId: String,
      currentPeriodEnd: Date,
      // Admin-granted subscription (overrides Stripe)
      grantedByAdmin: {
        type: Boolean,
        default: false,
      },
      grantedAt: Date,
      grantedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // ── Usage tracking ─────────────────────────────────────────
    usage: {
      aiCreditsUsed: { type: Number, default: 0 },
      aiCreditsLimit: { type: Number, default: 5 },
      downloadsCount: { type: Number, default: 0 },
      downloadsLimit: { type: Number, default: 3 },
      resumesCount: { type: Number, default: 0 },
      resumesLimit: { type: Number, default: 2 },
      lastResetDate: { type: Date, default: Date.now },
    },

    // ── Profile ────────────────────────────────────────────────
    avatar: String,
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },

    // ── Password reset ─────────────────────────────────────────
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: isPro ─────────────────────────────────────────────
userSchema.virtual("isPro").get(function () {
  return (
    this.subscription.plan === "pro" ||
    this.subscription.plan === "enterprise"
  );
});

// ── Pre-save: hash password ────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Pre-save: sync usage limits with plan ─────────────────────
userSchema.pre("save", function (next) {
  if (this.isModified("subscription.plan")) {
    const plan = this.subscription.plan;
    if (plan === "free") {
      this.usage.aiCreditsLimit = 5;
      this.usage.downloadsLimit = 3;
      this.usage.resumesLimit = 2;
    } else if (plan === "pro") {
      this.usage.aiCreditsLimit = 100;
      this.usage.downloadsLimit = 9999;
      this.usage.resumesLimit = 9999;
    } else if (plan === "enterprise") {
      this.usage.aiCreditsLimit = 9999;
      this.usage.downloadsLimit = 9999;
      this.usage.resumesLimit = 9999;
    }
  }
  next();
});

// ── Method: compare passwords ──────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Method: check if subscription is valid ─────────────────────
userSchema.methods.hasActiveSubscription = function () {
  if (this.subscription.grantedByAdmin) return true;
  if (this.subscription.plan === "free") return true;
  if (!this.subscription.currentPeriodEnd) return false;
  return new Date() < new Date(this.subscription.currentPeriodEnd);
};

// ── Index ──────────────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "subscription.plan": 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);
export default User;
