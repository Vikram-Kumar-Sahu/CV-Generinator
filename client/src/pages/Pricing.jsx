import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Check, Sparkles, ArrowRight, Loader2, Star, Shield, Zap, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../utils/helpers";

const PLANS = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "forever",
    description: "Get started for free, no card needed.",
    features: ["2 resumes", "Modern & Classic templates", "5 AI credits", "3 PDF downloads", "PDF watermark"],
    cta: "Get Started Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: "$9.99", yearly: "$6.67" },
    period: "per month",
    yearlyNote: "$79.99 billed annually · Save 33%",
    description: "Everything you need to land the job.",
    features: [
      "Unlimited resumes",
      "All 6 premium templates",
      "100 AI credits / month",
      "Unlimited PDF exports",
      "No watermark",
      "Full ATS score analysis",
      "AI bullet improvement",
      "Job-tailoring AI",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

export default function PricingPage() {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!user) { navigate("/register?plan=pro"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/subscriptions/checkout", {
        interval: billing === "yearly" ? "year" : "month",
      });
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          ResumeCraft
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-secondary text-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Pricing
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-3">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-zinc-500">Start free. Upgrade when you need more.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-2 mt-8 p-1 rounded-xl bg-zinc-100 border border-zinc-200">
            <button onClick={() => setBilling("monthly")}
              className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                billing === "monthly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500")}>
              Monthly
            </button>
            <button onClick={() => setBilling("yearly")}
              className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                billing === "yearly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500")}>
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Save 33%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={cn("rounded-2xl p-8", plan.highlight
                ? "bg-brand-600 text-white relative overflow-hidden"
                : "border border-zinc-200 bg-white")}>
              {plan.highlight && (
                <>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
                    <Star className="w-3 h-3 fill-white" /> Most Popular
                  </div>
                </>
              )}

              <h2 className={cn("text-lg font-bold mb-1", plan.highlight ? "text-white" : "text-zinc-900")}>{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={cn("text-4xl font-bold", plan.highlight ? "text-white" : "text-zinc-900")}>
                  {billing === "yearly" ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className={cn("text-sm", plan.highlight ? "text-white/70" : "text-zinc-500")}>
                  /{plan.period}
                </span>
              </div>
              {billing === "yearly" && plan.yearlyNote && (
                <p className={cn("text-xs mb-3", plan.highlight ? "text-white/60" : "text-zinc-400")}>{plan.yearlyNote}</p>
              )}
              <p className={cn("text-sm mb-6", plan.highlight ? "text-white/80" : "text-zinc-500")}>{plan.description}</p>

              {plan.highlight ? (
                <button onClick={handleUpgrade} disabled={loading || isPro}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-white text-brand-600 hover:bg-brand-50 transition-colors mb-6 disabled:opacity-70">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isPro ? "Already on Pro ✓" : loading ? "Redirecting…" : plan.cta}
                </button>
              ) : (
                <Link to={user ? "/dashboard" : plan.href}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors mb-6">
                  {user ? "Go to Dashboard" : plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className={cn("w-4 h-4 flex-shrink-0", plan.highlight ? "text-white" : "text-emerald-500")} />
                    <span className={plan.highlight ? "text-white/90" : "text-zinc-600"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400">
          {[{ icon: Shield, text: "Secured by Stripe" }, { icon: Zap, text: "Instant activation" }, { icon: Check, text: "Cancel anytime" }].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2"><Icon className="w-4 h-4" />{text}</div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-8">FAQ</h2>
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings anytime. You keep Pro access until the end of your billing period." },
            { q: "What happens to my resumes if I downgrade?", a: "Your resumes are never deleted. You can still view and edit them, but can't create new ones beyond the free limit." },
            { q: "Is Gemini AI free?", a: "We use Google's Gemini 1.5 Flash model. It's included in your plan — no extra cost. Free users get 5 AI uses, Pro gets 100/month." },
            { q: "Do you offer refunds?", a: "Yes — full refund within 7 days of your first Pro payment. Contact support and we'll process it immediately." },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-zinc-100 pb-5 mb-5">
              <h3 className="font-semibold text-zinc-900 mb-2">{q}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
