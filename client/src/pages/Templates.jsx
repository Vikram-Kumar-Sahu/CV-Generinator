import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, ArrowRight, Check, FileText } from "lucide-react";
import { cn, TEMPLATE_GRADIENTS } from "../utils/helpers";

const TEMPLATES = [
  { id: "modern", name: "Modern", category: "Modern", desc: "Clean two-column layout with subtle color accents. Perfect for tech and creative roles.", isPro: false },
  { id: "classic", name: "Classic", category: "Classic", desc: "Traditional single-column layout. Maximally ATS-optimized for corporate applications.", isPro: false },
  { id: "executive", name: "Executive", category: "Executive", desc: "Bold header with refined typography. Designed for senior and C-level professionals.", isPro: true },
  { id: "creative", name: "Creative", category: "Creative", desc: "Vibrant sidebar design that stands out. Ideal for designers, marketers, and creatives.", isPro: true },
  { id: "minimal", name: "Minimal", category: "Minimal", desc: "Ultra-clean with generous whitespace. Timeless elegance for any industry.", isPro: true },
  { id: "tech", name: "Tech", category: "Tech", desc: "Monospace-inspired layout engineered for software developers and engineers.", isPro: true },
];

export default function TemplatesPage() {
  const { user, isPro } = useAuth();

  return (
    <div className="min-h-screen bg-white">
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
            <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Templates
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-3">
            6 professional resume templates
          </h1>
          <p className="text-lg text-zinc-500">Designed by recruiters. ATS-tested. Built to impress.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map(t => {
            const locked = t.isPro && !isPro;
            return (
              <div key={t.id} className="group rounded-2xl border border-zinc-200 overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
                <div className={`relative h-52 bg-gradient-to-br ${TEMPLATE_GRADIENTS[t.id]} overflow-hidden`}>
                  <div className="absolute inset-5">
                    <div className="h-4 w-28 bg-white/40 rounded mb-1.5" />
                    <div className="h-2 w-18 bg-white/25 rounded mb-4" />
                    <div className="h-0.5 w-full bg-white/20 mb-3" />
                    {[75, 90, 65, 80, 55, 70].map((w, i) => (
                      <div key={i} className="h-1.5 bg-white/20 rounded mb-1.5" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold",
                      !t.isPro ? "bg-emerald-500/90 text-white" : "bg-brand-600/90 text-white")}>
                      {t.isPro ? "PRO" : "FREE"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-semibold">
                      {t.category}
                    </span>
                  </div>
                  {locked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <Lock className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-semibold">Pro Template</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-zinc-900 mb-1">{t.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{t.desc}</p>
                  {locked ? (
                    <Link to="/pricing" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-500 text-brand-600 text-sm font-semibold hover:bg-brand-50 transition-colors">
                      <Lock className="w-3.5 h-3.5" /> Unlock with Pro
                    </Link>
                  ) : (
                    <Link to={user ? `/builder?template=${t.id}` : "/register"}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">
                      Use This Template <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!isPro && (
          <div className="mt-16 text-center p-12 rounded-3xl bg-brand-950 text-white">
            <h2 className="text-2xl font-bold mb-3">Unlock all 6 premium templates</h2>
            <p className="text-brand-200 mb-6">Executive, Creative, Minimal and Tech are Pro-only.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["Executive", "Creative", "Minimal", "Tech"].map(n => (
                <div key={n} className="flex items-center gap-1.5 text-sm text-white/80">
                  <Check className="w-4 h-4 text-brand-300" /> {n} Template
                </div>
              ))}
            </div>
            <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors">
              Upgrade to Pro — $9.99/mo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
