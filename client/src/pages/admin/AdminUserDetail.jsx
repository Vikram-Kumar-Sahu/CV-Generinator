import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import {
  ArrowLeft, Crown, Shield, UserX, UserCheck,
  RefreshCw, Trash2, FileText, Sparkles, Loader2, Calendar
} from "lucide-react";
import { formatDate, TEMPLATE_GRADIENTS, cn } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ plan: "free", role: "user", aiCreditsLimit: 5 });

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(({ data }) => {
      setUser(data.user);
      setResumes(data.resumes);
      setForm({
        plan: data.user.subscription?.plan || "free",
        role: data.user.role,
        aiCreditsLimit: data.user.usage?.aiCreditsLimit || 5,
      });
      setLoading(false);
    }).catch(() => toast.error("Failed to load user"));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        api.patch(`/admin/users/${id}/subscription`, { plan: form.plan }),
        api.patch(`/admin/users/${id}/role`, { role: form.role }),
        api.patch(`/admin/users/${id}/credits`, { aiCreditsLimit: Number(form.aiCreditsLimit) }),
      ]);
      toast.success("User updated successfully");
      const { data } = await api.get(`/admin/users/${id}`);
      setUser(data.user);
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function resetCredits() {
    try {
      await api.patch(`/admin/users/${id}/credits`, { aiCreditsUsed: 0 });
      toast.success("AI credits reset to 0");
      const { data } = await api.get(`/admin/users/${id}`);
      setUser(data.user);
    } catch { toast.error("Failed to reset credits"); }
  }

  async function toggleStatus() {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !user.isActive });
      toast.success(user.isActive ? "User deactivated" : "User activated");
      setUser(u => ({ ...u, isActive: !u.isActive }));
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
  }

  async function deleteUser() {
    if (!confirm(`Permanently delete ${user.name} and ALL their data?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      window.history.back();
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Back */}
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      {/* User header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-700 flex items-center justify-center text-2xl font-bold text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <p className="text-zinc-400 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                  user.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-zinc-700 text-zinc-400")}>
                  {user.role.toUpperCase()}
                </span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                  user.subscription?.plan !== "free" ? "bg-brand-500/20 text-brand-400" : "bg-zinc-700 text-zinc-400")}>
                  {(user.subscription?.plan || "free").toUpperCase()}
                </span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                  user.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                  {user.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleStatus}
              className={cn("btn-ghost text-xs", user.isActive ? "text-red-400 hover:bg-red-500/10" : "text-emerald-400 hover:bg-emerald-500/10")}>
              {user.isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
            </button>
            <button onClick={deleteUser} className="btn-ghost text-xs text-red-400 hover:bg-red-500/10">
              <Trash2 className="w-3.5 h-3.5" /> Delete User
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
          {[
            { label: "Joined", value: formatDate(user.createdAt), icon: Calendar },
            { label: "Last Login", value: user.lastLogin ? formatDate(user.lastLogin) : "Never", icon: Calendar },
            { label: "Login Count", value: user.loginCount || 0, icon: UserCheck },
            { label: "Resumes", value: resumes.length, icon: FileText },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Edit form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Manage Access
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Subscription Plan</label>
              <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <p className="text-[11px] text-zinc-600 mt-1">Admin-granted subscription overrides Stripe billing.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">User Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Monthly AI Credits Limit</label>
              <input type="number" value={form.aiCreditsLimit}
                onChange={e => setForm(p => ({ ...p, aiCreditsLimit: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                min="0" max="9999" />
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Usage stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" /> Usage & Limits
          </h2>

          <div className="space-y-4">
            {[
              {
                label: "AI Credits",
                used: user.usage?.aiCreditsUsed || 0,
                limit: user.usage?.aiCreditsLimit || 5,
                color: "bg-brand-500",
              },
              {
                label: "Downloads",
                used: user.usage?.downloadsCount || 0,
                limit: user.usage?.downloadsLimit === 9999 ? "∞" : user.usage?.downloadsLimit || 3,
                color: "bg-emerald-500",
              },
              {
                label: "Resumes",
                used: resumes.length,
                limit: user.usage?.resumesLimit === 9999 ? "∞" : user.usage?.resumesLimit || 2,
                color: "bg-purple-500",
              },
            ].map(item => {
              const pct = item.limit === "∞" ? 0 : Math.min((item.used / item.limit) * 100, 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="text-white font-semibold">{item.used} / {item.limit}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-zinc-800">
              <button onClick={resetCredits}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Reset AI Credits to 0
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User's resumes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" /> Resumes ({resumes.length})
        </h2>
        {resumes.length === 0 ? (
          <p className="text-zinc-500 text-sm">No resumes created yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {resumes.map(r => (
              <div key={r._id} className="rounded-xl overflow-hidden border border-zinc-700">
                <div className={`h-20 bg-gradient-to-br ${TEMPLATE_GRADIENTS[r.templateId] || TEMPLATE_GRADIENTS.modern}`}>
                  <div className="p-2 space-y-1">
                    {[60, 80, 50].map((w, i) => <div key={i} className="h-1 bg-white/25 rounded" style={{ width: `${w}%` }} />)}
                  </div>
                </div>
                <div className="p-2 bg-zinc-800">
                  <p className="text-xs font-medium text-white truncate">{r.title}</p>
                  <p className="text-[10px] text-zinc-500">{formatDate(r.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
