import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import { supabase } from "../../lib/supabaseClient";

const BUCKET = "applications";

// ─── Upload to Supabase Storage ──────────────────────────────────────────────
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

// ─── helpers ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent " +
  "focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none " +
  "px-4 py-3 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 " +
  "dark:placeholder:text-gray-500 transition-all";

// PDF icon
function PdfIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── File preview row ─────────────────────────────────────────────────────────
function FilePreviewRow({ file, imagePreview, onRemove, disabled, subtitle }) {
  const isPdf = file.type === "application/pdf";
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden border border-blue-100 dark:border-blue-800
                      bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
        {!isPdf && imagePreview ? (
          <img src={imagePreview} alt="" className="w-full h-full object-cover" />
        ) : (
          <PdfIcon className="w-6 h-6 text-blue-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{file.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {subtitle || `${(file.size / 1024).toFixed(0)} KB`}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="text-red-400 hover:text-red-600 disabled:opacity-40 shrink-0 transition-colors"
        aria-label="Remove file"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// ─── Drop zone ────────────────────────────────────────────────────────────────
function DropZone({ label, file, imagePreview, onPick, onRemove, inputRef, disabled, subtitle }) {
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  };

  if (file) {
    return (
      <FilePreviewRow
        file={file}
        imagePreview={imagePreview}
        onRemove={onRemove}
        disabled={disabled}
        subtitle={subtitle}
      />
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl
                 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center
                 py-10 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
    >
      {/* Cloud upload icon */}
      <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M7 18a4 4 0 010-8 5 5 0 019.7-1.6A4 4 0 0117 18H7z"
                stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 14V7m0 0l-3 3m3-3l3 3"
                stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {label || "Choose a file or drag & drop it here"}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF or Image (PNG, JPG, WEBP)</p>

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

// ─── Main component ───────────────────────────────────────────────────────────
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (cvPreview)       URL.revokeObjectURL(cvPreview);
      if (overviewPreview) URL.revokeObjectURL(overviewPreview);
    };
  }, [cvPreview, overviewPreview]);

  const isAllowed = (file) =>
    file.type === "application/pdf" || file.type.startsWith("image/");

  const pickFile = (file, setFile, setPreview, prevPreview) => {
    if (!file) return;
    if (!isAllowed(file)) {
      setError("Only PDF and image files (PNG, JPG, WEBP) are allowed.");
      return;
    }
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
    setCvFile(null);
    setCvPreview(null);
  };

  const removeOverview = () => {
    if (overviewPreview) URL.revokeObjectURL(overviewPreview);
    setOverviewFile(null);
    setOverviewPreview(null);
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return setError("Full name is required.");
    if (!form.email.trim())    return setError("Email is required.");
    if (!authUser)             return setError("You must be logged in to apply.");
    setError("");

    const userId = String(authUser.id || authUser.userId || Date.now());

    try {
      let cvUrl       = null;
      let overviewUrl = null;

      setUploading(true);

      if (cvFile) {
        cvUrl = await uploadToSupabase(cvFile, "cv", userId);
      }
      if (overviewFile) {
        overviewUrl = await uploadToSupabase(overviewFile, "overview", userId);
      }

      setUploading(false);
      setSubmitting(true);

      const { error: dbErr } = await supabase.from("job_applications").insert({
        job_id:          String(job?.id || ""),
        job_title:       job?.title || "",
        applicant_id:    userId,
        full_name:       form.fullName.trim(),
        email:           form.email.trim(),
        phone:           form.phone.trim() || null,
        job_title_apply: form.jobTitle.trim() || null,
        description:     form.description.trim() || null,
        cv_url:          cvUrl,
        overview_url:    overviewUrl,
      });

      setSubmitting(false);

      if (dbErr) {
        console.error("apply db error:", dbErr);
        setError("Failed to submit application. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("apply error:", err);
      setUploading(false);
      setSubmitting(false);
      setError(err?.message || "Something went wrong.");
    }
  };

  const btnLabel = uploading
    ? "Uploading files…"
    : submitting
    ? "Submitting…"
    : "Submit Application";

  // ── Success ──────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your application for{" "}
            <span className="font-semibold text-blue-500">{job?.title}</span>{" "}
            has been sent successfully.
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

  // ── Modal ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 flex items-start justify-center px-4 pt-[89px] overflow-y-auto">
      <div className="w-full max-w-[680px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-4 overflow-hidden">

        {/* Header */}
        <div className="px-6 sm:px-8 pt-7 pb-4 flex items-start justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Submit Your Application
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill the required information below:
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white flex items-center justify-center text-lg font-bold transition-colors flex-shrink-0 ml-4"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-6 space-y-5">

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Row 1 — Full Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                disabled={isBusy}
                placeholder="John Smith"
                className={inputCls}
              />
            </Field>
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                disabled={isBusy}
                placeholder="097887766"
                inputMode="tel"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Row 2 — Email + Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={isBusy}
                placeholder="johnsmith@gmail.com"
                type="email"
                className={inputCls}
              />
            </Field>
            <Field label="Job Title">
              <input
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                disabled={isBusy}
                placeholder="Web Design"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              disabled={isBusy}
              rows={5}
              placeholder="Tell us about yourself and why you're a great fit…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Upload CV */}
          <Field label="Upload File">
            <DropZone
              label="Choose a file or drag & drop it here"
              file={cvFile}
              imagePreview={cvPreview}
              onPick={(f) => pickFile(f, setCvFile, setCvPreview, cvPreview)}
              onRemove={removeCv}
              inputRef={cvRef}
              disabled={isBusy}
            />
          </Field>

          {/* Upload Overview */}
          <Field label="Upload Overview File">
            <DropZone
              label="Click to upload overview file"
              file={overviewFile}
              imagePreview={overviewPreview}
              onPick={(f) => pickFile(f, setOverviewFile, setOverviewPreview, overviewPreview)}
              onRemove={removeOverview}
              inputRef={overviewRef}
              disabled={isBusy}
              subtitle={form.jobTitle || job?.title || ""}
            />
          </Field>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60
                       text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {isBusy && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {btnLabel}
          </button>

        </div>
      </div>
    </div>
  );
}