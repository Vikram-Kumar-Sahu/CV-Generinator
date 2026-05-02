import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Users, FileText, TrendingUp, Download, UserPlus, Crown, Activity, ArrowRight } from "lucide-react";
import { formatDate, cn } from "../../utils/helpers";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/activity"),
    ]).then(([s, a]) => {
      setStats(s.data.stats);
      setActivity(a.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="p-8 text-zinc-400">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-zinc-800 animate-pulse" />)}
      </div>
    </div>
  );

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", delta: `+${stats.newUsersToday} today` },
    { label: "Pro Users", value: stats.proUsers, icon: Crown, color: "text-amber-400", bg: "bg-amber-500/10", delta: `${stats.conversionRate}% conversion` },
    { label: "Total Resumes", value: stats.totalResumes, icon: FileText, color: "text-brand-400", bg: "bg-brand-500/10", delta: null },
    { label: "Downloads", value: stats.totalDownloads, icon: Download, color: "text-emerald-400", bg: "bg-emerald-500/10", delta: null },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-zinc-500 text-sm">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{s.value.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">{s.label}</div>
            {s.delta && <div className="text-xs text-emerald-400 mt-1">{s.delta}</div>}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Manage Users", desc: "View, edit roles, grant subscriptions", href: "/admin/users", icon: Users, color: "text-blue-400" },
          { label: "Manage Plans", desc: "Edit pricing and feature limits", href: "/admin/plans", icon: Crown, color: "text-amber-400" },
          { label: "New Users Today", desc: `${stats.newUsersToday} signups · ${stats.newUsersThisMonth} this month`, href: "/admin/users", icon: UserPlus, color: "text-emerald-400" },
        ].map(a => (
          <Link key={a.label} to={a.href}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex items-center justify-between group transition-colors">
            <div className="flex items-center gap-4">
              <a.icon className={`w-5 h-5 ${a.color}`} />
              <div>
                <p className="text-sm font-semibold text-white">{a.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-400" /> Recent Signups
            </h3>
            <Link to="/admin/users" className="text-xs text-zinc-500 hover:text-zinc-300">View all</Link>
          </div>
          <div className="space-y-3">
            {activity?.recentUsers?.map(u => (
              <div key={u._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{u.name}</p>
                    <p className="text-[10px] text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                    u.role === "admin" ? "bg-amber-500/20 text-amber-400" :
                    u.subscription?.plan !== "free" ? "bg-brand-500/20 text-brand-400" :
                    "bg-zinc-700 text-zinc-400")}>
                    {u.role === "admin" ? "ADMIN" : u.subscription?.plan?.toUpperCase() || "FREE"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent resumes */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" /> Recent Resumes
            </h3>
          </div>
          <div className="space-y-3">
            {activity?.recentResumes?.map(r => (
              <div key={r._id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white">{r.title}</p>
                  <p className="text-[10px] text-zinc-500">{r.user?.name} · {r.templateId}</p>
                </div>
                <p className="text-[10px] text-zinc-600">{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
