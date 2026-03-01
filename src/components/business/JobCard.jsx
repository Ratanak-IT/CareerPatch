// JobCard — shows a business owner job post
// Heart toggles API job-bookmark (works for ALL roles)
import { Link } from "react-router";
import {
  useGetJobBookmarksQuery,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} from "../../services/servicesApi";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getBudgetLabel(job) {
  if (!job?.budget) return null;
  return `$${Number(job.budget).toLocaleString()}`;
}

export default function JobCard({ job, authorName, authorAvatar }) {
  const id    = job?.id;
  const image = Array.isArray(job?.imageUrls) && job.imageUrls.length > 0
    ? job.imageUrls[0]
    : Array.isArray(job?.jobImages) && job.jobImages.length > 0
    ? job.jobImages[0]
    : FALLBACK_IMAGE;

  const title       = job?.title       || "Untitled";
  const description = job?.description || "No description";
  const category    = job?.category?.name || job?.categoryName || null;
  const status      = job?.status || null;
  const budget      = getBudgetLabel(job);
  const date        = formatDate(job?.createdAt);

  // ── API bookmark state ─────────────────────────────────────────────────────
  const { data: bookmarks = [] } = useGetJobBookmarksQuery();
  const [addBookmark,    { isLoading: adding }]   = useAddJobBookmarkMutation();
  const [removeBookmark, { isLoading: removing }] = useRemoveJobBookmarkMutation();

  const liked = bookmarks.some(
    (b) => String(b?.jobId ?? b?.id ?? b?.job?.id) === String(id)
  );

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || removing || !id) return;
    try {
      if (liked) await removeBookmark(id).unwrap();
      else       await addBookmark(id).unwrap();
    } catch (err) {
      console.error("job bookmark error:", err);
    }
  };

  return (
    <Link
      to={`/jobs/${id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0"
      style={{ width: 285, height: 487, textDecoration: "none" }}
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ height: 253 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
        {/* Status badge */}
        {status && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
            status === "OPEN"   ? "bg-green-100 text-green-700" :
            status === "DRAFT"  ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-100 text-gray-600"
          }`}>
            {status}
          </span>
        )}
        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          disabled={adding || removing}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow transition-transform hover:scale-110 disabled:opacity-60"
          aria-label={liked ? "Remove bookmark" : "Bookmark"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill={liked ? "#3B82F6" : "none"}
            stroke={liked ? "#3B82F6" : "#9ca3af"}
            strokeWidth="1.8" className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-blue-500 font-bold text-sm mb-1 truncate">{title}</h2>
        <p
          className="text-gray-500 text-xs leading-relaxed mb-3 overflow-hidden line-clamp-3"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {description}
        </p>

        {/* Category + budget + date */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {category && (
              <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {category}
              </span>
            )}
            {budget && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {budget}
              </span>
            )}
          </div>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>

        <div className="border-t border-gray-100 mb-3" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={authorAvatar || "https://placehold.co/32x32?text=?"}
              alt={authorName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/32x32?text=?"; }}
            />
            <span className="text-gray-700 text-xs font-medium">{authorName || "Business"}</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </Link>
  );
}