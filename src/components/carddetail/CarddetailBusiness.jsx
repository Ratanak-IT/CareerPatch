// src/components/carddetail/CardDetailBusiness.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useDarkMode } from "../navbar/NavbarComponent";
import {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
} from "../../services/detailworkApi";
import { selectAuthUser } from "../../features/auth/authSlice";
import CommentsSection from "../comments/CommentsSection";
import MessageButton from "../message/MessageButton";

/* ─── helpers ───────────────────────────────────────────────────────────── */
function timeAgo(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";

  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeList(resp) {
  const raw = resp?.data ?? resp;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
}

function normalizeOne(resp) {
  const raw = resp?.data ?? resp;
  if (!raw) return null;
  if (Array.isArray(raw)) return raw[0] ?? null;
  if (Array.isArray(raw?.content)) return raw.content[0] ?? null;
  if (Array.isArray(raw?.items)) return raw.items[0] ?? null;
  if (Array.isArray(raw?.results)) return raw.results[0] ?? null;
  if (typeof raw === "object") return raw;
  return null;
}

function getJobId(job) {
  return job?.id ?? job?.jobId ?? job?._id ?? null;
}

function asText(x, fallback = "—") {
  if (x == null) return fallback;
  if (typeof x === "string") return x;
  if (typeof x === "number") return String(x);
  return fallback;
}

/* ─── icons (same style) ───────────────────────────────────────────────── */
const IconClock = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconLocation = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconSend = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconBookmark = ({ filled }) => (
  <svg
    className="w-[18px] h-[18px]"
    fill={filled ? "#3B82F6" : "none"}
    stroke={filled ? "#3B82F6" : "currentColor"}
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
const IconBriefcase = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <path d="M2 12h20" />
  </svg>
);
const IconBack = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

/* ─── Skeleton / Error (same style) ─────────────────────────────────────── */
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

function ErrorState({ message, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">
          Could not load
        </p>
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

/* ─── Main ─────────────────────────────────────────────────────────────── */
const MOCK_PANEL = {
  projectCost: "$1500",
  experience: "Expert",
  duration: "1–2 months",
  deadline: "Mar 1, 2026",
};

export default function CardDetailBusiness() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const authUser = useSelector(selectAuthUser);

  const [bookmarked, setBookmarked] = useState(false);

  // fetch detail by id
  const {
    data: byIdResp,
    isLoading: byIdLoading,
    isError: byIdError,
    error: byIdErrObj,
  } = useGetJobByIdQuery(jobId, { skip: !jobId });

  // fallback fetch list (useful if backend returns weird structure)
  const {
    data: listResp,
    isLoading: listLoading,
    isError: listError,
    error: listErrObj,
  } = useGetAllJobsQuery(undefined, { skip: !jobId });

  // resolve job
  const job = useMemo(() => {
    const byId = normalizeOne(byIdResp);
    if (byId) return byId;
    const list = normalizeList(listResp);
    return list.find((x) => String(getJobId(x)) === String(jobId)) ?? null;
  }, [byIdResp, listResp, jobId]);

  const loading = (byIdLoading && !byIdError) || (listLoading && !listError);

  // derived fields (map job api -> UI)
  const companyName =
    job?.company?.name || job?.companyName || job?.company || "Company";
  const companyLogoText = (
    job?.company?.logo ||
    companyName?.slice(0, 2) ||
    "CO"
  )
    .toString()
    .slice(0, 2)
    .toUpperCase();
  const logoColor = job?.company?.logoColor || "#2B5F75";

  const title = job?.title ?? "Untitled";
  const loc = job?.location ?? job?.address ?? null;
  const posted = timeAgo(job?.createdAt);
  const desc = job?.description ?? "No description.";

  const responsibilities = Array.isArray(job?.responsibilities)
    ? job.responsibilities
    : [];
  const requirements = Array.isArray(job?.requirements) ? job.requirements : [];

  const skillsArr = Array.isArray(job?.skills)
    ? job.skills
    : Array.isArray(job?.skill)
      ? job.skill
      : [];

  // Right panel (you can replace MOCK_PANEL with real job fields later)
  const budget =
    job?.budget ?? job?.salary ?? job?.price ?? job?.projectCost ?? null;

  const exp = job?.experienceLevel ?? job?.experience ?? MOCK_PANEL.experience;

  const duration = job?.duration ?? MOCK_PANEL.duration;

  const deadline = job?.deadline ?? job?.endDate ?? MOCK_PANEL.deadline;

  // guards
  if (!jobId)
    return <ErrorState message="Missing job ID." onBack={() => navigate(-1)} />;
  if (loading) return <Skeleton />;
  if (!job) {
    const msg =
      (byIdError && JSON.stringify(byIdErrObj)) ||
      (listError && JSON.stringify(listErrObj)) ||
      "Not found.";
    return <ErrorState message={msg} onBack={() => navigate(-1)} />;
  }

  // theme helpers (same pattern as freelancer)
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
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 text-sm font-medium mb-7 px-4 py-2 rounded-xl transition-all
            ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          <IconBack /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5">
            {/* Header card (same style) */}
            <div className={infoTag}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-blue-100 flex items-center justify-center text-white font-extrabold text-sm"
                      style={{ background: logoColor }}
                    >
                      {companyLogoText}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {companyLogoText}
                      </div>
                      <span
                        className={`text-[13px] font-semibold truncate ${t1}`}
                      >
                        {companyName}
                      </span>
                    </div>

                    <h1 className="text-blue-500 text-xl sm:text-[22px] font-bold leading-snug mb-2">
                      {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                      {loc && (
                        <span
                          className={`flex items-center gap-1.5 text-[12px] ${t2}`}
                        >
                          <IconLocation />
                          {loc}
                        </span>
                      )}
                      <span
                        className={`flex items-center gap-1.5 text-[12px] ${t2}`}
                      >
                        <IconClock />
                        Posted {posted}
                      </span>
                    </div>
                  </div>
                </div>

                
                  <MessageButton
                    otherUser={{
                      id: job?.userId || job?.postedBy,
                      fullName: companyName,
                      profileImageUrl: null,
                    }}
                  />
              
              </div>

              <div className={`my-4 border-t ${divLine}`} />

              {/* optional chips */}
              <div className="flex flex-wrap gap-2">
                {job?.category?.name && (
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {job.category.name}
                  </span>
                )}
                {job?.status && (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full
                                   bg-emerald-50 text-emerald-600 border border-emerald-100"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {job.status}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={infoTag}>
              <h2 className={`text-[14px] font-bold mb-3 ${t1}`}>
                Job Description
              </h2>
              <p
                className={`text-[13px] leading-[1.75] whitespace-pre-line ${t2}`}
              >
                {desc}
              </p>
            </div>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <div className={infoTag}>
                <h2 className={`text-[14px] font-bold mb-4 ${t1}`}>
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {responsibilities.map((r, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2.5 text-[13px] ${t2}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2" />
                      {asText(r)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements + Skills (same layout like freelancer Tools/Skills block) */}
            {(requirements.length > 0 || skillsArr.length > 0) && (
              <div className={infoTag}>
                <div className="flex gap-0">
                  {/* LEFT: Requirements */}
                  <div style={{ width: "45%", paddingRight: "24px" }}>
                    <h2 className={`text-[14px] font-bold mb-4 ${t1}`}>
                      Requirements
                    </h2>
                    {requirements.length > 0 ? (
                      <ul className="space-y-3">
                        {requirements.map((req, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2.5 text-[13px] ${t2}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2" />
                            {asText(req)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-[12px] italic opacity-40 ${t2}`}>
                        Static
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: "1px",
                      background: dm ? "#334155" : "#f1f5f9",
                      flexShrink: 0,
                    }}
                  />

                  {/* RIGHT: Skills */}
                  <div style={{ flex: 1, paddingLeft: "24px" }}>
                    <h2 className={`text-[14px] font-bold mb-4 ${t1}`}>
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skillsArr.map((s, i) => {
                        const label =
                          typeof s === "string"
                            ? s
                            : s?.name || s?.title || "—";
                        return (
                          <span
                            key={i}
                            style={{ whiteSpace: "nowrap" }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium cursor-default transition-colors
                              ${
                                dm
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

          {/* RIGHT */}
          <div className="w-full lg:w-[38%] flex flex-col gap-5 lg:sticky lg:top-6">
            {/* Quotation card (same as freelancer) */}
            <div className={infoTag}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className={`text-[11px] font-medium mb-0.5 ${t2}`}>
                    Project Cost
                  </p>
                  <span
                    className={`text-[28px] font-extrabold leading-none ${t1}`}
                  >
                    {budget != null
                      ? `$${Number(budget).toLocaleString()}`
                      : MOCK_PANEL.projectCost}
                  </span>
                </div>

                <button
                  onClick={() => setBookmarked((b) => !b)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                    ${
                      bookmarked
                        ? "bg-blue-50 text-blue-500"
                        : `${dm ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`
                    }`}
                >
                  <IconBookmark filled={bookmarked} />
                </button>
              </div>

              <div className={`border-t ${divLine} mb-4`} />

              {/* Experience */}
              <div
                className={`flex items-center gap-3 p-3 rounded-xl mb-3
                ${dm ? "bg-blue-950/50 border border-blue-900/40" : "bg-blue-50 border border-blue-100"}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                  ${dm ? "bg-blue-900/60 text-blue-300" : "bg-blue-100 text-blue-600"}`}
                >
                  <IconBriefcase />
                </div>
                <div>
                  <p
                    className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${t2}`}
                  >
                    Experience
                  </p>
                  <p className={`text-[13px] font-bold ${t1}`}>{exp || "—"}</p>
                </div>
              </div>

              {/* Duration + deadline */}
              <div
                className={`p-3 rounded-xl mb-5 ${dm ? "bg-slate-700/50 border border-slate-700" : "bg-slate-50 border border-slate-100"}`}
              >
                <p
                  className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${t2}`}
                >
                  Duration
                </p>
                <p className={`text-[13px] font-semibold ${t1}`}>
                  {duration || "—"}
                </p>

                <div className={`mt-3 border-t ${divLine}`} />

                <p
                  className={`mt-3 text-[10px] uppercase tracking-wider font-semibold mb-1 ${t2}`}
                >
                  Deadline
                </p>
                <p className={`text-[13px] font-semibold text-blue-500`}>
                  {deadline || "—"}
                </p>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white
                           bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all shadow-sm shadow-blue-200"
              >
                ← Go Back
              </button>
            </div>

            {/* ── Comments (Supabase real-time) ── */}
            <CommentsSection
              postType="job"
              postId={jobId}
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
