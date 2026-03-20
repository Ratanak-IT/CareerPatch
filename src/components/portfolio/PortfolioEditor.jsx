import { useState, useRef } from "react";
import PortfolioRenderer from "./PortfolioTemplates";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary";
import {
  TEMPLATES,
  ACCENT_COLORS,
  FONT_OPTIONS,
  ANIM_OPTIONS,
} from "../../utils/portfolioUtils";

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200
                   border border-slate-700/60 bg-slate-800/60 text-white
                   placeholder:text-slate-500 focus:border-violet-500 focus:bg-slate-800
                   focus:ring-2 focus:ring-violet-500/20 disabled:opacity-40"
      />
    </div>
  );
}

/* ─── Textarea ───────────────────────────────────────────────────────────── */
function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none transition-all duration-200
                   border border-slate-700/60 bg-slate-800/60 text-white
                   placeholder:text-slate-500 focus:border-violet-500 focus:bg-slate-800
                   focus:ring-2 focus:ring-violet-500/20"
      />
    </div>
  );
}

/* ─── ImageUpload ────────────────────────────────────────────────────────── */
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
    } catch (err) {
      console.error("upload error", err);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload"
          className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none border border-slate-700/60
                     bg-slate-800/60 text-white placeholder:text-slate-500 focus:border-violet-500
                     focus:ring-2 focus:ring-violet-500/20 transition-all"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs
                     font-bold transition-all disabled:opacity-50 shrink-0 border border-violet-500/30"
        >
          {uploading ? (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            </span>
          ) : (
            "↑ Upload"
          )}
        </button>
      </div>
      {value && (
        <div className="relative mt-1 rounded-xl overflow-hidden border border-slate-700/60">
          <img src={value} alt="" className="h-100 w-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white
                       text-[10px] flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────────────────── */
function Section({ title, children, collapsible = true, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => collapsible && setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3
                   bg-slate-800/80 text-left hover:bg-slate-700/50 transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
          {title}
        </span>
        {collapsible && (
          <span
            className={`text-slate-500 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        )}
      </button>
      {open && (
        <div className="p-4 space-y-3.5 bg-slate-900/40">{children}</div>
      )}
    </div>
  );
}

const TAB_ICONS = {
  info: "👤",
  skills: "⚡",
  projs: "🚀",
  certs: "🏆",
  exp: "💼",
  edu: "🎓",
  style: "🎨",
};

export default function PortfolioEditor({
  portfolio,
  setPortfolio,
  template,
  setTemplate,
  saving,
  onSave,
  onClose,
}) {
  const [tab, setTab] = useState("info");
  const [showPreview, setShowPreview] = useState(false);
  const [splitPreview, setSplitPreview] = useState(false);

  const set = (key, val) => setPortfolio((p) => ({ ...p, [key]: val }));
  const setSocial = (key, val) =>
    setPortfolio((p) => ({ ...p, socials: { ...p.socials, [key]: val } }));
  const setAnim = (key, val) =>
    setPortfolio((p) => ({
      ...p,
      animations: { ...(p.animations || {}), [key]: val },
    }));

  /* ── Skills ── */
  const [skillInput, setSkillInput] = useState({
    name: "",
    percent: 80,
    color: "#7c3aed",
  });
  const addSkill = () => {
    if (!skillInput.name.trim()) return;
    set("skills", [...(portfolio.skills || []), { ...skillInput }]);
    setSkillInput({ name: "", percent: 80, color: "#7c3aed" });
  };
  const updateSkill = (i, key, val) => {
    const arr = [...(portfolio.skills || [])];
    arr[i] = { ...arr[i], [key]: val };
    set("skills", arr);
  };
  const removeSkill = (i) =>
    set(
      "skills",
      (portfolio.skills || []).filter((_, idx) => idx !== i),
    );

  /* ── Projects ── */
  const emptyProj = {
    title: "",
    desc: "",
    url: "",
    image: "",
    tags: "",
    featured: false,
  };
  const [newProj, setNewProj] = useState(emptyProj);
  const addProject = () => {
    if (!newProj.title.trim()) return;
    const tags = newProj.tags
      ? newProj.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    set("projects", [...(portfolio.projects || []), { ...newProj, tags }]);
    setNewProj(emptyProj);
  };
  const removeProj = (i) =>
    set(
      "projects",
      (portfolio.projects || []).filter((_, idx) => idx !== i),
    );
  const updateProj = (i, key, val) => {
    const arr = [...(portfolio.projects || [])];
    arr[i] = { ...arr[i], [key]: val };
    set("projects", arr);
  };

  /* ── Certificates ── */
  const emptyCert = { title: "", issuer: "", date: "", url: "", image: "" };
  const [newCert, setNewCert] = useState(emptyCert);
  const addCert = () => {
    if (!newCert.title.trim()) return;
    set("certificates", [...(portfolio.certificates || []), { ...newCert }]);
    setNewCert(emptyCert);
  };
  const removeCert = (i) =>
    set(
      "certificates",
      (portfolio.certificates || []).filter((_, idx) => idx !== i),
    );

  /* ── Experience ── */
  const emptyExp = { role: "", company: "", from: "", to: "", desc: "" };
  const [newExp, setNewExp] = useState(emptyExp);
  const addExp = () => {
    if (!newExp.role.trim()) return;
    set("experience", [...(portfolio.experience || []), { ...newExp }]);
    setNewExp(emptyExp);
  };
  const removeExp = (i) =>
    set(
      "experience",
      (portfolio.experience || []).filter((_, idx) => idx !== i),
    );

  /* ── Education ── */
  const emptyEdu = { degree: "", school: "", from: "", to: "" };
  const [newEdu, setNewEdu] = useState(emptyEdu);
  const addEdu = () => {
    if (!newEdu.degree.trim()) return;
    set("education", [...(portfolio.education || []), { ...newEdu }]);
    setNewEdu(emptyEdu);
  };
  const removeEdu = (i) =>
    set(
      "education",
      (portfolio.education || []).filter((_, idx) => idx !== i),
    );

  const TABS = [
    { id: "info", label: "Info" },
    { id: "skills", label: "Skills" },
    { id: "projs", label: "Projects" },
    { id: "certs", label: "Certs" },
    { id: "exp", label: "Exp" },
    { id: "style", label: "Style" },
  ];

  /* ── Shared remove button ── */
  const RemoveBtn = ({ onClick }) => (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-lg flex items-center justify-center
                 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white
                 transition-all shrink-0"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  /* ── Editor panel content ── */
  const EditorContent = () => (
    <>
      {/* ── INFO ── */}
      {tab === "info" && (
        <>
          <Section title="Basic Info">
            <Field
              label="Full Name"
              value={portfolio.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Your full name"
            />
            <Field
              label="Title / Role"
              value={portfolio.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
            <Field
              label="Location"
              value={portfolio.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Phnom Penh, Cambodia"
            />
            <Field
              label="Email"
              value={portfolio.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="your@email.com"
              type="email"
            />
            <Field
              label="Website"
              value={portfolio.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://..."
            />
            <Textarea
              label="Bio"
              value={portfolio.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Write something about yourself..."
              rows={4}
            />
            <ImageUpload
              label="Avatar / Profile Photo"
              value={portfolio.avatar}
              onChange={(v) => set("avatar", v)}
            />
          </Section>
          <Section title="Social Links" defaultOpen={false}>
            {[
              "github",
              "linkedin",
              "facebook",
              "telegram",
              "twitter",
              "youtube",
            ].map((k) => (
              <Field
                key={k}
                label={k}
                value={portfolio.socials?.[k] || ""}
                onChange={(e) => setSocial(k, e.target.value)}
                placeholder={
                  k === "telegram"
                    ? "https://t.me/username"
                    : `https://${k}.com/username`
                }
              />
            ))}
          </Section>
        </>
      )}

      {/* ── SKILLS ── */}
      {tab === "skills" && (
        <>
          <Section title="Add Skill">
            <Field
              label="Skill Name"
              value={skillInput.name}
              onChange={(e) =>
                setSkillInput((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. React"
            />
            <div className="flex gap-3 items-end">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Level:{" "}
                  <span className="text-violet-400">{skillInput.percent}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skillInput.percent}
                  onChange={(e) =>
                    setSkillInput((p) => ({
                      ...p,
                      percent: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5 shrink-0 items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Color
                </label>
                <input
                  type="color"
                  value={skillInput.color}
                  onChange={(e) =>
                    setSkillInput((p) => ({ ...p, color: e.target.value }))
                  }
                  className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
                />
              </div>
            </div>
            <button
              onClick={addSkill}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm
                         font-bold transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              + Add Skill
            </button>
          </Section>

          <div className="space-y-2">
            {(portfolio.skills || []).map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/50
                                      bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white/10"
                  style={{ background: s.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-white truncate">{s.name}</span>
                    <span style={{ color: s.color }}>{s.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${s.percent}%`, background: s.color }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={s.percent}
                    onChange={(e) =>
                      updateSkill(i, "percent", Number(e.target.value))
                    }
                    className="w-full accent-violet-500 h-1 mt-2"
                  />
                </div>
                <RemoveBtn onClick={() => removeSkill(i)} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PROJECTS ── */}
      {tab === "projs" && (
        <>
          <Section title="Add Project">
            <Field
              label="Title"
              value={newProj.title}
              onChange={(e) =>
                setNewProj((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Project name"
            />
            <Textarea
              label="Description"
              value={newProj.desc}
              onChange={(e) =>
                setNewProj((p) => ({ ...p, desc: e.target.value }))
              }
              placeholder="What does this project do?"
              rows={2}
            />
            <Field
              label="Live URL"
              value={newProj.url}
              onChange={(e) =>
                setNewProj((p) => ({ ...p, url: e.target.value }))
              }
              placeholder="https://..."
            />
            <Field
              label="Tags (comma-separated)"
              value={newProj.tags}
              onChange={(e) =>
                setNewProj((p) => ({ ...p, tags: e.target.value }))
              }
              placeholder="React, Node.js, MongoDB"
            />
            <ImageUpload
              label="Project Image"
              value={newProj.image}
              onChange={(v) => setNewProj((p) => ({ ...p, image: v }))}
            />
            <label className="flex items-center gap-2.5 text-sm cursor-pointer group">
              <div
                className={`w-9 h-5 rounded-full transition-colors relative ${newProj.featured ? "bg-violet-600" : "bg-slate-600"}`}
                onClick={() =>
                  setNewProj((p) => ({ ...p, featured: !p.featured }))
                }
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${newProj.featured ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-slate-300 font-medium text-xs">
                Mark as Featured ★
              </span>
            </label>
            <button
              onClick={addProject}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm
                         font-bold transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              + Add Project
            </button>
          </Section>

          <div className="space-y-2">
            {(portfolio.projects || []).map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-700/50 overflow-hidden"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-20 object-cover"
                  />
                )}
                <div className="p-3 bg-slate-800/40 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">
                      {p.featured && (
                        <span className="text-yellow-400 mr-1">★</span>
                      )}
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {p.desc}
                    </p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.tags.map((t, j) => (
                          <span
                            key={j}
                            className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => updateProj(i, "featured", !p.featured)}
                      className={`w-7 h-7 rounded-lg text-xs transition-colors ${p.featured ? "bg-yellow-400/20 text-yellow-400" : "bg-slate-700 text-slate-400 hover:text-yellow-400"}`}
                    >
                      ★
                    </button>
                    <RemoveBtn onClick={() => removeProj(i)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── CERTIFICATES ── */}
      {tab === "certs" && (
        <>
          <Section title="Add Certificate">
            <Field
              label="Certificate Title"
              value={newCert.title}
              onChange={(e) =>
                setNewCert((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g. AWS Certified Developer"
            />
            <Field
              label="Issuer"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert((p) => ({ ...p, issuer: e.target.value }))
              }
              placeholder="e.g. Amazon Web Services"
            />
            <Field
              label="Date"
              value={newCert.date}
              onChange={(e) =>
                setNewCert((p) => ({ ...p, date: e.target.value }))
              }
              placeholder="e.g. Jan 2024"
            />
            <Field
              label="Credential URL"
              value={newCert.url}
              onChange={(e) =>
                setNewCert((p) => ({ ...p, url: e.target.value }))
              }
              placeholder="https://..."
            />
            <ImageUpload
              label="Certificate Image"
              value={newCert.image}
              onChange={(v) => setNewCert((p) => ({ ...p, image: v }))}
            />
            <button
              onClick={addCert}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm
                         font-bold transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              + Add Certificate
            </button>
          </Section>
          <div className="space-y-2">
            {(portfolio.certificates || []).map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt=""
                    className="w-12 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">
                    {c.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {c.issuer} · {c.date}
                  </p>
                </div>
                <RemoveBtn onClick={() => removeCert(i)} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── EXPERIENCE ── */}
      {tab === "exp" && (
        <>
          <Section title="Add Experience">
            <Field
              label="Job Title"
              value={newExp.role}
              onChange={(e) =>
                setNewExp((p) => ({ ...p, role: e.target.value }))
              }
              placeholder="e.g. Senior Developer"
            />
            <Field
              label="Company"
              value={newExp.company}
              onChange={(e) =>
                setNewExp((p) => ({ ...p, company: e.target.value }))
              }
              placeholder="Company name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="From"
                value={newExp.from}
                onChange={(e) =>
                  setNewExp((p) => ({ ...p, from: e.target.value }))
                }
                placeholder="Jan 2022"
              />
              <Field
                label="To"
                value={newExp.to}
                onChange={(e) =>
                  setNewExp((p) => ({ ...p, to: e.target.value }))
                }
                placeholder="Present"
              />
            </div>
            <Textarea
              label="Description"
              value={newExp.desc}
              onChange={(e) =>
                setNewExp((p) => ({ ...p, desc: e.target.value }))
              }
              placeholder="What did you do there?"
              rows={2}
            />
            <button
              onClick={addExp}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm
                         font-bold transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              + Add Experience
            </button>
          </Section>
          <div className="space-y-2">
            {(portfolio.experience || []).map((e, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white">{e.role}</p>
                  <p className="text-xs text-violet-400">{e.company}</p>
                  <p className="text-xs text-slate-500">
                    {e.from}–{e.to || "Present"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {e.desc}
                  </p>
                </div>
                <RemoveBtn onClick={() => removeExp(i)} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── EDUCATION ── */}
      {tab === "edu" && (
        <>
          <Section title="Add Education">
            <Field
              label="Degree / Major"
              value={newEdu.degree}
              onChange={(e) =>
                setNewEdu((p) => ({ ...p, degree: e.target.value }))
              }
              placeholder="e.g. B.Sc. Computer Science"
            />
            <Field
              label="School"
              value={newEdu.school}
              onChange={(e) =>
                setNewEdu((p) => ({ ...p, school: e.target.value }))
              }
              placeholder="University name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="From"
                value={newEdu.from}
                onChange={(e) =>
                  setNewEdu((p) => ({ ...p, from: e.target.value }))
                }
                placeholder="2019"
              />
              <Field
                label="To"
                value={newEdu.to}
                onChange={(e) =>
                  setNewEdu((p) => ({ ...p, to: e.target.value }))
                }
                placeholder="2023"
              />
            </div>
            <button
              onClick={addEdu}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm
                         font-bold transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              + Add Education
            </button>
          </Section>
          <div className="space-y-2">
            {(portfolio.education || []).map((e, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white">{e.degree}</p>
                  <p className="text-xs text-violet-400">{e.school}</p>
                  <p className="text-xs text-slate-500">
                    {e.from}–{e.to || "Present"}
                  </p>
                </div>
                <RemoveBtn onClick={() => removeEdu(i)} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── STYLE ── */}
      {tab === "style" && (
        <>
          {/* Template picker */}
          <Section title="Choose Template">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                    ${
                      template === t.id
                        ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                        : "border-slate-700/50 hover:border-slate-600 bg-slate-800/40"
                    }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 ring-1 ring-white/10"
                    style={{ background: t.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-white truncate">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {t.desc}
                    </p>
                  </div>
                  {template === t.id && (
                    <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Section>


          {/* Accent color */}
          <Section title="Accent Color">
            <div className="flex flex-wrap gap-2 items-center">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => set("accentColor", c)}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${portfolio.accentColor === c ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110" : ""}`}
                  style={{ background: c }}
                />
              ))}
              <div className="flex flex-col gap-0.5 items-center">
                <label className="text-[9px] text-slate-500">Custom</label>
                <input
                  type="color"
                  value={portfolio.accentColor || "#7c3aed"}
                  onChange={(e) => set("accentColor", e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </Section>

          {/* Font */}
          <Section title="Font Style" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => set("fontStyle", f.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 text-left transition-all
                    ${
                      portfolio.fontStyle === f.id
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-slate-700/50 text-slate-400 hover:border-slate-500"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Section>
        </>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-md">
      
      <div
        className={`flex flex-col bg-[#0f172a] transition-all duration-300 overflow-hidden
              ${
                showPreview
                  ? "hidden lg:flex"
                  : "flex w-full lg:w-[420px] lg:shrink-0"
              }
              ${splitPreview ? "lg:w-[400px]" : "lg:w-[420px]"}`}
      >
        <div
          className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 shrink-0
                        bg-gradient-to-r from-slate-900 to-slate-900/80"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600
                            flex items-center justify-center shadow-lg shadow-violet-500/20"
            >
              <span className="text-xs">✦</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">
                Portfolio Editor
              </h2>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                CareerPatch
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop split preview toggle */}
            <button
              onClick={() => setSplitPreview((p) => !p)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${
                  splitPreview
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
                }`}
            >
              <span>{splitPreview ? "◧" : "◧"}</span>
              <span>{splitPreview ? "Hide Preview" : "Preview"}</span>
            </button>
            {/* Mobile preview button */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                         bg-slate-800 text-slate-300 hover:bg-violet-600 hover:text-white
                         transition-all border border-slate-700"
            >
              👁 Preview
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white
                         font-bold flex items-center justify-center transition-all border border-slate-700 hover:border-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Tabs (scrollable) ── */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 shrink-0 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-3 text-[11px] font-bold whitespace-nowrap transition-all shrink-0
                          flex flex-col items-center gap-0.5 min-w-[52px]
                ${
                  tab === t.id
                    ? "border-b-2 border-violet-500 text-violet-400 bg-violet-500/5"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                }`}
            >
              <span className="text-base leading-none">{TAB_ICONS[t.id]}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Content area ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
          <EditorContent />
        </div>

        {/* ── Save button ── */}
        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/80">
          <button
            onClick={() => onSave(portfolio, template)}
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2
                       bg-gradient-to-r from-violet-600 to-blue-600
                       hover:from-violet-500 hover:to-blue-500
                       disabled:opacity-50 transition-all
                       shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <span>💾</span> Save Portfolio
              </>
            )}
          </button>
        </div>
      </div>
      {/* ══ PREVIEW PANEL ══ */}
      {(splitPreview || showPreview) && (
        <div
          className={`flex flex-col flex-1 overflow-hidden border-l border-slate-800
                   ${showPreview && !splitPreview ? "w-full" : ""}`}
        >
          {/* Preview header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <button
                onClick={() => setShowPreview(false)}
                className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                           bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all border border-slate-700"
              >
                ← Edit
              </button>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-slate-500 font-mono hidden sm:block">
                  {TEMPLATES.find((t) => t.id === template)?.label || "Preview"}
                </span>
              </div>
            </div>

            {/* Dark/Light toggle IN preview header — always visible */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => set("darkMode", false)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1
                    ${!portfolio.darkMode ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-white"}`}
                >
                  ☀️ <span className="hidden sm:inline">Light</span>
                </button>
                <button
                  onClick={() => set("darkMode", true)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1
                    ${portfolio.darkMode ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-white"}`}
                >
                  🌙 <span className="hidden sm:inline">Dark</span>
                </button>
              </div>
              <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-1 rounded-lg font-bold border border-violet-500/20">
                Live
              </span>
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-y-auto">
            <PortfolioRenderer data={portfolio} template={template} />
          </div>
        </div>
      )}
    </div>
  );
}
