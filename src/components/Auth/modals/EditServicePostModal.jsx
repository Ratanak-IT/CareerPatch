// src/components/Auth/postcomponent/EditServiceModal.jsx
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../../../services/categoriesApi";
import { useUpdateServiceMutation } from "../../../services/servicesApi";
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";

const FALLBACK_THUMB = "https://placehold.co/56x56?text=?";

// ── Reusable chip badge
function Chip({ text, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-500 transition-colors leading-none"
        aria-label={`Remove ${text}`}
      >
        ×
      </button>
    </span>
  );
}

export default function EditServiceModal({ service, onClose }) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [updateService, { isLoading: saving }] = useUpdateServiceMutation();

  // ── Form state (matches API payload)
  const [form, setForm] = useState({
    title:       service?.title       || "",
    description: service?.description || "",
    categoryId:  service?.category?.id || service?.categoryId || "",
    status:      service?.status      || "ACTIVE",
    imageUrls:   Array.isArray(service?.imageUrls)
      ? service.imageUrls
      : Array.isArray(service?.jobImages)
      ? service.jobImages.map((img) => img.imageUrl || img)
      : [],
  });

  // ── Image upload state
  const fileRef      = useRef(null);
  const [pickedFile, setPickedFile]   = useState(null);
  const [previewUrl, setPreviewUrl]   = useState(null);
  const [uploading,  setUploading]    = useState(false);
  const [imageInput, setImageInput]   = useState("");

  // ── Error
  const [error, setError] = useState("");

  const busy = saving || uploading;

  // ── Helpers
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

  // ── Submit
  const handleSave = async () => {
    if (!form.title.trim())    return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.categoryId)      return setError("Please select a category.");
    setError("");

    try {
      let imageUrls = form.imageUrls;

      if (pickedFile) {
        setUploading(true);
        const url = await uploadImageToCloudinary(pickedFile);
        imageUrls  = [...imageUrls, url];
        setUploading(false);
      }

      await updateService({
        id: service.id,
        title:       form.title,
        description: form.description,
        categoryId:  form.categoryId,
        status:      form.status,
        imageUrls,
      }).unwrap();

      toast.success("updated successfully!");
      onClose?.();
    } catch (e) {
      console.error("update service error:", e);
      setUploading(false);
      setError(e?.message || "Failed to update post.");
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
            Edit Post
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
                <select
                  value={form.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                  disabled={busy}
                  className="w-full bg-transparent dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600
                             focus:border-blue-500 outline-none py-2
                             text-gray-900 dark:text-white"
                >
                  <option value="">— Select a category —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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

              {/* Existing image list */}
              {form.imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current images</p>
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

          {/* ── Save button ── */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="w-full sm:w-auto sm:min-w-[260px] bg-blue-500 hover:bg-blue-600
                         disabled:opacity-60 text-white font-semibold py-3 rounded-xl
                         flex items-center justify-center gap-2 transition-colors"
            >
              {busy && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}