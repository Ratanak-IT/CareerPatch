import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCreateServiceMutation, useGetCategoriesQuery } from "../../../services/servicesApi";
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";

const FALLBACK_THUMB = "https://placehold.co/64x64?text=IMG";

function Chip({ text, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="text-blue-700/70 hover:text-blue-900 font-bold"
        aria-label="remove"
      >
        ×
      </button>
    </span>
  );
}

export default function CreatePostModal({ onClose }) {
  // ---- base form (API payload)
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    status: "ACTIVE",
    imageUrls: [],
    // extra fields for your UI (optional)
    quotation: "",
    experienceLevel: "Expert",
    skills: [],
    tools: [],
    availability:
      "Available for part-time freelance work (20–30 hours per week).\nReady to start immediately. Flexible with different time zones and able to respond to messages within a few hours.",
  });

  const { data: categories = [] } = useGetCategoriesQuery();
  const [createService, { isLoading: saving }] = useCreateServiceMutation();

  const [error, setError] = useState("");

  // ---- chips input
  const [skillText, setSkillText] = useState("");
  const [toolText, setToolText] = useState("");

  // ---- image (file only; we upload to Cloudinary on submit)
  const fileInputRef = useRef(null);
  const [pickedFile, setPickedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const busy = saving || uploading;

  const categoryOptions = useMemo(() => {
    // your categories already come from API; keep as-is
    return Array.isArray(categories) ? categories : [];
  }, [categories]);

  const onPickFile = (file) => {
    setPickedFile(file || null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const addChip = (key, value) => {
    const v = value.trim();
    if (!v) return;
    setForm((p) => ({
      ...p,
      [key]: Array.from(new Set([...(p[key] || []), v])),
    }));
  };

  const removeChip = (key, value) => {
    setForm((p) => ({
      ...p,
      [key]: (p[key] || []).filter((x) => x !== value),
    }));
  };

  const onSubmit = async () => {
    // minimal required for your API
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.categoryId) return setError("Please select a category.");

    setError("");

    try {
      let imageUrls = form.imageUrls || [];

      // upload file -> get URL -> append to imageUrls
      if (pickedFile) {
        setUploading(true);
        const url = await uploadImageToCloudinary(pickedFile);
        imageUrls = [...imageUrls, url];
        setUploading(false);
      }

      // IMPORTANT: send only fields your backend accepts (keep same contract)
      const payload = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        status: form.status,
        imageUrls, // API expects url strings
      };

      console.log("Payload sent to API:", payload);

      await createService(payload).unwrap();
      onClose?.();
    } catch (e) {
      console.error(e);
      setUploading(false);
      setError(e?.message || "Failed to create post.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 dark:bg-darkblue/50 flex items-start justify-center px-4 pt-[89px] overflow-y-auto">
  <div className="w-full max-w-[1100px] bg-[#f6f7fb] dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden relative my-4">
    
    {/* Header */}
    <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pr-4 sm:pr-6 lg:pr-10 flex items-start justify-between sticky top-0 bg-[#f6f7fb] dark:bg-gray-900 z-10">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Freelancer Post</h2>
      <button
        onClick={onClose}
        disabled={busy}
        className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white flex items-center justify-center text-xl"
        aria-label="close"
      >
        ×
      </button>
    </div>

    {/* Error */}
    {error && (
      <div className="px-4 sm:px-6 lg:px-10 mt-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      </div>
    )}

    {/* Body */}
    <div className="px-4 sm:px-6 lg:px-10 pb-8 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* Title */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Title</p>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              disabled={busy}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Web Development"
            />
          </div>

          {/* Experience level */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Experience level</p>
            <select
              value={form.experienceLevel}
              onChange={(e) => setForm((p) => ({ ...p, experienceLevel: e.target.value }))}
              disabled={busy}
              className="w-full bg-transparent dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-2 text-gray-900 dark:text-white"
            >
              {["Beginner", "Intermediate", "Expert"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              disabled={busy}
              rows={6}
              className="w-full bg-transparent dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Describe your service..."
            />
          </div>

          {/* Availability */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Availability</p>
            <textarea
              value={form.availability}
              onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value }))}
              disabled={busy}
              rows={4}
              className="w-full bg-transparent dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-800 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Category</p>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              disabled={busy}
              className="w-full bg-transparent dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-2 text-gray-900 dark:text-white"
            >
              <option value="">— Select a category —</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Quotation + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quotation</p>
              <div className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-600 py-2">
                <span className="text-gray-600 dark:text-gray-400">$</span>
                <input
                  value={form.quotation}
                  onChange={(e) => setForm((p) => ({ ...p, quotation: e.target.value }))}
                  disabled={busy}
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="1000"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
              <div className="flex gap-3">
                {["ACTIVE", "INACTIVE"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((p) => ({ ...p, status: s }))}
                    disabled={busy}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      form.status === s
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(form.skills || []).map((s) => (
                  <Chip key={s} text={s} onRemove={() => removeChip("skills", s)} />
                ))}
              </div>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => addChip("skills", skillText) || setSkillText("")}
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline flex items-center gap-2 mt-6"
            >
              <span className="w-5 h-5 rounded-full border border-blue-300 dark:border-blue-500 flex items-center justify-center">+</span>
              Add skill
            </button>
          </div>

          {/* Skills input */}
          <div className="flex gap-2">
            <input
              value={skillText}
              onChange={(e) => setSkillText(e.target.value)}
              disabled={busy}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Type skill then click Add skill"
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addChip("skills", skillText); setSkillText(""); }
              }}
            />
          </div>

          {/* Tools & Technologies */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tools &amp; Technologies</p>
              <div className="flex flex-wrap gap-2">
                {(form.tools || []).map((t) => (
                  <Chip key={t} text={t} onRemove={() => removeChip("tools", t)} />
                ))}
              </div>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => addChip("tools", toolText) || setToolText("")}
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline flex items-center gap-2 mt-6"
            >
              <span className="w-5 h-5 rounded-full border border-blue-300 dark:border-blue-500 flex items-center justify-center">+</span>
              Add
            </button>
          </div>

          {/* Tools input */}
          <div className="flex gap-2">
            <input
              value={toolText}
              onChange={(e) => setToolText(e.target.value)}
              disabled={busy}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Type tool then click Add"
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addChip("tools", toolText); setToolText(""); }
              }}
            />
          </div>

          {/* Image picker area */}
          <div className="space-y-4">
            <div
              className="bg-[#eef2f7] dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-[120px] sm:h-[150px] lg:h-[170px] flex items-center justify-center cursor-pointer select-none"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
            >
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M7 18a4 4 0 010-8 5 5 0 019.7-1.6A4 4 0 0117 18H7z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 14V7m0 0l-3 3m3-3l3 3" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose a image here</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0])}
                disabled={busy}
              />
            </div>

            {/* Selected file row */}
            {pickedFile && (
              <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={previewUrl || FALLBACK_THUMB}
                  alt="selected"
                  className="w-14 h-14 rounded-xl object-cover border dark:border-gray-700"
                  onError={(e) => (e.currentTarget.src = FALLBACK_THUMB)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{pickedFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{(pickedFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => { setPickedFile(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                  aria-label="remove file"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={busy}
          className="w-full sm:min-w-[260px] sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {busy && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? "Posting..." : uploading ? "Uploading..." : "Post"}
        </button>
      </div>
    </div>
  </div>
</div>
  );
}