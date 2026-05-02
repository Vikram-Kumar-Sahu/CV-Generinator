export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function formatDateShort(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", year: "numeric",
  });
}

export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function calculateATSScore(content) {
  let score = 0;
  const p = content?.personal || {};
  if (p.firstName && p.lastName) score += 10;
  if (p.email) score += 10;
  if (p.phone) score += 5;
  if (p.location) score += 5;
  if (p.title) score += 5;
  if (content?.summary?.length >= 50) score += 15;
  if (content?.experience?.length >= 1) score += 20;
  if (content?.experience?.length >= 2) score += 5;
  if (content?.education?.length >= 1) score += 10;
  if (content?.skills?.length >= 1) score += 10;
  if (content?.skills?.length >= 3) score += 5;
  return Math.min(score, 100);
}

export function getPlanBadgeClass(plan) {
  if (plan === "pro" || plan === "enterprise") return "pro-badge";
  return "free-badge";
}

export function getRoleBadgeClass(role) {
  if (role === "admin") return "admin-badge";
  return "free-badge";
}

export const TEMPLATE_GRADIENTS = {
  modern: "from-brand-500 to-brand-700",
  classic: "from-gray-600 to-gray-900",
  executive: "from-slate-600 to-slate-900",
  creative: "from-purple-500 to-pink-600",
  minimal: "from-neutral-500 to-neutral-800",
  tech: "from-emerald-600 to-emerald-900",
};

export const DEFAULT_CONTENT = {
  personal: { firstName: "", lastName: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", title: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};
