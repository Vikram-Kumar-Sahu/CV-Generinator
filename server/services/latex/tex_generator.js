import { getTemplate } from "../../templates/latex/index.js";

export function generateLatex(resumeDoc, options = {}) {
  const template = getTemplate(resumeDoc.templateId);
  return template(resumeDoc.content, options);
}