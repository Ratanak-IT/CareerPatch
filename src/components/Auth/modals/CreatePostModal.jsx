import React, { useEffect, useRef, useState } from "react";
import { useCreateServiceMutation, useGetCategoriesQuery } from "../../../services/servicesApi";
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";
import { toast } from "react-toastify";

const FALLBACK_THUMB = "https://placehold.co/56x56?text=?";

function Chip({ text, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-500 transition-colors leading-none"
        aria-label="remove"
      >
        ×
      </button>
    </span>
  );
}

/* ─── Custom Category Dropdown ───────────────────────────────────────────── */
function CategoryDropdown({ categories, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  const selected = categories.find((c) => c.id === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (cat) => {
    onChange(cat.id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`group w-full flex items-center justify-between gap-3
                    px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200 outline-none select-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${open
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm"
                    }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors
            ${open ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/30"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke={open ? "#fff" : "#3b82f6"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </span>
          <span className={`truncate ${!selected && !open ? "text-gray-400 dark:text-gray-500 font-normal" : ""}`}>
            {selected ? selected.name : "Select a category"}
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
             className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        rounded-2xl shadow-2xl dark:shadow-black/60
                        overflow-hidden">
          <ul className="max-h-48 overflow-y-auto py-1">
            {categories.map((cat) => {
              const isSelected = cat.id === value;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5
                                text-sm text-left rounded-lg mx-1 transition-colors duration-100
                                ${isSelected
                                  ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                                }`}
                    style={{ width: "calc(100% - 8px)" }}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0
                      ${isSelected ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                    <span className="flex-1 truncate">{cat.name}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                           stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" className="shrink-0">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {categories.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700/80">
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {categories.length} {categories.length === 1 ? "category" : "categories"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CreatePostModal({ onClose }) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createService, { isLoading: saving }] = useCreateServiceMutation();

  const [form, setForm] = useState({
    title:       "",
    description: "",
    categoryId:  "",
    status:      "ACTIVE",
    imageUrls:   [],
  });

  const fileRef                         = useRef(null);
  const [pickedFile, setPickedFile]     = useState(null);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [uploading,  setUploading]      = useState(false);
  const [imageInput, setImageInput]     = useState("");
  const [error,      setError]          = useState("");

  const busy = saving || uploading;

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const pickFile = (file) => {
    if (!file) return;
    setPickedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removePicked = () => {
    setPickedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrlImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    set("imageUrls", [...form.imageUrls, url]);
    setImageInput("");
  };

  const removeUrlImage = (idx) =>
    set("imageUrls", form.imageUrls.filter((_, i) => i !== idx));

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const onSubmit = async () => {
    if (!form.title.trim())       return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.categoryId)         return setError("Please select a category.");
    setError("");

    try {
      let imageUrls = form.imageUrls;

      if (pickedFile) {
        setUploading(true);
        const url = await uploadImageToCloudinary(pickedFile);
        imageUrls = [...imageUrls, url];
        setUploading(false);
      }

      await createService({
        title:       form.title,
        description: form.description,
        categoryId:  form.categoryId,
        status:      form.status,
        imageUrls,
      }).unwrap();

      toast.success("Create Successfully")

      onClose?.();
    } catch (e) {
      console.error(e);
      setUploading(false);
      setError(e?.message || "Failed to create post.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 flex items-start justify-center px-4 pt-[89px] overflow-y-auto">
      <div className="w-full max-w-[1100px] bg-[#f6f7fb] dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden relative my-4">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-[#f6f7fb] dark:bg-gray-900
                        px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4
                        flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Freelancer Post
          </h2>
          <button
            onClick={onClose}
            disabled={busy}
            className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60
                       text-white flex items-center justify-center text-xl transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="px-4 sm:px-6 lg:px-10 pt-4">
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800
                            text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

            {/* ══ LEFT COLUMN ══ */}
            <div className="space-y-7">

              {/* Title */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Title</p>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  disabled={busy}
                  placeholder="e.g. React Developer"
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600
                             focus:border-blue-500 outline-none py-2
                             text-gray-900 dark:text-white
                             placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  disabled={busy}
                  rows={6}
                  placeholder="Describe your service..."
                  className="w-full bg-transparent dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                             rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-400
                             text-sm text-gray-800 dark:text-white
                             placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                />
              </div>
            
              {/* Category */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Category</p>
                <CategoryDropdown
                  categories={categories}
                  value={form.categoryId}
                  onChange={(id) => set("categoryId", id)}
                  disabled={busy}
                />
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
                <div className="flex gap-3">
                  {["ACTIVE", "INACTIVE"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      disabled={busy}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors
                        ${form.status === s
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

            {/* ══ RIGHT COLUMN ══ */}
            <div className="space-y-7">

              {/* Image upload area */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload Image</p>
                <div
                  className="bg-[#eef2f7] dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600
                             rounded-2xl h-[120px] sm:h-[150px] flex items-center justify-center cursor-pointer select-none"
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") fileRef.current?.click(); }}
                >
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40
                                    flex items-center justify-center mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 18a4 4 0 010-8 5 5 0 019.7-1.6A4 4 0 0117 18H7z"
                              stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M12 14V7m0 0l-3 3m3-3l3 3"
                              stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose an image from device</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                </div>

                {/* Selected file preview */}
                {pickedFile && (
                  <div className="mt-3 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600
                                  rounded-2xl p-3 flex items-center gap-3">
                    <img
                      src={previewUrl || FALLBACK_THUMB}
                      alt="preview"
                      className="w-12 h-12 rounded-xl object-cover border dark:border-gray-700 shrink-0"
                      onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{pickedFile.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(pickedFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removePicked}
                      disabled={busy}
                      className="text-red-500 hover:text-red-700 shrink-0"
                      aria-label="Remove file"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Paste URL */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or paste image URL</p>
                <div className="flex gap-2">
                  <input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    disabled={busy}
                    placeholder="https://example.com/image.jpg"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrlImage(); } }}
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400
                               text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={addUrlImage}
                    disabled={busy}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Added image list */}
              {form.imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Added images</p>
                  {form.imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white dark:bg-gray-800
                                 border border-gray-200 dark:border-gray-700
                                 rounded-xl px-3 py-2"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border dark:border-gray-700"
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                      />
                      <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeUrlImage(idx)}
                        disabled={busy}
                        className="text-red-400 hover:text-red-600 shrink-0 transition-colors"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Post button ── */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy}
              className="w-full sm:w-auto sm:min-w-[260px] bg-blue-500 hover:bg-blue-600
                         disabled:opacity-60 text-white font-semibold py-3 rounded-xl
                         flex items-center justify-center gap-2 transition-colors"
            >
              {busy && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {uploading ? "Uploading..." : saving ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}