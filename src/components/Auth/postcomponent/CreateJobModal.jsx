// src/components/Auth/postcomponent/CreateJobModal.jsx
import { useState } from "react";
import {
  useCreateJobMutation,
  useGetCategoriesQuery,
} from "../../../services/servicesApi";

export default function CreateJobModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    budget: "",
    jobImages: [],
  });
  const [imageInput, setImageInput] = useState("");
  const [error, setError] = useState("");

  const { data: categories = [] } = useGetCategoriesQuery();
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm((p) => ({ ...p, jobImages: [...p.jobImages, url] }));
    setImageInput("");
  };

  const handleRemoveImage = (idx) =>
    setForm((p) => ({ ...p, jobImages: p.jobImages.filter((_, i) => i !== idx) }));

  const handleSubmit = async () => {
    if (!form.title.trim())       return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.categoryId)         return setError("Please select a category.");
    setError("");
    try {
      await createJob({
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
      }).unwrap();
      onClose();
    } catch (e) {
      setError("Failed to create job. Please try again.");
      console.error("create job error:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Post a Job</h2>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold transition-colors">✕</button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">{error}</div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
            <input className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. React Developer Needed" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
            <textarea className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 resize-none" rows={4} placeholder="Describe the job requirements..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
            <select className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400" value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
              <option value="">— Select a category —</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Budget ($)</label>
            <input type="number" min="0" className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. 1500" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Image URLs</label>
            <div className="flex gap-2">
              <input className="flex-1 bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400" placeholder="Paste image URL then press Add" value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddImage(); } }} />
              <button onClick={handleAddImage} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold">Add</button>
            </div>
            {form.jobImages.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {form.jobImages.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" onError={(e) => { e.currentTarget.src = "https://placehold.co/48?text=?"; }} />
                    <span className="flex-1 text-xs text-gray-500 truncate">{url}</span>
                    <button onClick={() => handleRemoveImage(idx)} className="text-red-500 hover:text-red-700 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-8 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2">
            {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isLoading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
