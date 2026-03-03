// src/components/card/OwnJobCard.jsx
import { useRef, useState } from "react";
import { Link } from "react-router";
import { useBookmarks } from "../../hooks/useBookmarks";
import {
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetCategoriesQuery,
} from "../../services/servicesApi";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function getImage(j) {
  if (Array.isArray(j?.jobImages) && j.jobImages.length > 0) return j.jobImages[0];
  if (Array.isArray(j?.imageUrls) && j.imageUrls.length > 0) return j.imageUrls[0];
  return FALLBACK_IMAGE;
}

// ─── Edit Job Modal ───────────────────────────────────────────────────────────
function EditJobModal({ job, onClose }) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [form, setForm] = useState({
    title:       job?.title || "",
    description: job?.description || "",
    categoryId:  job?.category?.id || job?.categoryId || "",
    budget:      job?.budget || "",
    jobImages:   Array.isArray(job?.jobImages)
      ? job.jobImages.map((i) => i?.imageUrl || i)
      : [],
  });

  const [imageInput, setImageInput] = useState("");
  const [pickedFile, setPickedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState("");

  const fileRef = useRef(null);
  const [updateJob, { isLoading }] = useUpdateJobMutation();
  const busy = isLoading || uploading;

  const handleFileChange = (file) => {
    if (!file) return;
    setUploadErr("");
    setPickedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePicked = () => {
    setPickedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAddUrl = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm((p) => ({ ...p, jobImages: [...p.jobImages, url] }));
    setImageInput("");
  };

  const handleRemoveImage = (idx) =>
    setForm((p) => ({ ...p, jobImages: p.jobImages.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    setUploadErr("");
    try {
      let jobImages = form.jobImages;

      if (pickedFile) {
        setUploading(true);
        const url = await uploadImageToCloudinary(pickedFile);
        jobImages = [...jobImages, url];
        setUploading(false);
      }

      await updateJob({
        id: job.id,
        ...form,
        jobImages,
        budget: form.budget ? Number(form.budget) : undefined,
      }).unwrap();

      onClose();
    } catch (e) {
      console.error("update job error:", e);
      setUploading(false);
      setUploadErr(e?.message || "Failed to save. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Edit Job Post</h2>
          <button onClick={onClose} disabled={busy}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
              <option value="">— Select a category —</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Budget ($)</label>
            <input type="number" className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} />
          </div>

          {/* ── Upload from device / Google Drive ── */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Upload Image</label>
            <p className="text-xs text-gray-400">
              On Chrome/Edge, the file picker includes a "Google Drive" option in the sidebar.
            </p>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
              className="border-2 border-dashed border-gray-300 hover:border-blue-400 disabled:opacity-50 rounded-xl py-5 text-sm text-gray-500 transition-colors flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Choose image from device / Google Drive
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])} />

            {pickedFile && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                <span className="flex-1 text-xs text-gray-600 truncate">{pickedFile.name}</span>
                <button type="button" onClick={handleRemovePicked} className="text-red-500 font-bold text-sm">✕</button>
              </div>
            )}
          </div>

          {/* URL input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Or paste image URL</label>
            <div className="flex gap-2">
              <input className="flex-1 bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://..." value={imageInput} onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddUrl(); } }} />
              <button type="button" onClick={handleAddUrl}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold">Add</button>
            </div>
          </div>

          {/* Existing images */}
          {form.jobImages.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Current Images ({form.jobImages.length})</label>
              {form.jobImages.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <img src={url} alt={`img-${idx}`} className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} />
                  <span className="flex-1 text-xs text-gray-500 truncate">{url}</span>
                  <button type="button" onClick={() => handleRemoveImage(idx)}
                    className="text-red-500 font-bold text-sm flex-shrink-0">✕</button>
                </div>
              ))}
            </div>
          )}

          {uploadErr && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadErr}</p>
          )}
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={busy}
            className="px-6 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="button" onClick={handleSave} disabled={busy}
            className="px-8 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2">
            {busy && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {uploading ? "Uploading..." : isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteJobModal({ job, onClose }) {
  const [deleteJob, { isLoading }] = useDeleteJobMutation();
  const handleDelete = async () => {
    try { await deleteJob(job.id).unwrap(); onClose(); }
    catch (e) { console.error("delete job error:", e); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Delete Job Post?</h2>
          <p className="text-sm text-gray-500">Are you sure you want to delete <span className="font-semibold text-gray-700">"{job?.title}"</span>? This cannot be undone.</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleDelete} disabled={isLoading} className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2">
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
      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(p => !p); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" aria-label="More options">
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-10 z-20 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden w-36">
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Edit
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const image        = getImage(job);
  const categoryName = job?.category?.name || job?.categoryName || null;

  return (
    <>
      <Link
        to={`/jobs/${job?.id}`}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col w-full border border-gray-100"
      >
        {/* Image */}
        <div className="relative" style={{ height: 176 }}>
          <img src={image} alt={job?.title} className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} />
          <button onClick={toggle}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition-transform hover:scale-110 active:scale-95"
            aria-label={liked ? "Remove bookmark" : "Bookmark"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill={liked ? "#3B82F6" : "none"} stroke={liked ? "#3B82F6" : "#9ca3af"} strokeWidth="1.8" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-blue-500 font-bold text-sm mb-1 truncate">{job?.title || "Untitled"}</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
            style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
            {job?.description || "No description"}
          </p>

          {/* Tags + date */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-y-1">
            <div className="flex flex-wrap gap-1">
              {categoryName
                ? <span className="bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">{categoryName}</span>
                : <span className="text-gray-300 text-xs italic">No category</span>}
            </div>
            <span className="text-gray-400 text-xs">{formatDate(job?.createdAt)}</span>
          </div>

          <div className="border-t border-gray-100 mb-3" />

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <img src={avatar || "https://placehold.co/32x32?text=?"} alt={author}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/32x32?text=?"; }} />
              <span className="text-gray-700 text-xs font-medium truncate max-w-[80px]">{author || "Business"}</span>
            </div>
            <CardMenu onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />
          </div>
        </div>
      </Link>

      {editOpen   && <EditJobModal   job={job} onClose={() => setEditOpen(false)} />}
      {deleteOpen && <DeleteJobModal job={job} onClose={() => setDeleteOpen(false)} />}
    </>
  );
}
