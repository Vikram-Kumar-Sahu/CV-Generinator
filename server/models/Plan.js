import mongoose from "mongoose";

// Admin-managed subscription plans catalog
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["free", "pro", "enterprise"],
      unique: true,
    },
    displayName: { type: String, required: true },
    description: String,
    monthlyPrice: { type: Number, required: true }, // in cents
    yearlyPrice: { type: Number, required: true },  // in cents
    stripePriceIdMonthly: String,
    stripePriceIdYearly: String,
    features: {
      resumesLimit: { type: Number, default: 2 },
      templatesAccess: [String],
      aiCreditsMonthly: { type: Number, default: 5 },
      downloadsLimit: { type: Number, default: 3 },
      watermark: { type: Boolean, default: true },
      atsAnalysis: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
