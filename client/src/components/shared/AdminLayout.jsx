import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, CreditCard, ArrowLeft, Shield, BarChart3 } from "lucide-react";
import { cn } from "../../utils/helpers";

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/plans", label: "Plans & Pricing", icon: CreditCard },
];

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-zinc-900 border-r border-zinc-800 h-full">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <p className="text-xs text-zinc-500">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to app */}
        <div className="p-4 border-t border-zinc-800">
          <NavLink to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </NavLink>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <Outlet />
      </main>
    </div>
  );
}
