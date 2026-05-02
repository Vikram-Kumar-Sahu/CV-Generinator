// ── Resumes Page ──────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { FileText, PlusCircle, MoreHorizontal, Edit3, Copy, Trash2, Download, TrendingUp } from "lucide-react";
import { formatDate, TEMPLATE_GRADIENTS, cn } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function ResumesPage() {
  const { isPro } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    api.get("/resumes").then(r => { setResumes(r.data.resumes); setLoading(false); });
  }, []);

  async function deleteResume(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await api.delete(`/resumes/${id}`);
    setResumes(r => r.filter(x => x._id !== id));
    toast.success("Resume deleted");
  }

  async function duplicateResume(id) {
    try {
      const { data } = await api.post(`/resumes/${id}/duplicate`);
      setResumes(r => [data.resume, ...r]);
      toast.success("Resume duplicated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not duplicate");
    }
    setMenuOpen(null);
  }

  const canCreate = isPro || resumes.length < 2;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">My Resumes</h1>
          <p className="text-sm text-zinc-500">{isPro ? `${resumes.length} resumes · Pro plan` : `${resumes.length}/2 resumes · Free plan`}</p>
        </div>
        {canCreate ? (
          <Link to="/builder" className="btn-primary"><PlusCircle className="w-4 h-4" /> New Resume</Link>
        ) : (
          <Link to="/pricing" className="btn-primary">Upgrade for More</Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card overflow-hidden animate-pulse"><div className="h-32 bg-zinc-100" /><div className="p-4 space-y-2"><div className="h-3 w-24 bg-zinc-100 rounded" /><div className="h-2 w-16 bg-zinc-50 rounded" /></div></div>)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-zinc-200">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-semibold text-zinc-700 mb-2">No resumes yet</h3>
          <Link to="/builder" className="btn-primary mt-4"><PlusCircle className="w-4 h-4" /> Create Your First Resume</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(r => (
            <div key={r._id} className="card overflow-hidden group relative">
              <Link to={`/builder/${r._id}`}>
                <div className={`h-36 bg-gradient-to-br ${TEMPLATE_GRADIENTS[r.templateId] || TEMPLATE_GRADIENTS.modern} relative overflow-hidden`}>
                  <div className="absolute inset-4 space-y-1.5">
                    <div className="h-2.5 w-20 bg-white/40 rounded" />
                    <div className="h-1.5 w-12 bg-white/25 rounded" />
                    {[75, 90, 65, 80].map((w, i) => <div key={i} className="h-1 bg-white/20 rounded" style={{ width: `${w}%` }} />)}
                  </div>
                  <div className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/20 text-white/90 capitalize">{r.templateId}</div>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link to={`/builder/${r._id}`} className="font-semibold text-sm text-zinc-900 hover:text-brand-600 transition-colors truncate">{r.title}</Link>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === r._id ? null : r._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === r._id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl border border-zinc-200 shadow-lg overflow-hidden py-1">
                          <Link to={`/builder/${r._id}`} className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"><Edit3 className="w-3.5 h-3.5" /> Edit</Link>
                          <button onClick={() => duplicateResume(r._id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"><Copy className="w-3.5 h-3.5" /> Duplicate</button>
                          <div className="my-1 border-t border-zinc-100" />
                          <button onClick={() => { deleteResume(r._id, r.title); setMenuOpen(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">{formatDate(r.updatedAt)}</p>
                  {r.atsScore > 0 && (
                    <span className={cn("text-xs font-semibold flex items-center gap-1",
                      r.atsScore >= 80 ? "text-emerald-600" : r.atsScore >= 60 ? "text-amber-600" : "text-red-500")}>
                      <TrendingUp className="w-3 h-3" /> {r.atsScore}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {canCreate && (
            <Link to="/builder" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 p-8 hover:border-brand-400 hover:bg-brand-50/30 transition-all min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                <PlusCircle className="w-5 h-5 text-zinc-400 group-hover:text-brand-600 transition-colors" />
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-brand-600 transition-colors">New Resume</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
