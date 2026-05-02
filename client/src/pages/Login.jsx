import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-lg text-zinc-900">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            ResumeCraft
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-500 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input"
                placeholder="you@email.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
          <p className="text-xs text-amber-700">
            <strong>First registered user</strong> automatically becomes Admin
          </p>
        </div>
      </div>
    </div>
  );
}
