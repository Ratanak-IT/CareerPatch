import { useMemo } from "react";
import { getProjectPreview, normalizeUrl } from "../../utils/portfolioMedia";
import { normalizePortfolio } from "../../hooks/usePortfolio";

const TEMPLATES = [
  { id: "minimal", label: "Minimal Frame", badge: "01" },
  { id: "aurora", label: "Aurora Glow", badge: "02" },
  { id: "executive", label: "Executive Grid", badge: "03" },
  { id: "creative", label: "Creative Burst", badge: "04" },
  { id: "developer", label: "Code Deck", badge: "05" },
  { id: "magazine", label: "Magazine Layout", badge: "06" },
  { id: "neon", label: "Neon Pulse", badge: "07" },
  { id: "soft", label: "Soft Card", badge: "08" },
  { id: "bold", label: "Bold Split", badge: "09" },
  { id: "mono", label: "Mono Editorial", badge: "10" },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getThemeClasses(themeMode) {
  if (themeMode === "light") {
    return "bg-slate-50 text-slate-900";
  }
  if (themeMode === "dark") {
    return "bg-[#050816] text-slate-100";
  }
  return "bg-slate-50 text-slate-900 dark:bg-[#050816] dark:text-slate-100";
}

function icon(name) {
  const shared = "w-5 h-5";
  const icons = {
    mail: (
      <svg className={shared} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9m19.5 0A2.25 2.25 0 0019.5 5.25h-15A2.25 2.25 0 002.25 7.5m19.5 0l-8.69 5.215a2.25 2.25 0 01-2.12 0L2.25 7.5" />
      </svg>
    ),
    phone: (
      <svg className={shared} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25A2.25 2.25 0 0021.75 19.5v-1.372c0-.516-.351-.965-.852-1.089l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.145-7.145 1.125 1.125 0 01.38-1.21l1.293-.97a1.125 1.125 0 00.417-1.173L6.96 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    location: (
      <svg className={shared} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.75-5.625-6.75-11.25a6.75 6.75 0 1113.5 0C18.75 15.375 12 21 12 21z" />
        <circle cx="12" cy="9.75" r="2.25" />
      </svg>
    ),
    github: (
      <svg className={shared} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.75a10.25 10.25 0 00-3.24 20c.52.096.708-.224.708-.5v-1.77c-2.88.625-3.487-1.22-3.487-1.22-.472-1.2-1.152-1.52-1.152-1.52-.94-.643.07-.631.07-.631 1.04.073 1.588 1.065 1.588 1.065.924 1.583 2.423 1.125 3.013.86.094-.67.36-1.125.654-1.384-2.3-.263-4.72-1.15-4.72-5.118 0-1.13.404-2.054 1.066-2.778-.107-.26-.462-1.314.102-2.74 0 0 .87-.28 2.85 1.06a9.86 9.86 0 015.188 0c1.98-1.34 2.85-1.06 2.85-1.06.564 1.426.21 2.48.102 2.74.662.724 1.066 1.648 1.066 2.778 0 3.978-2.424 4.852-4.73 5.11.37.32.7.944.7 1.902v2.82c0 .279.187.602.713.5A10.25 10.25 0 0012 1.75z"/></svg>
    ),
    linkedin: (
      <svg className={shared} viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A1.48 1.48 0 103.5 4.98 1.48 1.48 0 004.98 3.5zM3.75 8.25h2.5v12h-2.5zM9 8.25h2.4v1.64h.03c.33-.63 1.14-1.3 2.35-1.3 2.52 0 2.99 1.66 2.99 3.82v7.84h-2.5v-6.95c0-1.66-.03-3.79-2.31-3.79-2.31 0-2.67 1.8-2.67 3.67v7.07H9z"/></svg>
    ),
    facebook: (
      <svg className={shared} viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.33l.35-2.73H13.5V9.53c0-.79.22-1.33 1.36-1.33h1.45V5.77A19.7 19.7 0 0014.2 5.6c-2.1 0-3.54 1.28-3.54 3.64v2.03H8.25V14h2.41v7z"/></svg>
    ),
    telegram: (
      <svg className={shared} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.75A10.25 10.25 0 1022.25 12 10.262 10.262 0 0012 1.75zm4.6 7.01l-1.56 7.37c-.118.522-.426.65-.862.405l-2.39-1.76-1.153 1.11a.603.603 0 01-.484.236l.172-2.443 4.447-4.018c.193-.171-.042-.266-.299-.095l-5.498 3.46-2.366-.738c-.514-.16-.524-.514.107-.76l9.25-3.566c.428-.16.801.102.622.802z"/></svg>
    ),
    website: (
      <svg className={shared} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.485 0 4.5-4.03 4.5-9s-2.015-9-4.5-9m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m-9 9h18"/></svg>
    ),
  };
  return icons[name] || null;
}

function SocialLinks({ socials, accent }) {
  const entries = Object.entries(socials || {}).filter(([, value]) => value);
  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([key, value]) => (
        <a
          key={key}
          href={normalizeUrl(value)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5"
          style={{ borderColor: `${accent}33`, color: accent, backgroundColor: `${accent}12` }}
        >
          {icon(key)}
          <span className="capitalize">{key}</span>
        </a>
      ))}
    </div>
  );
}

