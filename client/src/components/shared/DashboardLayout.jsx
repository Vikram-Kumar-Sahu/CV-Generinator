import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, FileText, Settings, PlusCircle,
  LogOut, Shield, ChevronRight, Sparkles, FileType
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../../utils/helpers";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/resumes", label: "My Resumes", icon: FileText },
  { to: "/builder", label: "New Resume", icon: PlusCircle, highlight: true },
  { to: "/templates", label: "Templates", icon: FileType },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout, isAdmin, isPro } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    navigate("/");
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-zinc-200 h-full flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-zinc-100">
          <a href="/" className="flex items-center gap-2 font-bold text-zinc-900">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm">ResumeCraft</span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : highlight
                    ? "text-brand-600 hover:bg-brand-50"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {highlight && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
            </NavLink>
          ))}

          {/* Admin link */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2",
                  isActive
                    ? "bg-amber-50 text-amber-700"
                    : "text-amber-600 hover:bg-amber-50"
                )
              }
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Pro upsell */}
        {!isPro && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-white/80 mb-2">AI writing, all templates, no watermark.</p>
            <a href="/pricing" className="flex items-center gap-1 text-[11px] font-semibold text-white hover:underline">
              Upgrade now <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* User footer */}
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                  user?.role === "admin" ? "bg-amber-100 text-amber-700" :
                  isPro ? "bg-brand-100 text-brand-700" : "bg-zinc-100 text-zinc-600"
                )}>
                  {user?.role === "admin" ? "ADMIN" : isPro ? "PRO" : "FREE"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full btn-ghost text-xs justify-start text-zinc-400">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
