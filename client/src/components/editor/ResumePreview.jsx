// ResumePreview.jsx
// Renders the live resume preview based on selected template and content.
// Watermark shown for free users. Pure default export — no extra exports.

export default function ResumePreview({ content, templateId, isPro }) {
  const p = content?.personal || {};

  const ACCENTS = {
    modern:    "#6470f3",
    classic:   "#1a1a1a",
    executive: "#1e3a5f",
    creative:  "#7c3aed",
    minimal:   "#171717",
    tech:      "#10b981",
  };
  const accent = ACCENTS[templateId] || ACCENTS.modern;

  // ── Shared helpers ──────────────────────────────────────────────────────────

  function ContactRow({ color = "#666", small = false }) {
    const size = small ? "8.5px" : "9px";
    const items = [
      p.email    && `✉ ${p.email}`,
      p.phone    && `📞 ${p.phone}`,
      p.location && `📍 ${p.location}`,
      p.linkedin && `🔗 ${p.linkedin}`,
      p.github   && `⬡ ${p.github}`,
      p.website  && `🌐 ${p.website}`,
    ].filter(Boolean);
    return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", fontSize:size, color, marginTop:"6px" }}>
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
    );
  }

  function SecTitle({ title, color }) {
    return (
      <h2 style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
        color: color || accent, borderBottom:`2px solid ${color || accent}`,
        paddingBottom:"3px", marginBottom:"8px", marginTop:"14px" }}>
        {title}
      </h2>
    );
  }

  function Bullet({ text, color }) {
    return (
      <p style={{ fontSize:"8.5px", paddingLeft:"12px", position:"relative",
        marginBottom:"2px", color:"#444", lineHeight:1.5 }}>
        <span style={{ position:"absolute", left:0, color: color || accent }}>▸</span>
        {text}
      </p>
    );
  }

  function WM() {
    return (
      <div style={{ position:"absolute", bottom:"20px", right:"20px", fontSize:"9px",
        color:"rgba(0,0,0,0.1)", fontWeight:600, letterSpacing:"0.1em",
        textTransform:"uppercase", transform:"rotate(-45deg)",
        pointerEvents:"none", zIndex:10 }}>
        ResumeCraft Free
      </div>
    );
  }

  // ── Modern ──────────────────────────────────────────────────────────────────
  if (templateId === "modern") return (
    <div style={{ fontFamily:"system-ui,sans-serif", color:"#1a1a2e", fontSize:"10px",
      lineHeight:1.5, padding:"36px", minHeight:"1123px", position:"relative" }}>
      {!isPro && <WM />}
      <div style={{ marginBottom:"18px", borderBottom:`3px solid ${accent}`, paddingBottom:"14px" }}>
        <h1 style={{ fontSize:"24px", fontWeight:700, letterSpacing:"-0.02em", margin:"0 0 2px" }}>
          {p.firstName||"Your"} {p.lastName||"Name"}
        </h1>
        {p.title && <p style={{ fontSize:"12px", color:accent, fontWeight:600, margin:0 }}>{p.title}</p>}
        <ContactRow />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"20px" }}>
        <div>
          {(content.skills||[]).length > 0 && <>
            <SecTitle title="Skills" />
            {content.skills.map(cat => (
              <div key={cat.id} style={{ marginBottom:"10px" }}>
                {cat.category && <p style={{ fontWeight:700, fontSize:"8.5px", color:"#333", marginBottom:"4px" }}>{cat.category}</p>}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"3px" }}>
                  {(cat.items||[]).map(s => (
                    <span key={s} style={{ fontSize:"7.5px", padding:"2px 6px", background:"#f0f4ff",
                      color:accent, borderRadius:"99px", border:`1px solid #c7d7fe` }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </>}
          {(content.education||[]).length > 0 && <>
            <SecTitle title="Education" />
            {content.education.map(edu => (
              <div key={edu.id} style={{ marginBottom:"10px" }}>
                <p style={{ fontWeight:700, fontSize:"9.5px" }}>{edu.institution}</p>
                <p style={{ fontSize:"9px", color:"#555" }}>{edu.degree}{edu.field&&` in ${edu.field}`}</p>
                <p style={{ fontSize:"8px", color:"#888" }}>{edu.startDate}{edu.endDate&&` – ${edu.endDate}`}</p>
                {edu.gpa && <p style={{ fontSize:"8px", color:"#888" }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </>}
          {(content.certifications||[]).length > 0 && <>
            <SecTitle title="Certifications" />
            {content.certifications.map(c => (
              <div key={c.id} style={{ marginBottom:"7px" }}>
                <p style={{ fontWeight:600, fontSize:"9px" }}>{c.name}</p>
                <p style={{ fontSize:"8px", color:"#888" }}>{c.issuer} · {c.date}</p>
              </div>
            ))}
          </>}
          {(content.languages||[]).length > 0 && <>
            <SecTitle title="Languages" />
            {content.languages.map(l => (
              <div key={l.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ fontSize:"9px", fontWeight:500 }}>{l.language}</span>
                <span style={{ fontSize:"8px", color:"#888" }}>{l.proficiency}</span>
              </div>
            ))}
          </>}
        </div>
        <div>
          {content.summary && <>
            <SecTitle title="Summary" />
            <p style={{ fontSize:"9.5px", color:"#444", lineHeight:1.7 }}>{content.summary}</p>
          </>}
          {(content.experience||[]).length > 0 && <>
            <SecTitle title="Experience" />
            {content.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom:"14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <p style={{ fontWeight:700, fontSize:"10.5px", color:"#1a1a2e" }}>{exp.position}</p>
                  <p style={{ fontSize:"8px", color:"#888", whiteSpace:"nowrap", marginLeft:"8px" }}>
                    {exp.startDate}{exp.endDate&&` – ${exp.endDate}`}
                  </p>
                </div>
                <p style={{ fontSize:"9.5px", color:accent, fontWeight:600, marginBottom:"5px" }}>
                  {exp.company}{exp.location&&` · ${exp.location}`}
                </p>
                {(exp.bullets||[]).map((b,i) => <Bullet key={i} text={b} />)}
              </div>
            ))}
          </>}
          {(content.projects||[]).length > 0 && <>
            <SecTitle title="Projects" />
            {content.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom:"10px" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <p style={{ fontWeight:700, fontSize:"10px" }}>{proj.name}</p>
                  {proj.url && <span style={{ fontSize:"8px", color:accent }}>↗ Live</span>}
                </div>
                {(proj.technologies||[]).length > 0 &&
                  <p style={{ fontSize:"8.5px", color:accent, marginBottom:"3px" }}>{proj.technologies.join(" · ")}</p>}
                <p style={{ fontSize:"9px", color:"#555", lineHeight:1.5 }}>{proj.description}</p>
              </div>
            ))}
          </>}
        </div>
      </div>
    </div>
  );

  // ── Classic ─────────────────────────────────────────────────────────────────
  if (templateId === "classic") return (
    <div style={{ fontFamily:"Georgia,serif", color:"#1a1a1a", fontSize:"10px",
      lineHeight:1.6, padding:"40px", minHeight:"1123px", position:"relative" }}>
      {!isPro && <WM />}
      <div style={{ textAlign:"center", borderBottom:"2px solid #1a1a1a", paddingBottom:"12px", marginBottom:"16px" }}>
        <h1 style={{ fontSize:"22px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", margin:"0 0 4px" }}>
          {p.firstName||"Your"} {p.lastName||"Name"}
        </h1>
        {p.title && <p style={{ fontSize:"11px", color:"#555", marginBottom:"6px" }}>{p.title}</p>}
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"10px", fontSize:"9px", color:"#666" }}>
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join("  |  ")}
        </div>
      </div>
      {content.summary && <>
        <h2 style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
          borderBottom:"1px solid #ccc", paddingBottom:"3px", marginBottom:"8px" }}>Professional Summary</h2>
        <p style={{ fontSize:"9.5px", lineHeight:1.7, marginBottom:"14px" }}>{content.summary}</p>
      </>}
      {(content.experience||[]).length > 0 && <>
        <h2 style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
          borderBottom:"1px solid #ccc", paddingBottom:"3px", marginBottom:"10px" }}>Professional Experience</h2>
        {content.experience.map(exp => (
          <div key={exp.id} style={{ marginBottom:"12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <strong style={{ fontSize:"10.5px" }}>{exp.position}</strong>
              <span style={{ fontSize:"8.5px", color:"#666" }}>{exp.startDate}{exp.endDate&&` – ${exp.endDate}`}</span>
            </div>
            <p style={{ fontSize:"9.5px", color:"#444", fontStyle:"italic", marginBottom:"4px" }}>
              {exp.company}{exp.location&&`, ${exp.location}`}
            </p>
            {(exp.bullets||[]).length > 0 &&
              <ul style={{ paddingLeft:"16px", margin:"4px 0 0" }}>
                {exp.bullets.map((b,i) => <li key={i} style={{ fontSize:"9px", marginBottom:"2px" }}>{b}</li>)}
              </ul>}
          </div>
        ))}
      </>}
      {(content.education||[]).length > 0 && <>
        <h2 style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
          borderBottom:"1px solid #ccc", paddingBottom:"3px", marginBottom:"10px", marginTop:"14px" }}>Education</h2>
        {content.education.map(edu => (
          <div key={edu.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <div>
              <strong style={{ fontSize:"10px" }}>{edu.institution}</strong>
              <p style={{ fontSize:"9.5px", color:"#555" }}>{edu.degree}{edu.field&&`, ${edu.field}`}{edu.gpa&&` · GPA: ${edu.gpa}`}</p>
            </div>
            <span style={{ fontSize:"9px", color:"#666", whiteSpace:"nowrap" }}>{edu.endDate}</span>
          </div>
        ))}
      </>}
      {(content.skills||[]).length > 0 && <>
        <h2 style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
          borderBottom:"1px solid #ccc", paddingBottom:"3px", marginBottom:"8px", marginTop:"14px" }}>Skills</h2>
        {content.skills.map(cat => (
          <p key={cat.id} style={{ fontSize:"9.5px", marginBottom:"4px" }}>
            {cat.category && <strong>{cat.category}: </strong>}{(cat.items||[]).join(", ")}
          </p>
        ))}
      </>}
    </div>
  );

  // ── Executive ───────────────────────────────────────────────────────────────
  if (templateId === "executive") return (
    <div style={{ fontFamily:"Georgia,serif", color:"#111", fontSize:"10px",
      lineHeight:1.5, minHeight:"1123px", position:"relative" }}>
      {!isPro && <WM />}
      <div style={{ background:"#1e3a5f", color:"white", padding:"32px 40px 24px" }}>
        <h1 style={{ fontSize:"26px", fontWeight:700, margin:"0 0 4px" }}>{p.firstName||"Your"} {p.lastName||"Name"}</h1>
        {p.title && <p style={{ fontSize:"13px", color:"#93c5fd", fontWeight:500, margin:"0 0 12px" }}>{p.title}</p>}
        <ContactRow color="#cbd5e1" small />
      </div>
      <div style={{ padding:"28px 40px" }}>
        {content.summary && (
          <div style={{ padding:"14px", background:"#f8fafc", border:"1px solid #e2e8f0",
            borderLeft:"4px solid #1e3a5f", borderRadius:"4px", marginBottom:"20px" }}>
            <p style={{ fontSize:"9.5px", lineHeight:1.7, color:"#334155" }}>{content.summary}</p>
          </div>
        )}
        {(content.experience||[]).length > 0 && <>
          <SecTitle title="Executive Experience" color="#1e3a5f" />
          {content.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom:"14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                <p style={{ fontWeight:700, fontSize:"11px", color:"#1e3a5f" }}>{exp.position}</p>
                <span style={{ fontSize:"8.5px", color:"#888" }}>{exp.startDate}{exp.endDate&&` – ${exp.endDate}`}</span>
              </div>
              <p style={{ fontSize:"9.5px", color:"#555", marginBottom:"5px", fontStyle:"italic" }}>
                {exp.company}{exp.location&&` · ${exp.location}`}
              </p>
              {(exp.bullets||[]).map((b,i) => (
                <p key={i} style={{ fontSize:"9px", paddingLeft:"14px", position:"relative", marginBottom:"3px", color:"#444" }}>
                  <span style={{ position:"absolute", left:0, color:"#1e3a5f" }}>◆</span>{b}
                </p>
              ))}
            </div>
          ))}
        </>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
          <div>
            {(content.education||[]).length > 0 && <>
              <SecTitle title="Education" color="#1e3a5f" />
              {content.education.map(edu => (
                <div key={edu.id} style={{ marginBottom:"10px" }}>
                  <p style={{ fontWeight:600, fontSize:"10px" }}>{edu.degree}{edu.field&&` in ${edu.field}`}</p>
                  <p style={{ fontSize:"9.5px", color:"#555" }}>{edu.institution}</p>
                  <p style={{ fontSize:"8.5px", color:"#888" }}>{edu.endDate}</p>
                </div>
              ))}
            </>}
          </div>
          <div>
            {(content.skills||[]).length > 0 && <>
              <SecTitle title="Core Competencies" color="#1e3a5f" />
              {content.skills.map(cat => (
                <div key={cat.id} style={{ marginBottom:"8px" }}>
                  {cat.category && <p style={{ fontWeight:600, fontSize:"8.5px", color:"#333" }}>{cat.category}</p>}
                  <p style={{ fontSize:"8.5px", color:"#555" }}>{(cat.items||[]).join(" · ")}</p>
                </div>
              ))}
            </>}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Creative ────────────────────────────────────────────────────────────────
  if (templateId === "creative") return (
    <div style={{ fontFamily:"system-ui,sans-serif", color:"#1a1a1a", fontSize:"10px",
      lineHeight:1.5, minHeight:"1123px", display:"grid", gridTemplateColumns:"220px 1fr", position:"relative" }}>
      {!isPro && <WM />}
      <div style={{ background:"#7c3aed", color:"white", padding:"32px 20px", minHeight:"100%" }}>
        <div style={{ width:"60px", height:"60px", borderRadius:"50%", background:"rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"22px", fontWeight:700, marginBottom:"12px", border:"3px solid rgba(255,255,255,0.4)" }}>
          {(p.firstName?.[0]||"?")}{p.lastName?.[0]||""}
        </div>
        <h1 style={{ fontSize:"16px", fontWeight:700, lineHeight:1.2, margin:"0 0 4px" }}>{p.firstName}<br />{p.lastName}</h1>
        {p.title && <p style={{ fontSize:"8.5px", color:"#ddd6fe", marginTop:"4px", marginBottom:"16px" }}>{p.title}</p>}
        <p style={{ fontSize:"7.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#ddd6fe", marginBottom:"8px" }}>Contact</p>
        {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map(item => (
          <p key={item} style={{ fontSize:"8px", color:"#f5f3ff", marginBottom:"4px", wordBreak:"break-all" }}>{item}</p>
        ))}
        {(content.skills||[]).length > 0 && <>
          <p style={{ fontSize:"7.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em",
            color:"#ddd6fe", marginTop:"16px", marginBottom:"8px" }}>Skills</p>
          {content.skills.map(cat => (
            <div key={cat.id} style={{ marginBottom:"8px" }}>
              {cat.category && <p style={{ fontSize:"7.5px", fontWeight:600, color:"#c4b5fd", marginBottom:"3px" }}>{cat.category}</p>}
              {(cat.items||[]).map(s => <p key={s} style={{ fontSize:"8px", color:"#f5f3ff", marginBottom:"2px" }}>• {s}</p>)}
            </div>
          ))}
        </>}
        {(content.languages||[]).length > 0 && <>
          <p style={{ fontSize:"7.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em",
            color:"#ddd6fe", marginTop:"16px", marginBottom:"8px" }}>Languages</p>
          {content.languages.map(l => (
            <div key={l.id} style={{ marginBottom:"4px" }}>
              <p style={{ fontSize:"8.5px", color:"#f5f3ff" }}>{l.language}</p>
              <p style={{ fontSize:"7.5px", color:"#c4b5fd" }}>{l.proficiency}</p>
            </div>
          ))}
        </>}
      </div>
      <div style={{ padding:"32px 28px" }}>
        {content.summary && <>
          <SecTitle title="About Me" color="#7c3aed" />
          <p style={{ fontSize:"9.5px", color:"#444", lineHeight:1.7 }}>{content.summary}</p>
        </>}
        {(content.experience||[]).length > 0 && <>
          <SecTitle title="Experience" color="#7c3aed" />
          {content.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom:"12px", paddingLeft:"10px", borderLeft:"3px solid #e9d5ff" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <p style={{ fontWeight:700, fontSize:"10px" }}>{exp.position}</p>
                <span style={{ fontSize:"8.5px", color:"#888" }}>{exp.startDate}{exp.endDate&&` – ${exp.endDate}`}</span>
              </div>
              <p style={{ fontSize:"9.5px", color:"#7c3aed", fontWeight:600, marginBottom:"4px" }}>{exp.company}</p>
              {(exp.bullets||[]).map((b,i) => (
                <p key={i} style={{ fontSize:"8.5px", color:"#555", marginBottom:"2px", paddingLeft:"8px", position:"relative" }}>
                  <span style={{ position:"absolute", left:0, color:"#7c3aed" }}>•</span>{b}
                </p>
              ))}
            </div>
          ))}
        </>}
        {(content.education||[]).length > 0 && <>
          <SecTitle title="Education" color="#7c3aed" />
          {content.education.map(edu => (
            <div key={edu.id} style={{ marginBottom:"8px" }}>
              <p style={{ fontWeight:600, fontSize:"10px" }}>{edu.degree}{edu.field&&` in ${edu.field}`}</p>
              <p style={{ fontSize:"9px", color:"#555" }}>{edu.institution} · {edu.endDate}</p>
            </div>
          ))}
        </>}
        {(content.projects||[]).length > 0 && <>
          <SecTitle title="Projects" color="#7c3aed" />
          {content.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom:"8px" }}>
              <p style={{ fontWeight:600, fontSize:"10px" }}>{proj.name}</p>
              <p style={{ fontSize:"8.5px", color:"#7c3aed", marginBottom:"2px" }}>{(proj.technologies||[]).join(" · ")}</p>
              <p style={{ fontSize:"8.5px", color:"#555" }}>{proj.description}</p>
            </div>
          ))}
        </>}
      </div>
    </div>
  );

  // ── Tech ────────────────────────────────────────────────────────────────────
  if (templateId === "tech") return (
    <div style={{ fontFamily:"'ui-monospace','Cascadia Code',monospace", color:"#0f172a",
      fontSize:"9.5px", lineHeight:1.6, padding:"36px", minHeight:"1123px",
      background:"#f0fdf4", position:"relative" }}>
      {!isPro && <WM />}
      <div style={{ background:"#064e3b", color:"#d1fae5", padding:"16px 20px", borderRadius:"8px", marginBottom:"20px" }}>
        <p style={{ fontSize:"8.5px", color:"#6ee7b7", marginBottom:"4px" }}>{"// resume.json"}</p>
        <h1 style={{ fontSize:"20px", fontWeight:700, color:"#ecfdf5", margin:"0 0 2px" }}>{p.firstName||"Your"} {p.lastName||"Name"}</h1>
        {p.title && <p style={{ fontSize:"10px", color:"#10b981" }}>&gt; {p.title}</p>}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", marginTop:"8px", fontSize:"8px", color:"#a7f3d0" }}>
          {[p.email&&`📧 ${p.email}`, p.phone&&`📱 ${p.phone}`, p.location&&`📍 ${p.location}`, p.github&&`⬡ ${p.github}`].filter(Boolean).map(i => <span key={i}>{i}</span>)}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 200px", gap:"20px" }}>
        <div>
          {content.summary && (
            <div style={{ padding:"12px", background:"white", border:"1px solid #a7f3d030", borderRadius:"6px", marginBottom:"16px" }}>
              <p style={{ fontSize:"7.5px", fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"5px" }}>{"// summary"}</p>
              <p style={{ fontSize:"9px", lineHeight:1.7, color:"#374151" }}>{content.summary}</p>
            </div>
          )}
          {(content.experience||[]).length > 0 && <>
            <p style={{ fontSize:"7.5px", fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px" }}>{"// experience"}</p>
            {content.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom:"12px", padding:"10px 12px", background:"white", borderRadius:"6px", borderLeft:"3px solid #10b981" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <p style={{ fontWeight:700, fontSize:"10px", color:"#064e3b" }}>{exp.position}</p>
                  <code style={{ fontSize:"8px", color:"#888", background:"#f0fdf4", padding:"1px 4px", borderRadius:"3px" }}>
                    {exp.startDate}{exp.endDate&&`→${exp.endDate}`}
                  </code>
                </div>
                <p style={{ fontSize:"9px", color:"#10b981", fontWeight:600, marginBottom:"4px" }}>{exp.company}</p>
                {(exp.bullets||[]).map((b,i) => (
                  <p key={i} style={{ fontSize:"8.5px", color:"#4b5563", marginBottom:"2px" }}>
                    <span style={{ color:"#10b981" }}>→ </span>{b}
                  </p>
                ))}
              </div>
            ))}
          </>}
          {(content.projects||[]).length > 0 && <>
            <p style={{ fontSize:"7.5px", fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px", marginTop:"14px" }}>{"// projects"}</p>
            {content.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom:"10px", padding:"10px 12px", background:"white", borderRadius:"6px", border:"1px solid #d1fae5" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <p style={{ fontWeight:700, fontSize:"10px" }}>{proj.name}</p>
                  {proj.github && <code style={{ fontSize:"8px", color:"#10b981" }}>github ↗</code>}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"3px", margin:"3px 0" }}>
                  {(proj.technologies||[]).map(t => (
                    <code key={t} style={{ fontSize:"7.5px", background:"#d1fae5", color:"#065f46", padding:"2px 5px", borderRadius:"3px" }}>{t}</code>
                  ))}
                </div>
                <p style={{ fontSize:"9px", color:"#555" }}>{proj.description}</p>
              </div>
            ))}
          </>}
        </div>
        <div>
          {(content.skills||[]).length > 0 && (
            <div style={{ padding:"12px", background:"white", borderRadius:"6px", border:"1px solid #d1fae5", marginBottom:"14px" }}>
              <p style={{ fontSize:"7.5px", fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px" }}>{"// skills"}</p>
              {content.skills.map(cat => (
                <div key={cat.id} style={{ marginBottom:"8px" }}>
                  {cat.category && <p style={{ fontSize:"7.5px", color:"#888", marginBottom:"3px" }}># {cat.category}</p>}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"3px" }}>
                    {(cat.items||[]).map(s => (
                      <code key={s} style={{ fontSize:"7.5px", background:"#d1fae5", color:"#065f46", padding:"2px 5px", borderRadius:"3px" }}>{s}</code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {(content.education||[]).length > 0 && (
            <div style={{ padding:"12px", background:"white", borderRadius:"6px", border:"1px solid #d1fae5" }}>
              <p style={{ fontSize:"7.5px", fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px" }}>{"// education"}</p>
              {content.education.map(edu => (
                <div key={edu.id} style={{ marginBottom:"8px" }}>
                  <p style={{ fontWeight:600, fontSize:"9px" }}>{edu.institution}</p>
                  <p style={{ fontSize:"8px", color:"#555" }}>{edu.degree}{edu.field&&`, ${edu.field}`}</p>
                  <code style={{ fontSize:"7.5px", color:"#888" }}>{edu.endDate}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── Minimal (default fallback) ──────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", color:"#171717", fontSize:"10px",
      lineHeight:1.6, padding:"48px", minHeight:"1123px", position:"relative" }}>
      {!isPro && <WM />}
      <div style={{ marginBottom:"24px" }}>
        <h1 style={{ fontSize:"28px", fontWeight:300, letterSpacing:"-0.03em", margin:"0 0 4px" }}>
          {p.firstName||"Your"} <strong style={{ fontWeight:700 }}>{p.lastName||"Name"}</strong>
        </h1>
        {p.title && <p style={{ fontSize:"11px", color:"#737373", letterSpacing:"0.05em" }}>{p.title}</p>}
        <ContactRow color="#737373" />
      </div>
      <div style={{ height:"1px", background:"#e5e5e5", marginBottom:"20px" }} />
      {content.summary && <p style={{ fontSize:"10px", color:"#404040", lineHeight:1.8, marginBottom:"20px", maxWidth:"540px" }}>{content.summary}</p>}
      {(content.experience||[]).length > 0 && <>
        <p style={{ fontSize:"8.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:"#a3a3a3", marginBottom:"12px" }}>Experience</p>
        {content.experience.map(exp => (
          <div key={exp.id} style={{ display:"grid", gridTemplateColumns:"110px 1fr", gap:"8px", marginBottom:"14px" }}>
            <p style={{ fontSize:"8px", color:"#a3a3a3", paddingTop:"1px", lineHeight:1.4 }}>{exp.startDate}{exp.endDate&&`\n– ${exp.endDate}`}</p>
            <div>
              <p style={{ fontWeight:600, fontSize:"10.5px" }}>{exp.position}</p>
              <p style={{ fontSize:"9.5px", color:"#737373", marginBottom:"4px" }}>{exp.company}</p>
              {(exp.bullets||[]).map((b,i) => <p key={i} style={{ fontSize:"9px", color:"#555", marginBottom:"2px" }}>— {b}</p>)}
            </div>
          </div>
        ))}
      </>}
      {(content.education||[]).length > 0 && <>
        <p style={{ fontSize:"8.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:"#a3a3a3", marginBottom:"12px", marginTop:"16px" }}>Education</p>
        {content.education.map(edu => (
          <div key={edu.id} style={{ display:"grid", gridTemplateColumns:"110px 1fr", gap:"8px", marginBottom:"10px" }}>
            <p style={{ fontSize:"8px", color:"#a3a3a3" }}>{edu.endDate}</p>
            <div>
              <p style={{ fontWeight:600, fontSize:"10px" }}>{edu.degree}{edu.field&&`, ${edu.field}`}</p>
              <p style={{ fontSize:"9.5px", color:"#737373" }}>{edu.institution}</p>
            </div>
          </div>
        ))}
      </>}
      {(content.skills||[]).length > 0 && <>
        <p style={{ fontSize:"8.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:"#a3a3a3", marginBottom:"12px", marginTop:"16px" }}>Skills</p>
        {content.skills.map(cat => (
          <div key={cat.id} style={{ display:"grid", gridTemplateColumns:"110px 1fr", gap:"8px", marginBottom:"6px" }}>
            <p style={{ fontSize:"8.5px", color:"#a3a3a3" }}>{cat.category}</p>
            <p style={{ fontSize:"9px", color:"#404040" }}>{(cat.items||[]).join(", ")}</p>
          </div>
        ))}
      </>}
    </div>
  );
}
