// src/components/bookmarks/BookmarkedJobCard.jsx
import { Link } from "react-router";
import { useGetUserByIdQuery } from "../../services/userApi";
import { useBookmarks } from "../../hooks/useBookmarks";

const FALLBACK_IMAGE = "https://placehold.co/400x220?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/40x40?text=?";

const BASE = import.meta.env.VITE_API_URL;

function resolveUrl(u) {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `${BASE}${u.startsWith("/") ? "" : "/"}${u}`;
}

function pickJobImage(job) {
  const raw =
    (Array.isArray(job?.jobImages) && job.jobImages[0]) ||
    (Array.isArray(job?.imageUrls) && job.imageUrls[0]) ||
    (Array.isArray(job?.images) && job.images[0]) ||
    job?.imageUrl ||
    job?.thumbnail ||
    job?.coverImageUrl ||
    null;

  return resolveUrl(raw) || FALLBACK_IMAGE;
}

function formatDateDMY(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function BookmarkedJobCard({ bm }) {
  // expected: { id: bookmarkId, job: {...} }
  const job = bm?.job ?? null;

  // ✅ compute ids safely (even if job is null)
  const jobId = job?.id ?? null;
  const userId = job?.userId ?? null;

  // ✅ ALWAYS call hooks (skip requests if missing ids)
  const { data: userRes } = useGetUserByIdQuery(userId, { skip: !userId });
  const user = userRes?.data || userRes;

  const { liked, toggle } = useBookmarks({
    id: jobId,
    type: "job",
  });

  // ✅ only after hooks
  if (!jobId) return null;

  const title = job?.title || "Untitled";
  const description = job?.description || "No description available.";
  const categoryName = job?.category?.name || job?.categoryName || null;
  const date = formatDateDMY(job?.createdAt);
  const status = job?.status || "UNKNOWN";

  const image = pickJobImage(job);

  const tags = [];
  if (categoryName) tags.push(categoryName);
  if (job?.skills?.[0]) tags.push(job.skills[0]);

  const authorName = user?.fullName || user?.companyName || "Business";
  const authorAvatar = user?.profileImageUrl || FALLBACK_AVATAR;

  return (
    <Link
      to={`/jobs/${jobId}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col w-full border border-gray-100 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 176 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!jobId) return;
            toggle();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={liked ? "Remove bookmark" : "Bookmark"}
          type="button"
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
        <h3 className="text-[#1E88E5] font-bold text-sm mb-1 truncate">{title}</h3>

        <p
          className="text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {description}
        </p>

        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <span>Date: {date}</span>

          <span
            className={`font-semibold ${
              status === "OPEN"
                ? "text-green-500"
                : status === "DRAFT"
                ? "text-yellow-500"
                : "text-gray-500"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="bg-[#1E88E5] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="border-t border-gray-100 mb-3" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
            />
            <span className="text-gray-700 text-xs font-medium truncate max-w-[80px]">
              {authorName}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
            type="button"
          >
            Apply Now
          </button>
        </div>
      </div>
    </Link>
  );
}