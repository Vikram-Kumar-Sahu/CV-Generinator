import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import {
  Search, Filter, ChevronLeft, ChevronRight,
  UserCheck, UserX, Crown, Shield, Eye, Loader2
} from "lucide-react";
import { formatDate, cn, debounce } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", plan: "", role: "", page: 1 });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...f, limit: 15 }).toString();
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(filters); }, [filters, fetchUsers]);

  const debouncedSearch = useCallback(
    debounce((val) => setFilters(p => ({ ...p, search: val, page: 1 })), 400),
    []
  );

  async function updateSubscription(userId, plan) {
    setActionLoading(userId + plan);
    try {
      await api.patch(`/admin/users/${userId}/subscription`, { plan });
      toast.success(`Plan updated to ${plan}`);
      fetchUsers(filters);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleStatus(userId, currentStatus) {
    setActionLoading(userId + "status");
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      toast.success(!currentStatus ? "User activated" : "User deactivated");
      fetchUsers(filters);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function updateRole(userId, role) {
    setActionLoading(userId + "role");
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success(`Role updated to ${role}`);
      fetchUsers(filters);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
        <p className="text-zinc-500 text-sm">{pagination.total} total users</p>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email…"
              onChange={e => debouncedSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Plan filter */}
          <select
            value={filters.plan}
            onChange={e => setFilters(p => ({ ...p, plan: e.target.value, page: 1 }))}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* Role filter */}
          <select
            value={filters.role}
            onChange={e => setFilters(p => ({ ...p, role: e.target.value, page: 1 }))}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["User", "Plan", "Role", "Resumes", "Joined", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-zinc-800/50 transition-colors">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <select
                        value={user.subscription?.plan || "free"}
                        onChange={e => updateSubscription(user._id, e.target.value)}
                        disabled={!!actionLoading}
                        className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none",
                          user.subscription?.plan === "pro" || user.subscription?.plan === "enterprise"
                            ? "bg-brand-500/20 text-brand-300"
                            : "bg-zinc-700 text-zinc-300"
                        )}
                      >
                        <option value="free">FREE</option>
                        <option value="pro">PRO</option>
                        <option value="enterprise">ENTERPRISE</option>
                      </select>
                      {user.subscription?.grantedByAdmin && (
                        <span className="block text-[10px] text-amber-400 mt-0.5">Admin granted</span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={e => updateRole(user._id, e.target.value)}
                        disabled={!!actionLoading}
                        className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none",
                          user.role === "admin"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-zinc-700 text-zinc-300"
                        )}
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>

                    {/* Resumes */}
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {user.resumeCount || 0}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                        user.isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      )}>
                        {user.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/users/${user._id}`}
                          className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
                          title="View details">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleStatus(user._id, user.isActive)}
                          disabled={actionLoading === user._id + "status"}
                          className="p-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {actionLoading === user._id + "status"
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                            : user.isActive
                            ? <UserX className="w-3.5 h-3.5 text-red-400" />
                            : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              Page {pagination.page} of {pagination.pages} · {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors text-zinc-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors text-zinc-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
