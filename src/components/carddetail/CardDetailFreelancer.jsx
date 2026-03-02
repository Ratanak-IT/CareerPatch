// src/components/card/CardDetailFreelancer.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDarkMode } from "../navbar/NavbarComponent";
import {
  useGetServicesQuery,
  useGetServiceByIdQuery,
} from "../../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../../services/userApi";

// ─── constants ────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = "https://placehold.co/64x64?text=?";
const FALLBACK_COVER  = "https://placehold.co/900x320?text=No+Image";
const FALLBACK_THUMB  = "https://placehold.co/80x56?text=img";

// ─── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(value) {
  if (!value) return "—";
  const d   = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60)                   return "just now";
  if (sec < 3600)                 return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400)                return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 604800)               return `${Math.floor(sec / 86400)} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeListResponse(resp) {
  const raw = resp?.data ?? resp;
  if (Array.isArray(raw))              return raw;
  if (Array.isArray(raw?.content))     return raw.content;
  if (Array.isArray(raw?.items))       return raw.items;
  if (Array.isArray(raw?.results))     return raw.results;
  return [];
}

// ─── small shared pieces ─────────────────────────────────────────────────────
function SkillBadge({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                     bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100
                     transition-colors cursor-default">
      {label}
    </span>
  );
}

function InfoRow({ icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
      {icon}
      {children}
    </span>
  );
}

// ─── icons ────────────────────────────────────────────────────────────────────
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? "#1E88E5" : "none"} stroke="#1E88E5" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/>
    <path d="M2 12h20"/>
  </svg>
);
const DotIcon = ({ color }) => (
  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: color }} />
);
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
  </svg>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Could not load service</p>
        <p className="text-xs text-gray-500 mb-6 break-words">{message}</p>
        <button onClick={onBack}
          className="px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
          Go Back
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CardDetailFreelancer() {
  const { darkMode } = useDarkMode();
  const navigate     = useNavigate();
  const { serviceId } = useParams();

  const [comment,   setComment]   = useState("");
  const [bookmarked,setBookmarked]= useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [comments,  setComments]  = useState([]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: byIdResp, isLoading: byIdLoading, isError: byIdError, error: byIdErrObj } =
    useGetServiceByIdQuery(serviceId, { skip: !serviceId });

  const { data: listResp, isLoading: listLoading, isError: listError, error: listErrObj } =
    useGetServicesQuery(undefined, { skip: !serviceId });

  const service = useMemo(() => {
    const byId = byIdResp?.data ?? byIdResp;
    if (byId && typeof byId === "object" && !Array.isArray(byId)) return byId;
    const items = normalizeListResponse(listResp);
    return items.find(
      (x) => String(x?.id ?? x?.serviceId ?? x?._id ?? x?.uuid) === String(serviceId)
    );
  }, [byIdResp, listResp, serviceId]);

  const userId = service?.userId;
  const { data: userRes } = useGetUserByIdQuery(userId, { skip: !userId });
  const user = userRes?.data ?? userRes;

  const loading = (byIdLoading && !byIdError) || (listLoading && !listError);

  // ── Derived fields ─────────────────────────────────────────────────────────
  const freelancerName   = user?.fullName || user?.username || service?.username || "Freelancer";
  const freelancerAvatar = user?.profileImageUrl || service?.profileImageUrl || FALLBACK_AVATAR;
  const location         = user?.address || service?.location || null;

  const title        = service?.title       ?? "Untitled";
  const description  = service?.description ?? "No description";
  const status       = service?.status      ?? null;
  const categoryName = service?.category?.name || service?.categoryName || service?.category || null;
  const budget       = service?.budget      ?? service?.price ?? null;
  const experience   = service?.experienceLevel || user?.experienceYears
    ? `${user?.experienceYears ?? ""}${user?.experienceYears ? " years" : ""}` || service?.experienceLevel
    : null;
  const postedAgo    = timeAgo(service?.createdAt);

  const images = (() => {
    if (Array.isArray(service?.jobImages) && service.jobImages.length)
      return service.jobImages.filter(Boolean);
    if (typeof service?.jobImages === "string" && service.jobImages)
      return [service.jobImages];
    if (Array.isArray(service?.imageUrls) && service.imageUrls.length)
      return service.imageUrls.filter(Boolean);
    return [];
  })();

  const coverImage = images[activeImg] || FALLBACK_COVER;

  const skillsArr = Array.isArray(service?.skills)
    ? service.skills
    : Array.isArray(user?.skills) ? user.skills : [];

  const tools = Array.isArray(user?.tools) ? user.tools : [];

  const handlePostComment = () => {
    if (!comment.trim()) return;
    setComments((p) => [...p, { text: comment.trim(), time: "just now", name: "You" }]);
    setComment("");
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!serviceId) return <ErrorState message="Missing service ID in URL." onBack={() => navigate(-1)} />;
  if (loading)    return <Skeleton />;
  if (!service) {
    const msg = (byIdError && JSON.stringify(byIdErrObj)) ||
                (listError  && JSON.stringify(listErrObj)) ||
                "Service not found.";
    return <ErrorState message={msg} onBack={() => navigate(-1)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Back button ─────────────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-sm font-medium mb-6 transition-colors
            ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
        >
          <ArrowLeftIcon />
          Back
        </button>

        {/* ── Main grid ───────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ════ LEFT COLUMN ════════════════════════════════════════ */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5">

            {/* Header card */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
              ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>

              <div className="flex items-start justify-between gap-4">
                {/* Avatar + name + title */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0
                                  ring-2 ring-blue-100">
                    <img src={freelancerAvatar} alt={freelancerName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }} />
                  </div>

                  <div className="min-w-0">
                    {/* Name chip */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center
                                      text-white text-xs font-bold shrink-0">
                        {freelancerName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`text-sm font-semibold truncate
                        ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                        {freelancerName}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-blue-500 text-xl sm:text-2xl font-bold leading-tight truncate">
                      {title}
                    </h1>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      {location && (
                        <InfoRow icon={<LocationIcon />}>{location}</InfoRow>
                      )}
                      <InfoRow icon={<ClockIcon />}>Posted {postedAgo}</InfoRow>
                    </div>
                  </div>
                </div>

                {/* Message button */}
                <button
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                             text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  <SendIcon />
                  <span className="hidden sm:inline">Message</span>
                </button>
              </div>

              {/* Divider */}
              <div className={`mt-4 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`} />

              {/* Status + category badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {status && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
                                   bg-green-50 text-green-600 border border-green-100">
                    <DotIcon color="#22c55e" />
                    {status}
                  </span>
                )}
                {categoryName && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full
                                   bg-blue-50 text-blue-600 border border-blue-100">
                    {categoryName}
                  </span>
                )}
              </div>
            </div>

            {/* Cover image + thumbnails */}
            <div className={`rounded-2xl overflow-hidden border transition-colors
              ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>

              <div className="relative w-full" style={{ height: 260 }}>
                <img src={coverImage} alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }} />
              </div>

              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.slice(0, 6).map((url, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all
                        ${i === activeImg ? "border-blue-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}>
                      <img src={url} alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
              ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
              <h2 className={`text-sm font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Description
              </h2>
              <p className={`text-[13px] leading-6 whitespace-pre-line
                ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {description}
              </p>
            </div>

            {/* Availability (bio) */}
            {user?.bio && (
              <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
                ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                <h2 className={`text-sm font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Availability
                </h2>
                <p className={`text-[13px] leading-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {user.bio}
                </p>
              </div>
            )}

            {/* Tools & Technologies + Skills */}
            {(tools.length > 0 || skillsArr.length > 0) && (
              <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
                ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="flex flex-col sm:flex-row gap-6">

                  {/* Tools */}
                  {tools.length > 0 && (
                    <div className="flex-1">
                      <h2 className={`text-sm font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        Tools & Technologies
                      </h2>
                      <ul className="space-y-2">
                        {tools.map((t, i) => (
                          <li key={i} className={`flex items-center gap-2 text-[13px]
                            ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <DotIcon color="#1E88E5" />
                            {typeof t === "string" ? t : t?.name || "—"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills */}
                  {skillsArr.length > 0 && (
                    <div className="flex-1">
                      <h2 className={`text-sm font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {skillsArr.map((s, i) => {
                          const label = typeof s === "string" ? s : s?.name || s?.title || "—";
                          return <SkillBadge key={i} label={label} />;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills only (no tools) */}
            {skillsArr.length > 0 && tools.length === 0 && (
              <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
                ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
                <h2 className={`text-sm font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillsArr.map((s, i) => {
                    const label = typeof s === "string" ? s : s?.name || s?.title || "—";
                    return <SkillBadge key={i} label={label} />;
                  })}
                </div>
              </div>
            )}

          </div>

          {/* ════ RIGHT COLUMN ═══════════════════════════════════════ */}
          <div className="w-full lg:w-[38%] flex flex-col gap-5 lg:sticky lg:top-6">

            {/* Quotation card */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
              ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>

              {/* Price + bookmark */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {budget != null ? `$${Number(budget).toLocaleString()}` : "—"}
                  </span>
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Quotation
                  </span>
                </div>
                <button
                  onClick={() => setBookmarked((b) => !b)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  title={bookmarked ? "Remove bookmark" : "Bookmark"}
                >
                  <BookmarkIcon filled={bookmarked} />
                </button>
              </div>

              {/* Experience row */}
              {(experience || service?.experienceLevel) && (
                <div className={`flex items-center gap-3 p-3 rounded-xl mb-4
                  ${darkMode ? "bg-blue-950/40 border border-blue-900/40" : "bg-blue-50 border border-blue-100"}`}>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <BriefcaseIcon />
                  </div>
                  <div>
                    <p className={`text-[11px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Experience
                    </p>
                    <p className={`text-sm font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                      {service?.experienceLevel || experience}
                    </p>
                  </div>
                </div>
              )}

              {/* Freelancer mini-card */}
              <div className={`flex items-center gap-3 p-3 rounded-xl
                ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-100"}`}>
                <img src={freelancerAvatar} alt={freelancerName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }} />
                <div className="min-w-0">
                  <p className={`text-[11px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Freelancer</p>
                  <p className={`text-sm font-semibold truncate ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                    {freelancerName}
                  </p>
                </div>
              </div>

              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white
                           bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Back
              </button>
            </div>

            {/* Comments card */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors
              ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>

              {/* Comment list */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1">
                {comments.length === 0 && (
                  /* Default sample comment slot */
                  <div className="flex items-start gap-3">
                    <img src={freelancerAvatar} alt={freelancerName}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[13px] font-semibold
                          ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                          {freelancerName}
                        </span>
                        <span className={`text-[11px] shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          —
                        </span>
                      </div>
                      <p className="text-xs text-blue-500 bg-blue-50 border border-blue-100
                                    px-3 py-1.5 rounded-xl inline-block">
                        —
                      </p>
                    </div>
                  </div>
                )}

                {comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center
                                    text-white text-xs font-bold shrink-0">
                      Y
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[13px] font-semibold
                          ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                          {c.name}
                        </span>
                        <span className={`text-[11px] shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          {c.time}
                        </span>
                      </div>
                      <p className="text-xs text-blue-500 bg-blue-50 border border-blue-100
                                    px-3 py-1.5 rounded-xl inline-block">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className={`border-t mb-4 ${darkMode ? "border-gray-800" : "border-gray-100"}`} />

              {/* Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handlePostComment(); }}
                  placeholder="Write a comment..."
                  className={`flex-1 text-[13px] px-4 py-2.5 rounded-xl outline-none transition-all
                    ${darkMode
                      ? "bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400"
                    }`}
                />
                <button
                  onClick={handlePostComment}
                  disabled={!comment.trim()}
                  className="px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold
                             bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-colors
                             whitespace-nowrap"
                >
                  Post
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}