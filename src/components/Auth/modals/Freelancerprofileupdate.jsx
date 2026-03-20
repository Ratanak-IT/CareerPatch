import { useState, useRef, useEffect } from "react";
import { useUploadProfileImageMutation } from "../../../services/profileApi"; // ✅ adjust path if yours is different
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";
import { supabase } from "../../../lib/supabaseClient";
export default function FreelancerProfileUpdate({
  editOpen,
  setEditOpen,
  form,
  setForm,
  skills,
  setSkills,
  skillText,
  setSkillText,
  onAddSkill,
  onRemoveSkill,
  onSaveProfile,
  saving,
  user,
  onCoverSaved,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  // ── Cover image state (Cloudinary → Supabase user_covers) ──────────────────
  const coverRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const coverDisplay = coverPreview || existingCover || null;
  const coverName = coverFile?.name ?? (existingCover ? "Current cover" : null);

  // Load existing cover from Supabase on open
  useEffect(() => {
    const userId = String(user?.id ?? user?.userId ?? "");
    if (!userId) return;
    supabase
      .from("user_covers")
      .select("cover_url")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.cover_url) setExistingCover(data.cover_url);
      });
  }, [user?.id, user?.userId]);

  const pickCover = (file) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const removeCover = () => {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setExistingCover(null);
    if (coverRef.current) coverRef.current.value = "";
  };

  // ✅ use your API upload endpoint
  const [{ isLoading: uploading }] = useUploadProfileImageMutation();

  const busy = saving || uploading || uploadingCover;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ✅ Upload image first, then save profile
  const handleUpdate = async () => {
    try {
      let uploadedUrl = null;

      // 1. Upload profile photo to Cloudinary
      if (imageFile) {
        uploadedUrl = await uploadImageToCloudinary(imageFile);
        console.log("✅ Profile image uploaded:", uploadedUrl);
        handleRemoveImage();
      }

      // 2. Upload cover to Cloudinary → save URL to Supabase user_covers
      if (coverFile) {
        const userId = String(user?.id ?? user?.userId ?? "");
        setUploadingCover(true);
        const cloudinaryCoverUrl = await uploadImageToCloudinary(coverFile);
        setUploadingCover(false);
        console.log("✅ Cover uploaded:", cloudinaryCoverUrl);

        const { error: upsertErr } = await supabase
          .from("user_covers")
          .upsert(
            {
              user_id: userId,
              cover_url: cloudinaryCoverUrl,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

        if (upsertErr) {
          console.error("❌ Supabase upsert error:", upsertErr.message);
        } else {
          console.log("✅ Cover URL saved to Supabase");
          setExistingCover(cloudinaryCoverUrl);
          // Instantly update parent cover — no page reload needed
          onCoverSaved?.(cloudinaryCoverUrl);
        }
      }

      // 3. Save profile fields to backend
      await onSaveProfile(uploadedUrl);
    } catch (e) {
      console.error("Update profile error:", e);
      setUploadingCover(false);
    }
  };

  if (!editOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-9 pt-8 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Freelancer Profile Update
          </h2>
          <button
            onClick={() => setEditOpen(false)}
            disabled={busy}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-lg w-9 h-9 flex items-center justify-center text-sm font-semibold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-9 py-6 flex flex-col gap-5"> 

          {/* Row 2 — Full Name + Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                disabled={busy}
                className="bg-slate-100 dark:bg-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                disabled={busy}
                className="bg-slate-100 dark:bg-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Row 3 — Address + Experience */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                disabled={busy}
                className="bg-slate-100 dark:bg-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Experience Years
              </label>
              <input
                disabled={busy}
                type="number"
                className="bg-slate-100 dark:bg-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
                placeholder="Years"
                value={form.experienceYears}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    experienceYears: Number(e.target.value || 0),
                  }))
                }
              />
            </div>
          </div>

          {/* Row 4 — Skills full width */}
          {/* Skills (left) + About Me (right) */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Skills */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Skills
    </label>
    <div className="border border-slate-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 flex flex-wrap gap-2 items-center min-h-[46px] bg-white dark:bg-gray-700">
      {skills.map((s) => (
        <span key={s} className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
          {s}
          <button type="button" disabled={busy} onClick={() => onRemoveSkill(s)}
            className="text-blue-400 hover:text-blue-700 text-base leading-none">×</button>
        </span>
      ))}
      <button type="button" disabled={busy} onClick={onAddSkill}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-semibold">
        <span className="text-base leading-none">⊕</span> Add skill
      </button>
    </div>
    <input disabled={busy}
      className="bg-slate-100 dark:bg-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
      placeholder="Type skill then press Enter"
      value={skillText}
      onChange={(e) => setSkillText(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddSkill(); } }} />
  </div>

  {/* About Me */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      About me
    </label>
    <textarea disabled={busy}
      className="bg-slate-100 dark:bg-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
      placeholder="Bio / description"
      rows={6}
      value={form.bio}
      onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
  </div>
</div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cover Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image
                <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                  (Recommended 1600 × 400 px)
                </span>
              </label>
              {!coverDisplay ? (
                <div
                  onClick={() => !busy && coverRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl
                     bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center
                     h-40 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <svg
                    className="w-10 h-10 text-blue-400 mb-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000
              14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload cover image
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                  <div className="relative w-full h-40">
                    <img
                      src={coverDisplay}
                      alt="cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate flex-1">
                      {coverName}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => coverRef.current?.click()}
                        disabled={busy}
                        className="text-xs text-blue-500 hover:underline disabled:opacity-60"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeCover}
                        disabled={busy}
                        className="text-red-500 hover:text-red-700 disabled:opacity-60"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <input
                ref={coverRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) pickCover(f);
                  e.target.value = "";
                }}
              />
              {uploadingCover && (
                <p className="text-xs text-blue-500 flex items-center gap-1.5 mt-1">
                  <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Uploading cover…
                </p>
              )}
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Photo
              </label>
              <div
                className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors h-40"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
              >
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {imageFile ? "Image selected" : "Choose profile photo"}
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={busy}
                />
              </div>
              {imageFile && (
                <div className="border border-dashed border-slate-300 dark:border-gray-600 rounded-xl px-3 py-2.5 flex items-center gap-3 bg-slate-50 dark:bg-gray-700/50">
                  <img
                    src={imagePreview || "https://placehold.co/48x48?text=IMG"}
                    alt="preview"
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {imageFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={busy}
                    className="text-red-500 hover:text-red-700 disabled:opacity-60 shrink-0"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-9 pb-9 flex justify-center gap-3">
          <button
            onClick={() => setEditOpen(false)}
            disabled={busy}
            className="px-8 py-2.5 rounded-full border border-slate-300 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-60 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={busy}
            className="px-10 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {busy && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {uploading
              ? "Uploading photo…"
              : uploadingCover
                ? "Uploading cover…"
                : saving
                  ? "Saving…"
                  : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
