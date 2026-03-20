import {  SkillBar, SocialLink, CertCard, ProjectCard, FONTS } from "./PortfolioShared";

const initial = (name) => (name || "?")[0]?.toUpperCase() || "?";

function Avatar({ data, size = 80, shape = "circle" }) {
  const radius = shape === "square" ? "rounded-2xl" : shape === "squircle" ? "rounded-3xl" : "rounded-full";
  if (data.avatar) {
    return (
      <img src={data.avatar} alt={data.name}
        className={`${radius} object-cover shrink-0`}
        style={{ width: size, height: size }} />
    );
  }
  return (
    <div className={`${radius} flex items-center justify-center font-black text-white shrink-0`}
         style={{ width: size, height: size, background: `linear-gradient(135deg, ${data.accentColor || "#7c3aed"}, ${data.accentColor || "#7c3aed"}88)`, fontSize: size * 0.38 }}>
      {initial(data.name)}
    </div>
  );
}

function wrap(data) {
  return {
    d:    data,
    dark: !!data.darkMode,
    acc:  data.accentColor || "#7c3aed",
    bg:   data.darkMode ? "#0f172a" : (data.bgColor || "#ffffff"),
    font: FONTS[data.fontStyle] || FONTS.modern,
    anim: { hero: "fade", cards: "slide", skills: "grow", ...(data.animations || {}) },
    skills:  Array.isArray(data.skills)       ? data.skills       : [],
    projs:   Array.isArray(data.projects)     ? data.projects     : [],
    certs:   Array.isArray(data.certificates) ? data.certificates : [],
    exp:     Array.isArray(data.experience)   ? data.experience   : [],
    edu:     Array.isArray(data.education)    ? data.education    : [],
    socials: data.socials || {},
  };
}

/* ── Noise texture overlay ── */
const NoiseOverlay = ({ opacity = 0.03 }) => (
  <div className="pointer-events-none absolute inset-0" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
    opacity, mixBlendMode: "overlay"
  }} />
);

/* ── Dot grid pattern ── */
const DotGrid = ({ color = "#ffffff", opacity = 0.06 }) => (
  <div className="pointer-events-none absolute inset-0" style={{
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "28px 28px", opacity
  }} />
);

/* ── Diagonal lines ── */
const DiagLines = ({ color = "#ffffff", opacity = 0.04 }) => (
  <div className="pointer-events-none absolute inset-0" style={{
    backgroundImage: `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%)`,
    backgroundSize: "12px 12px", opacity
  }} />
);

