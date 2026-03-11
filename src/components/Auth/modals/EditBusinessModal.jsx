import React, { useRef, useState, useEffect } from "react";
import { useUpdateBusinessProfileMutation } from "../../../services/profileApi";
import { uploadImageToCloudinary } from "../../../utils/uploadToCloudinary";

function Label({ children }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800
                 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-blue-400
                 disabled:opacity-50
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
    />
  );
}

export default function EditBusinessModal({ user, onClose, onSaved }) {
  const [updateBusinessProfile, { isLoading: saving }] =
    useUpdateBusinessProfileMutation();

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
    bio: user?.bio ?? "",
  });

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const fileInputRef = useRef(null);
  const [pickedFile, setPickedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const displayImage = localPreview || form.profileImageUrl || null;
  const displayName =
    pickedFile?.name ?? (form.profileImageUrl ? "Current photo" : null);

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

  const handleUpdate = async () => {
    try {
      let imageUrl = form.profileImageUrl;

      if (pickedFile) {
        setUploading(true);
        imageUrl = await uploadImageToCloudinary(pickedFile);
        setUploading(false);
      }

      await updateBusinessProfile({
        fullName: form.fullName,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        address: form.address,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        industry: form.industry,
        bio: form.bio,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 dark:bg-black/50">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-gray-50 shadow-2xl dark:bg-gray-900 dark:shadow-black/40">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Company Profile Update
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500
                       text-xl font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-8 pb-6 sm:grid-cols-2">
          <div>
            <Label>Full Name</Label>
            <TextInput
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="John Smith"
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <TextInput
              value={form.phone}
              onChange={set("phone")}
              placeholder="097887766"
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Email</Label>
            <TextInput
              value={form.email}
              onChange={set("email")}
              placeholder="john@gmail.com"
              type="email"
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Company focus</Label>
            <TextInput
              value={form.industry}
              onChange={set("industry")}
              placeholder="Software development"
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Location</Label>
            <TextInput
              value={form.address}
              onChange={set("address")}
              placeholder="Phnom Penh"
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Website</Label>
            <TextInput
              value={form.companyWebsite}
              onChange={set("companyWebsite")}
              placeholder="www.technovasolution.com"
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Company Name</Label>
            <TextInput
              value={form.companyName}
              onChange={set("companyName")}
              placeholder="Tech Innovators Inc."
              disabled={isBusy}
            />
          </div>

          <div>
            <Label>Gender</Label>
            <select
              value={form.gender}
              onChange={set("gender")}
              disabled={isBusy}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800
                         outline-none transition focus:ring-2 focus:ring-blue-400 disabled:opacity-50
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Upload Profile Image + About */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:col-span-2 sm:grid-cols-2">
            {/* Left */}
            <div>
              <Label>Upload Profile Image</Label>

              {!displayImage && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-7 transition-colors hover:border-blue-400
                             dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
                >
                  <svg
                    className="mb-1.5 h-14 w-14 text-blue-400 dark:text-blue-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose a image here
                  </p>
                </div>
              )}

              {displayImage && (
                <div className="space-y-2 rounded-xl border-2 border-dashed border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={displayImage}
                      alt="preview"
                      className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                    />
                    <span className="flex-1 truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                      {displayName}
                    </span>
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={isBusy}
                      className="shrink-0 text-red-500 transition-colors hover:text-red-700 disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                             4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    className="text-xs text-blue-500 hover:underline disabled:opacity-60 dark:text-blue-400"
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
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-500 dark:text-blue-400">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent dark:border-blue-400" />
                  Uploading image…
                </p>
              )}
            </div>

            {/* Right */}
            {/* <div>
              <Label>About me</Label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="description"
                rows={5}
                disabled={isBusy}
                className="h-full min-h-[130px] w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700
                           placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-blue-400 disabled:opacity-50
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
              />
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleUpdate}
            disabled={isBusy}
            className="flex items-center gap-2 rounded-full bg-blue-500 px-24 py-3 text-sm font-semibold text-white
                       transition-colors hover:bg-blue-600 disabled:opacity-60"
          >
            {isBusy && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}