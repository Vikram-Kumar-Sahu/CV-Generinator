import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, Eye, EyeOff, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome to ResumeCraft 🎉");
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-lg text-zinc-900">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            ResumeCraft
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Create your account</h1>
          <p className="text-sm text-zinc-500 mb-6">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Full Name</label>
              <input type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input" placeholder="John Doe" required autoFocus />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input" placeholder="you@email.com" required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input pr-10" placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Creating account…" : "Create Free Account"}
            </button>
          </form>

          <ul className="mt-5 space-y-1.5">
            {["Free forever plan", "No credit card needed", "AI resume writing included"].map(t => (
              <li key={t} className="flex items-center gap-2 text-xs text-zinc-500">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </li>
            ))}
          </ul>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
