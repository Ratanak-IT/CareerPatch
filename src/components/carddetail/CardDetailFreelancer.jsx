import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useSelector } from "react-redux";
import { useDarkMode } from "../navbar/NavbarComponent";
import {
  useGetServicesQuery,
  useGetServiceByIdQuery,
} from "../../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../../services/userApi";
import { selectAuthUser } from "../../features/auth/authSlice";
import { useBookmarks } from "../../hooks/useBookmarks";
import CommentsSection from "../comments/CommentsSection";
import MessageButton from "../message/MessageButton";

// ─── constants ────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = "https://placehold.co/64x64?text=?";
const FALLBACK_COVER = "https://placehold.co/900x320?text=No+Image";
const FALLBACK_THUMB = "https://placehold.co/80x56?text=img";

// ─── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeList(resp) {
  const raw = resp?.data ?? resp;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
}

// ─── icons ────────────────────────────────────────────────────────────────────
const IconClock = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconLocation = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconBriefcase = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <path d="M2 12h20" />
  </svg>
);

// ─── Heart icon ───────────────────────────────────────────────────────────────
const IconHeart = ({ filled }) => (
  <svg
    className="w-5 h-5 transition-transform duration-200"
    viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "currentColor"}
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto animate-pulse space-y-5">
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-36 bg-gray-200 rounded-2xl" />
        <div className="flex gap-5">
          <div className="flex-1 space-y-4">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
          </div>
          <div className="w-72 space-y-4">
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function ErrorState({ message, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Could not load</p>
        <p className="text-xs text-gray-400 mb-5">{message}</p>
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CardDetailFreelancer() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const authUser = useSelector(selectAuthUser);

  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState(false);

  const {
    data: byIdResp,
    isLoading: byIdLoading,
    isError: byIdError,
  } = useGetServiceByIdQuery(serviceId, { skip: !serviceId });

  const {
    data: listResp,
    isLoading: listLoading,
    isError: listError,
  } = useGetServicesQuery(undefined, { skip: !serviceId });

  const service = useMemo(() => {
    const byId = byIdResp?.data ?? byIdResp;
    if (byId && typeof byId === "object" && !Array.isArray(byId)) return byId;
    return normalizeList(listResp).find(
      (x) => String(x?.id ?? x?.serviceId ?? x?._id) === String(serviceId),
    );
  }, [byIdResp, listResp, serviceId]);

  // ── Favorites via API (same as FreelancerCard / JobsGrid) ──
  const { liked, toggle: toggleBookmark } = useBookmarks({ id: service?.id, type: "service" });
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authUser) { navigate("/login"); return; }
    toggleBookmark();
  };

  // Only BUSINESS users can favorite — freelancers (who own their own posts) cannot
  const viewerType = authUser?.userType ?? authUser?.role ?? "";
  const isOwner = authUser && service?.userId && String(authUser?.id ?? authUser?.userId) === String(service?.userId);
  const canFavorite = !isOwner && viewerType.toUpperCase() !== "FREELANCER";

  const { data: userRes } = useGetUserByIdQuery(service?.userId, {
    skip: !service?.userId,
  });
  const user = userRes?.data ?? userRes;
  const loading = (byIdLoading && !byIdError) || (listLoading && !listError);

  // derived
  const name = user?.fullName || user?.username || service?.username || "Freelancer";
  const avatar = user?.profileImageUrl || service?.profileImageUrl || FALLBACK_AVATAR;
  const loc = user?.address || service?.location || null;
  const title = service?.title ?? "Untitled";
  const desc = service?.description ?? "No description.";
  const status = service?.status ?? null;
  const catName = service?.category?.name || service?.categoryName || null;
  const exp =
    service?.experienceLevel ||
    (user?.experienceYears ? `${user.experienceYears} yrs exp` : null);
  const posted = timeAgo(service?.createdAt);

  const images = (() => {
    if (Array.isArray(service?.jobImages) && service.jobImages.length)
      return service.jobImages.filter(Boolean);
    if (typeof service?.jobImages === "string") return [service.jobImages];
    if (Array.isArray(service?.imageUrls) && service.imageUrls.length)
      return service.imageUrls.filter(Boolean);
    return [];
  })();
  const coverSrc = !imgError && images[activeImg] ? images[activeImg] : FALLBACK_COVER;

  const skillsArr = Array.isArray(service?.skills)
    ? service.skills
    : Array.isArray(user?.skills)
      ? user.skills
      : [];
  const tools = Array.isArray(user?.tools) ? user.tools : [];

  // guards
  if (!serviceId) return <ErrorState message="Missing service ID." onBack={() => navigate(-1)} />;
  if (loading) return <Skeleton />;
  if (!service) return (
    <ErrorState message="This service is unavailable or has been removed." onBack={() => navigate(-1)} />
  );

  // theme helpers
  const dm = darkMode;
  const bg = dm ? "bg-[#0f172a]" : "bg-slate-50";
  const cardBg = dm ? "bg-[#1e293b]" : "bg-white";
  const border = dm ? "border-[#334155]" : "border-slate-100";
  const t1 = dm ? "text-white" : "text-slate-900";
  const t2 = dm ? "text-slate-400" : "text-slate-500";
  const divLine = dm ? "border-[#334155]" : "border-slate-100";
  const infoTag = `${cardBg} border ${border} rounded-2xl p-5 sm:p-6 shadow-sm`;

  return (
    <div
      className={`min-h-screen ${bg} transition-colors duration-300`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 text-sm font-medium mb-7 px-4 py-2 rounded-xl transition-all
            ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          <IconBack /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ══════════ LEFT ══════════ */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5">

            {/* ── Header card ── */}
            <div className={infoTag}>
              <div className="flex items-start justify-between gap-4">
                {/* Avatar + info */}
                <div className="flex items-start gap-4 min-w-0">
                  <Link to={`/freelancers/${service?.userId}`} className="relative shrink-0 hover:opacity-80 transition-opacity">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-blue-100">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                      />
                    </div>
                    {status === "AVAILABLE" && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/freelancers/${service?.userId}`}
                      className="flex items-center gap-2 mb-1.5 w-fit hover:opacity-75 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`text-[13px] font-semibold truncate underline-offset-2 hover:underline ${t1}`}>{name}</span>
                    </Link>

                    <h1 className="text-blue-500 text-xl sm:text-[22px] font-bold leading-snug mb-2">
                      {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                      {loc && (
                        <span className={`flex items-center gap-1.5 text-[12px] ${t2}`}>
                          <IconLocation />{loc}
                        </span>
                      )}
                      <span className={`flex items-center gap-1.5 text-[12px] ${t2}`}>
                        <IconClock />Posted {posted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message btn */}
                <MessageButton
                  otherUser={{
                    id: user?.id || service?.userId,
                    fullName: name,
                    profileImageUrl: avatar,
                  }}
                />
              </div>

              {/* Badges */}
              {(status || catName) && (
                <>
                  <div className={`my-4 border-t ${divLine}`} />
                  <div className="flex flex-wrap gap-2">
                    {status && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {status}
                      </span>
                    )}
                    {catName && (
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {catName}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Cover image ── */}
            <div className={`${cardBg} border ${border} rounded-2xl overflow-hidden shadow-sm`}>
              <div className="relative" style={{ height: 300 }}>
                <img
                  src={coverSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {images.length > 1 && (
                <div className={`p-3 flex gap-2 overflow-x-auto border-t ${divLine}`}>
                  {images.slice(0, 6).map((url, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImg(i); setImgError(false); }}
                      className={`shrink-0 w-[72px] h-12 rounded-xl overflow-hidden border-2 transition-all
                        ${i === activeImg ? "border-blue-500 shadow-md scale-105" : "border-transparent opacity-55 hover:opacity-90 hover:border-slate-200"}`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Description ── */}
            <div className={infoTag}>
              <h2 className={`text-[14px] font-bold mb-3 ${t1}`}>Description</h2>
              <p className={`text-[13px] leading-[1.75] whitespace-pre-line ${t2}`}>{desc}</p>
            </div>

            {/* ── Availability ── */}
            {user?.bio && (
              <div className={infoTag}>
                <h2 className={`text-[14px] font-bold mb-3 ${t1}`}>Availability</h2>
                <p className={`text-[13px] leading-[1.75] ${t2}`}>{user.bio}</p>
              </div>
            )}

            {/* ── Tools & Skills ── */}
            {(tools.length > 0 || skillsArr.length > 0) && (
              <div className={infoTag}>
                <div className="flex gap-0">
                  <div style={{ width: "45%", paddingRight: "24px" }}>
                    <h2 className={`text-[14px] font-bold mb-4 ${t1}`}>Tools & Technologies</h2>
                    {tools.length > 0 ? (
                      <ul className="space-y-3">
                        {tools.map((tool, i) => (
                          <li key={i} className={`flex items-center gap-2.5 text-[13px] ${t2}`}>
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                            {typeof tool === "string" ? tool : tool?.name || "—"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-[12px] italic opacity-40 ${t2}`}>Static</p>
                    )}
                  </div>

                  <div style={{ width: "1px", background: dm ? "#334155" : "#f1f5f9", flexShrink: 0 }} />

                  <div style={{ flex: 1, paddingLeft: "24px" }}>
                    <h2 className={`text-[14px] font-bold mb-4 ${t1}`}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skillsArr.map((s, i) => {
                        const label = typeof s === "string" ? s : s?.name || s?.title || "—";
                        return (
                          <span
                            key={i}
                            style={{ whiteSpace: "nowrap" }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium cursor-default transition-colors
                              ${dm
                                ? "bg-indigo-950/60 text-indigo-300 border border-indigo-800 hover:bg-indigo-900/60"
                                : "bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100"
                              }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══════════ RIGHT ══════════ */}
          <div className="w-full lg:w-[38%] flex flex-col gap-5 lg:sticky lg:top-6">

            {/* ── Sidebar card ── */}
            <div className={infoTag}>

              {/* ── Experience row (was "Project Cost") ── */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`flex items-center gap-3 flex-1 p-3 rounded-xl
                    ${dm ? "bg-blue-950/50 border border-blue-900/40" : "bg-blue-50 border border-blue-100"}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                    ${dm ? "bg-blue-900/60 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                    <IconBriefcase />
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${t2}`}>
                      Experience
                    </p>
                    <p className={`text-[13px] font-bold ${t1}`}>
                      {exp ?? "—"}
                    </p>
                  </div>
                </div>

                {/* ── Heart / Favorite button — only for BUSINESS viewers ── */}
                {canFavorite && (
                  <button
                    onClick={handleToggleFavorite}
                    aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                    className={`ml-3 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                      active:scale-90 hover:scale-110
                      ${liked
                        ? "bg-red-50 dark:bg-red-900/30"
                        : dm
                          ? "text-slate-500 hover:text-red-400 hover:bg-white/5"
                          : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                  >
                    <IconHeart filled={liked} />
                  </button>
                )}
              </div>

              <div className={`border-t ${divLine} mb-4`} />

              {/* Author mini card — clickable */}
              <Link
                to={`/freelancers/${service?.userId}`}
                className={`flex items-center gap-3 p-3 rounded-xl mb-5 hover:opacity-80 transition-opacity
                  ${dm ? "bg-slate-700/50 border border-slate-700" : "bg-slate-50 border border-slate-100"}`}
              >
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white"
                  onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                />
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${t2}`}>Freelancer</p>
                  <p className={`text-[13px] font-semibold truncate ${t1}`}>{name}</p>
                </div>
              </Link>

              {/* Go Back */}
              {/* <button
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white
                           bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all shadow-sm shadow-blue-200"
              >
                ← Go Back
              </button> */}
            </div>

            {/* ── Comments ── */}
            <CommentsSection
              postType="service"
              postId={serviceId}
              authUser={authUser}
              dm={dm}
              t1={t1}
              t2={t2}
              cardBg={cardBg}
              border={border}
              divLine={divLine}
            />
          </div>
        </div>
      </div>
    </div>
  );
}