function ContactList({ data, accent }) {
  const items = [
    data.email && { iconName: "mail", label: data.email },
    data.phone && { iconName: "phone", label: data.phone },
    data.location && { iconName: "location", label: data.location },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {items.map((item) => (
        <div key={item.label} className="inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: `${accent}12`, color: accent }}>
          {icon(item.iconName)}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Avatar({ data, accent, className = "w-24 h-24" }) {
  if (data.avatar) {
    return <img src={data.avatar} alt={data.name} className={`${className} rounded-[28px] object-cover shadow-2xl`} />;
  }

  return (
    <div className={`${className} rounded-[28px] flex items-center justify-center text-white text-4xl font-black shadow-2xl`} style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}>
      {(data.name || "?").slice(0, 1).toUpperCase()}
    </div>
  );
}

function SkillTrack({ skill, accent, variant = 0, animationStyle = "float" }) {
  const level = clamp(Number(skill.level || 0), 0, 100);
  const color = skill.color || accent;
  const outerClass = {
    0: "rounded-2xl border p-4",
    1: "rounded-[28px] p-4 border",
    2: "rounded-3xl p-4 border-l-4",
    3: "rounded-2xl p-4 border shadow-sm",
    4: "rounded-3xl p-4 border bg-black/20",
    5: "rounded-none border-b pb-4",
    6: "rounded-[20px] p-4 border",
    7: "rounded-[30px] p-4 border bg-white/70 dark:bg-white/5 backdrop-blur",
    8: "rounded-3xl p-4 border-2",
    9: "rounded-2xl p-4 border-dashed border-2",
  }[variant] || "rounded-2xl border p-4";

  const trackClass = {
    0: "h-3 rounded-full",
    1: "h-2 rounded-full",
    2: "h-4 rounded-full",
    3: "h-2.5 rounded-full",
    4: "h-3 rounded-full",
    5: "h-1.5 rounded-full",
    6: "h-4 rounded-[999px]",
    7: "h-2 rounded-full",
    8: "h-5 rounded-2xl",
    9: "h-2 rounded-full",
  }[variant] || "h-3 rounded-full";

  const progressClass = {
    none: "",
    float: "transition-all duration-500 hover:-translate-y-1",
    pulse: "animate-pulse",
    slide: "transition-all duration-500 hover:translate-x-1",
    fade: "transition-opacity duration-500 hover:opacity-80",
  }[animationStyle] || "transition-all duration-500 hover:-translate-y-1";

  return (
    <div className={`${outerClass} ${progressClass}`} style={{ borderColor: `${color}2a` }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-semibold">{skill.name}</h4>
        <span className="text-xs font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className={`${trackClass} overflow-hidden`} style={{ backgroundColor: `${color}18` }}>
        <div
          className={`${trackClass} transition-all duration-700`}
          style={{ width: `${level}%`, background: variant % 2 === 0 ? `linear-gradient(90deg, ${color}, ${accent})` : color }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project, accent, variant = 0, animationStyle = "float" }) {
  const href = normalizeUrl(project.url);
  const image = project.image || getProjectPreview(project.url);
  const motion = {
    none: "",
    float: "transition duration-300 hover:-translate-y-2 hover:shadow-2xl",
    pulse: "transition duration-300 hover:scale-[1.01]",
    slide: "transition duration-300 hover:translate-x-1",
    fade: "transition duration-300 hover:opacity-95",
  }[animationStyle] || "transition duration-300 hover:-translate-y-2 hover:shadow-2xl";

  const frameClass = {
    0: "rounded-[30px] overflow-hidden border bg-white/90 dark:bg-slate-900/60",
    1: "rounded-[36px] overflow-hidden border bg-white/70 dark:bg-white/5 backdrop-blur",
    2: "rounded-none overflow-hidden border bg-transparent",
    3: "rounded-[28px] overflow-hidden shadow-lg border bg-white dark:bg-slate-900",
    4: "rounded-3xl overflow-hidden border bg-[#07111f] text-white",
    5: "rounded-[14px] overflow-hidden border bg-white dark:bg-slate-950",
    6: "rounded-[26px] overflow-hidden border bg-black/30 text-white backdrop-blur",
    7: "rounded-[34px] overflow-hidden border bg-white/85 dark:bg-slate-950/70",
    8: "rounded-[24px] overflow-hidden border-2 bg-white dark:bg-slate-900",
    9: "rounded-none overflow-hidden border-2 border-dashed bg-white dark:bg-slate-950",
  }[variant] || "rounded-[30px] overflow-hidden border bg-white/90 dark:bg-slate-900/60";

  const content = (
    <div className={`${frameClass} ${motion}`} style={{ borderColor: `${accent}26` }}>
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
        {image ? (
          <img src={image} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm" style={{ color: accent }}>Project Preview</div>
        )}
        <div className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: accent }}>
          {project.year || "Project"}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{project.title || "Untitled project"}</h3>
            {project.role && <p className="text-sm opacity-70">{project.role}</p>}
          </div>
          {href && (
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${accent}14`, color: accent }}>
              Visit ↗
            </span>
          )}
        </div>
        <p className="text-sm leading-6 opacity-80">{project.desc || "No project description yet."}</p>
        {project.stack && (
          <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: `${accent}10` }}>
            <span className="font-semibold">Stack:</span> {project.stack}
          </div>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {content}
    </a>
  );
}

function CertificationCard({ item, accent, variant = 0 }) {
  return (
    <div
      className={[
        "overflow-hidden border",
        variant === 5 || variant === 9 ? "rounded-none" : "rounded-[28px]",
        variant === 6 ? "bg-black/25 text-white" : "bg-white/80 dark:bg-white/5",
      ].join(" ")}
      style={{ borderColor: `${accent}24` }}
    >
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm" style={{ color: accent }}>Certificate Image</div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h4 className="font-bold">{item.title || "Certificate"}</h4>
        <p className="text-sm opacity-75">{item.issuer || "Issuer"}</p>
        {item.year && <p className="text-xs font-semibold" style={{ color: accent }}>{item.year}</p>}
      </div>
    </div>
  );
}

function TemplateFrame({ template, data }) {
  const accent = data.accentColor || "#2563EB";
  const themeClass = getThemeClasses(data.themeMode);
  const templateIndex = TEMPLATES.findIndex((item) => item.id === template);
  const templateData = TEMPLATES[templateIndex] || TEMPLATES[0];

  const wrappers = {
    minimal: "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8",
    aurora: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10",
    executive: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12",
    creative: "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8",
    developer: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10",
    magazine: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12",
    neon: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10",
    soft: "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8",
    bold: "mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8",
    mono: "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10",
  };

  const heroClasses = {
    minimal: "grid gap-6 rounded-[36px] border p-8 md:grid-cols-[1.3fr_0.7fr] md:p-12",
    aurora: "relative overflow-hidden rounded-[40px] border p-8 md:p-12",
    executive: "grid gap-8 rounded-none border p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12",
    creative: "grid gap-8 rounded-[40px] border p-8 md:grid-cols-[0.95fr_1.05fr] md:p-12",
    developer: "grid gap-8 rounded-[32px] border p-6 md:grid-cols-[0.85fr_1.15fr] md:p-10",
    magazine: "grid gap-8 rounded-none border p-8 md:grid-cols-[1.15fr_0.85fr] md:p-12",
    neon: "relative overflow-hidden rounded-[36px] border p-8 md:p-12",
    soft: "grid gap-8 rounded-[44px] border p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12",
    bold: "grid gap-8 rounded-[30px] border p-6 md:grid-cols-[0.8fr_1.2fr] md:p-10",
    mono: "grid gap-8 rounded-none border-2 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12",
  };

  const sectionTitleClass = {
    minimal: "text-2xl font-bold",
    aurora: "text-3xl font-black",
    executive: "text-2xl font-semibold uppercase tracking-[0.18em]",
    creative: "text-3xl font-black",
    developer: "text-2xl font-semibold",
    magazine: "text-3xl font-serif font-bold",
    neon: "text-3xl font-black uppercase tracking-[0.2em]",
    soft: "text-2xl font-bold",
    bold: "text-3xl font-black",
    mono: "text-2xl font-black uppercase tracking-[0.25em]",
  };

  const projectGridClass = {
    minimal: "grid gap-6 md:grid-cols-2",
    aurora: "grid gap-6 lg:grid-cols-2",
    executive: "grid gap-4 lg:grid-cols-3",
    creative: "grid gap-6 md:grid-cols-2",
    developer: "grid gap-6 lg:grid-cols-2",
    magazine: "grid gap-4 md:grid-cols-2",
    neon: "grid gap-6 lg:grid-cols-3",
    soft: "grid gap-6 md:grid-cols-2",
    bold: "grid gap-6 xl:grid-cols-3",
    mono: "grid gap-5 md:grid-cols-2",
  };

  return (
    <div className={`${themeClass} min-h-screen`}>
      <div className={wrappers[template] || wrappers.minimal}>
        <div className={heroClasses[template]} style={{ borderColor: `${accent}26`, background: heroBackground(template, accent, data.themeMode) }}>
          {(template === "aurora" || template === "neon") && (
            <>
              <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: glowBackground(template, accent) }} />
              <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: `${accent}45` }} />
            </>
          )}

          <div className="relative z-10 flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]" style={{ borderColor: `${accent}33`, color: accent, backgroundColor: `${accent}12` }}>
              <span>{templateData.badge}</span>
              <span>{templateData.label}</span>
              {data.accentName && <span>• {data.accentName}</span>}
            </div>
            <div className="space-y-4">
              <h1 className={heroTitleClass(template)}>{data.name || "Your Name"}</h1>
              <div className="space-y-2">
                <p className="text-xl font-semibold" style={{ color: accent }}>{data.title || "Professional title"}</p>
                {data.tagline && <p className="max-w-2xl text-base opacity-80 md:text-lg">{data.tagline}</p>}
              </div>
              <p className="max-w-3xl text-sm leading-7 opacity-80 md:text-base">{data.bio || "Write a short, high-impact introduction about your work, specialty, and value."}</p>
            </div>
            <ContactList data={data} accent={accent} />
            <SocialLinks socials={data.socials} accent={accent} />
          </div>

          <div className="relative z-10 flex items-center justify-center md:justify-end">
            <div className={avatarShellClass(template)} style={{ borderColor: `${accent}2a`, backgroundColor: `${accent}0f` }}>
              <Avatar data={data} accent={accent} className={avatarSizeClass(template)} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-8">
            <div className="rounded-[32px] border p-6 md:p-8" style={{ borderColor: `${accent}20`, backgroundColor: `${accent}08` }}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className={sectionTitleClass[template]} style={{ color: accent }}>Skills</h2>
                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Custom % tracks</span>
              </div>
              <div className="grid gap-4">
                {(data.skills || []).length ? (
                  data.skills.map((skill) => (
                    <SkillTrack
                      key={skill.id || skill.name}
                      skill={skill}
                      accent={accent}
                      variant={templateIndex < 0 ? 0 : templateIndex}
                      animationStyle={data.animationStyle}
                    />
                  ))
                ) : (
                  <p className="text-sm opacity-70">No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border p-6 md:p-8" style={{ borderColor: `${accent}20` }}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className={sectionTitleClass[template]} style={{ color: accent }}>Certificates</h2>
                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Image gallery</span>
              </div>
              {(data.certifications || []).length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {data.certifications.map((item) => (
                    <CertificationCard key={item.id || item.title} item={item} accent={accent} variant={templateIndex < 0 ? 0 : templateIndex} />
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-70">No certificates added yet.</p>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className={sectionTitleClass[template]} style={{ color: accent }}>Projects</h2>
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Click card to open live URL</span>
            </div>
            <div className={projectGridClass[template]}>
              {(data.projects || []).length ? (
                data.projects.map((project) => (
                  <ProjectCard
                    key={project.id || project.title}
                    project={project}
                    accent={accent}
                    variant={templateIndex < 0 ? 0 : templateIndex}
                    animationStyle={data.animationStyle}
                  />
                ))
              ) : (
                <div className="rounded-[30px] border p-8 text-sm opacity-70" style={{ borderColor: `${accent}20` }}>
                  No projects added yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function heroBackground(template, accent, themeMode) {
  const isDark = themeMode === "dark";
  const darkGlass = "linear-gradient(135deg, rgba(10,15,28,0.92), rgba(17,24,39,0.84))";
  const lightGlass = "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))";

  const map = {
    minimal: isDark ? darkGlass : lightGlass,
    aurora: `linear-gradient(135deg, ${accent}12, rgba(255,255,255,0.08), ${accent}08)`,
    executive: isDark ? "linear-gradient(180deg, rgba(2,6,23,0.95), rgba(15,23,42,0.9))" : "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,0.92))",
    creative: `linear-gradient(145deg, ${accent}10, rgba(255,255,255,0.6))`,
    developer: "linear-gradient(135deg, rgba(3,7,18,0.96), rgba(15,23,42,0.95))",
    magazine: isDark ? darkGlass : "linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0.96))",
    neon: "linear-gradient(135deg, rgba(1,5,18,1), rgba(15,23,42,0.98))",
    soft: `linear-gradient(135deg, ${accent}0f, rgba(255,255,255,0.95))`,
    bold: `linear-gradient(135deg, ${accent}12, rgba(15,23,42,0.06))`,
    mono: isDark ? "linear-gradient(180deg, rgba(2,6,23,1), rgba(10,10,10,1))" : "linear-gradient(180deg, rgba(255,255,255,1), rgba(250,250,250,1))",
  };

  return map[template] || lightGlass;
}

function glowBackground(template, accent) {
  if (template === "aurora") {
    return `radial-gradient(circle at 10% 20%, ${accent}55 0%, transparent 35%), radial-gradient(circle at 85% 10%, rgba(236,72,153,0.3) 0%, transparent 30%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.22) 0%, transparent 35%)`;
  }
  return `radial-gradient(circle at 15% 15%, ${accent}65 0%, transparent 28%), radial-gradient(circle at 80% 25%, rgba(217,70,239,0.3) 0%, transparent 26%), radial-gradient(circle at 45% 80%, rgba(34,211,238,0.25) 0%, transparent 30%)`;
}

function heroTitleClass(template) {
  const classes = {
    minimal: "text-4xl font-black tracking-tight md:text-6xl",
    aurora: "text-4xl font-black tracking-tight md:text-7xl",
    executive: "text-4xl font-semibold uppercase tracking-tight md:text-6xl",
    creative: "text-4xl font-black md:text-6xl",
    developer: "text-4xl font-semibold md:text-6xl",
    magazine: "text-4xl font-serif font-bold md:text-6xl",
    neon: "text-4xl font-black uppercase md:text-6xl",
    soft: "text-4xl font-black md:text-6xl",
    bold: "text-4xl font-black md:text-7xl",
    mono: "text-4xl font-black uppercase md:text-6xl",
  };

  return classes[template] || classes.minimal;
}

function avatarShellClass(template) {
  const classes = {
    minimal: "rounded-[36px] border p-5",
    aurora: "rounded-[40px] border p-6 backdrop-blur",
    executive: "rounded-none border p-6",
    creative: "rounded-[42px] border p-5 shadow-2xl",
    developer: "rounded-[26px] border p-4 bg-black/20",
    magazine: "rounded-none border p-6",
    neon: "rounded-[36px] border p-5 bg-black/20 shadow-[0_0_60px_rgba(59,130,246,0.2)]",
    soft: "rounded-[48px] border p-5 bg-white/80 backdrop-blur",
    bold: "rounded-[28px] border p-4",
    mono: "rounded-none border-2 p-5",
  };
  return classes[template] || classes.minimal;
}

function avatarSizeClass(template) {
  const classes = {
    minimal: "h-40 w-40 md:h-52 md:w-52",
    aurora: "h-44 w-44 md:h-56 md:w-56",
    executive: "h-40 w-40 md:h-56 md:w-56",
    creative: "h-44 w-44 md:h-56 md:w-56",
    developer: "h-40 w-40 md:h-52 md:w-52",
    magazine: "h-44 w-44 md:h-56 md:w-56",
    neon: "h-44 w-44 md:h-56 md:w-56",
    soft: "h-42 w-42 md:h-54 md:w-54",
    bold: "h-40 w-40 md:h-52 md:w-52",
    mono: "h-44 w-44 md:h-56 md:w-56",
  };
  return classes[template] || classes.minimal;
}

export default function PortfolioRenderer({ data, template = "minimal" }) {
  const portfolio = useMemo(() => normalizePortfolio(data), [data]);
  const validTemplate = TEMPLATES.some((item) => item.id === template) ? template : "minimal";
  return <TemplateFrame template={validTemplate} data={portfolio} />;
}