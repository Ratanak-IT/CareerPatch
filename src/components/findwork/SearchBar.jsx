// src/components/findwork/SearchBar.jsx
export default function SearchBar({
  searchText, onChangeSearch,
  experienceLevel, onChangeLevel,
  budgetRange, onChangeBudget, onSubmit,
}) {
  const levels  = ["All Levels", "Junior", "Mid-level", "Senior", "Expert"];
  const budgets = ["All Budgets", "$0-$500", "$500-$1000", "$1000-$2000", "$2000+"];

  const Chevron = () => (
    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4
                    text-gray-400 dark:text-slate-500 shrink-0"
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ══ DESKTOP md+ — single row, matches screenshot ══ */}
      <div className="hidden md:flex items-stretch h-[64px] rounded-2xl overflow-hidden
                      bg-white dark:bg-[#0d1b35]
                      border border-gray-200 dark:border-[#1e3a5f]
                      shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]">

        {/* Search — takes majority of space */}
        <div className="flex items-center gap-3 px-6 min-w-0" style={{ flex: "2" }}>
          <svg className="w-[18px] h-[18px] text-gray-400 dark:text-slate-500 shrink-0"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
          </svg>
          <input
            type="text" value={searchText}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="Search by title"
            className="flex-1 min-w-0 bg-transparent outline-none
                       text-sm text-gray-700 dark:text-slate-200
                       placeholder-gray-400 dark:placeholder-slate-500"
          />
          {searchText && (
            <button onClick={() => onChangeSearch("")}
              className="text-gray-300 hover:text-gray-500 dark:text-slate-600
                         dark:hover:text-slate-400 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-200 dark:bg-[#1e3a5f]" />

        {/* Experience Level */}
        <div className="relative flex items-center" style={{ flex: "1" }}>
          <select value={experienceLevel} onChange={(e) => onChangeLevel(e.target.value)}
            className="appearance-none w-full h-full pl-5 pr-10 text-sm
                       text-gray-500 dark:text-slate-300
                       bg-transparent outline-none cursor-pointer">
            {levels.map((l) => <option key={l}>{l}</option>)}
          </select>
          <Chevron />
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-200 dark:bg-[#1e3a5f]" />

        {/* Budget Range */}
        <div className="relative flex items-center" style={{ flex: "1" }}>
          <select value={budgetRange} onChange={(e) => onChangeBudget(e.target.value)}
            className="appearance-none w-full h-full pl-5 pr-10 text-sm
                       text-gray-500 dark:text-slate-300
                       bg-transparent outline-none cursor-pointer">
            {budgets.map((b) => <option key={b}>{b}</option>)}
          </select>
          <Chevron />
        </div>

        {/* Search button */}
        <button onClick={onSubmit}
          className="px-10 bg-[#1E88E5] hover:bg-blue-600
                     dark:bg-blue-500 dark:hover:bg-blue-400
                     text-white font-semibold text-sm
                     transition-colors shrink-0">
          Search
        </button>
      </div>

      {/* ══ MOBILE — single card, arrow inside search row ══ */}
      <div className="md:hidden">
        <div className="w-full rounded-2xl overflow-hidden
                        bg-white dark:bg-[#0d1b35]
                        border border-gray-200 dark:border-[#1e3a5f]
                        shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

          {/* Search row — arrow button replaces separate Search pill */}
          <div className="flex items-center gap-3 px-4 h-[54px]
                          border-b border-gray-100 dark:border-[#1e3a5f]">
            <svg className="w-[17px] h-[17px] text-gray-400 dark:text-slate-500 shrink-0"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={searchText}
              onChange={(e) => onChangeSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Search by title"
              className="flex-1 bg-transparent outline-none text-[14px]
                         text-gray-700 dark:text-slate-200
                         placeholder-gray-400 dark:placeholder-slate-500"
            />
            {/* Arrow button — replaces the big Search pill */}
            <button onClick={onSubmit}
              className="w-9 h-9 rounded-xl bg-[#1E88E5] hover:bg-blue-600
                         flex items-center justify-center shrink-0
                         transition-colors active:scale-95">
              <svg className="w-[18px] h-[18px] text-white" fill="none"
                stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Dropdowns row */}
          <div className="flex h-[48px] divide-x divide-gray-100 dark:divide-[#1e3a5f]">
            <div className="relative flex-1 flex items-center">
              <select value={experienceLevel} onChange={(e) => onChangeLevel(e.target.value)}
                className="appearance-none w-full h-full pl-4 pr-7 text-[13px]
                           text-gray-500 dark:text-slate-300
                           bg-transparent outline-none cursor-pointer">
                {levels.map((l) => <option key={l}>{l}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
                              w-3.5 h-3.5 text-gray-400 shrink-0"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="m6 9 6 6 6-6" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="relative flex-1 flex items-center">
              <select value={budgetRange} onChange={(e) => onChangeBudget(e.target.value)}
                className="appearance-none w-full h-full pl-4 pr-7 text-[13px]
                           text-gray-500 dark:text-slate-300
                           bg-transparent outline-none cursor-pointer">
                {budgets.map((b) => <option key={b}>{b}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
                              w-3.5 h-3.5 text-gray-400 shrink-0"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="m6 9 6 6 6-6" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}