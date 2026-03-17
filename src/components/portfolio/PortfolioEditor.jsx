import { useMemo, useState } from "react";
import PortfolioRenderer from "./PortfolioTemplates";
import { normalizePortfolio } from "../../hooks/usePortfolio";
import { getProjectPreview, normalizeUrl, uploadPortfolioImage } from "../../utils/portfolioMedia";

const TEMPLATES = [
  { id: "minimal", label: "Minimal Frame", desc: "Clean modern portfolio", color: "#2563EB" },
  { id: "aurora", label: "Aurora Glow", desc: "Gradient lights + glass", color: "#8B5CF6" },
  { id: "executive", label: "Executive Grid", desc: "Corporate editorial layout", color: "#0F766E" },
  { id: "creative", label: "Creative Burst", desc: "Bold presentation style", color: "#F97316" },
  { id: "developer", label: "Code Deck", desc: "Dark pro dev look", color: "#10B981" },
  { id: "magazine", label: "Magazine Layout", desc: "Storytelling portfolio", color: "#DC2626" },
  { id: "neon", label: "Neon Pulse", desc: "Futuristic standout style", color: "#7C3AED" },
  { id: "soft", label: "Soft Card", desc: "Rounded premium style", color: "#EC4899" },
  { id: "bold", label: "Bold Split", desc: "High contrast layout", color: "#EA580C" },
  { id: "mono", label: "Mono Editorial", desc: "Black white premium", color: "#111827" },
];

const ACCENT_COLORS = [
  { name: "Ocean Blue", value: "#2563EB" },
  { name: "Royal Violet", value: "#7C3AED" },
  { name: "Mint Pro", value: "#10B981" },
  { name: "Sunset Orange", value: "#F97316" },
  { name: "Ruby Red", value: "#DC2626" },
  { name: "Rose Pink", value: "#EC4899" },
  { name: "Teal Glass", value: "#0F766E" },
  { name: "Midnight Navy", value: "#111827" },
  { name: "Amber Gold", value: "#D97706" },
  { name: "Sky Cyan", value: "#0891B2" },
];

const ANIMATIONS = [
  { id: "float", label: "Float" },
  { id: "slide", label: "Slide" },
  { id: "pulse", label: "Pulse" },
  { id: "fade", label: "Fade" },
  { id: "none", label: "None" },
];

