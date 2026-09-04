import { escapeLaTeX } from "../../services/latex/tex_utils.js";

const ACCENTS = {
  modern: "4F46E5",
  classic: "222222",
  executive: "1E3A5F",
  creative: "7C3AED",
  minimal: "374151",
  tech: "059669",
};

const text = (value) => escapeLaTeX(value || "");
const dateRange = (item) => [item.startDate, item.endDate || (item.current ? "Present" : "")]
  .filter(Boolean)
  .map(text)
  .join(" -- ");

function contactLine(personal) {
  return [personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.website]
    .filter(Boolean)
    .map(text)
    .join(" $\\cdot$ ");
}

function section(title, body, accent) {
  if (!body) return "";
  return `\\section*{\\color{accent}${text(title)}}\n${body}`;
}

function experience(items) {
  return (items || []).map((item) => `
\\textbf{${text(item.position)}}\\hfill{\\small ${dateRange(item)}}\\\\
{\\color{accent}\\textit{${text(item.company)}${item.location ? `, ${text(item.location)}` : ""}}}\\par
${(item.bullets || []).filter(Boolean).map((bullet) => `\\begin{itemize}\\item ${text(bullet)}\\end{itemize}`).join("\n")}`).join("\n");
}

function education(items) {
  return (items || []).map((item) => `
\\textbf{${text(item.institution)}}\\hfill{\\small ${text(item.endDate || item.startDate)}}\\\\
${text(item.degree)}${item.field ? `, ${text(item.field)}` : ""}${item.gpa ? `\\quad GPA: ${text(item.gpa)}` : ""}\\par`).join("\n");
}

function skills(items) {
  return (items || []).map((item) => `\\textbf{${text(item.category)}}${item.category ? ": " : ""}${text((item.items || []).join(", "))}\\par`).join("\n");
}

function projects(items) {
  return (items || []).map((item) => `\\textbf{${text(item.name)}}${item.technologies?.length ? `\\quad{\\small ${text(item.technologies.join(" | "))}}` : ""}\\par
${text(item.description)}\\par`).join("\n");
}

export function getTemplate(templateId = "modern") {
  return (content = {}, { isPro = true } = {}) => {
    const personal = content.personal || {};
    const accent = ACCENTS[templateId] || ACCENTS.modern;
    const sections = [
      section("Summary", content.summary && text(content.summary), accent),
      section("Experience", experience(content.experience), accent),
      section("Education", education(content.education), accent),
      section("Skills", skills(content.skills), accent),
      section("Projects", projects(content.projects), accent),
      section("Certifications", (content.certifications || []).map((item) => `${text(item.name)}${item.issuer ? ` -- ${text(item.issuer)}` : ""}${item.date ? ` (${text(item.date)})` : ""}\\par`).join("\n"), accent),
      section("Languages", (content.languages || []).map((item) => `${text(item.language)}${item.proficiency ? ` -- ${text(item.proficiency)}` : ""}\\par`).join("\n"), accent),
    ].filter(Boolean).join("\n");

    return `\\documentclass[10pt,a4paper]{article}
\\usepackage[margin=0.65in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\definecolor{accent}{HTML}{${accent}}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=1.2em, nosep}
\\begin{document}
\\begin{center}
{\\Huge\\bfseries ${text(personal.firstName || "Your")} ${text(personal.lastName || "Name")}}\\par
${personal.title ? `\\vspace{2pt}{\\large\\color{accent}${text(personal.title)}}\\par` : ""}
\\vspace{3pt}{\\small ${contactLine(personal)}}
\\end{center}
\\vspace{-4pt}\\hrule\\vspace{8pt}
${sections}
${!isPro ? "\\vfill\\begin{center}\\color{gray}\\scriptsize ResumeCraft Free\\end{center}" : ""}
\\end{document}
`;
  };
}