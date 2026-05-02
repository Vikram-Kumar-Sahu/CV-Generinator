import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import {
  ChevronLeft, Download, Save, Sparkles, Palette,
  Settings2, TrendingUp, Check, Loader2, Eye, EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
import { debounce, calculateATSScore, DEFAULT_CONTENT, cn } from "../../utils/helpers";
import EditorPanel from "../../components/editor/EditorPanel";
import ResumePreview from "../../components/editor/ResumePreview";
import TemplateSelector from "../../components/editor/TemplateSelector";
import ATSPanel from "../../components/editor/ATSPanel";


export default function BuilderPage() {
  const { id } = useParams();
  const { isPro } = useAuth();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [activeTab, setActiveTab] = useState("editor");
  const [showPreview, setShowPreview] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const previewRef = useRef(null);

  // Load or create resume
  useEffect(() => {
    async function load() {
      try {
        if (id) {
          const { data } = await api.get(`/resumes/${id}`);
          setResume(data.resume);
          setAtsScore(data.resume.atsScore || calculateATSScore(data.resume.content));
        } else {
          const { data } = await api.post("/resumes", {
            title: "My Resume",
            templateId: "modern",
            content: DEFAULT_CONTENT,
          });
          navigate(`/builder/${data.resume._id}`, { replace: true });
          setResume(data.resume);
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load resume");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Auto-save
  const autoSave = useCallback(
    debounce(async (r) => {
      setSaveState("saving");
      try {
        await api.patch(`/resumes/${r._id}`, {
          title: r.title,
          templateId: r.templateId,
          content: r.content,
          atsScore: calculateATSScore(r.content),
        });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2500);
      } catch {
        setSaveState("error");
      }
    }, 1500),
    []
  );

  function updateContent(updater) {
    setResume(prev => {
      const newContent = updater(prev.content);
      const newScore = calculateATSScore(newContent);
      setAtsScore(newScore);
      const updated = { ...prev, content: newContent };
      autoSave(updated);
      return updated;
    });
  }

  function updateField(field, value) {
    setResume(prev => {
      const updated = { ...prev, [field]: value };
      autoSave(updated);
      return updated;
    });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const el = previewRef.current;
      if (!el) { toast.error("Preview not ready"); return; }
      await html2pdf().set({
        margin: 0,
        filename: `${resume.title || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(el).save();
      await api.post(`/resumes/${resume._id}/download`);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  const tabs = [
    { id: "editor", icon: Settings2, label: "Editor" },
    { id: "templates", icon: Palette, label: "Templates" },
    { id: "ats", icon: TrendingUp, label: "ATS" },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-100 overflow-hidden">
      {/* Toolbar */}
      <header className="flex items-center gap-3 px-4 h-14 bg-white border-b border-zinc-200 flex-shrink-0 z-10">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mr-2">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="w-px h-5 bg-zinc-200" />

        {/* Title */}
        <input
          type="text"
          value={resume.title}
          onChange={e => updateField("title", e.target.value)}
          className="flex-1 max-w-xs text-sm font-semibold text-zinc-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-zinc-50 rounded-lg px-2 py-1"
          placeholder="Resume Title"
        />

        <div className="flex-1" />

        {/* Save indicator */}
        <div className="text-xs text-zinc-400 min-w-16 text-right">
          {saveState === "saving" && <span className="flex items-center gap-1 justify-end"><Loader2 className="w-3 h-3 animate-spin" /> Saving</span>}
          {saveState === "saved" && <span className="flex items-center gap-1 justify-end text-emerald-600"><Check className="w-3 h-3" /> Saved</span>}
          {saveState === "error" && <span className="text-red-500">Error</span>}
        </div>

        {/* ATS Score */}
        <div className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
          atsScore >= 80 ? "bg-emerald-50 text-emerald-700" :
          atsScore >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600")}>
          <TrendingUp className="w-3 h-3" /> {atsScore}%
        </div>

        {/* Mobile preview toggle */}
        <button onClick={() => setShowPreview(!showPreview)} className="lg:hidden btn-ghost p-2">
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Export */}
        <button onClick={handleExport} disabled={exporting} className="btn-primary text-xs px-3 py-2">
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-zinc-200 flex-shrink-0">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeTab === tab.id ? "bg-brand-50 text-brand-700" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50")}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-[420px] flex-shrink-0 overflow-y-auto bg-white border-r border-zinc-200">
          {activeTab === "editor" && (
            <EditorPanel content={resume.content} onChange={updateContent} isPro={isPro} resumeId={resume._id} />
          )}
          {activeTab === "templates" && (
            <TemplateSelector selected={resume.templateId} onSelect={t => updateField("templateId", t)} isPro={isPro} />
          )}
          {activeTab === "ats" && (
            <ATSPanel content={resume.content} score={atsScore} isPro={isPro} />
          )}
        </div>

        {/* Right preview */}
        <div className={cn("flex-1 overflow-auto p-6 lg:p-8 items-start justify-center bg-zinc-100",
          showPreview ? "flex" : "hidden lg:flex")}>
          <div className="w-full max-w-[794px]">
            <div ref={previewRef} className="bg-white shadow-xl rounded-lg overflow-hidden"
              style={{ width: "794px", minHeight: "1123px" }}>
              <ResumePreview content={resume.content} templateId={resume.templateId} isPro={isPro} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
