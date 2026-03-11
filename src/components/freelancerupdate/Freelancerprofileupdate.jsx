import { useState, useRef, useEffect } from "react";
import { useUploadProfileImageMutation } from "../../services/profileApi";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary";

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
}) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const [uploadProfileImage, { isLoading: uploading }] =
    useUploadProfileImageMutation();

  const busy = saving || uploading;

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

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleUpdate = async () => {
    try {
      let uploadedUrl = null;

      if (imageFile) {
        uploadedUrl = await uploadImageToCloudinary(imageFile);
        console.log("Profile image uploaded URL:", uploadedUrl);
        handleRemoveImage();
      }

      await onSaveProfile(uploadedUrl);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  if (!editOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900 dark:shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 pt-7 pb-4 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Freelancer Profile Update
          </h2>

          <button
            type="button"
            onClick={() => setEditOpen(false)}
            disabled={busy}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 text-lg font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-8 py-7">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Full Name
              </label>
              <input
                disabled={busy}
                type="text"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Phone
              </label>
              <input
                disabled={busy}
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Address
              </label>
              <input
                disabled={busy}
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Experience Years
              </label>
              <input
                disabled={busy}
                type="number"
                placeholder="Experience years"
                value={form.experienceYears}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    experienceYears: Number(e.target.value || 0),
                  }))
                }
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Skills */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Skills
              </label>

              <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {skill}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onRemoveSkill(skill)}
                      className="text-sm leading-none text-blue-500 transition hover:text-blue-700 disabled:opacity-60 dark:text-blue-300 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  disabled={busy}
                  onClick={onAddSkill}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-500 transition hover:text-blue-700 disabled:opacity-60 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  <span className="text-base leading-none">⊕</span>
                  Add skill
                </button>
              </div>

              <input
                disabled={busy}
                type="text"
                placeholder="Type skill then press Enter"
                value={skillText}
                onChange={(e) => setSkillText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddSkill();
                  }
                }}
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Profile Image
              </label>

              <div
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 transition hover:border-blue-400 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
              >
                <svg
                  className="h-10 w-10 text-blue-400 dark:text-blue-300"
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

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {imageFile ? "Image selected" : "Choose an image here"}
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
                <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 dark:border-gray-700 dark:bg-gray-800">
                  <img
                    src={imagePreview || "https://placehold.co/48x48?text=IMG"}
                    alt="preview"
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />

                  <span className="flex-1 truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                    {imageFile.name}
                  </span>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={busy}
                    className="shrink-0 text-red-500 transition hover:text-red-700 disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      className="h-5 w-5"
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

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              About Me
            </label>
            <textarea
              disabled={busy}
              rows={5}
              placeholder="Write something about yourself..."
              value={form.bio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-8 py-5 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setEditOpen(false)}
            disabled={busy}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {uploading ? "Uploading..." : saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}