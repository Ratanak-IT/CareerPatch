// src/components/apply/ApplyJobModal.jsx
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import { supabase } from "../../lib/supabaseClient";

const BUCKET = "applications";

async function uploadToSupabase(file, folder, userId) {
  const ext       = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const path      = `${folder}/${userId}-${timestamp}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconUpload = () => (
  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);
const IconPdf = () => (
  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const IconSend = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ── Shared input class ─────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl bg-slate-100 dark:bg-[#0f172a] border border-transparent " +
  "focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#1a2744] outline-none " +
  "px-4 py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 " +
  "dark:placeholder:text-slate-500 transition-all";

/* ── Drop Zone ──────────────────────────────────────────────────────────── */
function DropZone({ label, hint, file, imagePreview, onPick, onRemove, inputRef, disabled }) {
  const isPdf = file?.type === "application/pdf";

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  };

  /* file already picked — show preview row */
  if (file) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800
                      bg-blue-50/60 dark:bg-blue-950/20 p-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden bg-white dark:bg-[#1e293b]
                        border border-blue-100 dark:border-blue-900 flex items-center justify-center">
          {!isPdf && imagePreview
            ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            : <IconPdf />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">{file.name}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {(file.size / 1024).toFixed(0)} KB · {isPdf ? "PDF" : "Image"}
          </p>
        </div>
        <button
          type="button" onClick={onRemove} disabled={disabled}
          className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400
                     hover:bg-red-200 dark:hover:bg-red-800/40 flex items-center justify-center
                     transition-colors disabled:opacity-40 shrink-0"
          aria-label="Remove"
        >
          <IconTrash />
        </button>
      </div>
    );
  }

  /* empty — drop zone */
  return (
    <div
      className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700
                 bg-slate-50 dark:bg-[#0f172a]/60
                 hover:border-blue-300 dark:hover:border-blue-600
                 hover:bg-blue-50/40 dark:hover:bg-blue-950/20
                 flex flex-col items-center justify-center py-8 gap-2
                 cursor-pointer transition-all select-none"
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
        <IconUpload />
      </div>
      <div className="text-center px-2">
        <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">{label}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{hint || "PDF, PNG, JPG, WEBP"}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
/**
 * ApplyJobModal
 * Props:
 *   job     — { id, title }
 *   onClose — close handler
 */
export default function ApplyJobModal({ job, onClose }) {
  const authUser = useSelector(selectAuthUser);

  const [form, setForm] = useState({
    fullName:    authUser?.fullName || authUser?.name || "",
    email:       authUser?.email   || "",
    phone:       authUser?.phone   || "",
    jobTitle:    job?.title        || "",
    description: "",
  });

  const [cvFile,          setCvFile]          = useState(null);
  const [cvPreview,       setCvPreview]       = useState(null);
  const [overviewFile,    setOverviewFile]    = useState(null);
  const [overviewPreview, setOverviewPreview] = useState(null);

  const [uploading,  setUploading]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  const cvRef       = useRef(null);
  const overviewRef = useRef(null);

  const isBusy = uploading || submitting;
  const set    = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* cleanup object URLs */
  useEffect(() => {
    return () => {
      if (cvPreview)       URL.revokeObjectURL(cvPreview);
      if (overviewPreview) URL.revokeObjectURL(overviewPreview);
    };
  }, [cvPreview, overviewPreview]);

  const isAllowed = (f) => f.type === "application/pdf" || f.type.startsWith("image/");

  const pickFile = (file, setFile, setPreview, prevPreview) => {
    if (!file) return;
    if (!isAllowed(file)) { setError("Only PDF and image files are allowed."); return; }
    setError("");
    setFile(file);
    if (file.type.startsWith("image/")) {
      if (prevPreview) URL.revokeObjectURL(prevPreview);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const removeCv = () => {
    if (cvPreview) URL.revokeObjectURL(cvPreview);
    setCvFile(null); setCvPreview(null);
  };

  const removeOverview = () => {
    if (overviewPreview) URL.revokeObjectURL(overviewPreview);
    setOverviewFile(null); setOverviewPreview(null);
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return setError("Full name is required.");
    if (!form.email.trim())    return setError("Email is required.");
    if (!authUser)             return setError("You must be logged in to apply.");
    setError("");
    const userId = String(authUser.id || authUser.userId || Date.now());
    try {
      let cvUrl = null, overviewUrl = null;
      setUploading(true);
      if (cvFile)       cvUrl       = await uploadToSupabase(cvFile,       "cv",       userId);
      if (overviewFile) overviewUrl = await uploadToSupabase(overviewFile, "overview", userId);
      setUploading(false);

      setSubmitting(true);
      const { error: dbErr } = await supabase.from("job_applications").insert({
        job_id:           String(job?.id || ""),
        job_title:        job?.title || "",
        applicant_id:     userId,
        applicant_avatar: authUser?.profileImageUrl || null,
        full_name:        form.fullName.trim(),
        email:            form.email.trim(),
        phone:            form.phone.trim()    || null,
        job_title_apply:  form.jobTitle.trim() || null,
        description:      form.description.trim() || null,
        cv_url:           cvUrl,
        overview_url:     overviewUrl,
      });
      setSubmitting(false);
      if (dbErr) { setError("Failed to submit. Please try again."); return; }
      setSuccess(true);
    } catch (err) {
      setUploading(false); setSubmitting(false);
      setError(err?.message || "Something went wrong.");
    }
  };

  /* ── Success ─────────────────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 dark:bg-black/70">
        <div className="w-full max-w-sm bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl
                        border border-slate-100 dark:border-[#334155] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30
                          flex items-center justify-center mx-auto mb-4">
            <svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2">
            Application Submitted!
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Your application for{" "}
            <span className="font-semibold text-blue-500">{job?.title}</span>{" "}
            has been sent to the employer.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* ── Modal ───────────────────────────────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
                 bg-black/50 dark:bg-black/70 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[720px] my-auto
                   bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl
                   border border-slate-100 dark:border-[#334155] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5
                        border-b border-slate-100 dark:border-[#334155]">
          <div className="min-w-0 pr-4">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-white leading-tight">
              Submit Your Application
            </h2>
            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              Applying for:{" "}
              <span className="font-semibold text-blue-500">{job?.title || "—"}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center
                       text-slate-400 hover:text-slate-700 dark:hover:text-white
                       hover:bg-slate-100 dark:hover:bg-white/10
                       disabled:opacity-40 transition-all"
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="px-6 sm:px-8 py-6 space-y-5">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 text-[13px]
                            bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                            text-red-600 dark:text-red-400">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Row 1 — Full Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">
                Full Name <span className="text-red-400 font-normal">*</span>
              </label>
              <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                disabled={isBusy} placeholder="John Smith" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">Phone</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                disabled={isBusy} placeholder="097 887 766" inputMode="tel" className={inputCls} />
            </div>
          </div>

          {/* Row 2 — Email + Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">
                Email <span className="text-red-400 font-normal">*</span>
              </label>
              <input value={form.email} onChange={(e) => set("email", e.target.value)}
                disabled={isBusy} placeholder="johnsmith@gmail.com" type="email"
                className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">
                Applying For
              </label>
              <input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)}
                disabled={isBusy} placeholder="e.g. Web Designer" className={inputCls} />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">
              Description
            </label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              disabled={isBusy} rows={4}
              placeholder="Tell us about yourself and why you're a great fit for this role…"
              className={`${inputCls} resize-none`} />
          </div>

          {/* Upload row — 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">
                CV / Resume
              </label>
              <DropZone
                label="Click or drag & drop"
                hint="PDF, PNG, JPG — max 5 MB"
                file={cvFile}
                imagePreview={cvPreview}
                onPick={(f) => pickFile(f, setCvFile, setCvPreview, cvPreview)}
                onRemove={removeCv}
                inputRef={cvRef}
                disabled={isBusy}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">
                Portfolio / Overview
              </label>
              <DropZone
                label="Click or drag & drop"
                hint="PDF, PNG, JPG — max 5 MB"
                file={overviewFile}
                imagePreview={overviewPreview}
                onPick={(f) => pickFile(f, setOverviewFile, setOverviewPreview, overviewPreview)}
                onRemove={removeOverview}
                inputRef={overviewRef}
                disabled={isBusy}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600
                       disabled:opacity-60 text-white font-semibold text-[14px]
                       flex items-center justify-center gap-2
                       transition-colors active:scale-[0.98]
                       shadow-sm shadow-blue-200 dark:shadow-none"
          >
            {isBusy ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {uploading ? "Uploading files…" : "Submitting…"}
              </>
            ) : (
              <>
                <IconSend />
                Submit Application
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}