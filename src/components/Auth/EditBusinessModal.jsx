import React, { useRef, useState, useEffect } from "react";
import { useUpdateBusinessProfileMutation } from "../../services/profileApi";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary"; // ✅ adjust if different path

function Label({ children }) {
  return <label className="block text-sm font-medium text-gray-600 mb-1.5">{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-400
                 disabled:opacity-50 transition"
    />
  );
}

export default function EditBusinessModal({ user, onClose, onSaved }) {
  const [updateBusinessProfile, { isLoading: saving }] = useUpdateBusinessProfileMutation();

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    gender: user?.gender ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    companyName: user?.companyName ?? "",
    companyWebsite: user?.companyWebsite ?? "",
    industry: user?.industry ?? "",
    profileImageUrl: user?.profileImageUrl ?? "",
    bio: user?.bio ?? "", // ✅ keep because your UI uses bio
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── image state ────────────────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [pickedFile, setPickedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const displayImage = localPreview || form.profileImageUrl || null;
  const displayName = pickedFile?.name ?? (form.profileImageUrl ? "Current photo" : null);

  const onPickFile = (file) => {
    if (!file) return;
    setPickedFile(file);
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
  };

  const removeImage = () => {
    setPickedFile(null);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setForm((p) => ({ ...p, profileImageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      let imageUrl = form.profileImageUrl;

      // ✅ 1) upload to Cloudinary first
      if (pickedFile) {
        setUploading(true);
        imageUrl = await uploadImageToCloudinary(pickedFile);
        setUploading(false);
      }

      // ✅ 2) save profile with URL
      await updateBusinessProfile({
        fullName: form.fullName,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        address: form.address,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        industry: form.industry,
        bio: form.bio, // if backend ignores, no problem
        profileImageUrl: imageUrl,
      }).unwrap();

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("update-business-profile failed:", err);
      setUploading(false);
    }
  };

  const isBusy = uploading || saving;
  const btnLabel = uploading ? "Uploading…" : saving ? "Saving…" : "Update";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">
      <div className="bg-gray-50 rounded-2xl w-full max-w-3xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-5">
          <h2 className="text-2xl font-bold text-gray-900">Company Profile Update</h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl w-10 h-10
                       flex items-center justify-center text-xl font-bold shrink-0 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <Label>Full Name</Label>
            <TextInput value={form.fullName} onChange={set("fullName")} placeholder="John Smith" disabled={isBusy} />
          </div>

          <div>
            <Label>Phone</Label>
            <TextInput value={form.phone} onChange={set("phone")} placeholder="097887766" disabled={isBusy} />
          </div>

          <div>
            <Label>Email</Label>
            <TextInput value={form.email} onChange={set("email")} placeholder="john@gmail.com" type="email" disabled={isBusy} />
          </div>

          <div>
            <Label>Company focus</Label>
            <TextInput value={form.industry} onChange={set("industry")} placeholder="Software development" disabled={isBusy} />
          </div>

          <div>
            <Label>Location</Label>
            <TextInput value={form.address} onChange={set("address")} placeholder="Phnom Penh" disabled={isBusy} />
          </div>

          <div>
            <Label>Website</Label>
            <TextInput value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="www.technovasolution.com" disabled={isBusy} />
          </div>

          <div>
            <Label>Company Name</Label>
            <TextInput value={form.companyName} onChange={set("companyName")} placeholder="Tech Innovators Inc." disabled={isBusy} />
          </div>

          <div>
            <Label>Gender</Label>
            <select
              value={form.gender}
              onChange={set("gender")}
              disabled={isBusy}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white
                         outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Upload Profile Image + About */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left */}
            <div>
              <Label>Upload Profile Image</Label>

              {!displayImage && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col
                             items-center justify-center py-7 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <svg className="w-14 h-14 text-blue-400 mb-1.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000
                      14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                  </svg>
                  <p className="text-sm text-gray-500">Choose a image here</p>
                </div>
              )}

              {displayImage && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={displayImage}
                      alt="preview"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <span className="text-sm text-gray-700 font-medium truncate flex-1">{displayName}</span>
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={isBusy}
                      className="text-red-500 hover:text-red-700 disabled:opacity-60 shrink-0 transition-colors"
                      title="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                             4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    className="text-xs text-blue-500 hover:underline disabled:opacity-60"
                  >
                    Change image
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0])}
                disabled={isBusy}
              />

              {uploading && (
                <p className="mt-1.5 text-xs text-blue-500 flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Uploading image…
                </p>
              )}
            </div>

            {/* Right */}
            <div>
              <Label>About me</Label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="description"
                rows={5}
                disabled={isBusy}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-white
                           placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-400
                           resize-none transition h-full min-h-[130px] disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleUpdate}
            disabled={isBusy}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold
                       px-24 py-3 rounded-full text-sm flex items-center gap-2 transition-colors"
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