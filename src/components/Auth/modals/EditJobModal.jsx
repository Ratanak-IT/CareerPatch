import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGetCategoriesQuery, useUpdateJobMutation } from "../../../services/servicesApi";
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";

const FALLBACK_THUMB = "https://placehold.co/56x56?text=?";

export default function EditJobModal({ job, onClose, onSaved }) {
  const { data: rawCategories = [] } = useGetCategoriesQuery();
  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : Array.isArray(rawCategories?.data)
    ? rawCategories.data
    : [];

  const [updateJob, { isLoading: saving }] = useUpdateJobMutation();

  const existingUrls = Array.isArray(job?.jobImages)
    ? job.jobImages.map((i) => (typeof i === "string" ? i : i?.imageUrl)).filter(Boolean)
    : [];

  const [form, setForm] = useState({
    title:      job?.title       || "",
    budget:     job?.budget      ? String(job.budget) : "",
    description:job?.description || "",
    categoryId: job?.category?.id || job?.categoryId || "",
    status:     job?.status      || "OPEN",
  });

  const [jobImages, setJobImages] = useState(existingUrls);

  const fileRef                         = useRef(null);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [error,        setError]        = useState("");

  const isBusy = saving || uploading;
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const onPickFile = (file) => {
    if (!file) return;
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeExistingImage = (url) =>
    setJobImages((p) => p.filter((x) => x !== url));

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  const handleSave = async () => {
    if (!form.title.trim())       return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.categoryId)         return setError("Please select a category.");
    setError("");

    try {
      let finalImages = jobImages;
      if (imageFile) {
        setUploading(true);
        const url = await uploadImageToCloudinary(imageFile);
        setUploading(false);
        if (url) finalImages = [...finalImages, url];
      }

      await updateJob({
        id:          job.id,
        title:       form.title.trim(),
        description: form.description.trim(),
        categoryId:  form.categoryId,
        budget:      form.budget ? Number(form.budget) : undefined,
        status:      form.status,
        jobImages:   finalImages,
      }).unwrap();

      toast.success("Job updated successfully!");

      onSaved?.();
      onClose();
    } catch (err) {
      console.error("update job failed:", err);
      setUploading(false);
      setError(err?.message || "Failed to update job.");
    }
  };

  const btnLabel = uploading ? "Uploading…" : saving ? "Saving…" : "Save Changes";

  return (
    <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 flex items-start justify-center px-4 pt-[89px] overflow-y-auto">
      <div className="w-full max-w-[1100px] bg-[#f6f7fb] dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden relative my-4">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-[#f6f7fb] dark:bg-gray-900
                        px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4
                        flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Edit Job Post
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
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
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-7">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Title</p>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                disabled={isBusy}
                placeholder="Web Development"
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600
                           focus:border-blue-500 outline-none py-2
                           text-gray-900 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Project Cost</p>
              <div className="flex items-center gap-1 border-b border-gray-300 dark:border-gray-600 py-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">$</span>
                <input
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value.replace(/[^0-9.]/g, ""))}
                  disabled={isBusy}
                  placeholder="1500"
                  inputMode="numeric"
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-white
                             placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* ROW 2 — Job Description | Job Image (same height) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 items-start">

            {/* Job Description */}
            <div className="flex flex-col h-full">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Description</p>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                disabled={isBusy}
                placeholder="Describe the job..."
                className="flex-1 w-full bg-transparent dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-400
                           text-sm text-gray-800 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           resize-none min-h-[180px]"
              />
            </div>

            {/* Job Image */}
            <div className="flex flex-col h-full">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Image</p>

              {/* Upload zone */}
              <div
                className="flex-1 bg-[#eef2f7] dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600
                           rounded-2xl min-h-[180px] flex items-center justify-center cursor-pointer select-none"
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") fileRef.current?.click(); }}
              >
                <div className="text-center px-4">
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
                  disabled={isBusy}
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />
              </div>

              {/* New file preview */}
              {imagePreview && (
                <div className="mt-3 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600
                                rounded-2xl p-3 flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-12 h-12 rounded-xl object-cover border dark:border-gray-700 shrink-0"
                    onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{imageFile?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {imageFile ? (imageFile.size / 1024).toFixed(0) + " KB" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isBusy}
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

              {/* Existing images */}
              {jobImages.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current images</p>
                  {jobImages.map((url) => (
                    <div
                      key={url}
                      className="flex items-center gap-3 bg-white dark:bg-gray-800
                                 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2"
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
                        onClick={() => removeExistingImage(url)}
                        disabled={isBusy}
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

          {/* ROW 3 — Category | Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 items-end">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Category</p>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                disabled={isBusy}
                className="w-full bg-transparent dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600
                           focus:border-blue-500 outline-none py-2 text-gray-900 dark:text-white"
              >
                <option value="">— Select a category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
              <div className="flex gap-3">
                {["OPEN", "DRAFT", "CLOSED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("status", s)}
                    disabled={isBusy}
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
      
          <div className="pt-3 flex justify-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={isBusy}
              className="w-full sm:w-auto sm:min-w-[260px] bg-blue-500 hover:bg-blue-600
                         disabled:opacity-60 text-white font-semibold py-3 rounded-xl
                         flex items-center justify-center gap-2 transition-colors"
            >
              {isBusy && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {btnLabel}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}