// src/components/carddetail/CarddetailBusiness.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetJobByIdQuery } from "../../services/servicesApi";
import { useGetUserByIdQuery } from "../../services/userApi";

const FALLBACK_AVATAR = "https://placehold.co/48x48?text=?";

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatRelative(value) {
  if (!value) return "";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function IconHeart({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#1E88E5" : "none"} stroke={filled ? "#1E88E5" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ── Static sample comments (since API has none) ───────────────────────────────
const STATIC_COMMENTS = [
  { id: 1, name: "Eung Lizuia", avatar: "https://i.pravatar.cc/40?img=5", text: "So amazing", time: "2 hours ago" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CardDetailBusiness() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(STATIC_COMMENTS);

  // Fetch job
  const { data: jobRes, isLoading, isError } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const job = jobRes?.data ?? jobRes;

  // Fetch author
  const userId = job?.userId;
  const { data: userRes } = useGetUserByIdQuery(userId, { skip: !userId });
  const author = userRes?.data ?? userRes;

  const authorName = author?.companyName || author?.fullName || author?.username || "ABA Bank";
  const authorAvatar = author?.profileImageUrl || FALLBACK_AVATAR;
  const authorInitials = authorName?.slice(0, 3).toUpperCase() || "ABA";

  // Job fields
  const title = job?.title || "Untitled";
  const description = job?.description || "No description provided.";
  const budget = job?.budget;
  const level = job?.level || job?.experienceLevel || "Expert";
  const duration = job?.duration || "1–2 months";
  const deadline = job?.deadline ? formatDate(job.deadline) : "Mar 1, 2026";
  const location = job?.location || "Phnom Penh (Khan Sek Sok,)";
  const postedAgo = formatRelative(job?.createdAt);
  const skills = Array.isArray(job?.skills) && job.skills.length > 0 ? job.skills : ["Figma", "Design"];

  // Parse responsibilities & requirements from description or use defaults
  const responsibilities = Array.isArray(job?.responsibilities) && job.responsibilities.length > 0
    ? job.responsibilities
    : [
        "Collaborate with product managers & developers",
        "Create wireframes & prototypes",
        "Visual design & branding",
        "Improve user experience",
        "Usability testing",
      ];

  const requirements = Array.isArray(job?.requirements) && job.requirements.length > 0
    ? job.requirements
    : [
        "5+ years of experience with Figma or Sketch",
        "Strong portfolio showcasing relevant projects",
      ];

  function handlePostComment() {
    const text = comment.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), name: "You", avatar: FALLBACK_AVATAR, text, time: "Just now" },
    ]);
    setComment("");
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError || !job) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow">
          <p className="text-gray-700 font-semibold mb-2">Job not found</p>
          <p className="text-gray-400 text-sm mb-5">The job you're looking for doesn't exist or was removed.</p>
          <button
            onClick={() => navigate("/findwork")}
            className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
          <div className="w-full lg:w-[60%] flex flex-col gap-5">

            {/* Header card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Company info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1E88E5] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {author?.profileImageUrl ? (
                      <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <span className="text-white font-bold text-xs">{authorInitials}</span>
                    )}
                  </div>
                  <span className="text-gray-800 font-semibold text-sm">{authorName}</span>
                </div>

                {/* Message button */}
                <button className="flex items-center gap-2 bg-[#1E88E5] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  <IconSend />
                  Message
                </button>
              </div>

              <div className="mt-4 pb-4 border-b border-gray-100">
                <h1 className="text-[#1E88E5] text-xl font-bold">{title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><IconPin /> {location}</span>
                  <span className="flex items-center gap-1">
                    <IconClock />
                    Posted {postedAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-gray-800 font-bold text-sm mb-3">Job Description</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-gray-800 font-bold text-sm mb-4">Responsibilities:</h2>
              <ul className="flex flex-col gap-2.5">
                {responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[#1E88E5] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements + Skills */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-gray-800 font-bold text-sm mb-4">Requirements:</h2>
                  <ul className="flex flex-col gap-2.5">
                    {requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#1E88E5] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:w-[180px]">
                  <h2 className="text-gray-800 font-bold text-sm mb-4">Skills needed</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
          <div className="w-full lg:w-[40%] flex flex-col gap-5">

            {/* Budget + Info card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {/* Budget row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {budget != null ? `$${budget}` : "$1500"}
                  </span>
                  <span className="text-gray-400 text-sm">Project cost</span>
                </div>
                <button onClick={() => setLiked((p) => !p)} className="p-1 hover:scale-110 transition-transform">
                  <IconHeart filled={liked} />
                </button>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-3 mb-5">
                <InfoRow icon={<IconBriefcase />} label="Experience" value={level} valueColor="text-gray-800" />
                <InfoRow icon={<IconCalendar />} label="Duration" value={duration} valueColor="text-gray-800" />
                <InfoRow icon={<IconClock />} label="Deadline" value={deadline} valueColor="text-[#1E88E5]" />
              </div>

              {/* Apply button */}
              <button className="w-full bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors">
                Apply Now
              </button>
            </div>

            {/* Comments card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {/* Comment list */}
              <div className="flex flex-col gap-4 mb-4">
                {comments.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover"
                          onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                        />
                        <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{c.time}</span>
                    </div>
                    <div className="ml-11">
                      <span className="inline-block bg-[#f0f4ff] text-gray-600 text-sm px-4 py-2 rounded-xl">
                        {c.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4" />

              {/* Comment input */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                  placeholder="Write a comment"
                  className="flex-1 bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 rounded-xl px-4 py-2.5 outline-none focus:border-[#1E88E5] transition-colors"
                />
                <button
                  onClick={handlePostComment}
                  className="bg-[#1E88E5] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
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

// ── Info Row Sub-component ─────────────────────────────────────────────────────
function InfoRow({ icon, label, value, valueColor = "text-gray-800" }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f7ff] border border-[#dbeafe]">
      <div className="w-9 h-9 rounded-xl bg-[#dbeafe] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-sm font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}