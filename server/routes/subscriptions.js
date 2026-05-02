import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── POST /api/subscriptions/checkout ──────────────────────────
router.post("/checkout", protect, async (req, res, next) => {
  try {
    const { interval = "month" } = req.body;
    const user = await User.findById(req.user._id);

    // Get or create Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
      await user.save({ validateBeforeSave: false });
    }

    const priceId =
      interval === "year"
        ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      metadata: { userId: user._id.toString() },
      allow_promotion_codes: true,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/subscriptions/portal ────────────────────────────
router.post("/portal", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.subscription.stripeCustomerId) {
      return res.status(404).json({ error: "No billing account found." });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard/settings`,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/subscriptions/status ─────────────────────────────
router.get("/status", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    plan: user.subscription.plan,
    status: user.subscription.status,
    currentPeriodEnd: user.subscription.currentPeriodEnd,
    usage: user.usage,
  });
});

export default router;
