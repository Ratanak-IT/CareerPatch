// src/components/freelancer/FreelancerCard.jsx
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useBookmarks } from "../../hooks/useBookmarks";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/32x32?text=?";

// ✅ Try to read current user from redux (adjust if your state shape is different)
function selectMe(state) {
  // common patterns:
  return (
    state?.auth?.user ||
    state?.auth?.me ||
    state?.profile?.user ||
    state?.profile?.me ||
    null
  );
}

export default function FreelancerCard({
  id,
  image,
  title,
  description,
  tags = [],
  date,
  author,
  avatar,

  // userId of the freelancer/business who posted this post
  authorId,

  postType = "service", // "service" | "job"
}) {
  const me = useSelector(selectMe);

  // ✅ Only business owner can see bookmark button
  // handle different possible fields: role/userType
  const role = (me?.userType || me?.role || "").toString().toUpperCase();
  const canBookmark = role === "BUSINESS_OWNER";

  const { liked, toggle } = useBookmarks({ id, type: postType });

  const linkTo = postType === "job" ? `/jobs/${id}` : `/services/${id}`;
  const navigate = useNavigate();

  const goProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (authorId) navigate(`/freelancers/${authorId}`);
  };

  // If no id, don't render (bookmark + link needs id)
  if (!id) return null;

  return (
    <Link
      to={linkTo}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col w-full"
    >
      <div className="relative shrink-0">
        <img
          src={image || FALLBACK_IMAGE}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* ✅ Bookmark visible only for BUSINESS_OWNER */}
        {canBookmark && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Bookmark clicked:", { id, postType });
              toggle()
                .then(() => console.log("Bookmark toggle done"))
                .catch((err) => console.error("Bookmark toggle error:", err));
            }}
            className={`absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition-transform hover:scale-110 active:scale-95 ${
              liked ? "ring-2 ring-blue-200" : ""
            }`}
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
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-blue-500 font-bold text-sm mb-1 truncate">
          {title}
        </h2>

        <p
          className="text-gray-500 text-xs leading-relaxed mb-4 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(tags) ? tags : [])
              .filter(Boolean)
              .slice(0, 2)
              .map((t) => (
                <span
                  key={t}
                  className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
          </div>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>

        <div className="border-t border-gray-100 mb-3" />

        <div className="flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={goProfile}
            className="flex items-center gap-2 text-left"
            aria-label="View profile"
          >
            <img
              src={avatar || FALLBACK_AVATAR}
              alt={author}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
            />
            <span className="text-gray-700 text-xs font-medium">{author}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Message
          </button>
        </div>
      </div>
    </Link>
  );
}
