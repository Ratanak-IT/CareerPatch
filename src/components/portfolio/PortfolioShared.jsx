

import { useEffect, useRef, useState } from "react";

/* ─── Font families ──────────────────────────────────────────────────────── */
export const FONTS = {
  modern:  "'Inter', 'Segoe UI', sans-serif",
  classic: "'Georgia', 'Times New Roman', serif",
  mono:    "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  rounded: "'Nunito', 'Poppins', sans-serif",
};

/* ─── AOS-style scroll animation via IntersectionObserver ───────────────── */
export function useScrollReveal(animType = "fade") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || animType === "none") { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [animType]);

  const style = {
    transition: "opacity 0.7s ease, transform 0.7s ease",
    opacity:    visible ? 1 : 0,
    transform:  visible ? "none" : (
      animType === "slide" ? "translateY(32px)" :
      animType === "zoom"  ? "scale(0.92)"      :
      animType === "left"  ? "translateX(-32px)" :
      animType === "right" ? "translateX(32px)"  :
      "translateY(20px)"
    ),
  };
  return { ref, style };
}

/* ─── Skill bar ──────────────────────────────────────────────────────────── */
export function SkillBar({ skill, animType = "grow", dark = false }) {
  const barRef  = useRef(null);
  const [grown, setGrown] = useState(animType === "none");

  useEffect(() => {
    if (animType === "none") { setGrown(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setGrown(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, [animType]);

  const pct   = Math.min(100, Math.max(0, skill.percent || 0));
  const color = skill.color || "#1E88E5";

  return (
    <div ref={barRef} className="mb-4">
      <div className="flex justify-between mb-1.5 text-sm font-semibold">
        <span style={{ color: dark ? "#e2e8f0" : "#1e293b" }}>{skill.name}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: dark ? "#334155" : "#e2e8f0" }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: grown ? `${pct}%` : "0%", background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Social icons ───────────────────────────────────────────────────────── */
export const SOCIAL_ICONS = {
  github:   <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57v-2.235c-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22v3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />,
  linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
  facebook: <path d="M24 12.073C24 5.373 18.627 0 12 0S0 5.373 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  telegram: <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />,
  twitter:  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />,
  youtube:  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />,
};

export function SocialLink({ type, url, accent }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
      style={{ background: `${accent}20`, color: accent }}>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        {SOCIAL_ICONS[type]}
      </svg>
    </a>
  );
}

/* ─── Certificate card ───────────────────────────────────────────────────── */
export function CertCard({ cert, accent, dark }) {
  return (
    <a href={cert.url || "#"} target={cert.url ? "_blank" : "_self"} rel="noopener noreferrer"
      className="block rounded-xl border p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: dark ? "#334155" : "#e2e8f0",
        background:  dark ? "#1e293b" : "#f8faff",
      }}>
      {cert.image && (
        <img src={cert.image} alt={cert.title} className="w-full h-28 object-cover rounded-lg mb-3" />
      )}
      <p className="font-bold text-sm" style={{ color: accent }}>{cert.title}</p>
      <p className="text-xs mt-0.5" style={{ color: dark ? "#94a3b8" : "#64748b" }}>{cert.issuer}</p>
      {cert.date && <p className="text-xs mt-1" style={{ color: dark ? "#64748b" : "#94a3b8" }}>{cert.date}</p>}
      {cert.url && (
        <span className="inline-block mt-2 text-xs font-semibold" style={{ color: accent }}>
          View credential ↗
        </span>
      )}
    </a>
  );
}

/* ─── Section title ──────────────────────────────────────────────────────── */
export function SectionTitle({ children, accent, dark, align = "left" }) {
  return (
    <div className={`mb-6 flex flex-col ${align === "center" ? "items-center" : "items-start"}`}>
      <h2 className="text-xl sm:text-2xl font-bold"
          style={{ color: dark ? "#f1f5f9" : "#0f172a" }}>
        {children}
      </h2>
      <div className="mt-2 h-1 w-12 rounded-full" style={{ background: accent }} />
    </div>
  );
}

/* ─── Project card ───────────────────────────────────────────────────────── */
export function ProjectCard({ project, accent, dark, animType = "slide" }) {
  const { ref, style } = useScrollReveal(animType);
  return (
    <a ref={ref} style={style}
      href={project.url || "#"}
      target={project.url ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden border transition-all duration-300
                 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ borderColor: dark ? "#334155" : "#e2e8f0", background: dark ? "#1e293b" : "#fff" }}>
      {project.image ? (
        <div className="h-44 overflow-hidden">
          <img src={project.image} alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-4xl font-black"
             style={{ background: `${accent}18`, color: `${accent}60` }}>
          {"{}"}
        </div>
      )}
      <div className="p-4">
        {project.featured && (
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2"
                style={{ background: `${accent}20`, color: accent }}>
            ★ Featured
          </span>
        )}
        <h3 className="font-bold" style={{ color: dark ? "#f1f5f9" : "#0f172a" }}>{project.title}</h3>
        <p className="text-sm mt-1 line-clamp-2" style={{ color: dark ? "#94a3b8" : "#64748b" }}>{project.desc}</p>
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: `${accent}15`, color: accent }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}