import { useState } from "react";
import api from "../../utils/api";
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen,
  Award, Languages, FileText, ChevronDown, ChevronUp,
  PlusCircle, Trash2, Sparkles, Loader2
} from "lucide-react";
import { cn, generateId } from "../../utils/helpers";
import toast from "react-hot-toast";

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Languages },
];

export default function EditorPanel({ content, onChange, isPro, resumeId }) {
  const [open, setOpen] = useState("personal");
  const [aiLoading, setAiLoading] = useState(null);

  async function callAI(action, text, field, context) {
    if (!isPro) { toast.error("AI features require Pro. Upgrade to unlock!"); return null; }
    setAiLoading(field);
    try {
      const { data } = await api.post("/ai/generate", {
        action, content: text,
        jobTitle: content?.personal?.title,
        context,
      });
      toast.success(`${data.creditsUsed}/${data.creditsLimit} AI credits used`);
      return data.result;
    } catch (err) {
      toast.error(err.response?.data?.error || "AI failed");
      return null;
    } finally {
      setAiLoading(null);
    }
  }

  const set = (path, value) => onChange(prev => {
    const parts = path.split(".");
    const next = { ...prev };
    let cur = next;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = { ...cur[parts[i]] };
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    return next;
  });

  return (
    <div className="pb-8">
      {SECTIONS.map(sec => (
        <div key={sec.id} className="border-b border-zinc-100 last:border-0">
          <button onClick={() => setOpen(open === sec.id ? "" : sec.id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center",
                open === sec.id ? "bg-brand-100 text-brand-600" : "bg-zinc-100 text-zinc-500")}>
                <sec.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-zinc-700">{sec.label}</span>
            </div>
            {open === sec.id ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {open === sec.id && (
            <div className="px-5 pb-5">
              {sec.id === "personal" && <PersonalSection content={content} set={set} />}
              {sec.id === "summary" && <SummarySection content={content} onChange={onChange} callAI={callAI} aiLoading={aiLoading} isPro={isPro} />}
              {sec.id === "experience" && <ExperienceSection content={content} onChange={onChange} callAI={callAI} aiLoading={aiLoading} isPro={isPro} />}
              {sec.id === "education" && <EducationSection content={content} onChange={onChange} />}
              {sec.id === "skills" && <SkillsSection content={content} onChange={onChange} />}
              {sec.id === "projects" && <ProjectsSection content={content} onChange={onChange} />}
              {sec.id === "certifications" && <CertsSection content={content} onChange={onChange} />}
              {sec.id === "languages" && <LanguagesSection content={content} onChange={onChange} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Shared field components ───────────────────────────────────────────────────
function F({ label, children }) {
  return <div className="mb-3"><label className="block text-xs font-medium text-zinc-500 mb-1">{label}</label>{children}</div>;
}
function I({ value, onChange, placeholder, type = "text" }) {
  return <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input" />;
}
function T({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="input resize-none" />;
}
function AIBtn({ onClick, loading, isPro, label = "AI Improve" }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
        !isPro ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-brand-50 text-brand-600 hover:bg-brand-100")}>
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
      {!isPro ? "AI (Pro)" : label}
    </button>
  );
}
function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-zinc-200 text-sm font-medium text-zinc-400 hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50/30 transition-all">
      <PlusCircle className="w-4 h-4" /> {label}
    </button>
  );
}
function RemoveBtn({ onClick }) {
  return (
    <button onClick={onClick} className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Personal ──────────────────────────────────────────────────────────────────
function PersonalSection({ content, set }) {
  const p = content.personal || {};
  const s = (field) => (v) => set(`personal.${field}`, v);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <F label="First Name"><I value={p.firstName} onChange={s("firstName")} placeholder="John" /></F>
        <F label="Last Name"><I value={p.lastName} onChange={s("lastName")} placeholder="Doe" /></F>
      </div>
      <F label="Professional Title"><I value={p.title} onChange={s("title")} placeholder="Senior Software Engineer" /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Email"><I value={p.email} onChange={s("email")} placeholder="john@email.com" type="email" /></F>
        <F label="Phone"><I value={p.phone} onChange={s("phone")} placeholder="+1 555 000 0000" /></F>
      </div>
      <F label="Location"><I value={p.location} onChange={s("location")} placeholder="San Francisco, CA" /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="LinkedIn"><I value={p.linkedin} onChange={s("linkedin")} placeholder="linkedin.com/in/..." /></F>
        <F label="GitHub"><I value={p.github} onChange={s("github")} placeholder="github.com/..." /></F>
      </div>
      <F label="Website"><I value={p.website} onChange={s("website")} placeholder="yourwebsite.com" /></F>
    </div>
  );
}

// ── Summary ───────────────────────────────────────────────────────────────────
function SummarySection({ content, onChange, callAI, aiLoading, isPro }) {
  async function improve() {
    const result = await callAI("improve_summary", content.summary, "summary");
    if (result) onChange(p => ({ ...p, summary: result }));
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-zinc-500">Professional Summary</label>
        <AIBtn onClick={improve} loading={aiLoading === "summary"} isPro={isPro} />
      </div>
      <T value={content.summary} onChange={v => onChange(p => ({ ...p, summary: v }))} placeholder="A results-driven professional…" rows={5} />
      <p className="text-[11px] text-zinc-400 mt-1">{(content.summary || "").length}/600 chars</p>
    </div>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
function ExperienceSection({ content, onChange, callAI, aiLoading, isPro }) {
  function add() {
    onChange(p => ({ ...p, experience: [...(p.experience || []), { id: generateId(), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "", bullets: [] }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));
  }
  async function improveBullets(exp) {
    const result = await callAI("improve_bullets", exp.bullets.join("\n") || exp.description, `exp_${exp.id}`);
    if (result) {
      const bullets = result.split("\n").map(b => b.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
      update(exp.id, "bullets", bullets);
    }
  }
  return (
    <div>
      {(content.experience || []).map((exp, idx) => (
        <div key={exp.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Position {idx + 1}</span>
            <div className="flex items-center gap-2">
              <AIBtn onClick={() => improveBullets(exp)} loading={aiLoading === `exp_${exp.id}`} isPro={isPro} label="Improve Bullets" />
              <RemoveBtn onClick={() => remove(exp.id)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Company"><I value={exp.company} onChange={v => update(exp.id, "company", v)} placeholder="Google" /></F>
            <F label="Position"><I value={exp.position} onChange={v => update(exp.id, "position", v)} placeholder="Software Engineer" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Date"><I value={exp.startDate} onChange={v => update(exp.id, "startDate", v)} placeholder="Jan 2022" /></F>
            <F label="End Date"><I value={exp.current ? "Present" : exp.endDate} onChange={v => update(exp.id, "endDate", v)} placeholder="Dec 2024" /></F>
          </div>
          <F label="Location"><I value={exp.location} onChange={v => update(exp.id, "location", v)} placeholder="San Francisco, CA" /></F>
          <F label="Bullet Points (one per line)">
            <T value={(exp.bullets || []).join("\n")} onChange={v => update(exp.id, "bullets", v.split("\n").filter(Boolean))} placeholder="Led team of engineers…&#10;Reduced load time by 40%…" rows={4} />
          </F>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Experience" />
    </div>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────
function EducationSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, education: [...(p.education || []), { id: generateId(), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", gpa: "", honors: "" }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));
  }
  return (
    <div>
      {(content.education || []).map((edu, idx) => (
        <div key={edu.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Education {idx + 1}</span>
            <RemoveBtn onClick={() => remove(edu.id)} />
          </div>
          <F label="Institution"><I value={edu.institution} onChange={v => update(edu.id, "institution", v)} placeholder="MIT" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Degree"><I value={edu.degree} onChange={v => update(edu.id, "degree", v)} placeholder="Bachelor of Science" /></F>
            <F label="Field"><I value={edu.field} onChange={v => update(edu.id, "field", v)} placeholder="Computer Science" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Year"><I value={edu.startDate} onChange={v => update(edu.id, "startDate", v)} placeholder="2018" /></F>
            <F label="End Year"><I value={edu.endDate} onChange={v => update(edu.id, "endDate", v)} placeholder="2022" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="GPA"><I value={edu.gpa} onChange={v => update(edu.id, "gpa", v)} placeholder="3.8/4.0" /></F>
            <F label="Honors"><I value={edu.honors} onChange={v => update(edu.id, "honors", v)} placeholder="Cum Laude" /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Education" />
    </div>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function SkillsSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, skills: [...(p.skills || []), { id: generateId(), category: "", items: [] }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, skills: p.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, skills: p.skills.filter(s => s.id !== id) }));
  }
  return (
    <div>
      {(content.skills || []).map((cat, idx) => (
        <div key={cat.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Category {idx + 1}</span>
            <RemoveBtn onClick={() => remove(cat.id)} />
          </div>
          <F label="Category Name"><I value={cat.category} onChange={v => update(cat.id, "category", v)} placeholder="Programming Languages" /></F>
          <F label="Skills (comma-separated)">
            <I value={(cat.items || []).join(", ")} onChange={v => update(cat.id, "items", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="JavaScript, Python, Go" />
          </F>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Skill Category" />
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function ProjectsSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, projects: [...(p.projects || []), { id: generateId(), name: "", description: "", technologies: [], url: "", github: "" }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, projects: p.projects.map(x => x.id === id ? { ...x, [field]: value } : x) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, projects: p.projects.filter(x => x.id !== id) }));
  }
  return (
    <div>
      {(content.projects || []).map((proj, idx) => (
        <div key={proj.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-zinc-400">Project {idx + 1}</span>
            <RemoveBtn onClick={() => remove(proj.id)} />
          </div>
          <F label="Project Name"><I value={proj.name} onChange={v => update(proj.id, "name", v)} placeholder="E-Commerce Platform" /></F>
          <F label="Description"><T value={proj.description} onChange={v => update(proj.id, "description", v)} placeholder="Built a full-stack platform…" rows={2} /></F>
          <F label="Technologies (comma-separated)">
            <I value={(proj.technologies || []).join(", ")} onChange={v => update(proj.id, "technologies", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB" />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Live URL"><I value={proj.url} onChange={v => update(proj.id, "url", v)} placeholder="https://..." /></F>
            <F label="GitHub"><I value={proj.github} onChange={v => update(proj.id, "github", v)} placeholder="github.com/..." /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Project" />
    </div>
  );
}

// ── Certifications ────────────────────────────────────────────────────────────
function CertsSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, certifications: [...(p.certifications || []), { id: generateId(), name: "", issuer: "", date: "" }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, certifications: p.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, certifications: p.certifications.filter(c => c.id !== id) }));
  }
  return (
    <div>
      {(content.certifications || []).map(cert => (
        <div key={cert.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex justify-end mb-2"><RemoveBtn onClick={() => remove(cert.id)} /></div>
          <F label="Certification Name"><I value={cert.name} onChange={v => update(cert.id, "name", v)} placeholder="AWS Solutions Architect" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Issuer"><I value={cert.issuer} onChange={v => update(cert.id, "issuer", v)} placeholder="Amazon Web Services" /></F>
            <F label="Date"><I value={cert.date} onChange={v => update(cert.id, "date", v)} placeholder="May 2024" /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Certification" />
    </div>
  );
}

// ── Languages ─────────────────────────────────────────────────────────────────
function LanguagesSection({ content, onChange }) {
  const levels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];
  function add() {
    onChange(p => ({ ...p, languages: [...(p.languages || []), { id: generateId(), language: "", proficiency: "Fluent" }] }));
  }
  return (
    <div>
      {(content.languages || []).map(lang => (
        <div key={lang.id} className="flex gap-3 mb-3">
          <div className="flex-1">
            <I value={lang.language} onChange={v => onChange(p => ({ ...p, languages: p.languages.map(l => l.id === lang.id ? { ...l, language: v } : l) }))} placeholder="Spanish" />
          </div>
          <select value={lang.proficiency}
            onChange={e => onChange(p => ({ ...p, languages: p.languages.map(l => l.id === lang.id ? { ...l, proficiency: e.target.value } : l) }))}
            className="input w-36">
            {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
          </select>
          <RemoveBtn onClick={() => onChange(p => ({ ...p, languages: p.languages.filter(l => l.id !== lang.id) }))} />
        </div>
      ))}
      <AddBtn onClick={add} label="Add Language" />
    </div>
  );
}
