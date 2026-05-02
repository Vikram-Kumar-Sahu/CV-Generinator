import { Link } from "react-router-dom";
import {
  TrendingUp, Check, X, Lock, Lightbulb,
  AlertTriangle, ChevronRight, RefreshCw
} from "lucide-react";
import { cn } from "../../utils/helpers";

// ── ATS Check definitions ─────────────────────────────────────────────────────
// Each check has: label, description, points, and how to pass it
function getChecks(content) {
  const p = content?.personal || {};
  const summary = content?.summary || "";
  const experience = content?.experience || [];
  const education = content?.education || [];
  const skills = content?.skills || [];

  return [
    {
      id: "fullName",
      label: "Full name included",
      description: "Both first and last name are required for ATS candidate matching.",
      points: 10,
      pass: !!(p.firstName && p.lastName),
      fix: "Fill in both First Name and Last Name in Personal Info.",
    },
    {
      id: "email",
      label: "Email address",
      description: "Email is the primary contact field — every ATS requires it.",
      points: 10,
      pass: !!p.email,
      fix: "Add your email address in Personal Info.",
    },
    {
      id: "phone",
      label: "Phone number",
      description: "Recruiters use phone for quick screening calls before interviews.",
      points: 5,
      pass: !!p.phone,
      fix: "Add your phone number in Personal Info.",
    },
    {
      id: "location",
      label: "Location / City",
      description: "ATS systems filter by geography for location-based job postings.",
      points: 5,
      pass: !!p.location,
      fix: "Add your city/location in Personal Info.",
    },
    {
      id: "title",
      label: "Professional title",
      description: "The first keyword an ATS matches against the job posting title.",
      points: 5,
      pass: !!p.title,
      fix: "Add a professional title like 'Full Stack Developer' in Personal Info.",
    },
    {
      id: "summary",
      label: "Summary (50+ characters)",
      description: "The summary is the highest-density keyword section. ATS scans it heavily.",
      points: 15,
      pass: summary.length >= 50,
      fix: `Write at least 3–4 sentences (currently ${summary.length} characters).`,
    },
    {
      id: "exp1",
      label: "At least 1 work experience",
      description: "Work experience carries the most weight (20pts) — it's where your relevant keywords live.",
      points: 20,
      pass: experience.length >= 1,
      fix: "Add at least one job in the Experience section.",
    },
    {
      id: "exp2",
      label: "At least 2 work experiences",
      description: "Two jobs = more keywords and shows career progression. Bonus points.",
      points: 5,
      pass: experience.length >= 2,
      fix: "Add a second job or internship in the Experience section.",
    },
    {
      id: "education",
      label: "Education section",
      description: "Many job postings filter by degree requirements — ATS checks this.",
      points: 10,
      pass: education.length >= 1,
      fix: "Add your degree/university in the Education section.",
    },
    {
      id: "skills",
      label: "Skills section present",
      description: "Skills is where ATS keyword matching happens. No skills = no matches.",
      points: 10,
      pass: skills.length >= 1,
      fix: "Add at least one skill category in the Skills section.",
    },
    {
      id: "skills3",
      label: "3+ skill categories",
      description: "Multiple skill groups increase keyword coverage across different domains.",
      points: 5,
      pass: skills.length >= 3,
      fix: "Add 3 or more skill categories (e.g. Frontend, Backend, Tools).",
    },
  ];
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ATSPanel({ content, score, isPro }) {
  const checks = getChecks(content);
  const passed = checks.filter((c) => c.pass).length;
  const failed = checks.filter((c) => !c.pass);
  const totalPoints = checks.reduce((a, c) => a + c.points, 0); // 100

  // Score color
  const scoreColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const scoreLabel =
    score >= 80 ? "Strong" : score >= 60 ? "Good" : "Needs Work";
  const scoreBg =
    score >= 80
      ? "bg-emerald-50 border-emerald-100"
      : score >= 60
      ? "bg-amber-50 border-amber-100"
      : "bg-red-50 border-red-100";
  const scoreText =
    score >= 80 ? "text-emerald-700" : score >= 60 ? "text-amber-700" : "text-red-600";

  // SVG circle
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-zinc-800 mb-5">ATS Score Analysis</h3>

      {/* ── Score ring ── */}
      <div className="flex items-center gap-5 mb-5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        {/* Circular progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
            {/* Background track */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="8"
            />
            {/* Progress arc */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          {/* Score number in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold leading-none"
              style={{ color: scoreColor }}
            >
              {score}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">/ 100</span>
          </div>
        </div>

        {/* Score details */}
        <div className="flex-1">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold mb-2",
              scoreBg,
              scoreText
            )}
          >
            <TrendingUp className="w-3 h-3" />
            {scoreLabel}
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {score < 60
              ? "Your resume needs significant improvements to pass ATS filters."
              : score < 80
              ? "Good progress! Fill in the missing sections to boost your score."
              : "Your resume is ATS-ready. You're in a strong position to apply!"}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1.5">
            {passed}/{checks.length} checks passed
          </p>
        </div>
      </div>

      {/* ── Score bar ── */}
      <div className="mb-5">
        <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>ATS Compatibility</span>
          <span className="font-semibold" style={{ color: scoreColor }}>
            {score}%
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${score}%`,
              backgroundColor: scoreColor,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>0</span>
          <span className="text-amber-500 font-medium">60 (Good)</span>
          <span className="text-emerald-500 font-medium">80 (Strong)</span>
          <span>100</span>
        </div>
      </div>

      {/* ── Checklist ── */}
      <div className="mb-5">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
          Checklist ({passed}/{checks.length})
        </p>
        <div className="space-y-2">
          {checks.map((check) => (
            <div
              key={check.id}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-xl transition-colors",
                check.pass ? "bg-emerald-50/50" : "bg-red-50/50"
              )}
            >
              {/* Pass/Fail icon */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  check.pass
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-500"
                )}
              >
                {check.pass ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </div>

              {/* Label and details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      check.pass ? "text-zinc-700" : "text-zinc-600"
                    )}
                  >
                    {check.label}
                  </p>
                  <span
                    className={cn(
                      "text-[10px] font-bold flex-shrink-0",
                      check.pass ? "text-emerald-600" : "text-zinc-400"
                    )}
                  >
                    +{check.points}pts
                  </span>
                </div>
                {/* Show fix tip only for failed checks */}
                {!check.pass && (
                  <p className="text-[11px] text-red-500 mt-0.5 leading-tight">
                    → {check.fix}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Failed items summary ── */}
      {failed.length > 0 && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <p className="text-xs font-bold text-amber-700">
              {failed.length} thing{failed.length > 1 ? "s" : ""} to fix
            </p>
          </div>
          <ul className="space-y-1">
            {failed.map((c) => (
              <li key={c.id} className="flex items-start gap-1.5 text-[11px] text-amber-700">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {c.fix}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Points breakdown ── */}
      <div className="mb-5">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
          Points Breakdown
        </p>
        <div className="space-y-1.5">
          {[
            { section: "Personal Info", max: 35, earned: checks.filter(c => ["fullName","email","phone","location","title"].includes(c.id) && c.pass).reduce((a,c) => a + c.points, 0) },
            { section: "Summary", max: 15, earned: checks.find(c => c.id === "summary")?.pass ? 15 : 0 },
            { section: "Experience", max: 25, earned: checks.filter(c => ["exp1","exp2"].includes(c.id) && c.pass).reduce((a,c) => a + c.points, 0) },
            { section: "Education", max: 10, earned: checks.find(c => c.id === "education")?.pass ? 10 : 0 },
            { section: "Skills", max: 15, earned: checks.filter(c => ["skills","skills3"].includes(c.id) && c.pass).reduce((a,c) => a + c.points, 0) },
          ].map((row) => (
            <div key={row.section} className="flex items-center gap-2">
              <p className="text-[11px] text-zinc-500 w-28 flex-shrink-0">{row.section}</p>
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${(row.earned / row.max) * 100}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-zinc-600 w-12 text-right flex-shrink-0">
                {row.earned}/{row.max}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pro tips (shown to pro users) ── */}
      {isPro ? (
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-brand-600" />
            <p className="text-xs font-bold text-brand-700">Pro ATS Tips</p>
          </div>
          <ul className="space-y-2">
            {[
              "Mirror exact keywords from the job description in your bullet points",
              "Use action verbs: Led, Built, Increased, Reduced, Engineered, Delivered",
              "Add quantifiable metrics — numbers, percentages, dollar amounts",
              "Keep resume to 1 page for under 10 years experience",
              "Avoid tables, graphics, and columns in Classic template for maximum ATS compatibility",
              "Use the job title from the posting as your Professional Title",
              "List skills exactly as they appear in job postings (React not ReactJS)",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-1.5 text-[11px] text-brand-700">
                <span className="text-brand-400 flex-shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* ── Pro upgrade prompt (shown to free users) ── */
        <div className="rounded-xl overflow-hidden border border-brand-100">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-white" />
              <p className="text-xs font-bold text-white">Pro: Full ATS Analysis</p>
            </div>
            <p className="text-[11px] text-white/80">
              Unlock keyword matching, industry-specific tips, and job tailoring AI.
            </p>
          </div>
          <div className="bg-brand-50 p-3">
            <ul className="space-y-1 mb-3">
              {[
                "7 expert ATS optimization tips",
                "Keyword matching against job descriptions",
                "AI job tailoring — paste any job posting",
                "Section-by-section scoring breakdown",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-[11px] text-brand-700">
                  <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className="block text-center py-2 px-4 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              Unlock Pro Features
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
