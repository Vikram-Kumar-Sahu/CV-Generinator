import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText, Sparkles, Zap, Shield, Download, Star,
  ArrowRight, Check, BarChart3, Palette, Globe, Cpu
} from "lucide-react";
import { cn } from "../utils/helpers";

const FEATURES = [
  { icon: Cpu, title: "Gemini AI Writing", desc: "Google's Gemini generates bullet points and summaries tailored to your target role.", color: "text-brand-600", bg: "bg-brand-50" },
  { icon: BarChart3, title: "ATS Score Analysis", desc: "Real-time scoring ensures your resume passes automated applicant tracking systems.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Palette, title: "6 Pro Templates", desc: "Modern, Classic, Executive, Creative, Minimal, and Tech — designed by recruiters.", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Zap, title: "Live Preview", desc: "See changes instantly in your split-screen editor. What you see is what you get.", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Download, title: "1-Click PDF Export", desc: "High-fidelity PDF output that looks exactly like your preview every time.", color: "text-rose-600", bg: "bg-rose-50" },
  { icon: Globe, title: "Job Tailoring", desc: "Paste any job description and AI reshapes your resume to match it perfectly.", color: "text-sky-600", bg: "bg-sky-50" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Software Engineer @ Google", avatar: "PS", color: "bg-brand-500", quote: "The AI suggestions were incredibly on-point. My ATS score went from 45 to 92 and I landed my dream job.", stars: 5 },
  { name: "Marcus Chen", role: "Product Manager @ Stripe", avatar: "MC", color: "bg-emerald-500", quote: "The Executive template is stunning. Three recruiters specifically commented on how professional my resume looked.", stars: 5 },
  { name: "Anika Patel", role: "UX Designer @ Figma", avatar: "AP", color: "bg-purple-500", quote: "I rewrote my entire resume in 20 minutes. The live preview is a game-changer for real-time iteration.", stars: 5 },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            ResumeCraft
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/templates" className="btn-ghost text-sm">Templates</Link>
            <Link to="/pricing" className="btn-ghost text-sm">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm">Dashboard <ArrowRight className="w-3.5 h-3.5" /></Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-zinc-900">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-b from-white to-zinc-50">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI · Free to start
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            Your resume,{" "}
            <span className="bg-gradient-to-r from-brand-600 to-purple-500 bg-clip-text text-transparent">
              reimagined by AI
            </span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10">
            Build ATS-optimized, beautifully designed resumes in minutes.
            AI writes your bullets, scores your compatibility, and tailors your resume to any job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">
              Build My Resume Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/templates" className="btn-secondary text-base px-8 py-3.5">
              See Templates
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
            {["No credit card required", "Free forever plan", "Export in seconds"].map(t => (
              <div key={t} className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />{t}</div>
            ))}
          </div>
        </div>

        {/* Hero mockup */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 bg-white">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 border-b border-zinc-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-6 rounded-md bg-zinc-200 flex items-center px-3">
                <span className="text-xs text-zinc-500">app.resumecraft.io/builder</span>
              </div>
            </div>
            <div className="flex h-72 bg-zinc-50">
              <div className="w-2/5 border-r border-zinc-200 p-4">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Editor</div>
                {[{ w: "80%", h: "7" }, { w: "60%", h: "7" }, { w: "70%", h: "7" }].map((f, i) => (
                  <div key={i} className="mb-3">
                    <div className={`h-${f.h} rounded-lg bg-zinc-200 border border-zinc-300`} style={{ width: f.w }} />
                  </div>
                ))}
                <div className="mt-4 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Experience</div>
                {[1, 2].map(i => <div key={i} className="mb-2 p-2 rounded-lg border border-zinc-200 bg-white">
                  <div className="h-2 w-24 bg-zinc-200 rounded mb-1" />
                  <div className="h-1.5 w-16 bg-zinc-100 rounded" />
                </div>)}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium">
                  <Sparkles className="w-3 h-3" /> AI Improve
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Live Preview</div>
                <div className="bg-white rounded-xl border border-zinc-200 h-[calc(100%-28px)] p-4">
                  <div className="h-3 w-32 bg-zinc-800 rounded mb-1" />
                  <div className="h-2 w-20 bg-brand-300 rounded mb-3" />
                  <div className="h-0.5 w-full bg-brand-200 mb-3" />
                  {[70, 85, 60, 75, 50].map((w, i) => <div key={i} className="h-1.5 mb-1.5 bg-zinc-100 rounded" style={{ width: `${w}%` }} />)}
                  <div className="h-0.5 w-full bg-brand-200 mt-3 mb-3" />
                  {[80, 65, 70].map((w, i) => <div key={i} className="h-1.5 mb-1.5 bg-zinc-100 rounded" style={{ width: `${w}%` }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["50,000+", "Resumes Created"], ["3x", "More Interviews"], ["4.9/5", "User Rating"], ["95%", "ATS Pass Rate"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">{v}</div>
                <div className="text-sm text-zinc-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-4">Features</div>
            <h2 className="text-4xl font-bold text-zinc-900 mb-3">Everything you need to get hired faster</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-zinc-100 bg-white hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-4">Testimonials</div>
            <h2 className="text-4xl font-bold text-zinc-900">Loved by job seekers worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-6 rounded-2xl bg-white border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-zinc-700 mb-5 leading-relaxed text-sm">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-brand-950 rounded-3xl p-16">
          <FileText className="w-12 h-12 text-brand-300 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Start building your dream resume today.</h2>
          <p className="text-brand-200 mb-8">Join 50,000+ professionals who landed jobs with ResumeCraft.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors">
            Create My Resume — It's Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center"><FileText className="w-3 h-3 text-white" /></div>
            ResumeCraft
          </Link>
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} ResumeCraft. Built with MERN + Gemini AI.</p>
          <div className="flex gap-4 text-sm text-zinc-400">
            <Link to="/pricing" className="hover:text-zinc-700">Pricing</Link>
            <Link to="/templates" className="hover:text-zinc-700">Templates</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
