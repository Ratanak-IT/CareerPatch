// src/components/profile/ProfileCompletionBar.jsx
// Shows profile completion progress to the owner only

const CHECKS = [
  { key: "avatar",    label: "Profile photo",    check: (u) => !!u?.profileImageUrl },
  { key: "fullName",  label: "Full name",        check: (u) => !!String(u?.fullName || "").trim() },
  { key: "bio",       label: "Bio / About",      check: (u) => !!String(u?.bio || "").trim() },
  { key: "phone",     label: "Phone number",     check: (u) => !!String(u?.phone || "").trim() },
  { key: "address",   label: "Location",         check: (u) => !!String(u?.address || "").trim() },
  { key: "skills",    label: "Skills added",     check: (u) => Array.isArray(u?.skills) && u.skills.length > 0 },
  { key: "portfolio", label: "Portfolio set up", check: (u, hasPortfolio) => !!hasPortfolio },
  { key: "cover",     label: "Cover photo",      check: (u, _hasPortfolio, hasCover) => !!hasCover },
];

function getColor(pct) {
  if (pct < 40)  return { bar: "#ef4444", text: "text-red-500",    bg: "bg-red-50 dark:bg-red-900/20",    border: "border-red-200 dark:border-red-800" };
  if (pct < 70)  return { bar: "#f59e0b", text: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" };
  if (pct < 100) return { bar: "#3b82f6", text: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/20",  border: "border-blue-200 dark:border-blue-800" };
  return          { bar: "#22c55e", text: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20",  border: "border-green-200 dark:border-green-800" };
}

export default function ProfileCompletionBar({ user, hasPortfolio = false, hasCover = false, onEditClick }) {
  if (!user) return null;

  const results = CHECKS.map((c) => ({ ...c, done: c.check(user, hasPortfolio, hasCover) }));
  const done    = results.filter((r) => r.done).length;
  const pct     = Math.round((done / results.length) * 100);
  const missing = results.filter((r) => !r.done);

  const { bar, text, bg, border } = getColor(pct);

  const label =
    pct === 100 ? "Profile complete! 🎉" :
    pct >= 70   ? "Almost there!" :
    pct >= 40   ? "Keep going!" :
    "Let's get started!";

  return (
    <div className={`rounded-2xl border ${border} ${bg} p-4 mb-4`}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`relative w-10 h-10 shrink-0`}>
            {/* Circular progress */}
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor"
                      strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
              <circle cx="18" cy="18" r="15.5" fill="none"
                      strokeWidth="3"
                      stroke={bar}
                      strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 0.6s ease" }} />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${text}`}>
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{done} of {results.length} complete</p>
          </div>
        </div>

        {pct < 100 && onEditClick && (
          <button
            onClick={onEditClick}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            style={{ background: bar, color: "#fff" }}
          >
            Complete Profile
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: bar }}
        />
      </div>

      {/* Missing items */}
      {missing.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {missing.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                         bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            >
              <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {item.label}
            </span>
          ))}
        </div>
      )}

      {/* All done */}
      {pct === 100 && (
        <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Your profile is 100% complete. You look great!
        </p>
      )}
    </div>
  );
}