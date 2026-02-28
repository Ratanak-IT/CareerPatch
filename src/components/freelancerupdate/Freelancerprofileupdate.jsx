import { useState, useRef } from "react";

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
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  if (!editOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-9 pt-8 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Freelancer Profile Update</h2>
          <button
            onClick={() => setEditOpen(false)}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg w-9 h-9 flex items-center justify-center text-sm font-semibold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-9 py-6 flex flex-col gap-5">

          {/* Row 1: Full Name + Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* Row 2: Address + Experience Years */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input
                className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Experience Years</label>
              <input
                type="number"
                className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Experience years"
                value={form.experienceYears}
                onChange={(e) =>
                  setForm((p) => ({ ...p, experienceYears: Number(e.target.value || 0) }))
                }
              />
            </div>
          </div>

          {/* Row 3: Skills + Image Upload */}
          <div className="grid grid-cols-2 gap-6">

            {/* Skills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Skill</label>

              {/* Skill tags */}
              <div className="border border-slate-200 rounded-xl px-3.5 py-2.5 flex flex-wrap gap-2 items-center min-h-[46px] bg-white">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100"
                  >
                    {s}
                    <button
                      onClick={() => onRemoveSkill(s)}
                      className="text-blue-400 hover:text-blue-700 text-base leading-none transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={onAddSkill}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-semibold transition-colors"
                >
                  <span className="text-base leading-none">⊕</span> Add skill
                </button>
              </div>

              {/* Skill input */}
              <input
                className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Type skill then press Enter"
                value={skillText}
                onChange={(e) => setSkillText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddSkill();
                  }
                }}
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current.click()}
              >
                <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-slate-500">Choose a image here</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {imageFile && (
                <div className="border border-dashed border-slate-300 rounded-xl px-3 py-2.5 flex items-center gap-3 bg-slate-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                  <span className="flex-1 text-sm font-medium text-gray-700 truncate">
                    {imageFile.name}
                  </span>
                  <button
                    onClick={handleRemoveImage}
                    className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">About me</label>
            <textarea
              className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              placeholder="Bio / description"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-9 pb-9 flex justify-center gap-3">
          <button
            onClick={() => setEditOpen(false)}
            className="px-8 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSaveProfile}
            disabled={saving}
            className="px-10 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}