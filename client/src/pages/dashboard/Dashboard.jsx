import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { FileText, Download, TrendingUp, Clock, PlusCircle, Sparkles, ArrowRight } from "lucide-react";
import { formatDate, TEMPLATE_GRADIENTS, cn } from "../../utils/helpers";

export default function DashboardPage() {
  const { user, isPro } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/resumes").then(r => { setResumes(r.data.resumes); setLoading(false); });
  }, []);

  const totalDownloads = resumes.reduce((a, r) => a + (r.downloads || 0), 0);
  const avgATS = resumes.length
    ? Math.round(resumes.filter(r => r.atsScore).reduce((a, r) => a + r.atsScore, 0) / resumes.filter(r => r.atsScore).length)
    : 0;

  const stats = [
    { label: "Resumes", value: resumes.length, icon: FileText, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Downloads", value: totalDownloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg ATS Score", value: avgATS ? `${avgATS}%` : "—", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    {
      label: "AI Credits Left",
      value: `${(user?.usage?.aiCreditsLimit || 0) - (user?.usage?.aiCreditsUsed || 0)}`,
      icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50"
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-zinc-500">
            {isPro ? "Pro plan · Unlimited everything" : `Free plan · ${resumes.length}/2 resumes used`}
          </p>
        </div>
        <Link to="/builder" className="btn-primary">
          <PlusCircle className="w-4 h-4" /> New Resume
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-zinc-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upgrade banner */}
      {!isPro && (
        <div className="relative rounded-2xl overflow-hidden bg-brand-600 p-5 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-700/40 to-transparent" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Upgrade to Pro</p>
                <p className="text-white/70 text-xs mt-0.5">Unlock all 6 templates, 100 AI credits, no watermark.</p>
              </div>
            </div>
            <Link to="/pricing" className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-brand-600 text-sm font-semibold hover:bg-brand-50 transition-colors">
              Upgrade <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent resumes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Resumes</h2>
          {resumes.length > 0 && (
            <Link to="/dashboard/resumes" className="text-sm text-brand-600 hover:underline">View all</Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-32 bg-zinc-100" />
                <div className="p-4"><div className="h-3 w-24 bg-zinc-100 rounded mb-2" /><div className="h-2 w-16 bg-zinc-100 rounded" /></div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-zinc-200 bg-white">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-700 mb-2">No resumes yet</h3>
            <p className="text-sm text-zinc-500 mb-6">Create your first resume and start applying.</p>
            <Link to="/builder" className="btn-primary">
              <PlusCircle className="w-4 h-4" /> Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.slice(0, 6).map(resume => (
              <Link key={resume._id} to={`/builder/${resume._id}`}
                className="card overflow-hidden hover:shadow-md transition-shadow group">
                <div className={`h-32 bg-gradient-to-br ${TEMPLATE_GRADIENTS[resume.templateId] || TEMPLATE_GRADIENTS.modern} relative`}>
                  <div className="absolute inset-4 space-y-1">
                    <div className="h-2.5 w-20 bg-white/40 rounded" />
                    <div className="h-1.5 w-12 bg-white/25 rounded" />
                    <div className="mt-2 space-y-1">
                      {[70, 85, 60].map((w, i) => <div key={i} className="h-1 bg-white/20 rounded" style={{ width: `${w}%` }} />)}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/20 text-white/90 capitalize">
                    {resume.templateId}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm text-zinc-900 group-hover:text-brand-600 transition-colors truncate mb-1">{resume.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-400">{formatDate(resume.updatedAt)}</p>
                    {resume.atsScore > 0 && (
                      <span className={cn("text-xs font-semibold", resume.atsScore >= 80 ? "text-emerald-600" : resume.atsScore >= 60 ? "text-amber-600" : "text-red-500")}>
                        {resume.atsScore}% ATS
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
