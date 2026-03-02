// ── Icons ─────────────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function JobDetailComponent({ job }) {
  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Header */}
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold tracking-wide flex-shrink-0"
              style={{ backgroundColor: job.company.logoColor }}
            >
              {job.company.logo}
            </div>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">{job.company.name}</span>
          </div>
          <button className="flex items-center gap-1.5 sm:gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-sm">
            <SendIcon />
            Message
          </button>
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-blue-500 mb-3 sm:mb-4">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-400 text-xs sm:text-sm pt-3 sm:pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5"><LocationIcon />{job.location}</span>
          <span className="flex items-center gap-1.5"><ClockIcon />Posted {job.postedAgo}</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm sm:text-base mb-2 sm:mb-3">Job Description</h2>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{job.description}</p>
      </div>

      {/* Responsibilities */}
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">Responsibilities:</h2>
        <ul className="space-y-2 sm:space-y-3">
          {job.responsibilities.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-500">
              <span className="mt-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Requirements + Skills */}
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-16">
          <div className="flex-1">
            <h2 className="font-bold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">Requirements:</h2>
            <ul className="space-y-2 sm:space-y-3">
              {job.requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <span className="mt-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">Skills needed</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-xs sm:text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}