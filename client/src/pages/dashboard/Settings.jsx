// Settings Page
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { User, CreditCard, Shield, ExternalLink, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, isPro, refreshUser } = useAuth();
  const [nameForm, setNameForm] = useState(user?.name || "");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  async function saveName(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/auth/profile", { name: nameForm });
      await refreshUser();
      toast.success("Profile updated");
    } catch { toast.error("Failed to update"); }
    finally { setSaving(false); }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    setSaving(true);
    try {
      await api.patch("/auth/password", { currentPassword: pwForm.current, newPassword: pwForm.newPw });
      setPwForm({ current: "", newPw: "", confirm: "" });
      toast.success("Password updated");
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setSaving(false); }
  }

  async function openPortal() {
    setPortalLoading(true);
    try {
      const { data } = await api.post("/subscriptions/portal");
      window.location.href = data.url;
    } catch { toast.error("Could not open billing portal"); }
    finally { setPortalLoading(false); }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">Settings</h1>

      {/* Profile */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center"><User className="w-4 h-4 text-brand-600" /></div>
          <div><h2 className="font-semibold text-zinc-900">Profile</h2><p className="text-xs text-zinc-500">Update your name and email</p></div>
        </div>
        <form onSubmit={saveName} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Full Name</label>
            <input value={nameForm} onChange={e => setNameForm(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Email</label>
            <input value={user?.email} disabled className="input opacity-60 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save Profile
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><Shield className="w-4 h-4 text-amber-600" /></div>
          <div><h2 className="font-semibold text-zinc-900">Password</h2><p className="text-xs text-zinc-500">Change your password</p></div>
        </div>
        <form onSubmit={savePassword} className="space-y-4">
          {["current", "newPw", "confirm"].map((f, i) => (
            <div key={f}>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">{["Current Password", "New Password", "Confirm New Password"][i]}</label>
              <input type="password" value={pwForm[f]} onChange={e => setPwForm(p => ({ ...p, [f]: e.target.value }))} className="input" placeholder="••••••••" />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Update Password
          </button>
        </form>
      </section>

      {/* Billing */}
      <section className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><CreditCard className="w-4 h-4 text-emerald-600" /></div>
          <div><h2 className="font-semibold text-zinc-900">Billing & Subscription</h2><p className="text-xs text-zinc-500">Manage your plan</p></div>
        </div>
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Current Plan: <span className={isPro ? "text-brand-600" : "text-zinc-500"}>{isPro ? "Pro" : "Free"}</span></p>
            <p className="text-xs text-zinc-500 mt-0.5">
              AI Credits: {user?.usage?.aiCreditsUsed}/{user?.usage?.aiCreditsLimit} used this month
            </p>
          </div>
        </div>
        {isPro ? (
          <button onClick={openPortal} disabled={portalLoading} className="btn-secondary">
            {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
            Manage Billing
          </button>
        ) : (
          <a href="/pricing" className="btn-primary">Upgrade to Pro</a>
        )}
      </section>
    </div>
  );
}
