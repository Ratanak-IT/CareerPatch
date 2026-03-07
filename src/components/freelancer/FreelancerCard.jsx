// src/components/freelancer/FreelancerCard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useBookmarks } from "../../hooks/useBookmarks";
import { selectIsAuthed } from "../../features/auth/authSlice";
import { FiChevronRight } from "react-icons/fi";

const FALLBACK_IMAGE  = "https://placehold.co/285x253?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/32x32?text=?";

function selectMe(state) {
  return (
    state?.auth?.user    ||
    state?.auth?.me      ||
    state?.profile?.user ||
    state?.profile?.me   ||
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
  authorId,
  postType = "service",
}) {
  const me       = useSelector(selectMe);
  const isAuthed = useSelector(selectIsAuthed);
  const role     = (me?.userType || me?.role || "").toString().toUpperCase();
  const canBookmark = isAuthed && role === "BUSINESS_OWNER";

  const { liked: likedFromHook, toggle } = useBookmarks({ id, type: postType });
  const [liked, setLiked] = useState(likedFromHook);
  useEffect(() => { setLiked(likedFromHook); }, [likedFromHook]);

  const navigate = useNavigate();
  const linkTo   = postType === "job" ? `/jobs/${id}` : `/services/${id}`;

  // Central auth redirect helper
  const redirectToLogin = (destination) => {
    navigate(`/login?redirect=${encodeURIComponent(destination)}`);
  };

  const requireAuth = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      e.stopPropagation();
      redirectToLogin(linkTo);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) { redirectToLogin(linkTo); return; }
    setLiked((prev) => !prev);
    toggle().catch(() => setLiked((prev) => !prev));
  };

  // Profile click also requires login
  const goProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) { redirectToLogin(`/freelancers/${authorId}`); return; }
    if (authorId) navigate(`/freelancers/${authorId}`);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) { redirectToLogin(linkTo); return; }
    // message logic here
  };

  if (!id) return null;

  return (
    <Link
      to={linkTo}
      onClick={requireAuth}
      className="group flex flex-col w-full rounded-2xl overflow-hidden
                 bg-white dark:bg-slate-800
                 border border-gray-100 dark:border-slate-700
                 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60
                 hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ height: "clamp(230px, 25vw, 176px)" }}>
        <img
          src={image || FALLBACK_IMAGE}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />

        {/* Bookmark — BUSINESS_OWNER only */}
        {canBookmark && (
          <button
            type="button"
            onClick={handleBookmark}
            className={`absolute top-3 right-3 z-50 w-8 h-8 rounded-full
                        backdrop-blur-sm flex items-center justify-center
                        shadow-md transition-all duration-200 hover:scale-110 active:scale-95
                        ${liked
                          ? "bg-[#2563EB]/10 dark:bg-[#2563EB]/20"
                          : "bg-white/90 dark:bg-slate-800/90"
                        }`}
            aria-label={liked ? "Remove bookmark" : "Bookmark"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              className={`w-[18px] h-[18px] transition-all duration-200 ${
                liked
                  ? "fill-[#2563EB] stroke-[#2563EB] scale-110"
                  : "fill-none stroke-gray-400 scale-100"
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
            </svg>
          </button>
        )}

        {/* Guest overlay hint */}
        {!isAuthed && (
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors duration-200 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 pointer-events-none">
            <span className="bg-black/60 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
              Login to view details
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 overflow-hidden">

        <h2 className="text-[#1E88E5] dark:text-blue-100 font-bold text-sm mb-1 truncate">
          {title}
        </h2>

        <p
          className="text-gray-500 dark:text-gray-300 text-xs leading-relaxed mb-4 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {description}
        </p>

        {/* Tags + Date */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(tags) ? tags : [])
              .filter(Boolean)
              .slice(0, 2)
              .map((t) => (
                <span key={t}
                  className="bg-[#1E88E5]/10 dark:bg-blue-300/20
                             text-[#1E88E5] dark:text-blue-200
                             text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
          </div>
          <span className="text-gray-400 dark:text-gray-300 text-xs">{date}</span>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 mb-3" />

        {/* Author + Message */}
        <div className="flex items-center justify-between mt-auto">
          <button
            type="button"
            onClick={goProfile}
            className="flex items-center gap-2 text-left"
            aria-label={isAuthed ? "View profile" : "Login to view profile"}
          >
            <img
              src={avatar || FALLBACK_AVATAR}
              alt={author}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700"
              onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
            />
            <span className="text-gray-700 dark:text-slate-300 text-xs font-medium">
              {author}
            </span>
          </button>

          <button
  className="flex items-center justify-center
             w-5 h-5 rounded-full
             bg-gray-100 hover:bg-gray-300
             text-gray-400 hover:text-gray-800
             transition duration-200"
>
  <FiChevronRight size={10} />
</button>
        </div>
      </div>
    </Link>
  );
}