export function MinimalTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);

  // ── Always dark ──
  const bg = "#0f172a";

  // ── Dark mode only ───────────────────────────────────────────────────────
  const tx      = "#f1f5f9";
  const sub     = "#94a3b8";
  const border  = "#334155";
  const cardBg  = "#1e293b";
  const tagBg   = `${acc}20`;

  return (
    <div style={{ background: bg, fontFamily: font, color: tx, minHeight: "100vh" }}>

      {/* Top accent line */}
      <div
        style={{
          height: "3px",
          background: `linear-gradient(90deg, ${acc}, ${acc}66, transparent)`,
        }}
      />

      <div className="max-w-[760px] mx-auto px-6 sm:px-10 py-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start gap-10 mb-20">
          <div className="relative shrink-0">
            <Avatar data={d} size={96} shape="square" />
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg"
              style={{ background: acc }}
            />
          </div>

          <div className="flex-1 pt-2">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: acc }}
            >
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-3"
                style={{ color: tx }}>
              {d.name || "Your Name"}
            </h1>
            <p className="text-lg font-medium mb-4" style={{ color: sub }}>
              {d.title}
            </p>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: sub }}>
              {d.bio}
            </p>

            {/* Contact row */}
            <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: sub }}>
              {d.location && <span>📍 {d.location}</span>}
              {d.email    && <span>✉ {d.email}</span>}
              {d.website  && (
                <a
                  href={d.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: acc }}
                >
                  {d.website}
                </a>
              )}
            </div>

            {/* Socials */}
            <div className="mt-4 flex gap-2">
              {Object.entries(socials)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <SocialLink key={k} type={k} url={v} accent={acc} />
                ))}
            </div>
          </div>
        </div>

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        {skills.length > 0 && (
          <section className="mb-16">
            <SectionHeader num="01" title="Skills" border={border} acc={acc} tx={tx} />
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-1">
              {skills.map((s, i) => (
                <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ─────────────────────────────────────────────────────── */}
        {projs.length > 0 && (
          <section className="mb-16">
            <SectionHeader num="02" title="Projects" border={border} acc={acc} tx={tx} />
            <div className="grid sm:grid-cols-2 gap-6">
              {projs.map((p, i) => (
                <a
                  key={i}
                  href={p.url || "#"}
                  target={p.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group block rounded-2xl p-4 transition-all duration-200"
                  style={{
                    background: cardBg,
                    border: `1px solid ${border}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = acc;
                    e.currentTarget.style.background = "#253347";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.background = cardBg;
                  }}
                >
                  {p.image && (
                    <div className="h-40 rounded-xl overflow-hidden mb-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-sm" style={{ color: tx }}>
                        {p.featured && <span className="text-yellow-500 mr-1">★</span>}
                        {p.title}
                      </p>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: sub }}>
                        {p.desc}
                      </p>
                    </div>
                    <span
                      className="text-lg shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      style={{ color: acc }}
                    >
                      ↗
                    </span>
                  </div>
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map((t, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
                          style={{ background: tagBg, color: acc }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Experience ───────────────────────────────────────────────────── */}
        {exp.length > 0 && (
          <section className="mb-16">
            <SectionHeader num="03" title="Experience" border={border} acc={acc} tx={tx} />
            <div className="space-y-8">
              {exp.map((e, i) => (
                <div
                  key={i}
                  className="grid sm:grid-cols-[140px_1fr] gap-4 p-4 rounded-2xl"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wide pt-1"
                    style={{ color: sub }}
                  >
                    {e.from}–{e.to || "Now"}
                  </p>
                  <div>
                    <p className="font-black" style={{ color: tx }}>{e.role}</p>
                    <p className="text-sm font-semibold mb-2" style={{ color: acc }}>
                      {e.company}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: sub }}>
                      {e.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Certificates ─────────────────────────────────────────────────── */}
        {certs.length > 0 && (
          <section className="mb-16">
            <SectionHeader num="04" title="Certificates" border={border} acc={acc} tx={tx} />
            <div className="grid sm:grid-cols-2 gap-4">
              {certs.map((c, i) => (
                <CertCard key={i} cert={c} accent={acc} dark={true} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

/* ── Section header helper ───────────────────────────────────────────────── */
function SectionHeader({ num, title, border, acc, tx }) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span
        className="text-[11px] font-bold tabular-nums shrink-0"
        style={{ color: acc }}
      >
        {num}
      </span>
      <h2
        className="text-2xl font-black tracking-tight shrink-0"
        style={{ color: tx }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ background: border }} />
    </div>
  );
}


export function CreativeTemplate({ data }) {
  const { d, dark, acc, bg, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const tx = dark ? "#f8fafc" : "#0f0f0f";
  const sub = dark ? "#94a3b8" : "#6b7280";

  return (
    <div style={{ background: dark ? "#0a0a0f" : "#fafafa", fontFamily: font, color: tx, minHeight: "100vh" }}>

      {/* Full-bleed hero */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, #0a0a0f 0%, ${acc}30 50%, #0a0a0f 100%)`, minHeight: 420 }}>
        <NoiseOverlay opacity={0.06} />
        <DotGrid color={acc} opacity={0.08} />

        {/* Massive background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[200px] font-black leading-none select-none"
                style={{ color: `${acc}08`, letterSpacing: "-0.05em" }}>
            {initial(d.name)}
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-8 py-16 flex flex-col sm:flex-row items-end gap-8">
          <div className="flex-1">
            <p className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border"
               style={{ color: acc, borderColor: `${acc}40`, background: `${acc}10` }}>
              {d.title || "Portfolio"}
            </p>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tighter text-white">
              {(d.name || "Your Name").split(" ").map((w, i) => (
                <span key={i} className="block">{w}</span>
              ))}
            </h1>
            <p className="mt-6 text-white/60 text-sm leading-relaxed max-w-md">{d.bio}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
            </div>
          </div>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-3xl blur-2xl scale-110" style={{ background: `${acc}40` }} />
            <Avatar data={d} size={160} shape="squircle" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16 space-y-16">

        {skills.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: acc }}>✦</div>
              <h2 className="text-3xl font-black tracking-tight">What I Do</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {skills.map((s,i) => (
                <div key={i} className="p-4 rounded-2xl border transition-all hover:border-current"
                     style={{ background: dark ? "#111118" : "#fff", borderColor: dark ? "#1e1e2e" : "#e5e7eb" }}>
                  <SkillBar skill={s} animType={anim.skills} dark={dark} />
                </div>
              ))}
            </div>
          </section>
        )}

        {projs.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: acc }}>◆</div>
              <h2 className="text-3xl font-black tracking-tight">Selected Work</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projs.map((p,i) => (
                <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                   className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                   style={{ background: dark ? "#111118" : "#fff", borderColor: dark ? "#1e1e2e" : "#e5e7eb",
                            boxShadow: `0 0 0 0 ${acc}00` }}
                   onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 40px ${acc}30`}
                   onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  {p.image ? (
                    <div className="h-44 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center" style={{ background: `${acc}15` }}>
                      <span className="text-4xl font-black opacity-30" style={{ color: acc }}>{"{}"}</span>
                    </div>
                  )}
                  <div className="p-5">
                    {p.featured && <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: `${acc}20`, color: acc }}>★ Featured</span>}
                    <p className="font-black text-sm">{p.title}</p>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: sub }}>{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.tags.map((t,j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${acc}15`, color: acc }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white font-bold" style={{ background: acc }}>↗</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {exp.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: acc }}>▸</div>
              <h2 className="text-3xl font-black tracking-tight">Experience</h2>
            </div>
            <div className="space-y-4">
              {exp.map((e,i) => (
                <div key={i} className="group p-6 rounded-2xl border transition-all cursor-default hover:border-current"
                     style={{ background: dark ? "#111118" : "#fff", borderColor: dark ? "#1e1e2e" : "#e5e7eb" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <p className="font-black text-lg">{e.role}</p>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${acc}15`, color: acc }}>{e.from}–{e.to||"Now"}</span>
                  </div>
                  <p className="font-semibold text-sm mb-2" style={{ color: acc }}>{e.company}</p>
                  <p className="text-sm leading-relaxed" style={{ color: sub }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {certs.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: acc }}>✓</div>
              <h2 className="text-3xl font-black tracking-tight">Certificates</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   3. DEVELOPER — Next-gen terminal with glowing UI
═══════════════════════════════════════════════════════════════ */
export function DeveloperTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const glow = `0 0 40px ${acc}30`;

  return (
    <div style={{ background: "#060a10", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: "#c9d1d9", minHeight: "100vh" }}>

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)"
      }} />

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${acc}08 1px, transparent 1px), linear-gradient(90deg, ${acc}08 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      {/* Header bar */}
      <div className="relative z-10 flex items-center gap-3 px-6 py-3 border-b" style={{ borderColor: `${acc}20`, background: "#060a10" }}>
        <div className="flex gap-1.5">
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}80` }} />)}
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md text-xs border" style={{ borderColor: `${acc}20`, background: `${acc}08`, color: acc }}>
            ~/portfolio/{d.name?.toLowerCase().replace(/\s+/g,"-") || "user"} — bash
          </div>
        </div>
        <div className="text-xs" style={{ color: `${acc}60` }}>v2.0.0</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Whoami block */}
        <div className="mb-12">
          <p className="text-xs mb-2" style={{ color: `${acc}80` }}>$ <span style={{ color: acc }}>whoami</span> --verbose</p>
          <div className="p-6 rounded-2xl border" style={{ background: "#0d1117", borderColor: `${acc}20`, boxShadow: glow }}>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0">
                <Avatar data={{ ...d, darkMode: true }} size={100} shape="squircle" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#060a10]" style={{ background: "#28c840", boxShadow: "0 0 8px #28c84080" }} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black mb-1" style={{ color: acc, textShadow: `0 0 30px ${acc}50` }}>{d.name || "Your Name"}</h1>
                <p className="text-base mb-3 opacity-70">// {d.title}</p>
                <p className="text-sm leading-relaxed opacity-60 border-l-2 pl-3 mb-4" style={{ borderColor: acc }}>{d.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {d.location && <span className="text-xs px-2 py-1 rounded border" style={{ borderColor: `${acc}30`, color: `${acc}90` }}>📍 {d.location}</span>}
                  {d.email    && <span className="text-xs px-2 py-1 rounded border" style={{ borderColor: `${acc}30`, color: `${acc}90` }}>✉ {d.email}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                       className="px-3 py-1 rounded-lg text-xs font-bold border transition-all hover:scale-105 hover:shadow-lg"
                       style={{ borderColor: `${acc}40`, color: acc }}
                       onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 12px ${acc}50`}
                       onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                      {k}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-12">
            <p className="text-xs mb-4" style={{ color: `${acc}80` }}>$ <span style={{ color: acc }}>ls</span> ./skills/ <span className="opacity-40">--sort=proficiency</span></p>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => (
                <div key={i} className="p-4 rounded-xl border transition-all" style={{ background: "#0d1117", borderColor: `${acc}15` }}>
                  <SkillBar skill={s} animType={anim.skills} dark={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div className="mb-12">
            <p className="text-xs mb-4" style={{ color: `${acc}80` }}>$ <span style={{ color: acc }}>git</span> log --oneline --graph</p>
            <div className="space-y-3">
              {projs.map((p,i) => (
                <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                   className="group flex gap-4 p-4 rounded-xl border transition-all hover:-translate-y-0.5"
                   style={{ background: "#0d1117", borderColor: `${acc}15` }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = acc; e.currentTarget.style.boxShadow = `0 0 20px ${acc}20`; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = `${acc}15`; e.currentTarget.style.boxShadow = "none"; }}>
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <span style={{ color: acc }} className="text-base">◆</span>
                    <div className="w-px flex-1 opacity-20" style={{ background: acc }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-white">{p.featured && <span style={{ color: acc }}>★ </span>}{p.title}</p>
                      <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: acc }}>↗</span>
                    </div>
                    <p className="text-xs opacity-60 mt-0.5 line-clamp-2">{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((t,j) => <span key={j} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${acc}15`, color: acc }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  {p.image && <img src={p.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0 border opacity-70 group-hover:opacity-100 transition-opacity" style={{ borderColor: `${acc}30` }} />}
                </a>
              ))}
            </div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="mb-12">
            <p className="text-xs mb-4" style={{ color: `${acc}80` }}>$ <span style={{ color: acc }}>cat</span> experience.log</p>
            {exp.map((e,i) => (
              <div key={i} className="mb-4 p-4 rounded-xl border" style={{ background: "#0d1117", borderColor: `${acc}15` }}>
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold" style={{ color: acc }}>{e.role}</p>
                  <code className="text-xs opacity-50">{e.from}–{e.to||"now"}</code>
                </div>
                <p className="text-sm opacity-70 mb-2">{e.company}</p>
                <p className="text-xs opacity-50 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        )}

        {certs.length > 0 && (
          <div className="mb-12">
            <p className="text-xs mb-4" style={{ color: `${acc}80` }}>$ <span style={{ color: acc }}>ls</span> ./certifications/</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
            </div>
          </div>
        )}

        <p className="text-xs opacity-20">$ echo "Built with CareerPatch" &amp;&amp; exit 0</p>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   4. GLASS — Liquid crystal morphism
═══════════════════════════════════════════════════════════════ */
export function GlassTemplate({ data }) {
  const { d, dark, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const bg1 = dark ? "#060d1f" : "#e8f0ff";
  const bg2 = dark ? "#0a0a1a" : "#f0e8ff";
  const glassBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.55)";
  const glassBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.9)";
  const tx = dark ? "#f1f5f9" : "#0f172a";

  return (
    <div style={{ background: `linear-gradient(135deg, ${bg1} 0%, ${acc}15 50%, ${bg2} 100%)`, fontFamily: font, color: tx, minHeight: "100vh" }}>

      {/* Ambient orbs */}
      {[
        { size: 500, top: "-10%", left: "-10%", delay: 0 },
        { size: 400, top: "40%", right: "-5%", delay: 2 },
        { size: 300, bottom: "10%", left: "30%", delay: 4 },
      ].map((orb, i) => (
        <div key={i} className="fixed rounded-full pointer-events-none blur-[100px]"
             style={{ width: orb.size, height: orb.size, background: acc, opacity: dark ? 0.08 : 0.12,
                      top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
                      animation: `pulse ${6+i*2}s ease-in-out infinite`, animationDelay: `${orb.delay}s` }} />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 space-y-6">

        {/* Hero card */}
        <div className="rounded-3xl p-8 sm:p-10 backdrop-blur-2xl border shadow-2xl"
             style={{ background: glassBg, borderColor: glassBorder, boxShadow: `0 40px 80px ${acc}15` }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full blur-xl scale-110" style={{ background: acc, opacity: 0.3 }} />
              <Avatar data={d} size={120} shape="circle" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: acc }}>{d.title}</p>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3">{d.name || "Your Name"}</h1>
              <p className="text-sm leading-relaxed max-w-md opacity-75 mb-5">{d.bio}</p>
              <div className="flex flex-wrap gap-3 text-xs opacity-60 mb-4 justify-center sm:justify-start">
                {d.location && <span>📍 {d.location}</span>}
                {d.email    && <span>✉ {d.email}</span>}
              </div>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
              </div>
            </div>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="rounded-3xl p-8 backdrop-blur-2xl border shadow-xl"
               style={{ background: glassBg, borderColor: glassBorder }}>
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: acc }}>⚡</span>
              Skills
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div>
            <h2 className="text-xl font-black mb-4 px-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: acc }}>🚀</span>
              Projects
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projs.map((p,i) => (
                <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                   className="group rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                   style={{ background: glassBg, borderColor: glassBorder }}>
                  {p.image ? (
                    <div className="h-40 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center" style={{ background: `${acc}15` }}>
                      <span className="text-4xl font-black opacity-40" style={{ color: acc }}>{"{}"}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-black text-sm">{p.title}</p>
                    <p className="text-xs mt-1 opacity-60 line-clamp-2">{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((t,j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${acc}20`, color: acc }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="rounded-3xl p-8 backdrop-blur-2xl border"
               style={{ background: glassBg, borderColor: glassBorder }}>
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs" style={{ background: acc }}>💼</span>
              Experience
            </h2>
            {exp.map((e,i) => (
              <div key={i} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5" style={{ background: acc, boxShadow: `0 0 8px ${acc}` }} />
                  {i < exp.length - 1 && <div className="w-px flex-1 opacity-20" style={{ background: acc }} />}
                </div>
                <div className="pb-4">
                  <p className="font-black">{e.role}</p>
                  <p className="text-sm font-semibold mb-1" style={{ color: acc }}>{e.company}</p>
                  <p className="text-xs opacity-50 mb-2">{e.from}–{e.to||"Present"}</p>
                  <p className="text-sm opacity-70">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {certs.length > 0 && (
          <div>
            <h2 className="text-xl font-black mb-4 px-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs" style={{ background: acc }}>🏆</span>
              Certificates
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </div>
        )}

        <p className="text-center text-xs opacity-20 py-4">Made with CareerPatch</p>
      </div>
    </div>
  );
}


export function SidebarTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, edu, socials } = wrap(data);

  // ── Always dark ──
  const mainBg = "#0a0f1a";
  const tx     = "#e2e8f0";
  const border = "#1e293b";
  const cardBg = "#111827";

  return (
    <div style={{ background: mainBg, fontFamily: font, minHeight: "100vh" }}>
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Sidebar */}
        <div className="lg:w-80 relative flex flex-col" style={{ background: "#111827" }}>
          <NoiseOverlay opacity={0.04} />
          <DiagLines color="#ffffff" opacity={0.03} />

          <div className="relative z-10 p-8 flex flex-col gap-8 text-white">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full blur-xl scale-125" style={{ background: "rgba(255,255,255,0.2)" }} />
                <Avatar data={{ ...d, accentColor: "#fff" }} size={110} shape="squircle" />
              </div>
              <h1 className="text-2xl font-black leading-tight">{d.name || "Your Name"}</h1>
              <p className="text-sm mt-1.5 opacity-70 font-medium">{d.title}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs opacity-60">
                {d.location && <span>📍 {d.location}</span>}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">Contact</p>
              {d.email   && <p className="text-xs opacity-80 flex items-center gap-2"><span>✉</span>{d.email}</p>}
              {d.website && <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs opacity-80 flex items-center gap-2 hover:opacity-100"><span>🌐</span>{d.website}</a>}
            </div>

            {/* Social */}
            {Object.entries(socials).some(([,v])=>v) && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">Socials</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent="#fff" />)}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-4">Skills</p>
                {skills.map((s,i) => <SkillBar key={i} skill={{ ...s, color: "#ffffff" }} animType={anim.skills} dark={true} />)}
              </div>
            )}

            {/* Education */}
            {edu.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">Education</p>
                {edu.map((e,i) => (
                  <div key={i} className="mb-4 bg-white/10 rounded-xl p-3">
                    <p className="text-sm font-bold">{e.degree}</p>
                    <p className="text-xs opacity-70 mt-0.5">{e.school}</p>
                    <p className="text-xs opacity-50">{e.from}–{e.to||"Present"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8 lg:p-12" style={{ color: tx }}>

          {/* Bio */}
          <div className="mb-12">
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="text-2xl font-black">About</h2>
              <div className="flex-1 h-px" style={{ background: border }} />
            </div>
            <p className="text-base leading-relaxed opacity-75 max-w-2xl">{d.bio}</p>
          </div>

          {exp.length > 0 && (
            <div className="mb-12">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-2xl font-black">Experience</h2>
                <div className="flex-1 h-px" style={{ background: border }} />
              </div>
              <div className="space-y-5">
                {exp.map((e,i) => (
                  <div key={i} className="group flex gap-5 p-5 rounded-2xl transition-all hover:shadow-lg"
                       style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <p className="font-black">{e.role}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: `${acc}15`, color: acc }}>
                          {e.from}–{e.to||"Now"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: acc }}>{e.company}</p>
                      <p className="text-sm opacity-60 mt-1">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projs.length > 0 && (
            <div className="mb-12">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-2xl font-black">Projects</h2>
                <div className="flex-1 h-px" style={{ background: border }} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={true} animType={anim.cards} />)}
              </div>
            </div>
          )}

          {certs.length > 0 && (
            <div>
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-2xl font-black">Certificates</h2>
                <div className="flex-1 h-px" style={{ background: border }} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


export function NeonTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const neon = acc;
  const glow = (color, size = 20) => `0 0 ${size}px ${color}`;

  return (
    <div style={{ background: "#020408", fontFamily: font, color: "#e2e8f0", minHeight: "100vh" }}>

      {/* Neon grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${neon}12 1px, transparent 1px), linear-gradient(90deg, ${neon}12 1px, transparent 1px)`,
        backgroundSize: "50px 50px"
      }} />

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none" style={{
        background: `radial-gradient(circle at 0 0, ${neon}20, transparent 70%)`
      }} />
      <div className="fixed bottom-0 right-0 w-40 h-40 pointer-events-none" style={{
        background: `radial-gradient(circle at 100% 100%, ${neon}15, transparent 70%)`
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 rounded-full blur-2xl scale-150" style={{ background: neon, opacity: 0.2 }} />
            <div className="relative w-32 h-32 rounded-full mx-auto border-2" style={{ borderColor: neon, boxShadow: `${glow(neon, 30)}, inset ${glow(neon, 10)}` }}>
              <Avatar data={{ ...d, darkMode: true }} size={128} shape="circle" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-3 leading-none tracking-tighter"
              style={{ color: neon, textShadow: `${glow(neon, 20)}, ${glow(neon, 60)}, ${glow(neon, 100)}` }}>
            {d.name || "YOUR NAME"}
          </h1>

          <div className="inline-block px-5 py-2 border text-sm font-bold tracking-widest uppercase mb-5"
               style={{ borderColor: neon, color: neon, boxShadow: `${glow(neon)}, inset ${glow(neon, 5)}` }}>
            {d.title || "DEVELOPER"}
          </div>

          <p className="max-w-lg mx-auto text-sm opacity-50 leading-relaxed mb-6">{d.bio}</p>

          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {d.location && <span className="px-3 py-1 text-xs border" style={{ borderColor: `${neon}40`, color: `${neon}90` }}>📍 {d.location}</span>}
            {d.email    && <span className="px-3 py-1 text-xs border" style={{ borderColor: `${neon}40`, color: `${neon}90` }}>✉ {d.email}</span>}
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                 className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all"
                 style={{ borderColor: `${neon}50`, color: neon }}
                 onMouseEnter={e => { e.currentTarget.style.background = `${neon}20`; e.currentTarget.style.boxShadow = glow(neon); }}
                 onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
                {k}
              </a>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <section className="mb-14">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3"
                style={{ color: neon }}>
              <span style={{ textShadow: glow(neon) }}>// SKILLS.EXE</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${neon}40, transparent)` }} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => (
                <div key={i} className="p-4 rounded-xl border" style={{ background: "#060d16", borderColor: `${neon}20` }}>
                  <SkillBar skill={s} animType={anim.skills} dark={true} />
                </div>
              ))}
            </div>
          </section>
        )}

        {projs.length > 0 && (
          <section className="mb-14">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3"
                style={{ color: neon }}>
              <span style={{ textShadow: glow(neon) }}>// PROJECTS.DB</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${neon}40, transparent)` }} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {projs.map((p,i) => (
                <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                   className="group block rounded-xl border overflow-hidden transition-all"
                   style={{ background: "#060d16", borderColor: `${neon}25` }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = neon; e.currentTarget.style.boxShadow = glow(neon, 25); }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = `${neon}25`; e.currentTarget.style.boxShadow = "none"; }}>
                  {p.image && <img src={p.image} alt="" className="w-full h-36 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />}
                  <div className="p-5">
                    <p className="font-black" style={{ color: neon, textShadow: glow(neon, 8) }}>{p.title}</p>
                    <p className="text-xs opacity-50 mt-1 line-clamp-2">{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.tags.map((t,j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded border font-bold" style={{ borderColor: `${neon}30`, color: neon }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {exp.length > 0 && (
          <section className="mb-14">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3"
                style={{ color: neon }}>
              <span style={{ textShadow: glow(neon) }}>// EXPERIENCE.LOG</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${neon}40, transparent)` }} />
            </h2>
            {exp.map((e,i) => (
              <div key={i} className="mb-4 p-5 rounded-xl border" style={{ background: "#060d16", borderColor: `${neon}20` }}>
                <p className="font-black" style={{ color: neon }}>{e.role} <span className="opacity-50">@</span> {e.company}</p>
                <p className="text-xs opacity-40 mt-0.5 mb-2">{e.from}–{e.to||"Present"}</p>
                <p className="text-sm opacity-55">{e.desc}</p>
              </div>
            ))}
          </section>
        )}

        {certs.length > 0 && (
          <section className="mb-14">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3"
                style={{ color: neon }}>
              <span style={{ textShadow: glow(neon) }}>// CERTS.JSON</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${neon}40, transparent)` }} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={neon} dark={true} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


export function MagazineTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);

  // ── Always dark ──
  const bg      = "#0c0c0e";
  const tx      = "#f5f5f0";
  const sub     = "#8a8a7a";
  const divider = "#2a2a2a";

  return (
    <div style={{ background: bg, fontFamily: "'Playfair Display', Georgia, serif", color: tx, minHeight: "100vh" }}>

      {/* Masthead */}
      <div className="border-b-[3px] px-8 py-6" style={{ borderColor: acc }}>
        <div className="max-w-6xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 font-sans" style={{ color: acc }}>Portfolio Edition</p>
            <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tight">{d.name || "Your Name"}</h1>
            <p className="text-xl mt-2 italic" style={{ color: acc }}>{d.title}</p>
          </div>
          <div className="relative shrink-0">
            <Avatar data={d} size={100} shape="squircle" />
            <div className="absolute -bottom-1 -left-1 w-full h-1" style={{ background: acc }} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Bio strip */}
        <div className="grid md:grid-cols-3 gap-8 pb-10 mb-10" style={{ borderBottom: `1px solid ${divider}` }}>
          <div className="md:col-span-2">
            <p className="text-xl leading-relaxed italic opacity-80 mb-4">{d.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm font-sans" style={{ color: sub }}>
              {d.location && <span>📍 {d.location}</span>}
              {d.email    && <span>✉ {d.email}</span>}
              {d.website  && <a href={d.website} target="_blank" rel="noopener noreferrer" className="font-bold" style={{ color: acc }}>🌐 Website ↗</a>}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 font-sans" style={{ color: sub }}>Connect</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
            </div>
          </div>
        </div>

        {/* Two-column editorial layout */}
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-12">

            {skills.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-sans flex items-center gap-3" style={{ color: acc }}>
                  Skills <span className="flex-1 h-px" style={{ background: divider }} />
                </p>
                {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
              </div>
            )}

            {exp.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-sans flex items-center gap-3" style={{ color: acc }}>
                  Experience <span className="flex-1 h-px" style={{ background: divider }} />
                </p>
                {exp.map((e,i) => (
                  <div key={i} className="mb-7 pl-4" style={{ borderLeft: `3px solid ${acc}` }}>
                    <p className="font-black text-lg leading-tight">{e.role}</p>
                    <p className="italic text-sm mt-1 mb-1" style={{ color: acc }}>{e.company}</p>
                    <p className="text-xs font-sans mb-2" style={{ color: sub }}>{e.from}–{e.to||"Present"}</p>
                    <p className="text-sm leading-relaxed opacity-70">{e.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-1 hidden md:block" style={{ borderLeft: `1px solid ${divider}` }} />

          <div className="md:col-span-6 space-y-12">
            {projs.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-sans flex items-center gap-3" style={{ color: acc }}>
                  Projects <span className="flex-1 h-px" style={{ background: divider }} />
                </p>
                <div className="space-y-6">
                  {projs.map((p,i) => (
                    <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                       className="group block pb-6" style={{ borderBottom: `1px solid ${divider}` }}>
                      {p.image && (
                        <div className="h-40 rounded-xl overflow-hidden mb-4">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-black text-xl leading-tight">{p.featured && <span style={{ color: acc }}>★ </span>}{p.title}</p>
                          <p className="text-sm italic mt-1 leading-relaxed opacity-70">{p.desc}</p>
                        </div>
                        <span className="text-2xl opacity-0 group-hover:opacity-100 transition-all" style={{ color: acc }}>↗</span>
                      </div>
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {p.tags.map((t,j) => <span key={j} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded font-sans" style={{ background: `${acc}20`, color: acc }}>{t}</span>)}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {certs.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-sans flex items-center gap-3" style={{ color: acc }}>
                  Certificates <span className="flex-1 h-px" style={{ background: divider }} />
                </p>
                <div className="grid gap-3">
                  {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t mt-16 py-6 text-center text-xs font-sans" style={{ borderColor: divider, color: sub }}>
        Made with CareerPatch
      </div>
    </div>
  );
}


export function CardTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);

  // Dark mode only
  const gridBg = "#0a0f1a";
  const cardBg = "#111827";
  const cardBorder = "#1e293b";
  const tx = "#e2e8f0";

  const Card = ({ children, className = "", style = {} }) => (
    <div
      className={`rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
      style={{ background: cardBg, borderColor: cardBorder, color: tx, ...style }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ background: gridBg, fontFamily: font, color: tx, minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-5 py-12">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="col-span-2 row-span-1">
            <NoiseOverlay opacity={0.05} />
            <div className="relative z-10 p-7 flex flex-col h-full min-h-[200px] justify-between">
              <Avatar data={{ ...d, accentColor: "#fff" }} size={72} shape="squircle" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                  {d.name || "Your Name"}
                </h1>
                <p className="text-sm mt-1 opacity-75 font-medium">{d.title}</p>
              </div>
            </div>
          </Card>

          {/* Bio card */}
          <Card className="col-span-1">
            <div className="p-5 h-full flex flex-col">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-3">About</p>
              <p className="text-xs leading-relaxed opacity-70 flex-1 line-clamp-6">{d.bio}</p>
            </div>
          </Card>

          {/* Connect card */}
          <Card className="col-span-1">
            <div className="p-5 h-full flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Connect</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(socials)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <SocialLink key={k} type={k} url={v} accent={acc} />
                  ))}
              </div>
              {d.location && <p className="text-xs opacity-50 mt-auto">📍 {d.location}</p>}
              {d.email && <p className="text-xs opacity-50">✉ {d.email}</p>}
            </div>
          </Card>
        </div>

        {/* Skills bento card */}
        {skills.length > 0 && (
          <Card className="mb-4">
            <div className="p-7">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-black text-lg">Skills</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {skills.map((s, i) => (
                  <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Projects grid */}
        {projs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <h2 className="font-black text-lg">Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projs.map((p, i) => (
                <Card key={i} className="group cursor-pointer hover:-translate-y-1.5">
                  {p.image ? (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center" style={{ background: `${acc}10` }}>
                      <span className="text-3xl opacity-30" style={{ color: acc }}>
                        {"{}"}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    {p.featured && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5"
                        style={{ background: `${acc}15`, color: acc }}
                      >
                        ★ Featured
                      </span>
                    )}
                    <p className="font-black text-sm">{p.title}</p>
                    <p className="text-xs opacity-55 mt-1 line-clamp-2">{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((t, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: `${acc}12`, color: acc }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Experience + Certs row */}
        <div className="grid md:grid-cols-2 gap-4">
          {exp.length > 0 && (
            <Card>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="font-black text-lg">Experience</h2>
                </div>
                <div className="space-y-4">
                  {exp.map((e, i) => (
                    <div key={i} className="pl-4 border-l-2" style={{ borderColor: acc }}>
                      <p className="font-black text-sm">{e.role}</p>
                      <p className="text-xs font-semibold" style={{ color: acc }}>
                        {e.company}
                      </p>
                      <p className="text-xs opacity-40">
                        {e.from}–{e.to || "Now"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {certs.length > 0 && (
            <Card>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="font-black text-lg">Certificates</h2>
                </div>
                <div className="space-y-3">
                  {certs.map((c, i) => (
                    <CertCard key={i} cert={c} accent={acc} dark={true} />
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export function GradientTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);

  return (
    <div style={{ fontFamily: font, minHeight: "100vh", background: `radial-gradient(ellipse at 20% 0%, ${acc}30 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${acc}20 0%, transparent 50%), #050a14`, color: "#e2e8f0" }}>

      <DotGrid color={acc} opacity={0.05} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 rounded-full blur-3xl scale-150" style={{ background: acc, opacity: 0.25 }} />
            <div className="relative p-1.5 rounded-full" style={{ background: `linear-gradient(135deg, ${acc}, ${acc}44)` }}>
              <Avatar data={{ ...d, darkMode: true }} size={120} shape="circle" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-3 leading-none tracking-tight">{d.name || "Your Name"}</h1>
          <p className="text-xl opacity-60 mb-5 font-medium">{d.title}</p>
          <p className="max-w-lg mx-auto text-sm opacity-50 leading-relaxed mb-7">{d.bio}</p>

          <div className="flex justify-center gap-2 flex-wrap mb-5">
            {d.location && <span className="px-3 py-1 rounded-full text-xs backdrop-blur-sm border" style={{ borderColor: `${acc}30`, color: `${acc}90` }}>📍 {d.location}</span>}
            {d.email    && <span className="px-3 py-1 rounded-full text-xs backdrop-blur-sm border" style={{ borderColor: `${acc}30`, color: `${acc}90` }}>✉ {d.email}</span>}
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
          </div>
        </div>

        {/* Content in frosted cards */}
        <div className="space-y-6">
          {skills.length > 0 && (
            <div className="rounded-3xl p-8 border backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.04)", borderColor: `${acc}20` }}>
              <h2 className="text-lg font-black mb-6 flex items-center gap-3">
                <span style={{ color: acc }}>⚡</span> Skills
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
              </div>
            </div>
          )}

          {projs.length > 0 && (
            <div>
              <h2 className="text-lg font-black mb-5 flex items-center gap-3 px-1">
                <span style={{ color: acc }}>◆</span> Projects
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projs.map((p,i) => (
                  <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                     className="group block rounded-2xl border overflow-hidden transition-all hover:-translate-y-1.5 backdrop-blur-sm"
                     style={{ background: "rgba(255,255,255,0.04)", borderColor: `${acc}20` }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = `${acc}60`}
                     onMouseLeave={e => e.currentTarget.style.borderColor = `${acc}20`}>
                    {p.image ? (
                      <div className="h-40 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="h-28 flex items-center justify-center" style={{ background: `${acc}10` }}>
                        <span className="text-4xl opacity-20" style={{ color: acc }}>{"{}"}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-black text-sm">{p.title}</p>
                      <p className="text-xs opacity-50 mt-1 line-clamp-2">{p.desc}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags.map((t,j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${acc}20`, color: acc }}>{t}</span>)}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {exp.length > 0 && (
            <div className="rounded-3xl p-8 border backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.04)", borderColor: `${acc}20` }}>
              <h2 className="text-lg font-black mb-6 flex items-center gap-3">
                <span style={{ color: acc }}>▸</span> Experience
              </h2>
              {exp.map((e,i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ background: acc, boxShadow: `0 0 10px ${acc}` }} />
                    {i < exp.length - 1 && <div className="w-px flex-1 opacity-20" style={{ background: acc }} />}
                  </div>
                  <div className="pb-2">
                    <p className="font-black">{e.role} <span className="font-normal opacity-50">@</span> {e.company}</p>
                    <p className="text-xs opacity-40 mb-1">{e.from}–{e.to||"Now"}</p>
                    <p className="text-sm opacity-55 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {certs.length > 0 && (
            <div>
              <h2 className="text-lg font-black mb-5 flex items-center gap-3 px-1">
                <span style={{ color: acc }}>✓</span> Certificates
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResumeTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, edu, socials } = wrap(data);

  // Dark mode only
  const bg = "#111318";
  const tx = "#e8eaf0";
  const sub = "#6b7280";
  const divider = "#1f2937";

  return (
    <div style={{ background: bg, fontFamily: font, color: tx, minHeight: "100vh" }}>
      <div className="max-w-[820px] mx-auto px-8 sm:px-12 py-12">

        {/* Header */}
        <div
          className="flex flex-col sm:flex-row items-start gap-6 pb-8 mb-8"
          style={{ borderBottom: `3px solid ${acc}` }}
        >
          <Avatar data={d} size={88} shape="squircle" />
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-1">
              {d.name || "Your Name"}
            </h1>
            <p className="text-base font-semibold mb-3" style={{ color: acc }}>
              {d.title}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: sub }}>
              {d.email && <span className="flex items-center gap-1">✉ {d.email}</span>}
              {d.location && <span className="flex items-center gap-1">📍 {d.location}</span>}
              {d.website && (
                <a
                  href={d.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                  style={{ color: acc }}
                >
                  🌐 {d.website}
                </a>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              {Object.entries(socials)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <SocialLink key={k} type={k} url={v} accent={acc} />
                ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        {d.bio && (
          <div className="mb-8">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-3"
              style={{ color: acc }}
            >
              Professional Summary
              <span className="flex-1 h-px" style={{ background: divider }} />
            </h2>
            <p className="text-sm leading-relaxed opacity-80">{d.bio}</p>
          </div>
        )}

        {exp.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-3"
              style={{ color: acc }}
            >
              Experience
              <span className="flex-1 h-px" style={{ background: divider }} />
            </h2>
            <div className="space-y-6">
              {exp.map((e, i) => (
                <div key={i} className="relative pl-5" style={{ borderLeft: `2px solid ${acc}20` }}>
                  <div
                    className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                    style={{ background: acc }}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <p className="font-black">{e.role}</p>
                    <p className="text-xs font-mono" style={{ color: sub }}>
                      {e.from} — {e.to || "Present"}
                    </p>
                  </div>
                  <p className="text-sm font-bold mb-2" style={{ color: acc }}>
                    {e.company}
                  </p>
                  <p className="text-sm leading-relaxed opacity-70">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {edu.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-3"
              style={{ color: acc }}
            >
              Education
              <span className="flex-1 h-px" style={{ background: divider }} />
            </h2>
            {edu.map((e, i) => (
              <div key={i} className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-black">{e.degree}</p>
                  <p className="text-sm opacity-60">{e.school}</p>
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: sub }}>
                  {e.from}–{e.to || "Now"}
                </p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-3"
              style={{ color: acc }}
            >
              Skills
              <span className="flex-1 h-px" style={{ background: divider }} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s, i) => (
                <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />
              ))}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-3"
              style={{ color: acc }}
            >
              Projects
              <span className="flex-1 h-px" style={{ background: divider }} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {projs.map((p, i) => (
                <a
                  key={i}
                  href={p.url || "#"}
                  target={p.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group flex gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
                  style={{ borderColor: divider, background: "#161b26" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm">{p.title}</p>
                    <p className="text-xs opacity-55 mt-0.5 line-clamp-2">{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((t, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: `${acc}12`, color: acc }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-lg self-start"
                    style={{ color: acc }}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-3"
              style={{ color: acc }}
            >
              Certifications
              <span className="flex-1 h-px" style={{ background: divider }} />
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {certs.map((c, i) => (
                <CertCard key={i} cert={c} accent={acc} dark={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export function BoldTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);

  // Dark mode only
  const bg = "#080808";
  const tx = "#f5f5f0";
  const border = "#1a1a1a";

  return (
    <div style={{ background: bg, fontFamily: font, color: tx, minHeight: "100vh" }}>

      {/* Brutalist hero */}
      <div className="relative overflow-hidden border-b-4" style={{ borderColor: acc, minHeight: 360 }}>
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden">
          <span className="text-[280px] font-black leading-none opacity-[0.04] select-none tracking-tighter">
            {initial(d.name)}
          </span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-8 py-16 flex flex-col sm:flex-row items-end gap-8">
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 opacity-40">Portfolio</p>
            <h1 className="text-6xl sm:text-9xl font-black leading-none tracking-tighter">
              {(d.name || "Your Name").split(" ").map((w, i) => (
                <span key={i} className="block" style={{ color: i % 2 === 0 ? tx : acc }}>
                  {w}
                </span>
              ))}
            </h1>
            <p className="text-2xl mt-4 opacity-50 font-medium">{d.title}</p>
          </div>
          <div className="shrink-0 pb-2">
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl"/>
              <Avatar data={d} size={130} shape="square" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-14">

        {/* Marquee bio strip */}
        <div className="py-5 mb-14 border-y overflow-hidden" style={{ borderColor: border }}>
          <p className="text-sm font-medium opacity-60 whitespace-nowrap">
            {d.bio} &nbsp;·&nbsp; {d.bio} &nbsp;·&nbsp; {d.bio}
          </p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs opacity-40">
            {d.location && <span>📍 {d.location}</span>}
            {d.email && <span>✉ {d.email}</span>}
          </div>
          <div className="flex gap-2 mt-3">
            {Object.entries(socials)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <SocialLink key={k} type={k} url={v} accent={acc} />
              ))}
          </div>
        </div>

        <div className="space-y-16">
          {skills.length > 0 && (
            <div>
              <h2
                className="text-5xl sm:text-7xl font-black mb-8 leading-none"
                style={{ WebkitTextStroke: `2px ${acc}`, color: "transparent" }}
              >
                SKILLS
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {skills.map((s, i) => (
                  <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />
                ))}
              </div>
            </div>
          )}

          {projs.length > 0 && (
            <div>
              <h2
                className="text-5xl sm:text-7xl font-black mb-8 leading-none"
                style={{ WebkitTextStroke: `2px ${acc}`, color: "transparent" }}
              >
                WORK
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projs.map((p, i) => (
                  <a
                    key={i}
                    href={p.url || "#"}
                    target={p.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-2xl border transition-all hover:-translate-y-1.5 hover:shadow-xl"
                    style={{ borderColor: border, background: "#111111" }}
                  >
                    {p.image && (
                      <div className="h-36 rounded-xl overflow-hidden mb-4">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <p className="text-2xl font-black leading-tight mb-1">{p.title}</p>
                    <p className="text-xs opacity-50 line-clamp-2">{p.desc}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tags.map((t, j) => (
                          <span
                            key={j}
                            className="text-[11px] font-black uppercase tracking-wide px-2 py-0.5 rounded"
                            style={{ background: `${acc}15`, color: acc }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div
                      className="mt-3 flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: acc }}
                    >
                      View project <span>→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {exp.length > 0 && (
            <div>
              <h2
                className="text-5xl sm:text-7xl font-black mb-8 leading-none"
                style={{ WebkitTextStroke: `2px ${acc}`, color: "transparent" }}
              >
                EXP
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {exp.map((e, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border transition-all"
                    style={{ borderColor: border, background: "#111111" }}
                  >
                    <p className="text-3xl font-black leading-tight mb-1" style={{ color: acc }}>
                      {e.role}
                    </p>
                    <p className="font-bold text-sm">{e.company}</p>
                    <p className="text-xs opacity-40 mb-3">
                      {e.from}–{e.to || "Now"}
                    </p>
                    <p className="text-sm opacity-65 leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certs.length > 0 && (
            <div>
              <h2
                className="text-5xl sm:text-7xl font-black mb-8 leading-none"
                style={{ WebkitTextStroke: `2px ${acc}`, color: "transparent" }}
              >
                CERTS
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certs.map((c, i) => (
                  <CertCard key={i} cert={c} accent={acc} dark={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export function PastelTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);

  // Dark mode only
  const bg = "#12101a";
  const cardBg = "rgba(255,255,255,0.04)";
  const cardBorder = "rgba(255,255,255,0.07)";
  const tx = "#f0ecff";

  return (
    <div style={{ background: bg, fontFamily: font, color: tx, minHeight: "100vh" }}>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Floating hero card */}
        <div className="relative text-center mb-12">
          {/* Glow blob */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: acc, opacity: 0.12 }}
          />

          <div
            className="relative z-10 backdrop-blur-xl rounded-3xl border p-10 shadow-2xl"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl blur-xl scale-125"
                  style={{ background: acc, opacity: 0.3 }}
                />
                <div
                  className="relative w-28 h-28 rounded-3xl overflow-hidden border-2"
                  style={{ borderColor: `${acc}40` }}
                >
                  {d.avatar ? (
                    <img src={d.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl font-black"
                      style={{ background: `${acc}20`, color: acc }}
                    >
                      {initial(d.name)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-black mb-2">{d.name || "Your Name"}</h1>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
              style={{ background: `${acc}18`, color: acc }}
            >
              ✦ {d.title || "Portfolio"}
            </div>
            <p className="text-sm leading-relaxed opacity-65 max-w-sm mx-auto mb-5">{d.bio}</p>

            <div className="flex justify-center gap-2 flex-wrap text-xs opacity-50 mb-4">
              {d.location && <span>📍 {d.location}</span>}
              {d.email && <span>✉ {d.email}</span>}
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {Object.entries(socials)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <SocialLink key={k} type={k} url={v} accent={acc} />
                ))}
            </div>
          </div>
        </div>

        {/* Content cards */}
        <div className="space-y-5">
          {skills.length > 0 && (
            <div
              className="backdrop-blur-xl rounded-3xl border p-8 shadow-lg"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black"
                  style={{ background: acc }}
                >
                  ⚡
                </span>
                Skills
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {skills.map((s, i) => (
                  <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />
                ))}
              </div>
            </div>
          )}

          {projs.length > 0 && (
            <div>
              <h2 className="text-lg font-black mb-4 px-2 flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black"
                  style={{ background: acc }}
                >
                  🚀
                </span>
                Projects
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {projs.map((p, i) => (
                  <a
                    key={i}
                    href={p.url || "#"}
                    target={p.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl backdrop-blur-xl"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
                    {p.image ? (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-24 flex items-center justify-center rounded-t-2xl"
                        style={{ background: `${acc}12` }}
                      >
                        <span className="text-3xl opacity-30" style={{ color: acc }}>
                          {"{}"}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      {p.featured && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 inline-block"
                          style={{ background: `${acc}15`, color: acc }}
                        >
                          ★ Featured
                        </span>
                      )}
                      <p className="font-black text-sm">{p.title}</p>
                      <p className="text-xs opacity-55 mt-1 line-clamp-2">{p.desc}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags.map((t, j) => (
                            <span
                              key={j}
                              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: `${acc}15`, color: acc }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {exp.length > 0 && (
            <div
              className="backdrop-blur-xl rounded-3xl border p-8 shadow-lg"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs"
                  style={{ background: acc }}
                >
                  💼
                </span>
                Experience
              </h2>
              {exp.map((e, i) => (
                <div key={i} className="mb-5 last:mb-0 pl-5 border-l-2" style={{ borderColor: `${acc}50` }}>
                  <p className="font-black">
                    {e.role} <span className="font-semibold" style={{ color: acc }}>@ {e.company}</span>
                  </p>
                  <p className="text-xs opacity-45 mb-1">{e.from}–{e.to || "Present"}</p>
                  <p className="text-sm opacity-65 leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          )}

          {certs.length > 0 && (
            <div>
              <h2 className="text-lg font-black mb-4 px-2 flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs"
                  style={{ background: acc }}
                >
                  🏆
                </span>
                Certificates
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {certs.map((c, i) => (
                  <CertCard key={i} cert={c} accent={acc} dark={true} />
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs opacity-20 mt-12">Made with CareerPatch</p>
      </div>
    </div>
  );
}


/* ─── Export map ─────────────────────────────────────────────────────────── */
export const TEMPLATE_MAP = {
  minimal:   MinimalTemplate,
  developer: DeveloperTemplate,
  sidebar:   SidebarTemplate,
  magazine:  MagazineTemplate,
  card:      CardTemplate,
  gradient:  GradientTemplate,
  resume:    ResumeTemplate,
  bold:      BoldTemplate,
  pastel:    PastelTemplate,
};

export default function PortfolioRenderer({ data, template }) {
  if (!data) return null;
  const Component = TEMPLATE_MAP[template] || MinimalTemplate;
  return <Component data={data} />;
}