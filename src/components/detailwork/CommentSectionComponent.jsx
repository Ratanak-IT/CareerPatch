import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#3B82F6" : "none"} stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DeadlineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, valueClass = "text-gray-800 font-semibold text-sm" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className={valueClass}>{value}</p>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CommentSectionComponent({ data }) {
  const [liked, setLiked] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(data.comments);

  const handlePost = () => {
    if (!comment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: "You", avatarUrl: null, initials: "YO", text: comment.trim(), timeAgo: "Just now" },
    ]);
    setComment("");
  };

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Project Info Card */}
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{data.projectCost}</span>
            <span className="text-gray-400 text-xs sm:text-sm">Project cost</span>
          </div>
          <button onClick={() => setLiked((v) => !v)} className="transition-transform hover:scale-110 p-1">
            <HeartIcon filled={liked} />
          </button>
        </div>

        {/* Info rows — 3-col on tablet, 1-col on mobile & desktop sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <InfoRow icon={<BriefcaseIcon />} label="Experience" value={data.experience} />
          <InfoRow icon={<CalendarIcon />} label="Duration" value={data.duration} />
          <InfoRow
            icon={<DeadlineIcon />}
            label="Deadline"
            value={data.deadline}
            valueClass="text-blue-500 font-semibold text-sm"
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm">
          Apply Now
        </button>
      </div>

      {/* Comments Card */}
      <div className="bg-white rounded-2xl px-4 sm:px-5 py-4 sm:py-5 shadow-sm border border-gray-100">
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 max-h-40 sm:max-h-52 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5 sm:gap-3">
              {c.avatarUrl ? (
                <img src={c.avatarUrl} alt={c.author} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {c.initials || c.author.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{c.author}</span>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{c.timeAgo}</span>
                </div>
                <div className="bg-gray-100 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-600">{c.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
          <input
            type="text"
            placeholder="Write a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            className="flex-1 text-xs sm:text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent min-w-0"
          />
          <button
            onClick={handlePost}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0"
          >
            Post
          </button>
        </div>
      </div>

    </div>
  );
}