const THEMES = [
  { id: "auto", label: "Auto" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-[#0f172a] dark:text-white"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-[#0f172a] dark:text-white"
      />
    </div>
  );
}

function UploadButton({ label, onChange, loading }) {
  return (
    <label className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm dark:border-slate-700 dark:bg-[#0f172a]">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-200">{loading ? "Uploading…" : "Select image from device / drive"}</span>
      <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={loading} />
    </label>
  );
}

export default function PortfolioEditor({
  portfolio,
  setPortfolio,
  template,
  setTemplate,
  saving,
  onSave,
  onClose,
}) {
  const safePortfolio = useMemo(() => normalizePortfolio(portfolio), [portfolio]);
  const [tab, setTab] = useState("info");
  const [preview, setPreview] = useState(true);
  const [skillForm, setSkillForm] = useState({ name: "", level: 80, color: safePortfolio.accentColor || "#2563EB" });
  const [projectForm, setProjectForm] = useState({ title: "", desc: "", url: "", stack: "", role: "", year: "", image: "" });
  const [certForm, setCertForm] = useState({ title: "", issuer: "", year: "", image: "" });
  const [uploading, setUploading] = useState({ avatar: false, project: false, cert: false });

  const setField = (key, value) => setPortfolio((prev) => ({ ...normalizePortfolio(prev), [key]: value }));
  const setSocial = (key, value) => setPortfolio((prev) => ({ ...normalizePortfolio(prev), socials: { ...normalizePortfolio(prev).socials, [key]: value } }));

  const addSkill = () => {
    if (!skillForm.name.trim()) return;
    setPortfolio((prev) => {
      const current = normalizePortfolio(prev);
      return {
        ...current,
        skills: [
          ...current.skills,
          {
            id: `skill-${Date.now()}`,
            name: skillForm.name.trim(),
            level: Number(skillForm.level) || 0,
            color: skillForm.color || current.accentColor,
          },
        ],
      };
    });
    setSkillForm({ name: "", level: 80, color: safePortfolio.accentColor || "#2563EB" });
  };

  const removeSkill = (id) => {
    setPortfolio((prev) => {
      const current = normalizePortfolio(prev);
      return { ...current, skills: current.skills.filter((skill) => skill.id !== id) };
    });
  };

  const addProject = () => {
    if (!projectForm.title.trim()) return;
    const normalizedUrl = normalizeUrl(projectForm.url);
    setPortfolio((prev) => {
      const current = normalizePortfolio(prev);
      return {
        ...current,
        projects: [
          ...current.projects,
          {
            id: `project-${Date.now()}`,
            ...projectForm,
            title: projectForm.title.trim(),
            url: normalizedUrl,
            image: projectForm.image || getProjectPreview(normalizedUrl),
          },
        ],
      };
    });
    setProjectForm({ title: "", desc: "", url: "", stack: "", role: "", year: "", image: "" });
  };

  const removeProject = (id) => {
    setPortfolio((prev) => {
      const current = normalizePortfolio(prev);
      return { ...current, projects: current.projects.filter((item) => item.id !== id) };
    });
  };

  const addCertification = () => {
    if (!certForm.title.trim()) return;
    setPortfolio((prev) => {
      const current = normalizePortfolio(prev);
      return {
        ...current,
        certifications: [
          ...current.certifications,
          { id: `cert-${Date.now()}`, ...certForm, title: certForm.title.trim() },
        ],
      };
    });
    setCertForm({ title: "", issuer: "", year: "", image: "" });
  };

  const removeCertification = (id) => {
    setPortfolio((prev) => {
      const current = normalizePortfolio(prev);
      return { ...current, certifications: current.certifications.filter((item) => item.id !== id) };
    });
  };

  const uploadImage = async (file, target) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [target]: true }));
    try {
      const url = await uploadPortfolioImage(file, `portfolio/${target}`);
      if (target === "avatar") {
        setField("avatar", url);
      }
      if (target === "project") {
        setProjectForm((prev) => ({ ...prev, image: url }));
      }
      if (target === "cert") {
        setCertForm((prev) => ({ ...prev, image: url }));
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [target]: false }));
    }
  };

  const tabs = [
    { id: "info", label: "Info" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certs", label: "Certificates" },
    { id: "design", label: "Design" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60">
      <div className={`flex h-full flex-col overflow-hidden bg-slate-50 shadow-2xl transition-all dark:bg-[#111827] ${preview ? "w-full max-w-2xl" : "w-full max-w-4xl"}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Builder</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">10 unique professional templates • Cloudinary upload • responsive preview</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview((prev) => !prev)}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-slate-200 dark:text-slate-900"
            >
              {preview ? "Hide Preview" : "Show Preview"}
            </button>
            <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white">✕</button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111827]">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-[0.2em] ${tab === item.id ? "border-b-2 border-blue-500 text-blue-500" : "text-slate-500 dark:text-slate-400"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "info" && (
            <div className="space-y-4">
              <InputField label="Full name" value={safePortfolio.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your name" />
              <InputField label="Professional title" value={safePortfolio.title} onChange={(e) => setField("title", e.target.value)} placeholder="Frontend Developer" />
              <InputField label="Tagline" value={safePortfolio.tagline} onChange={(e) => setField("tagline", e.target.value)} placeholder="Building polished, user-focused digital products" />
              <TextAreaField label="Bio" value={safePortfolio.bio} onChange={(e) => setField("bio", e.target.value)} placeholder="Tell your story, experience, strengths, and impact." rows={5} />
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="Email" value={safePortfolio.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@example.com" />
                <InputField label="Phone" value={safePortfolio.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+855 ..." />
                <InputField label="Location" value={safePortfolio.location} onChange={(e) => setField("location", e.target.value)} placeholder="Phnom Penh, Cambodia" />
                <InputField label="Website" value={safePortfolio.socials.website} onChange={(e) => setSocial("website", e.target.value)} placeholder="your-site.com" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="GitHub" value={safePortfolio.socials.github} onChange={(e) => setSocial("github", e.target.value)} placeholder="github.com/username" />
                <InputField label="LinkedIn" value={safePortfolio.socials.linkedin} onChange={(e) => setSocial("linkedin", e.target.value)} placeholder="linkedin.com/in/username" />
                <InputField label="Facebook" value={safePortfolio.socials.facebook} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="facebook.com/username" />
                <InputField label="Telegram" value={safePortfolio.socials.telegram} onChange={(e) => setSocial("telegram", e.target.value)} placeholder="t.me/username" />
              </div>
              <UploadButton label="Profile image" loading={uploading.avatar} onChange={(e) => uploadImage(e.target.files?.[0], "avatar")} />
              {safePortfolio.avatar && <img src={safePortfolio.avatar} alt="avatar" className="h-32 w-32 rounded-[28px] object-cover" />}
            </div>
          )}

          {tab === "skills" && (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0f172a]">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Skill name" value={skillForm.name} onChange={(e) => setSkillForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="React" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Skill %</label>
                    <input type="range" min="0" max="100" value={skillForm.level} onChange={(e) => setSkillForm((prev) => ({ ...prev, level: Number(e.target.value) }))} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skillForm.level}%</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Track color</label>
                    <input type="color" value={skillForm.color} onChange={(e) => setSkillForm((prev) => ({ ...prev, color: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700" />
                  </div>
                </div>
                <button onClick={addSkill} className="mt-4 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white">Add Skill</button>
              </div>

              <div className="grid gap-3">
                {safePortfolio.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0f172a]">
                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: skill.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{skill.name}</p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: skill.color }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{skill.level}%</span>
                    <button onClick={() => removeSkill(skill.id)} className="text-red-500">Remove</button>
                  </div>
                ))}
                {!safePortfolio.skills.length && <p className="text-sm text-slate-500 dark:text-slate-400">No skills added yet.</p>}
              </div>
            </div>
          )}

          {tab === "projects" && (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0f172a]">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Project title" value={projectForm.title} onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Portfolio Website" />
                  <InputField label="Live URL" value={projectForm.url} onChange={(e) => setProjectForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="plovrean.vercel.app" />
                  <InputField label="Role" value={projectForm.role} onChange={(e) => setProjectForm((prev) => ({ ...prev, role: e.target.value }))} placeholder="Frontend Developer" />
                  <InputField label="Year" value={projectForm.year} onChange={(e) => setProjectForm((prev) => ({ ...prev, year: e.target.value }))} placeholder="2026" />
                  <InputField label="Stack" value={projectForm.stack} onChange={(e) => setProjectForm((prev) => ({ ...prev, stack: e.target.value }))} placeholder="React, Tailwind, Supabase" />
                </div>
                <TextAreaField label="Project description" value={projectForm.desc} onChange={(e) => setProjectForm((prev) => ({ ...prev, desc: e.target.value }))} placeholder="Describe the project, features, your contribution, and results." rows={4} />
                <div className="grid gap-4 md:grid-cols-2">
                  <UploadButton label="Project image (optional). If empty, homepage screenshot auto-generates from URL" loading={uploading.project} onChange={(e) => uploadImage(e.target.files?.[0], "project")} />
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/70">
                    <p className="font-semibold">Live preview source</p>
                    <p className="mt-2 break-all text-slate-600 dark:text-slate-300">{projectForm.image || getProjectPreview(projectForm.url) || "Add URL or upload image"}</p>
                  </div>
                </div>
                {(projectForm.image || projectForm.url) && (
                  <img src={projectForm.image || getProjectPreview(projectForm.url)} alt="project preview" className="mt-4 h-40 w-full rounded-2xl object-cover" />
                )}
                <button onClick={addProject} className="mt-4 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white">Add Project</button>
              </div>

              <div className="grid gap-4">
                {safePortfolio.projects.map((project) => (
                  <div key={project.id} className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0f172a] md:grid-cols-[180px_1fr_auto]">
                    <img src={project.image || getProjectPreview(project.url)} alt={project.title} className="h-36 w-full rounded-2xl object-cover" />
                    <div className="min-w-0 space-y-2">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{project.desc}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{project.role} {project.role && project.year ? "•" : ""} {project.year}</p>
                      <p className="text-xs font-semibold text-blue-600 break-all">{normalizeUrl(project.url)}</p>
                    </div>
                    <button onClick={() => removeProject(project.id)} className="text-red-500">Remove</button>
                  </div>
                ))}
                {!safePortfolio.projects.length && <p className="text-sm text-slate-500 dark:text-slate-400">No projects added yet.</p>}
              </div>
            </div>
          )}

          {tab === "certs" && (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0f172a]">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Certificate title" value={certForm.title} onChange={(e) => setCertForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Frontend Developer Certificate" />
                  <InputField label="Issuer" value={certForm.issuer} onChange={(e) => setCertForm((prev) => ({ ...prev, issuer: e.target.value }))} placeholder="Udemy / Coursera / University" />
                  <InputField label="Year" value={certForm.year} onChange={(e) => setCertForm((prev) => ({ ...prev, year: e.target.value }))} placeholder="2025" />
                </div>
                <UploadButton label="Certificate image" loading={uploading.cert} onChange={(e) => uploadImage(e.target.files?.[0], "cert")} />
                {certForm.image && <img src={certForm.image} alt="certificate preview" className="mt-4 h-48 w-full rounded-2xl object-cover" />}
                <button onClick={addCertification} className="mt-4 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white">Add Certificate</button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {safePortfolio.certifications.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0f172a]">
                    {item.image && <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />}
                    <div className="space-y-1 p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.issuer}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.year}</p>
                      <button onClick={() => removeCertification(item.id)} className="pt-2 text-sm text-red-500">Remove</button>
                    </div>
                  </div>
                ))}
                {!safePortfolio.certifications.length && <p className="text-sm text-slate-500 dark:text-slate-400">No certificates added yet.</p>}
              </div>
            </div>
          )}

          {tab === "design" && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">10 templates</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TEMPLATES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTemplate(item.id)}
                      className={`rounded-[24px] border p-4 text-left transition ${template === item.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0f172a]"}`}
                    >
                      <div className="mb-3 h-10 w-10 rounded-2xl" style={{ backgroundColor: item.color }} />
                      <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Accent color + custom color name</p>
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <InputField label="Color name" value={safePortfolio.accentName} onChange={(e) => setField("accentName", e.target.value)} placeholder="Ocean Blue" />
                  <input type="color" value={safePortfolio.accentColor} onChange={(e) => setField("accentColor", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-700 md:w-28" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setField("accentColor", item.value);
                        setField("accentName", item.name);
                        setSkillForm((prev) => ({ ...prev, color: item.value }));
                      }}
                      className="rounded-full border px-3 py-2 text-sm"
                      style={{ borderColor: `${item.value}55`, color: item.value, backgroundColor: `${item.value}12` }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Animation</p>
                  <div className="flex flex-wrap gap-2">
                    {ANIMATIONS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setField("animationStyle", item.id)}
                        className={`rounded-full px-4 py-2 text-sm ${safePortfolio.animationStyle === item.id ? "bg-blue-500 text-white" : "bg-white text-slate-700 dark:bg-[#0f172a] dark:text-slate-200"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Theme mode</p>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setField("themeMode", item.id)}
                        className={`rounded-full px-4 py-2 text-sm ${safePortfolio.themeMode === item.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white text-slate-700 dark:bg-[#0f172a] dark:text-slate-200"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <button onClick={() => onSave(normalizePortfolio(safePortfolio), template)} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save Portfolio"}
          </button>
        </div>
      </div>

      {preview && (
        <div className="hidden flex-1 overflow-y-auto border-l border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-950 xl:block">
          <div className="sticky top-0 z-10 border-b border-slate-300 bg-white/80 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-300">
            Live Preview • {TEMPLATES.find((item) => item.id === template)?.label}
          </div>
          <PortfolioRenderer data={safePortfolio} template={template} />
        </div>
      )}
    </div>
  );
}