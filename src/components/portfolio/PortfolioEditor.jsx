
import { useState, useRef } from "react";
import PortfolioRenderer from "./PortfolioTemplates";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary";

/* ─── Template catalog ───────────────────────────────────────────────────── */
const TEMPLATES = [
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

const ACCENT_COLORS = [
  "#1E88E5","#8B5CF6","#10B981","#F59E0B","#EF4444",
  "#EC4899","#06B6D4","#6366F1","#F97316","#84CC16",
  "#14B8A6","#A855F7","#FBBF24","#DC2626","#7C3AED",
];

const FONT_OPTIONS = [
  { id:"modern",  label:"Modern (Inter)"         },
  { id:"classic", label:"Classic (Georgia)"       },
  { id:"mono",    label:"Mono (JetBrains)"        },
  { id:"rounded", label:"Rounded (Nunito)"        },
];

const ANIM_OPTIONS = ["fade","slide","zoom","left","right","none"];

/* ─── Reusable input ─────────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type="text", disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <input type={type} value={value??""} onChange={onChange} placeholder={placeholder} disabled={disabled}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition
                   border border-slate-200 dark:border-slate-700
                   bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white
                   placeholder:text-slate-400 focus:border-blue-400 dark:focus:border-blue-500
                   disabled:opacity-50" />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <textarea value={value??""} onChange={onChange} placeholder={placeholder} rows={rows}
        className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none transition
                   border border-slate-200 dark:border-slate-700
                   bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white
                   placeholder:text-slate-400 focus:border-blue-400" />
    </div>
  );
}

/* ─── Image upload (Cloudinary) ──────────────────────────────────────────── */
function ImageUpload({ label, value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch(err) {
      console.error("upload error", err);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <div className="flex gap-2">
        <input value={value??""} onChange={e => onChange(e.target.value)} placeholder="https://... or upload below"
          className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none border border-slate-200 dark:border-slate-700
                     bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-blue-400" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition disabled:opacity-60 shrink-0">
          {uploading ? "…" : "Upload"}
        </button>
      </div>
      {value && <img src={value} alt="" className="mt-1 h-16 w-full object-cover rounded-xl" />}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────────────────── */
function Section({ title, children, collapsible=true }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button onClick={() => collapsible && setOpen(o=>!o)}
        className="w-full flex items-center justify-between px-4 py-3
                   bg-slate-50 dark:bg-slate-800/50 text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{title}</span>
        {collapsible && <span className="text-slate-400 text-sm">{open ? "▲" : "▼"}</span>}
      </button>
      {open && <div className="p-4 space-y-4 bg-white dark:bg-[#1e293b]">{children}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EDITOR MAIN
══════════════════════════════════════════════════════════ */
export default function PortfolioEditor({ portfolio, setPortfolio, template, setTemplate, saving, onSave, onClose }) {
  const [tab,       setTab]       = useState("info");
  const [preview,   setPreview]   = useState(false);

  // Helpers
  const set = (key, val) => setPortfolio(p => ({ ...p, [key]: val }));
  const setSocial = (key, val) => setPortfolio(p => ({ ...p, socials: { ...p.socials, [key]: val } }));
  const setAnim   = (key, val) => setPortfolio(p => ({ ...p, animations: { ...(p.animations||{}), [key]: val } }));

  /* ── Skills ── */
  const [skillInput, setSkillInput] = useState({ name:"", percent:80, color:"#1E88E5" });
  const addSkill = () => {
    if (!skillInput.name.trim()) return;
    set("skills", [...(portfolio.skills||[]), { ...skillInput }]);
    setSkillInput({ name:"", percent:80, color:"#1E88E5" });
  };
  const updateSkill = (i, key, val) => {
    const arr = [...(portfolio.skills||[])];
    arr[i] = { ...arr[i], [key]: val };
    set("skills", arr);
  };
  const removeSkill = (i) => set("skills", (portfolio.skills||[]).filter((_,idx)=>idx!==i));

  /* ── Projects ── */
  const emptyProj = { title:"", desc:"", url:"", image:"", tags:"", featured:false };
  const [newProj, setNewProj] = useState(emptyProj);
  const addProject = () => {
    if (!newProj.title.trim()) return;
    const tags = newProj.tags ? newProj.tags.split(",").map(t=>t.trim()).filter(Boolean) : [];
    set("projects", [...(portfolio.projects||[]), { ...newProj, tags }]);
    setNewProj(emptyProj);
  };
  const removeProj = (i) => set("projects", (portfolio.projects||[]).filter((_,idx)=>idx!==i));
  const updateProj = (i, key, val) => {
    const arr = [...(portfolio.projects||[])];
    arr[i] = { ...arr[i], [key]: val };
    set("projects", arr);
  };

  /* ── Certificates ── */
  const emptyCert = { title:"", issuer:"", date:"", url:"", image:"" };
  const [newCert, setNewCert] = useState(emptyCert);
  const addCert = () => {
    if (!newCert.title.trim()) return;
    set("certificates", [...(portfolio.certificates||[]), { ...newCert }]);
    setNewCert(emptyCert);
  };
  const removeCert = (i) => set("certificates", (portfolio.certificates||[]).filter((_,idx)=>idx!==i));

  /* ── Experience ── */
  const emptyExp = { role:"", company:"", from:"", to:"", desc:"" };
  const [newExp, setNewExp] = useState(emptyExp);
  const addExp = () => {
    if (!newExp.role.trim()) return;
    set("experience", [...(portfolio.experience||[]), { ...newExp }]);
    setNewExp(emptyExp);
  };
  const removeExp = (i) => set("experience", (portfolio.experience||[]).filter((_,idx)=>idx!==i));

  /* ── Education ── */
  const emptyEdu = { degree:"", school:"", from:"", to:"" };
  const [newEdu, setNewEdu] = useState(emptyEdu);
  const addEdu = () => {
    if (!newEdu.degree.trim()) return;
    set("education", [...(portfolio.education||[]), { ...newEdu }]);
    setNewEdu(emptyEdu);
  };
  const removeEdu = (i) => set("education", (portfolio.education||[]).filter((_,idx)=>idx!==i));

  const TABS = [
    { id:"info",    label:"Info"    },
    { id:"skills",  label:"Skills"  },
    { id:"projs",   label:"Projects"},
    { id:"certs",   label:"Certs"   },
    { id:"exp",     label:"Exp"     },
    { id:"edu",     label:"Edu"     },
    { id:"style",   label:"Style"   },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm">

      {/* ── Left panel ── */}
      <div className={`flex flex-col bg-gray-50 dark:bg-[#1e293b] shadow-2xl transition-all duration-300
                       ${preview ? "w-[400px] shrink-0" : "w-full max-w-2xl"} overflow-hidden`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Portfolio Editor</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreview(p=>!p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                ${preview ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
              {preview ? "Hide Preview" : "👁 Preview"}
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center transition-colors">✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[11px] font-bold whitespace-nowrap transition-colors shrink-0
                ${tab===t.id ? "border-b-2 border-blue-500 text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ── INFO ── */}
          {tab==="info" && (
            <>
              <Section title="Basic Info">
                <Field label="Full Name"    value={portfolio.name}     onChange={e=>set("name",e.target.value)}     placeholder="Your full name" />
                <Field label="Title / Role" value={portfolio.title}    onChange={e=>set("title",e.target.value)}    placeholder="e.g. Full Stack Developer" />
                <Field label="Location"     value={portfolio.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Phnom Penh, Cambodia" />
                <Field label="Email"        value={portfolio.email}    onChange={e=>set("email",e.target.value)}    placeholder="your@email.com" type="email" />
                <Field label="Website"      value={portfolio.website}  onChange={e=>set("website",e.target.value)}  placeholder="https://..." />
                <Textarea label="Bio" value={portfolio.bio} onChange={e=>set("bio",e.target.value)} placeholder="Write something about yourself..." rows={4} />
                <ImageUpload label="Avatar / Profile Photo" value={portfolio.avatar} onChange={v=>set("avatar",v)} />
              </Section>
              <Section title="Social Links">
                {["github","linkedin","facebook","telegram","twitter","youtube"].map(k => (
                  <Field key={k} label={k} value={portfolio.socials?.[k]||""} onChange={e=>setSocial(k,e.target.value)}
                    placeholder={k==="telegram" ? "https://t.me/username" : `https://${k}.com/username`} />
                ))}
              </Section>
            </>
          )}

          {/* ── SKILLS ── */}
          {tab==="skills" && (
            <>
              <Section title="Add Skill">
                <Field label="Skill Name" value={skillInput.name} onChange={e=>setSkillInput(p=>({...p,name:e.target.value}))} placeholder="e.g. React" />
                <div className="flex gap-3 items-end">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Level: {skillInput.percent}%</label>
                    <input type="range" min={0} max={100} value={skillInput.percent} onChange={e=>setSkillInput(p=>({...p,percent:Number(e.target.value)}))}
                      className="w-full accent-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Color</label>
                    <input type="color" value={skillInput.color} onChange={e=>setSkillInput(p=>({...p,color:e.target.value}))}
                      className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                  </div>
                </div>
                <button onClick={addSkill}
                  className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
                  + Add Skill
                </button>
              </Section>

              {/* Existing skills */}
              {(portfolio.skills||[]).map((s,i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ background: s.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800 dark:text-white truncate">{s.name}</span>
                      <span style={{ color: s.color }}>{s.percent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                      <div className="h-full rounded-full" style={{ width:`${s.percent}%`, background: s.color }} />
                    </div>
                    {/* Inline edit */}
                    <div className="mt-2 flex gap-2 items-center">
                      <input type="range" min={0} max={100} value={s.percent}
                        onChange={e=>updateSkill(i,"percent",Number(e.target.value))}
                        className="flex-1 accent-blue-500 h-1" />
                      <input type="color" value={s.color}
                        onChange={e=>updateSkill(i,"color",e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer shrink-0" />
                    </div>
                  </div>
                  <button onClick={()=>removeSkill(i)} className="text-red-400 hover:text-red-600 shrink-0 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ── PROJECTS ── */}
          {tab==="projs" && (
            <>
              <Section title="Add Project">
                <Field label="Title"       value={newProj.title} onChange={e=>setNewProj(p=>({...p,title:e.target.value}))} placeholder="Project name" />
                <Textarea label="Description" value={newProj.desc} onChange={e=>setNewProj(p=>({...p,desc:e.target.value}))} placeholder="What does this project do?" rows={2} />
                <Field label="Live URL"    value={newProj.url}   onChange={e=>setNewProj(p=>({...p,url:e.target.value}))}   placeholder="https://..." />
                <Field label="Tags (comma-separated)" value={newProj.tags} onChange={e=>setNewProj(p=>({...p,tags:e.target.value}))} placeholder="React, Node.js, MongoDB" />
                <ImageUpload label="Project Image" value={newProj.image} onChange={v=>setNewProj(p=>({...p,image:v}))} />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newProj.featured} onChange={e=>setNewProj(p=>({...p,featured:e.target.checked}))} className="accent-blue-500 w-4 h-4" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Mark as Featured ★</span>
                </label>
                <button onClick={addProject}
                  className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
                  + Add Project
                </button>
              </Section>

              {(portfolio.projects||[]).map((p,i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {p.image && <img src={p.image} alt="" className="w-full h-24 object-cover" />}
                  <div className="p-3 bg-white dark:bg-[#0f172a]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                          {p.featured && <span className="text-yellow-500 mr-1">★</span>}{p.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{p.desc}</p>
                        {p.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.tags.map((t,j) => <span key={j} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1.5 rounded">{t}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={()=>updateProj(i,"featured",!p.featured)}
                          className={`text-xs px-2 py-1 rounded-lg transition-colors ${p.featured ? "bg-yellow-100 text-yellow-600" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                          ★
                        </button>
                        <button onClick={()=>removeProj(i)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── CERTIFICATES ── */}
          {tab==="certs" && (
            <>
              <Section title="Add Certificate">
                <Field label="Certificate Title" value={newCert.title}  onChange={e=>setNewCert(p=>({...p,title:e.target.value}))}  placeholder="e.g. AWS Certified Developer" />
                <Field label="Issuer"            value={newCert.issuer} onChange={e=>setNewCert(p=>({...p,issuer:e.target.value}))} placeholder="e.g. Amazon Web Services" />
                <Field label="Date"              value={newCert.date}   onChange={e=>setNewCert(p=>({...p,date:e.target.value}))}   placeholder="e.g. Jan 2024" />
                <Field label="Credential URL"    value={newCert.url}    onChange={e=>setNewCert(p=>({...p,url:e.target.value}))}    placeholder="https://..." />
                <ImageUpload label="Certificate Image" value={newCert.image} onChange={v=>setNewCert(p=>({...p,image:v}))} />
                <button onClick={addCert}
                  className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
                  + Add Certificate
                </button>
              </Section>
              {(portfolio.certificates||[]).map((c,i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]">
                  {c.image && <img src={c.image} alt="" className="w-12 h-10 rounded-lg object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.issuer} · {c.date}</p>
                  </div>
                  <button onClick={()=>removeCert(i)} className="text-red-400 hover:text-red-600 shrink-0 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ── EXPERIENCE ── */}
          {tab==="exp" && (
            <>
              <Section title="Add Experience">
                <Field label="Job Title"  value={newExp.role}    onChange={e=>setNewExp(p=>({...p,role:e.target.value}))}    placeholder="e.g. Senior Developer" />
                <Field label="Company"    value={newExp.company} onChange={e=>setNewExp(p=>({...p,company:e.target.value}))} placeholder="Company name" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="From" value={newExp.from} onChange={e=>setNewExp(p=>({...p,from:e.target.value}))} placeholder="Jan 2022" />
                  <Field label="To"   value={newExp.to}   onChange={e=>setNewExp(p=>({...p,to:e.target.value}))}   placeholder="Present" />
                </div>
                <Textarea label="Description" value={newExp.desc} onChange={e=>setNewExp(p=>({...p,desc:e.target.value}))} placeholder="What did you do there?" rows={2} />
                <button onClick={addExp}
                  className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
                  + Add Experience
                </button>
              </Section>
              {(portfolio.experience||[]).map((e,i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-white">{e.role}</p>
                    <p className="text-xs text-blue-500">{e.company}</p>
                    <p className="text-xs text-slate-400">{e.from}–{e.to||"Present"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{e.desc}</p>
                  </div>
                  <button onClick={()=>removeExp(i)} className="text-red-400 hover:text-red-600 shrink-0 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ── EDUCATION ── */}
          {tab==="edu" && (
            <>
              <Section title="Add Education">
                <Field label="Degree / Major" value={newEdu.degree} onChange={e=>setNewEdu(p=>({...p,degree:e.target.value}))} placeholder="e.g. B.Sc. Computer Science" />
                <Field label="School"         value={newEdu.school} onChange={e=>setNewEdu(p=>({...p,school:e.target.value}))} placeholder="University name" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="From" value={newEdu.from} onChange={e=>setNewEdu(p=>({...p,from:e.target.value}))} placeholder="2019" />
                  <Field label="To"   value={newEdu.to}   onChange={e=>setNewEdu(p=>({...p,to:e.target.value}))}   placeholder="2023" />
                </div>
                <button onClick={addEdu}
                  className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
                  + Add Education
                </button>
              </Section>
              {(portfolio.education||[]).map((e,i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-white">{e.degree}</p>
                    <p className="text-xs text-blue-500">{e.school}</p>
                    <p className="text-xs text-slate-400">{e.from}–{e.to||"Present"}</p>
                  </div>
                  <button onClick={()=>removeEdu(i)} className="text-red-400 hover:text-red-600 shrink-0 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ── STYLE ── */}
          {tab==="style" && (
            <>
              {/* Template picker */}
              <Section title="Choose Template">
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={()=>setTemplate(t.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                        ${template===t.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}>
                      <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: t.color }} />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{t.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.desc}</p>
                      </div>
                      {template===t.id && <svg className="w-4 h-4 text-blue-500 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Colors */}
              <Section title="Accent Color">
                <div className="flex flex-wrap gap-2">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} onClick={()=>set("accentColor",c)}
                      className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                      style={{ background:c, borderColor: portfolio.accentColor===c?"white":"transparent", boxShadow: portfolio.accentColor===c?`0 0 0 3px ${c}`:""}} />
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500">Custom</label>
                    <input type="color" value={portfolio.accentColor||"#1E88E5"} onChange={e=>set("accentColor",e.target.value)}
                      className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                  </div>
                </div>
              </Section>

              {/* Background color (light mode only) */}
              <Section title="Background Color">
                <div className="flex items-center gap-3">
                  <input type="color" value={portfolio.bgColor||"#ffffff"} onChange={e=>set("bgColor",e.target.value)}
                    className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                  <div className="flex gap-2">
                    {["#ffffff","#f8faff","#f1f5f9","#fafaf9","#fefce8","#fff1f2"].map(c => (
                      <button key={c} onClick={()=>set("bgColor",c)}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:scale-110 transition-all"
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </Section>

              {/* Dark mode toggle */}
              <Section title="Mode">
                <div className="flex gap-3">
                  <button onClick={()=>set("darkMode",false)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                      ${!portfolio.darkMode ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                    ☀️ Light
                  </button>
                  <button onClick={()=>set("darkMode",true)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                      ${portfolio.darkMode ? "border-blue-500 bg-blue-900/20 text-blue-400" : "border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                    🌙 Dark
                  </button>
                </div>
              </Section>

              {/* Font */}
              <Section title="Font Style">
                <div className="grid grid-cols-2 gap-2">
                  {FONT_OPTIONS.map(f => (
                    <button key={f.id} onClick={()=>set("fontStyle",f.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 text-left transition-all
                        ${portfolio.fontStyle===f.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Animations */}
              <Section title="Animations">
                {[
                  { key:"hero",   label:"Hero entrance" },
                  { key:"cards",  label:"Card entrance"  },
                  { key:"skills", label:"Skill bars"     },
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {ANIM_OPTIONS.map(a => (
                        <button key={a} onClick={()=>setAnim(key,a)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize
                            ${(portfolio.animations||{})[key]===a ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </Section>
            </>
          )}
        </div>

        {/* Save */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <button onClick={()=>onSave(portfolio, template)} disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500
                       hover:from-purple-600 hover:to-blue-600 disabled:opacity-60
                       text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all">
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? "Saving…" : "💾 Save Portfolio"}
          </button>
        </div>
      </div>

      {/* ── Right: live preview ── */}
      {preview && (
        <div className="flex-1 overflow-y-auto border-l border-slate-300 dark:border-slate-700">
          <div className="sticky top-0 z-10 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Live Preview</span>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
              {TEMPLATES.find(t=>t.id===template)?.label}
            </span>
          </div>
          <PortfolioRenderer data={portfolio} template={template} />
        </div>
      )}
    </div>
  );
}