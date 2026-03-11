// src/components/carddetail/CardDetailFreelancer.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useSelector } from "react-redux";
import { useGetServicesQuery, useGetServiceByIdQuery } from "../../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../../services/userApi";
import { selectAuthUser } from "../../features/auth/authSlice";
import { useBookmarks } from "../../hooks/useBookmarks";
import CommentsSection from "../comments/CommentsSection";
import MessageButton from "../message/MessageButton";

// ─── constants ────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = "https://placehold.co/64x64?text=?";
const FALLBACK_COVER  = "https://placehold.co/900x320?text=No+Image";
const FALLBACK_THUMB  = "https://placehold.co/80x56?text=img";

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
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconLocation = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
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
const IconHeart = ({ filled }) => (
  <svg className="w-5 h-5 transition-transform duration-200" viewBox="0 0 24 24"
    fill={filled ? "#727FE8" : "none"} stroke={filled ? "#3E43C9" : "currentColor"} strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] py-8 px-4">
      <div className="max-w-5xl mx-auto animate-pulse space-y-5">
        <div className="h-7 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-36 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
            <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
          </div>
          <div className="w-full lg:w-72 space-y-4">
            <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
            <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function ErrorState({ message, onBack }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow border border-slate-100 dark:border-slate-700 p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Could not load</p>
        <p className="text-xs text-slate-400 mb-5 break-words">{message}</p>
      </div>
    </div>
  );
}

const card = "bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-4 sm:p-6 shadow-sm";

