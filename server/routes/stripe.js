import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/webhook — raw body, no auth
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const user = await User.findById(userId);
        if (!user) break;

        user.subscription.plan = "pro";
        user.subscription.status = "active";
        user.subscription.stripeSubscriptionId = subscription.id;
        user.subscription.stripePriceId = subscription.items.data[0].price.id;
        user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        user.subscription.grantedByAdmin = false;
        user.usage.aiCreditsLimit = 100;
        user.usage.downloadsLimit = 9999;
        user.usage.resumesLimit = 9999;
        await user.save({ validateBeforeSave: false });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        const user = await User.findOne({ "subscription.stripeSubscriptionId": subId });
        if (!user) break;

        user.subscription.status = "active";
        user.subscription.currentPeriodEnd = new Date(sub.current_period_end * 1000);
        // Reset monthly AI credits
        user.usage.aiCreditsUsed = 0;
        user.usage.lastResetDate = new Date();
        await user.save({ validateBeforeSave: false });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const user = await User.findOne({ "subscription.stripeSubscriptionId": sub.id });
        if (!user) break;

        user.subscription.status =
          sub.status === "active" ? "active"
          : sub.status === "canceled" ? "canceled"
          : sub.status === "past_due" ? "past_due"
          : sub.status === "trialing" ? "trialing"
          : "active";

        if (sub.status !== "active") {
          user.subscription.plan = "free";
          user.usage.aiCreditsLimit = 5;
          user.usage.downloadsLimit = 3;
          user.usage.resumesLimit = 2;
        }
        user.subscription.currentPeriodEnd = new Date(sub.current_period_end * 1000);
        await user.save({ validateBeforeSave: false });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const user = await User.findOne({ "subscription.stripeSubscriptionId": sub.id });
        if (!user) break;

        user.subscription.plan = "free";
        user.subscription.status = "canceled";
        user.usage.aiCreditsLimit = 5;
        user.usage.downloadsLimit = 3;
        user.usage.resumesLimit = 2;
        await user.save({ validateBeforeSave: false });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  res.json({ received: true });
});

export default router;
