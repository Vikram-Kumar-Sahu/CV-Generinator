import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Crown, Check, Edit2, Save, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const PLAN_DEFAULTS = {
  free:       { monthlyPrice: 0,    yearlyPrice: 0,     aiCreditsMonthly: 5,   resumesLimit: 2,    downloadsLimit: 3,    watermark: true,  atsAnalysis: false },
  pro:        { monthlyPrice: 999,  yearlyPrice: 7999,  aiCreditsMonthly: 100, resumesLimit: 9999, downloadsLimit: 9999, watermark: false, atsAnalysis: true  },
  enterprise: { monthlyPrice: 2999, yearlyPrice: 24999, aiCreditsMonthly: 9999,resumesLimit: 9999, downloadsLimit: 9999, watermark: false, atsAnalysis: true  },
};

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/plans").then(({ data }) => {
      // If no plans in DB yet, show defaults
      if (data.plans.length === 0) {
        setPlans(["free", "pro", "enterprise"].map(name => ({
          name,
          displayName: name.charAt(0).toUpperCase() + name.slice(1),
          ...PLAN_DEFAULTS[name],
          features: PLAN_DEFAULTS[name],
          isActive: true,
        })));
      } else {
        setPlans(data.plans);
      }
      setLoading(false);
    });
  }, []);

  function startEdit(plan) {
    setEditing(plan.name);
    setEditForm({
      monthlyPrice: plan.monthlyPrice ?? plan.features?.monthlyPrice ?? PLAN_DEFAULTS[plan.name]?.monthlyPrice,
      yearlyPrice: plan.yearlyPrice ?? plan.features?.yearlyPrice ?? PLAN_DEFAULTS[plan.name]?.yearlyPrice,
      aiCreditsMonthly: plan.features?.aiCreditsMonthly ?? PLAN_DEFAULTS[plan.name]?.aiCreditsMonthly,
      resumesLimit: plan.features?.resumesLimit ?? PLAN_DEFAULTS[plan.name]?.resumesLimit,
      downloadsLimit: plan.features?.downloadsLimit ?? PLAN_DEFAULTS[plan.name]?.downloadsLimit,
      watermark: plan.features?.watermark ?? PLAN_DEFAULTS[plan.name]?.watermark,
      atsAnalysis: plan.features?.atsAnalysis ?? PLAN_DEFAULTS[plan.name]?.atsAnalysis,
      stripePriceIdMonthly: plan.stripePriceIdMonthly || "",
      stripePriceIdYearly: plan.stripePriceIdYearly || "",
    });
  }

  async function handleSave(planName) {
    setSaving(true);
    try {
      const payload = {
        monthlyPrice: Number(editForm.monthlyPrice),
        yearlyPrice: Number(editForm.yearlyPrice),
        stripePriceIdMonthly: editForm.stripePriceIdMonthly,
        stripePriceIdYearly: editForm.stripePriceIdYearly,
        features: {
          aiCreditsMonthly: Number(editForm.aiCreditsMonthly),
          resumesLimit: Number(editForm.resumesLimit),
          downloadsLimit: Number(editForm.downloadsLimit),
          watermark: editForm.watermark,
          atsAnalysis: editForm.atsAnalysis,
        },
      };
      // Try update first, then create
      try {
        await api.patch(`/admin/plans/${planName}`, payload);
      } catch {
        await api.post("/admin/plans", {
          name: planName,
          displayName: planName.charAt(0).toUpperCase() + planName.slice(1),
          description: `${planName} plan`,
          ...payload,
        });
      }
      toast.success(`${planName} plan updated`);
      setEditing(null);
      const { data } = await api.get("/admin/plans");
      setPlans(data.plans);
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const PLAN_COLORS = {
    free: { border: "border-zinc-700", header: "bg-zinc-800", accent: "text-zinc-300" },
    pro: { border: "border-brand-500/50", header: "bg-brand-600", accent: "text-white" },
    enterprise: { border: "border-amber-500/50", header: "bg-amber-600", accent: "text-white" },
  };

  if (loading) return <div className="p-8 text-zinc-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading plans…</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Plans & Pricing</h1>
        <p className="text-zinc-500 text-sm">Manage subscription tiers and features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {["free", "pro", "enterprise"].map(planName => {
          const plan = plans.find(p => p.name === planName) || { name: planName, features: PLAN_DEFAULTS[planName], ...PLAN_DEFAULTS[planName] };
          const colors = PLAN_COLORS[planName];
          const isEditing = editing === planName;
          const f = plan.features || PLAN_DEFAULTS[planName];

          return (
            <div key={planName} className={`rounded-2xl border ${colors.border} overflow-hidden`}>
              {/* Header */}
              <div className={`${colors.header} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${colors.accent}`} />
                    <span className={`font-bold ${colors.accent} uppercase text-sm`}>{planName}</span>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => startEdit(plan)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => handleSave(planName)} disabled={saving}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                        {saving ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Save className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <button onClick={() => setEditing(null)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-white/70">Monthly Price (cents)</label>
                      <input type="number" value={editForm.monthlyPrice}
                        onChange={e => setEditForm(p => ({ ...p, monthlyPrice: e.target.value }))}
                        className="w-full mt-0.5 px-2 py-1.5 bg-white/20 rounded-lg text-white text-sm focus:outline-none focus:bg-white/30" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/70">Yearly Price (cents)</label>
                      <input type="number" value={editForm.yearlyPrice}
                        onChange={e => setEditForm(p => ({ ...p, yearlyPrice: e.target.value }))}
                        className="w-full mt-0.5 px-2 py-1.5 bg-white/20 rounded-lg text-white text-sm focus:outline-none focus:bg-white/30" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {plan.monthlyPrice === 0 ? "Free" : `$${(plan.monthlyPrice / 100).toFixed(2)}`}
                    </div>
                    {plan.monthlyPrice > 0 && <div className="text-white/70 text-xs">per month · ${(plan.yearlyPrice / 100 / 12).toFixed(2)}/mo yearly</div>}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="bg-zinc-900 p-5 space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    {[
                      { key: "aiCreditsMonthly", label: "AI Credits/month" },
                      { key: "resumesLimit", label: "Resume Limit (9999=∞)" },
                      { key: "downloadsLimit", label: "Downloads Limit (9999=∞)" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-[10px] text-zinc-500">{label}</label>
                        <input type="number" value={editForm[key]}
                          onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full mt-0.5 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500">Watermark on PDF</label>
                      <input type="checkbox" checked={editForm.watermark}
                        onChange={e => setEditForm(p => ({ ...p, watermark: e.target.checked }))}
                        className="w-4 h-4 accent-amber-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500">ATS Analysis</label>
                      <input type="checkbox" checked={editForm.atsAnalysis}
                        onChange={e => setEditForm(p => ({ ...p, atsAnalysis: e.target.checked }))}
                        className="w-4 h-4 accent-amber-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500">Stripe Monthly Price ID</label>
                      <input type="text" value={editForm.stripePriceIdMonthly}
                        onChange={e => setEditForm(p => ({ ...p, stripePriceIdMonthly: e.target.value }))}
                        placeholder="price_..."
                        className="w-full mt-0.5 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500">Stripe Yearly Price ID</label>
                      <input type="text" value={editForm.stripePriceIdYearly}
                        onChange={e => setEditForm(p => ({ ...p, stripePriceIdYearly: e.target.value }))}
                        placeholder="price_..."
                        className="w-full mt-0.5 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      `${f.aiCreditsMonthly >= 9999 ? "Unlimited" : f.aiCreditsMonthly} AI credits/month`,
                      `${f.resumesLimit >= 9999 ? "Unlimited" : f.resumesLimit} resumes`,
                      `${f.downloadsLimit >= 9999 ? "Unlimited" : f.downloadsLimit} PDF downloads`,
                      f.watermark ? "PDF watermark" : "No watermark",
                      f.atsAnalysis ? "Full ATS analysis" : "Basic ATS score",
                    ].map(feat => (
                      <div key={feat} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-zinc-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <p className="text-xs text-zinc-500">
          <strong className="text-zinc-400">Note:</strong> Changes to plan features take effect immediately for new users.
          Existing users keep their current limits until their next login or manual update.
          Stripe Price IDs are used for payment processing — get them from your Stripe dashboard.
        </p>
      </div>
    </div>
  );
}