// ─── Sidebar card content (shared between inline mobile + desktop sticky) ─────
function SidebarContent({ exp, canFavorite, liked, handleToggleFavorite }) {
  return (
    <>
      {/* Experience + Heart */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 flex-1 p-3 rounded-xl
          bg-blue-50 border border-blue-100
          dark:bg-blue-950/50 dark:border-blue-900/40">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300">
            <IconBriefcase />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5 text-slate-500 dark:text-slate-400">Experience</p>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white">{exp ?? "—"}</p>
          </div>
        </div>

        {canFavorite && (
          <button
            onClick={handleToggleFavorite}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            className={`ml-3 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90 hover:scale-110
              ${liked
                ? "bg-blue-200 dark:bg-blue-900/30"
                : "text-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:text-slate-500 dark:hover:text-blue-400 dark:hover:bg-white/5"}`}
          >
            <IconHeart filled={liked} />
          </button>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-[#334155]" />
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CardDetailFreelancer() {
  const navigate      = useNavigate();
  const { serviceId } = useParams();
  const authUser      = useSelector(selectAuthUser);

  const [activeImg, setActiveImg] = useState(0);
  const [imgError,  setImgError]  = useState(false);

  const { data: byIdResp, isLoading: byIdLoading, isError: byIdError } =
    useGetServiceByIdQuery(serviceId, { skip: !serviceId });
  const { data: listResp, isLoading: listLoading, isError: listError } =
    useGetServicesQuery(undefined, { skip: !serviceId });

  const service = useMemo(() => {
    const byId = byIdResp?.data ?? byIdResp;
    if (byId && typeof byId === "object" && !Array.isArray(byId)) return byId;
    return normalizeList(listResp).find(
      (x) => String(x?.id ?? x?.serviceId ?? x?._id) === String(serviceId),
    );
  }, [byIdResp, listResp, serviceId]);

  const { liked, toggle: toggleBookmark } = useBookmarks({ id: service?.id, type: "service" });
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authUser) { navigate("/login"); return; }
    toggleBookmark();
  };

  const viewerType  = authUser?.userType ?? authUser?.role ?? "";
  const isOwner     = authUser && service?.userId &&
    String(authUser?.id ?? authUser?.userId) === String(service?.userId);
  const canFavorite = !isOwner && viewerType.toUpperCase() !== "FREELANCER";

  const { data: userRes } = useGetUserByIdQuery(service?.userId, { skip: !service?.userId });
  const user    = userRes?.data ?? userRes;
  const loading = (byIdLoading && !byIdError) || (listLoading && !listError);

  const name    = user?.fullName || user?.username || service?.username || "Freelancer";
  const avatar  = user?.profileImageUrl || service?.profileImageUrl || FALLBACK_AVATAR;
  const loc     = user?.address || service?.location || null;
  const title   = service?.title   ?? "Untitled";
  const desc    = service?.description ?? "No description.";
  const status  = service?.status  ?? null;
  const catName = service?.category?.name || service?.categoryName || null;
  const exp     = service?.experienceLevel ||
    (user?.experienceYears ? `${user.experienceYears} yrs exp` : null);
  const posted  = timeAgo(service?.createdAt);

  const images = (() => {
    if (Array.isArray(service?.jobImages) && service.jobImages.length) return service.jobImages.filter(Boolean);
    if (typeof service?.jobImages === "string") return [service.jobImages];
    if (Array.isArray(service?.imageUrls) && service.imageUrls.length) return service.imageUrls.filter(Boolean);
    return [];
  })();
  const coverSrc = !imgError && images[activeImg] ? images[activeImg] : FALLBACK_COVER;

  const skillsArr = Array.isArray(service?.skills) ? service.skills
    : Array.isArray(user?.skills) ? user.skills : [];
  const tools = Array.isArray(user?.tools) ? user.tools : [];

  if (!serviceId) return <ErrorState message="Missing service ID." onBack={() => navigate(-1)} />;
  if (loading)    return <Skeleton />;
  if (!service)   return <ErrorState message="This service is unavailable or has been removed." onBack={() => navigate(-1)} />;

  const sidebarProps = { exp, canFavorite, liked, handleToggleFavorite };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300"
      style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium mb-7 px-4 py-2 rounded-xl transition-all
            text-slate-500 hover:text-slate-900 hover:bg-slate-100
            dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5">
          <IconBack /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ══ RIGHT — sticky sidebar on lg ══ */}
          <div className="hidden lg:block lg:w-[38%] order-2">
            <div className="lg:sticky lg:top-6 flex flex-col gap-5">
              <div className={card}>
                <SidebarContent {...sidebarProps} />
              </div>
              <CommentsSection postType="service" postId={serviceId} authUser={authUser} />
            </div>
          </div>

          {/* ══ LEFT — main content column ══ */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5 order-1">

            {/* ── Header card (profile) ── */}
            <div className={card}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Avatar — clickable */}
                  <Link to={`/freelancers/${service?.userId}`} className="relative shrink-0 hover:opacity-80 transition-opacity">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-blue-100">
                      <img src={avatar} alt={name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }} />
                    </div>
                    {status === "AVAILABLE" && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </Link>

                  <div className="min-w-0">
                    {/* Name — clickable */}
                    <Link to={`/freelancers/${service?.userId}`}
                      className="flex items-center gap-2 mb-1.5 w-fit hover:opacity-75 transition-opacity"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold truncate underline-offset-2 hover:underline text-slate-900 dark:text-white">
                        {name}
                      </span>
                    </Link>

                    <h1 className="text-blue-500 text-xl sm:text-[22px] font-bold leading-snug mb-2">{title}</h1>

                    <div className="flex flex-wrap items-center gap-3">
                      {loc && (
                        <span className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                          <IconLocation />{loc}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                        <IconClock />Posted {posted}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <MessageButton otherUser={{ id: user?.id || service?.userId, fullName: name, profileImageUrl: avatar }} />
                </div>
              </div>

              {(status || catName) && (
                <>
                  <div className="my-4 border-t border-slate-100 dark:border-[#334155]" />
                  <div className="flex flex-wrap gap-2">
                    {status && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />{status}
                      </span>
                    )}
                    {catName && (
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50">
                        {catName}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Sidebar inline — ONLY on < lg, placed RIGHT AFTER profile ── */}
            <div className="lg:hidden">
              <div className={card}>
                <SidebarContent {...sidebarProps} />
              </div>
            </div>

            {/* ── Cover image ── */}
            <div className="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-[220px] sm:h-[300px]">
                <img src={coverSrc} alt={title} className="w-full h-full object-cover"
                  onError={() => setImgError(true)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              {images.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto border-t border-slate-100 dark:border-[#334155]">
                  {images.slice(0, 6).map((url, i) => (
                    <button key={i} onClick={() => { setActiveImg(i); setImgError(false); }}
                      className={`shrink-0 w-[72px] h-12 rounded-xl overflow-hidden border-2 transition-all
                        ${i === activeImg
                          ? "border-blue-500 shadow-md scale-105"
                          : "border-transparent opacity-55 hover:opacity-90 hover:border-slate-200 dark:hover:border-slate-600"}`}>
                      <img src={url} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Description ── */}
            <div className={card}>
              <h2 className="text-[20px] font-bold mb-3 text-slate-900 dark:text-white">Description</h2>
              <p className="text-[16px] leading-[1.75] whitespace-pre-line text-slate-500 dark:text-gray-200">{desc}</p>
            </div>

            {/* ── Availability ── */}
            {user?.bio && (
              <div className={card}>
                <h2 className="text-[20px] font-bold mb-3 text-slate-900 dark:text-white">Availability</h2>
                <p className="text-[16px] leading-[1.75] text-slate-500 dark:text-gray-200">{user.bio}</p>
              </div>
            )}

            {/* ── Tools & Skills ── */}
            {(tools.length > 0 || skillsArr.length > 0) && (
              <div className={card}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-0">
                  <div className="w-full md:w-[45%] md:pr-6">
                    <h2 className="text-[20px] font-bold mb-4 text-slate-900 dark:text-white">Tools & Technologies</h2>
                    {tools.length > 0 ? (
                      <ul className="space-y-3">
                        {tools.map((tool, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-[13px] text-slate-500 dark:text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                            {typeof tool === "string" ? tool : tool?.name || "—"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[12px] italic opacity-40 text-slate-500 dark:text-slate-400">None</p>
                    )}
                  </div>
                  <div className="hidden md:block w-px bg-slate-100 dark:bg-[#334155] shrink-0" />
                  <div className="flex-1 md:pl-6">
                    <h2 className="text-[20px] font-bold mb-4 text-slate-900 dark:text-white">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skillsArr.map((s, i) => {
                        const label = typeof s === "string" ? s : s?.name || s?.title || "—";
                        return (
                          <span key={i} style={{ whiteSpace: "nowrap" }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium cursor-default transition-colors
                              bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100
                              dark:bg-indigo-950/60 dark:text-gray-200 dark:border-indigo-800 dark:hover:bg-indigo-900/60">
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

            {/* ── Comments — mobile only ── */}
            <div className="lg:hidden">
              <CommentsSection postType="service" postId={serviceId} authUser={authUser} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}