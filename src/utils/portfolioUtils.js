import { FONTS } from "../components/portfolio/PortfolioShared";
 
/* ─── Template catalog (used by PortfolioEditor style tab) ──────────────── */
export const TEMPLATES = [
  { id:"minimal",   label:"Minimal",   desc:"Clean Swiss typography",   color:"#1E88E5" },
  { id:"creative",  label:"Creative",  desc:"Bold gradient hero",        color:"#8B5CF6" },
  { id:"developer", label:"Developer", desc:"Dark terminal aesthetic",   color:"#10B981" },
  { id:"glass",     label:"Glass",     desc:"Frosted glassmorphism",     color:"#06B6D4" },
  { id:"sidebar",   label:"Sidebar",   desc:"Two-column with sidebar",   color:"#6366F1" },
  { id:"neon",      label:"Neon",      desc:"Cyberpunk dark neon",       color:"#F97316" },
  { id:"magazine",  label:"Magazine",  desc:"Editorial newspaper style", color:"#8B4513" },
  { id:"card",      label:"Card",      desc:"Bento grid layout",         color:"#EC4899" },
  { id:"gradient",  label:"Gradient",  desc:"Full immersive gradient",   color:"#7C3AED" },
  { id:"resume",    label:"Resume",    desc:"Traditional clean resume",  color:"#0F766E" },
  { id:"bold",      label:"Bold",      desc:"Large typography statement",color:"#DC2626" },
  { id:"pastel",    label:"Pastel",    desc:"Soft pastel aesthetic",     color:"#D946EF" },
  { id:"spotlight", label:"Spotlight", desc:"Dark spotlight hero",       color:"#FBBF24" },
];
 
export const ACCENT_COLORS = [
  "#1E88E5","#8B5CF6","#10B981","#F59E0B","#EF4444",
  "#EC4899","#06B6D4","#6366F1","#F97316","#84CC16",
  "#14B8A6","#A855F7","#FBBF24","#DC2626","#7C3AED",
];
 
export const FONT_OPTIONS = [
  { id:"modern",  label:"Modern (Inter)"    },
  { id:"classic", label:"Classic (Georgia)" },
  { id:"mono",    label:"Mono (JetBrains)"  },
  { id:"rounded", label:"Rounded (Nunito)"  },
];
 
export const ANIM_OPTIONS = ["fade","slide","zoom","left","right","none"];
 
/* ─── Normalise raw portfolio data into template-ready props ─────────────── */
export function wrap(data) {
  return {
    d:    data,
    dark: !!data.darkMode,
    acc:  data.accentColor || "#1E88E5",
    bg:   data.darkMode ? "#0f172a" : (data.bgColor || "#ffffff"),
    font: FONTS[data.fontStyle] || FONTS.modern,
    anim: {
      ...{ hero: "fade", cards: "slide", skills: "grow" },
      ...(data.animations || {}),
    },
    skills:  Array.isArray(data.skills)       ? data.skills       : [],
    projs:   Array.isArray(data.projects)     ? data.projects     : [],
    certs:   Array.isArray(data.certificates) ? data.certificates : [],
    exp:     Array.isArray(data.experience)   ? data.experience   : [],
    edu:     Array.isArray(data.education)    ? data.education    : [],
    socials: data.socials || {},
  };
}