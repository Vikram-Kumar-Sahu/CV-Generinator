import { execFile } from "child_process";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function compileToPDF(latexString) {
  const jobId = randomUUID();
  const dir = join(tmpdir(), jobId);
  const texFile = join(dir, "resume.tex");
  const pdfFile = join(dir, "resume.pdf");

  await mkdir(dir, { recursive: true });
  await writeFile(texFile, latexString, "utf8");

  try {
    await execFileAsync("pdflatex", [
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-output-directory",
      dir,
      texFile,
    ], { maxBuffer: 10 * 1024 * 1024 });

    const pdfBuffer = await readFile(pdfFile);
    return pdfBuffer;
  } catch (err) {
    throw new Error(`LaTeX compilation failed: ${err.stderr || err.stdout || err.message}`);
  } finally {
    await rm(dir, { recursive: true, force: true }); // cleanup
  }
}