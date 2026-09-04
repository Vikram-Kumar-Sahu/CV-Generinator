// Escape LaTeX special characters before interpolating user content.
export function escapeLaTeX(str = "") {
  return String(str ?? "")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, (c) => `\\${c}`)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}