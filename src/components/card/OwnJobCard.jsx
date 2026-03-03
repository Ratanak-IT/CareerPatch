// src/components/card/OwnJobCard.jsx
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { useBookmarks } from "../../hooks/useBookmarks";
import {
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetCategoriesQuery,
} from "../../services/servicesApi";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary";
import EditJobModal from "../modals/EditJobModal";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

// ─── helpers ──────────────────────────────────────────────────────────────────
const EXPERIENCE_LEVELS = ["Entry", "Junior", "Intermediate", "Senior", "Expert"];

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

function getImage(j) {
  if (Array.isArray(j?.jobImages) && j.jobImages.length > 0) return j.jobImages[0];
  if (Array.isArray(j?.imageUrls) && j.imageUrls.length > 0) return j.imageUrls[0];
  return FALLBACK_IMAGE;
}

function Label({ children }) {
  return <label className="block text-sm font-medium text-gray-600 mb-1.5">{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = "text", disabled, prefix }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition">
      {prefix && <span className="pl-4 pr-1 text-sm text-gray-500 select-none">{prefix}</span>}
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

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-blue-200 text-blue-600 text-xs font-medium px-3 py-1 rounded-full bg-white">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-blue-400 hover:text-blue-700 leading-none text-base font-bold"
      >
        ×
      </button>
    </span>
  );
}

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
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
        Add skill
      </button>
    </div>
  );
}

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
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        placeholder="Type a responsibility and press Enter…"
        className="text-xs text-gray-700 bg-transparent outline-none placeholder:text-gray-400 py-0.5 mt-auto"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={commit}
          className="flex items-center gap-1 text-blue-500 text-xs font-semibold hover:text-blue-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" strokeLinecap="round" />
          </svg>
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteJobModal({ job, onClose }) {
  const [deleteJob, { isLoading }] = useDeleteJobMutation();
  const handleDelete = async () => {
    try {
      await deleteJob(job.id).unwrap();
      onClose();
    } catch (e) {
      console.error("delete job error:", e);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Delete Job Post?</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">"{job?.title}"</span>? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 3-dot Menu ───────────────────────────────────────────────────────────────
function CardMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="More options"
      >
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-10 z-20 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden w-36">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export default function OwnJobCard({ job, author, avatar }) {
  const { liked, toggle } = useBookmarks({ id: job?.id, type: "job" });
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const image = getImage(job);
  const categoryName = job?.category?.name || job?.categoryName || null;

  return (
    <>
      <Link
        to={`/jobs/${job?.id}`}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col w-full border border-gray-100"
      >
        {/* Image */}
        <div className="relative" style={{ height: 176 }}>
          <img
            src={image}
            alt={job?.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <button
            onClick={toggle}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition-transform hover:scale-110 active:scale-95"
            aria-label={liked ? "Remove bookmark" : "Bookmark"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={liked ? "#3B82F6" : "none"}
              stroke={liked ? "#3B82F6" : "#9ca3af"}
              strokeWidth="1.8"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-blue-500 font-bold text-sm mb-1 truncate">{job?.title || "Untitled"}</h3>
          <p
            className="text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
            style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
          >
            {job?.description || "No description"}
          </p>

          {/* Tags + date */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-y-1">
            <div className="flex flex-wrap gap-1">
              {categoryName ? (
                <span className="bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {categoryName}
                </span>
              ) : (
                <span className="text-gray-300 text-xs italic">No category</span>
              )}
            </div>
            <span className="text-gray-400 text-xs">{formatDate(job?.createdAt)}</span>
          </div>

          <div className="border-t border-gray-100 mb-3" />

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <img
                src={avatar || "https://placehold.co/32x32?text=?"}
                alt={author}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/32x32?text=?";
                }}
              />
              <span className="text-gray-700 text-xs font-medium truncate max-w-[80px]">
                {author || "Business"}
              </span>
            </div>
            <CardMenu onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />
          </div>
        </div>
      </Link>

      {editOpen && <EditJobModal job={job} onClose={() => setEditOpen(false)} />}
      {deleteOpen && <DeleteJobModal job={job} onClose={() => setDeleteOpen(false)} />}
    </>
  );
}