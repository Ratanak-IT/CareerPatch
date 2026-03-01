

import React, { useRef, useState } from "react";
import { useGetCategoriesQuery, useCreateJobMutation } from "../../../services/servicesApi";
import { useUploadProfileImageMutation } from "../../../services/profileApi";

// ─── helpers ──────────────────────────────────────────────────────────────────
const EXPERIENCE_LEVELS = ["Entry", "Junior", "Intermediate", "Senior", "Expert"];

function Label({ children }) {
  return (
    <label className="block text-sm font-medium text-gray-600 mb-1.5">{children}</label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled, prefix }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition">
      {prefix && (
        <span className="pl-4 pr-1 text-sm text-gray-500 select-none">{prefix}</span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-3 text-sm text-gray-800 bg-transparent placeholder:text-gray-400 outline-none disabled:opacity-50"
      />
    </div>
  );
}

// Tag chip with × button
function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-blue-200 text-blue-600 text-xs font-medium px-3 py-1 rounded-full bg-white">
      {label}
      <button type="button" onClick={onRemove}
        className="text-blue-400 hover:text-blue-700 leading-none text-base font-bold">
        ×
      </button>
    </span>
  );
}

// Tags box: shows chips + "⊕ Add" inline input
function TagsBox({ tags, onAdd, onRemove, placeholder = "Type and press Enter…" }) {
  const [input, setInput] = useState("");

  const commit = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onAdd(v);
    setInput("");
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white px-3 py-2.5 min-h-[52px] flex flex-wrap gap-2 items-start">
      {tags.map((t) => (
        <Tag key={t} label={t} onRemove={() => onRemove(t)} />
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] text-xs text-gray-700 bg-transparent outline-none placeholder:text-gray-400 py-0.5"
      />
      <button
        type="button"
        onClick={commit}
        className="ml-auto flex items-center gap-1 text-blue-500 text-xs font-semibold shrink-0 hover:text-blue-700"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
        Add skill
      </button>
    </div>
  );
}

// Responsibilities box — same but different add label
function ResBox({ items, onAdd, onRemove }) {
  const [input, setInput] = useState("");

  const commit = () => {
    const v = input.trim();
    if (v && !items.includes(v)) onAdd(v);
    setInput("");
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white px-3 py-2.5 min-h-[120px] flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <Tag key={t} label={t} onRemove={() => onRemove(t)} />
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
        }}
        placeholder="Type a responsibility and press Enter…"
        className="text-xs text-gray-700 bg-transparent outline-none placeholder:text-gray-400 py-0.5 mt-auto"
      />
      <div className="flex justify-end">
        <button type="button" onClick={commit}
          className="flex items-center gap-1 text-blue-500 text-xs font-semibold hover:text-blue-700">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
          </svg>
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function CreateJobModal({ onClose }) {
  const { data: rawCategories = [] } = useGetCategoriesQuery();
  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : Array.isArray(rawCategories?.data) ? rawCategories.data : [];

  const [createJob, { isLoading: posting }] = useCreateJobMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProfileImageMutation();

  // ── form state ─────────────────────────────────────────────────────────────
  const [title,           setTitle]           = useState("");
  const [budget,          setBudget]          = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skills,          setSkills]          = useState([]);
  const [description,     setDescription]     = useState("");
  const [responsibilities,setResponsibilities]= useState([]);
  const [categoryId,      setCategoryId]      = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [status,          setStatus]          = useState("OPEN");

  // ── image state ────────────────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState([]); // final URL(s) for API

  const onPickFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!title.trim()) return;

    let jobImages = [...uploadedUrls];

    // Upload image if a new file was picked
    if (imageFile) {
      try {
        const res = await uploadImage(imageFile).unwrap();
        const url =
          res?.url ??
          res?.data?.url ??
          res?.profileImageUrl ??
          res?.data?.profileImageUrl ??
          null;
        if (url) jobImages = [url];
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    try {
      await createJob({
        title:           title.trim(),
        description:     description.trim(),
        categoryId:      categoryId || undefined,
        budget:          budget ? Number(budget) : undefined,
        jobImages,
        status,
        // extra fields — included so the backend can use them if supported
        experienceLevel: experienceLevel || undefined,
        skills:          skills.length ? skills : undefined,
        responsibilities:responsibilities.length ? responsibilities : undefined,
        projectDuration: projectDuration.trim() || undefined,
      }).unwrap();

      onClose();
    } catch (err) {
      console.error("create-job failed:", err);
    }
  };

  const isBusy   = posting || uploading;
  const btnLabel = uploading ? "Uploading…" : posting ? "Posting…" : "Post";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 overflow-y-auto py-8 px-4">
      <div className="bg-gray-50 rounded-2xl w-full max-w-3xl shadow-2xl">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-8 pb-2">
          {/* Back */}
          <button onClick={onClose}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Chat
          </button>

          {/* Close */}
          <button onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-10 h-10 flex items-center
                       justify-center text-xl font-bold transition-colors">
            ✕
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 px-8 pt-2 pb-6">Company Announcement</h2>

        {/* ── Fields ──────────────────────────────────────────────── */}
        <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

          {/* Job Title */}
          <div>
            <Label>Job Title</Label>
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Web Development" />
          </div>

          {/* Project Cost */}
          <div>
            <Label>Project Cost</Label>
            <TextInput
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="1500"
              type="text"
              prefix="$"
            />
          </div>

          {/* Experience Level */}
          <div>
            <Label>Experience level</Label>
            <div className="relative">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm
                           text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-400
                           transition pr-10"
              >
                <option value="">Intermediate</option>
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Skills needed */}
          <div>
            <Label>Skills needed</Label>
            <TagsBox
              tags={skills}
              onAdd={(v) => setSkills((p) => [...p, v])}
              onRemove={(v) => setSkills((p) => p.filter((s) => s !== v))}
              placeholder="e.g. React, Figma…"
            />
          </div>

          {/* Job Description */}
          <div>
            <Label>Job Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description"
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700
                         bg-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-400
                         resize-none transition"
            />
          </div>

          {/* Responsibilities (right of description) */}
          <div>
            <Label>Resonsibilities</Label>
            <ResBox
              items={responsibilities}
              onAdd={(v) => setResponsibilities((p) => [...p, v])}
              onRemove={(v) => setResponsibilities((p) => p.filter((r) => r !== v))}
            />
          </div>

          {/* Project Duration */}
          <div>
            <Label>Project Duration</Label>
            <TextInput
              value={projectDuration}
              onChange={(e) => setProjectDuration(e.target.value)}
              placeholder="4 months"
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm
                           text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-400
                           transition pr-10"
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm
                           text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-400
                           transition pr-10"
              >
                <option value="OPEN">Open</option>
                <option value="DRAFT">Draft</option>
                <option value="CLOSED">Closed</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Upload Image — full width */}
          <div className="sm:col-span-2">
            <Label>Job Image</Label>

            {/* Drop zone */}
            {!imagePreview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col
                           items-center justify-center py-8 cursor-pointer hover:border-blue-400
                           transition-colors"
              >
                <svg className="w-14 h-14 text-blue-400 mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000
                    14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                </svg>
                <p className="text-sm text-gray-500">Choose a image here</p>
              </div>
            )}

            {/* Preview */}
            {imagePreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <span className="text-sm text-gray-700 font-medium truncate flex-1">
                    {imageFile?.name ?? "Selected image"}
                  </span>
                  <button type="button" onClick={removeImage}
                    className="text-red-500 hover:text-red-700 transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                           4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs text-blue-500 hover:underline">
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
            />

            {uploading && (
              <p className="mt-1.5 text-xs text-blue-500 flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                Uploading image…
              </p>
            )}
          </div>

        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handlePost}
            disabled={isBusy || !title.trim()}
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