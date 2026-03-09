import {  useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFavorite,
  selectIsFavorite,
} from "../../features/favorites/favoritesSlice";
import {

  useDeleteServiceMutation
} from "../../services/servicesApi";
import EditServiceModal from "../Auth/modals/EditServiceModal";

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
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete Post?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              "{service?.title}"
            </span>
            ? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="More options"
      >
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
          <div className="absolute right-0 bottom-10 z-20 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden w-36">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
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
        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-slate-900/60 transition-shadow duration-300 flex flex-col flex-shrink-0"
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
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow transition-transform hover:scale-110"
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
          <h2 className="text-blue-500 dark:text-blue-300 font-bold text-sm mb-1 truncate">
            {service?.title || "Untitled"}
          </h2>

          <p
            className="text-gray-500 dark:text-gray-300 text-xs leading-relaxed mb-4 overflow-hidden line-clamp-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {service?.description || "No description"}
          </p>

          {/* Category + date */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-y-1 dark:text-gray-300">
            <div className="flex flex-wrap gap-1">
              {categoryName ? (
                <span className="bg-blue-500 dark:bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {categoryName}
                </span>
              ) : (
                <span className="text-gray-300 dark:text-gray-500 text-xs italic">
                  No category
                </span>
              )}
            </div>
            <span className="text-gray-400 dark:text-gray-400 text-xs">
              {formatDate(service?.createdAt ?? service?.createAt ?? service?.created_at)}
            </span>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-700 mb-3" />

          {/* Author + 3-dot menu */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <img
                src={avatar || "https://placehold.co/32x32?text=?"}
                alt={author}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/32x32?text=?";
                }}
              />
              <span className="text-gray-700 dark:text-slate-300 text-xs font-medium">
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