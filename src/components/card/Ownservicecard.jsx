import { useRef, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFavorite,
  selectIsFavorite,
} from "../../features/favorites/favoritesSlice";
import {
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetCategoriesQuery,
} from "../../services/servicesApi";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";

  let v = value;

  // if timestamp is in seconds, convert to ms
  if (typeof v === "number" && v < 1e12) v = v * 1000;

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getImage(s) {
  // API uses jobImages — normalizeService copies it to imageUrls, check both
  if (Array.isArray(s?.imageUrls) && s.imageUrls.length > 0)
    return s.imageUrls[0];
  if (Array.isArray(s?.jobImages) && s.jobImages.length > 0)
    return s.jobImages[0];
  if (typeof s?.jobImages === "string" && s.jobImages) return s.jobImages;
  return FALLBACK_IMAGE;
}

function getCategoryName(s) {
  return s?.category?.name || s?.categoryName || "—";
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditServiceModal({ service, onClose }) {
  const { data: categories = [] } = useGetCategoriesQuery();

  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    categoryId: service?.category?.id || service?.categoryId || "",
    status: service?.status || "ACTIVE",
    imageUrls: Array.isArray(service?.imageUrls)
      ? service.imageUrls
      : Array.isArray(service?.jobImages)
      ? service.jobImages.map((img) => img.imageUrl || img)
      : [],
  });

  const [imageInput, setImageInput] = useState("");
  const [pickedFile, setPickedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef(null);

  const [updateService, { isLoading }] = useUpdateServiceMutation();

  const busy = isLoading || uploading;

  // ── Add image from URL
  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm((p) => ({ ...p, imageUrls: [...p.imageUrls, url] }));
    setImageInput("");
  };

  const handleRemoveImage = (idx) =>
    setForm((p) => ({
      ...p,
      imageUrls: p.imageUrls.filter((_, i) => i !== idx),
    }));

  // ── Pick file
  const handleFileChange = (file) => {
    if (!file) return;
    setPickedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePicked = () => {
    setPickedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Save
  const handleSave = async () => {
    try {
      let imageUrls = form.imageUrls;

      // 1️⃣ Upload file to Cloudinary if selected
      if (pickedFile) {
        setUploading(true);
        const url = await uploadImageToCloudinary(pickedFile);
        imageUrls = [...imageUrls, url];
        setUploading(false);
      }

      // 2️⃣ Update service
      await updateService({
        id: service.id,
        ...form,
        imageUrls,
      }).unwrap();

      onClose();
    } catch (e) {
      console.error("update service error:", e);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Edit Post</h2>
          <button
            onClick={onClose}
            disabled={busy}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">

          {/* Title */}
          <input
            className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm"
            value={form.title}
            onChange={(e) =>
              setForm((p) => ({ ...p, title: e.target.value }))
            }
          />

          {/* Description */}
          <textarea
            className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />

          {/* Category */}
          <select
            className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm"
            value={form.categoryId}
            onChange={(e) =>
              setForm((p) => ({ ...p, categoryId: e.target.value }))
            }
          >
            <option value="">— Select a category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Upload from device */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Upload Image
            </label>

            <button
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl py-6 text-sm text-gray-500 hover:border-blue-400"
            >
              Choose image from device
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />

            {pickedFile && (
              <div className="flex items-center gap-3 bg-slate-50 border rounded-xl px-3 py-2">
                <img
                  src={previewUrl}
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="flex-1 text-xs truncate">
                  {pickedFile.name}
                </span>
                <button
                  onClick={handleRemovePicked}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* URL input */}
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm"
              placeholder="Paste image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <button
              onClick={handleAddImage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
            >
              Add
            </button>
          </div>

          {/* Existing images */}
          {form.imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-slate-50 border rounded-xl px-3 py-2"
            >
              <img
                src={url}
                className="w-12 h-12 object-cover rounded"
              />
              <span className="flex-1 text-xs truncate">{url}</span>
              <button
                onClick={() => handleRemoveImage(idx)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-full">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={busy}
            className="px-8 py-2 rounded-full bg-blue-500 text-white"
          >
            {uploading
              ? "Uploading..."
              : isLoading
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ service, onClose }) {
  const [deleteService, { isLoading }] = useDeleteServiceMutation();
  console.log("OwnServiceCard service:", service);

  const handleDelete = async () => {
    try {
      await deleteService(service.id).unwrap();
      onClose();
    } catch (e) {
      console.error("delete service error:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Delete Post?</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">
              "{service?.title}"
            </span>
            ? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 3-dot Menu ──────────────────────────────────────────────────────────────
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
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        aria-label="More options"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
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
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
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
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── OwnServiceCard ───────────────────────────────────────────────────────────
export default function OwnServiceCard({ service, author, avatar }) {
  const dispatch = useDispatch();
  const liked = useSelector(selectIsFavorite(service?.id));
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const image = getImage(service);
  const categoryName = getCategoryName(service);

  return (
    <>
      <Link
        to={`/services/${service?.id}`}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0"
        style={{ width: 285, height: 487, textDecoration: "none" }}
      >
        {/* Image */}
        <div className="relative flex-shrink-0" style={{ height: 253 }}>
          <img
            src={image}
            alt={service?.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(toggleFavorite(service?.id));
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow transition-transform hover:scale-110"
            aria-label={liked ? "Unlike" : "Like"}
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
        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          <h2 className="text-blue-500 font-bold text-sm mb-1 truncate">
            {service?.title || "Untitled"}
          </h2>

          <p
            className="text-gray-500 text-xs leading-relaxed mb-4 overflow-hidden line-clamp-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {service?.description || "No description"}
          </p>

          {/* Category + date */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-y-1">
            <div className="flex flex-wrap gap-1">
              {categoryName ? (
                <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {categoryName}
                </span>
              ) : (
                <span className="text-gray-300 text-xs italic">
                  No category
                </span>
              )}
            </div>
            <span className="text-gray-400 text-xs">
              {formatDate(service?.createdAt ?? service?.createAt ?? service?.created_at)}
            </span>
          </div>

          <div className="border-t border-gray-100 mb-3" />

          {/* Author + 3-dot menu */}
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
              <span className="text-gray-700 text-xs font-medium">
                {author || "Freelancer"}
              </span>
            </div>
            <CardMenu
              onEdit={() => setEditOpen(true)}
              onDelete={() => setDeleteOpen(true)}
            />
          </div>
        </div>
      </Link>

      {editOpen && (
        <EditServiceModal
          service={service}
          onClose={() => setEditOpen(false)}
        />
      )}
      {deleteOpen && (
        <DeleteConfirmModal
          service={service}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}
