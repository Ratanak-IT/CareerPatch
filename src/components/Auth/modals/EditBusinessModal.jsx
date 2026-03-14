// src/components/Auth/modals/EditBusinessModal.jsx
//
// Flow:
//   profileImage → Cloudinary upload → URL sent to backend PUT /update-business-profile
//   coverImage   → Cloudinary upload → URL upserted into Supabase user_covers table
//                  (backend has no coverImageUrl endpoint so we store it in Supabase)

import React, { useRef, useState, useEffect } from "react";
import { useUpdateBusinessProfileMutation } from "../../../services/profileApi";
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";
import { supabase } from "../../../lib/supabaseClient";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function Label({ children }) {
  return (
    <label className="block text-sm font-medium mb-1.5
                       text-gray-600 dark:text-slate-400">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition
                 border border-gray-200 dark:border-slate-600
                 bg-white dark:bg-[#0f172a]
                 text-gray-800 dark:text-white
                 placeholder:text-gray-400 dark:placeholder:text-slate-500
                 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                 disabled:opacity-50"
    />
  );
}

/* ─── Image upload zone ──────────────────────────────────────────────────── */
function ImageUploadZone({
  label, hint,
  displayImage, displayName,
  isBusy, isUploading,
  onPick, onRemove, fileInputRef,
  isCover = false,
}) {
  const heightCls = isCover ? "h-32 sm:h-40" : "py-7";
  const previewH  = isCover ? "h-32 sm:h-40" : "h-32";

  return (
    <div className="w-full max-w-md">
  <Label>{label}</Label>

  {!displayImage ? (
    <div
      onClick={() => !isBusy && fileInputRef.current?.click()}
      className="
        w-full aspect-[16/10]
        border-2 border-dashed border-gray-300 dark:border-slate-600
        rounded-xl bg-white dark:bg-[#0f172a]
        flex flex-col items-center justify-center
        cursor-pointer hover:border-blue-400 dark:hover:border-blue-500
        transition-colors
      "
    >
      <svg className="w-12 h-12 text-blue-400 mb-1.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
      </svg>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {isCover ? "Upload cover image" : "Choose an image"}
      </p>
      {hint && (
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{hint}</p>
      )}
    </div>
  ) : (
    <div
      className="
        w-full aspect-[16/10]
        border-2 border-dashed border-gray-300 dark:border-slate-600
        rounded-xl bg-white dark:bg-[#0f172a] overflow-hidden
        flex flex-col
      "
    >
      <div className="relative flex-1 w-full">
        <img
          src={displayImage}
          alt="preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/25 pointer-events-none" />
      </div>

      <div className="flex items-center justify-between px-3 py-2 gap-3 border-t border-gray-200 dark:border-slate-700">
        <span className="text-xs text-gray-600 dark:text-slate-300 font-medium truncate flex-1">
          {displayName}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="text-xs text-blue-500 dark:text-blue-400 hover:underline disabled:opacity-60"
          >
            Change
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={isBusy}
            className="text-red-500 dark:text-red-400 hover:text-red-700 disabled:opacity-60 transition-colors"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    disabled={isBusy}
    onChange={(e) => {
      const f = e.target.files?.[0];
      if (f) onPick(f);
      e.target.value = "";
    }}
  />

  {isUploading && (
    <p className="mt-1.5 text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1.5">
      <span className="w-3 h-3 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
      Uploading to Cloudinary…
    </p>
  )}
</div>

  );
}

/* ─── Main modal ─────────────────────────────────────────────────────────── */
export default function EditBusinessModal({ user, onClose, onSaved, onCoverSaved }) {
  const [updateBusinessProfile, { isLoading: saving }] = useUpdateBusinessProfileMutation();

  const [form, setForm] = useState({
    fullName:        user?.fullName        ?? "",
    gender:          user?.gender          ?? "",
    email:           user?.email           ?? "",
    phone:           user?.phone           ?? "",
    address:         user?.address         ?? "",
    companyName:     user?.companyName     ?? "",
    companyWebsite:  user?.companyWebsite  ?? "",
    industry:        user?.industry        ?? "",
    profileImageUrl: user?.profileImageUrl ?? "",
    bio:             user?.bio             ?? "",
  });

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  /* ── Profile image (Cloudinary → backend) ──────────────────── */
  const profileRef         = useRef(null);
  const [profileFile,      setProfileFile]      = useState(null);
  const [profilePreview,   setProfilePreview]   = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const profileDisplay = profilePreview || form.profileImageUrl || null;
  const profileName    = profileFile?.name ?? (form.profileImageUrl ? "Current photo" : null);

  const pickProfile = (file) => {
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };
  const removeProfile = () => {
    setProfileFile(null);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(null);
    setForm((p) => ({ ...p, profileImageUrl: "" }));
    if (profileRef.current) profileRef.current.value = "";
  };

  /* ── Cover image (Cloudinary → Supabase user_covers) ──────── */
  const coverRef         = useRef(null);
  const [coverFile,      setCoverFile]      = useState(null);
  const [coverPreview,   setCoverPreview]   = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [existingCover,  setExistingCover]  = useState(null);

  const coverDisplay = coverPreview || existingCover || null;
  const coverName    = coverFile?.name ?? (existingCover ? "Current cover" : null);

  // Load existing cover from Supabase on open
  useEffect(() => {
    const userId = String(user?.id ?? user?.userId ?? "");
    if (!userId) return;
    supabase
      .from("user_covers")
      .select("cover_url")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.warn("load cover error:", error.message);
        if (data?.cover_url) setExistingCover(data.cover_url);
      });
  }, [user?.id, user?.userId]);

  const pickCover = (file) => {
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

  /* cleanup object URLs */
  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (coverPreview)   URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  /* error state */
  const [submitError, setSubmitError] = useState("");

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleUpdate = async () => {
    setSubmitError("");
    try {
      /* 1. Upload profile photo → Cloudinary */
      let profileImageUrl = form.profileImageUrl;
      if (profileFile) {
        setUploadingProfile(true);
        profileImageUrl = await uploadImageToCloudinary(profileFile);
        setUploadingProfile(false);
        console.log("✅ profile uploaded to Cloudinary:", profileImageUrl);
      }

      /* 2. Upload cover → Cloudinary → save URL to Supabase user_covers */
      if (coverFile) {
        const userId = String(user?.id ?? user?.userId ?? "");
        setUploadingCover(true);
        const cloudinaryCoverUrl = await uploadImageToCloudinary(coverFile);
        setUploadingCover(false);
        console.log("✅ cover uploaded to Cloudinary:", cloudinaryCoverUrl);

        // Save URL in Supabase (no backend endpoint for coverImageUrl)
        const { error: upsertErr } = await supabase
          .from("user_covers")
          .upsert(
            { user_id: userId, cover_url: cloudinaryCoverUrl, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );

        if (upsertErr) {
          console.error("❌ Supabase upsert error:", upsertErr.message);
          setSubmitError(`Cover saved to Cloudinary but couldn't update profile: ${upsertErr.message}`);
          // Don't block — still save the rest of the form
        } else {
          console.log("✅ cover URL saved to Supabase user_covers");
          setExistingCover(cloudinaryCoverUrl);
          // ← Immediately update the parent's coverUrl state (no page reload needed)
          onCoverSaved?.(cloudinaryCoverUrl);
        }
      }

      /* 3. Save all other profile fields to backend */
      await updateBusinessProfile({
        fullName:       form.fullName,
        gender:         form.gender,
        email:          form.email,
        phone:          form.phone,
        address:        form.address,
        companyName:    form.companyName,
        companyWebsite: form.companyWebsite,
        industry:       form.industry,
        bio:            form.bio,
        profileImageUrl,
      }).unwrap();

      console.log("✅ business profile updated");
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("❌ handleUpdate error:", err);
      setUploadingProfile(false);
      setUploadingCover(false);
      setSubmitError(
        err?.data?.message || err?.message || "Something went wrong. Please try again."
      );
    }
  };

  const isBusy   = uploadingProfile || uploadingCover || saving;
  const btnLabel = uploadingProfile ? "Uploading photo…"
                 : uploadingCover   ? "Uploading cover…"
                 : saving           ? "Saving…"
                 : "Update";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4
                    bg-black/30 dark:bg-black/50">
      <div className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl
                      bg-gray-50 dark:bg-[#1e293b] transition-colors duration-300">

        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Company Profile Update
          </h2>
          <button onClick={onClose} disabled={isBusy}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shrink-0
                       bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Error banner */}
        {submitError && (
          <div className="mx-8 mb-4 px-4 py-3 rounded-xl text-sm
                          bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                          text-red-600 dark:text-red-400">
            {submitError}
          </div>
        )}

        {/* Fields */}
        <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

          <div><Label>Full Name</Label>
            <TextInput value={form.fullName}       onChange={set("fullName")}       placeholder="John Smith"           disabled={isBusy} /></div>
          <div><Label>Phone</Label>
            <TextInput value={form.phone}          onChange={set("phone")}          placeholder="097887766"            disabled={isBusy} /></div>
          <div><Label>Email</Label>
            <TextInput value={form.email}          onChange={set("email")}          placeholder="john@gmail.com"       type="email" disabled={isBusy} /></div>
          <div><Label>Company Focus</Label>
            <TextInput value={form.industry}       onChange={set("industry")}       placeholder="Software development" disabled={isBusy} /></div>
          <div><Label>Location</Label>
            <TextInput value={form.address}        onChange={set("address")}        placeholder="Phnom Penh"           disabled={isBusy} /></div>
          <div><Label>Website</Label>
            <TextInput value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="www.example.com"     disabled={isBusy} /></div>
          <div><Label>Company Name</Label>
            <TextInput value={form.companyName}    onChange={set("companyName")}    placeholder="Tech Innovators Inc." disabled={isBusy} /></div>
          <div>
            <Label>Gender</Label>
            <select value={form.gender} onChange={set("gender")} disabled={isBusy}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition
                         border border-gray-200 dark:border-slate-600
                         bg-white dark:bg-[#0f172a] text-gray-800 dark:text-white
                         focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 disabled:opacity-50">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ── Cover image — full width ── */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <ImageUploadZone
              label="Cover Image"
              hint="Uploads to Cloudinary. Recommended: 1600 × 400 px"
              displayImage={coverDisplay}
              displayName={coverName}
              isBusy={isBusy}
              isUploading={uploadingCover}
              onPick={pickCover}
              onRemove={removeCover}
              fileInputRef={coverRef}
              isCover={true}
            />
          </div>

          {/* ── Profile photo + Bio ── */}
            <ImageUploadZone
              label="Profile / Logo Image"
              hint="Uploads to Cloudinary"
              displayImage={profileDisplay}
              displayName={profileName}
              isBusy={isBusy}
              isUploading={uploadingProfile}
              onPick={pickProfile}
              onRemove={removeProfile}
              fileInputRef={profileRef}
              isCover={false}
            />
            {/* <div>
              <Label>About me</Label>
              <textarea value={form.bio ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="description" rows={5} disabled={isBusy}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition
                           min-h-[130px] h-full
                           border border-gray-200 dark:border-slate-600
                           bg-white dark:bg-[#0f172a] text-gray-700 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-slate-500
                           focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 disabled:opacity-50" />
            </div> */}
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-center py-8">
          <button onClick={handleUpdate} disabled={isBusy}
            className="px-24 py-3 rounded-full text-sm font-semibold text-white
                       flex items-center gap-2 transition-colors
                       bg-blue-500 hover:bg-blue-600
                       disabled:opacity-60 disabled:cursor-not-allowed">
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