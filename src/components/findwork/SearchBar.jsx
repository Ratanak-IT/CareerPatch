// src/components/findwork/SearchBar.jsx
export default function SearchBar({
  searchText, onChangeSearch,
  experienceLevel, onChangeLevel,
  budgetRange, onChangeBudget, onSubmit,
}) {
  const levels  = ["All Levels", "Junior", "Mid-level", "Senior", "Expert"];
  const budgets = ["All Budgets", "$0-$500", "$500-$1000", "$1000-$2000", "$2000+"];

  const ChevronIcon = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-[18px] h-[18px] text-gray-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div
      className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-[0_8px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >

      {/* ════════════════════════════
          DESKTOP  md+  — single row
      ════════════════════════════ */}
      <div className="hidden md:flex items-stretch divide-x divide-gray-200 dark:divide-slate-700 h-[60px]">

        {/* Search input */}
        <div className="flex items-center gap-3 flex-1 px-5">
          <SearchIcon />
          <input
            type="text" value={searchText}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="Search by title"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500"
          />
          {searchText && (
            <button onClick={() => onChangeSearch("")} className="text-gray-300 hover:text-gray-500 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* Level */}
        <div className="relative flex items-center min-w-[168px]">
          <select value={experienceLevel} onChange={(e) => onChangeLevel(e.target.value)}
            className="appearance-none w-full h-full pl-5 pr-9 text-sm text-gray-600 dark:text-slate-300 bg-transparent outline-none cursor-pointer">
            {levels.map((l) => <option key={l}>{l}</option>)}
          </select>
          <ChevronIcon />
        </div>

        {/* Budget */}
        <div className="relative flex items-center min-w-[158px]">
          <select value={budgetRange} onChange={(e) => onChangeBudget(e.target.value)}
            className="appearance-none w-full h-full pl-5 pr-9 text-sm text-gray-600 dark:text-slate-300 bg-transparent outline-none cursor-pointer">
            {budgets.map((b) => <option key={b}>{b}</option>)}
          </select>
          <ChevronIcon />
        </div>

        {/* Button */}
        <button onClick={onSubmit}
          className="px-8 bg-[#1E88E5] hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold text-sm transition-colors shrink-0">
          Search
        </button>
      </div>

      {/* ════════════════════════════════════════
          MOBILE  below md
          New concept: compact pill-style rows
          inside a single seamless card
      ════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col">

        {/* ── Search input row ── */}
        <div className="flex items-center gap-3 px-4 h-[54px]">
          <SearchIcon />
          <input
            type="text" value={searchText}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="Search by title"
            className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500"
          />
          {searchText && (
            <button onClick={() => onChangeSearch("")} className="text-gray-300 hover:text-gray-500 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* ── Thin separator ── */}
        <div className="mx-4 h-px bg-gray-200 dark:bg-slate-700" />

        {/* ── Two filter dropdowns in a row ── */}
        <div className="flex items-center h-[50px]">

          {/* Level dropdown */}
          <div className="relative flex-1 flex items-center h-full">
            <select value={experienceLevel} onChange={(e) => onChangeLevel(e.target.value)}
              className="appearance-none w-full h-full pl-4 pr-8 text-[13px] text-gray-600 dark:text-slate-300 bg-transparent outline-none cursor-pointer">
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
            <ChevronIcon />
          </div>

          {/* Vertical divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 shrink-0" />

          {/* Budget dropdown */}
          <div className="relative flex-1 flex items-center h-full">
            <select value={budgetRange} onChange={(e) => onChangeBudget(e.target.value)}
              className="appearance-none w-full h-full pl-4 pr-8 text-[13px] text-gray-600 dark:text-slate-300 bg-transparent outline-none cursor-pointer">
              {budgets.map((b) => <option key={b}>{b}</option>)}
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* ── Search button — full width, rounded bottom ── */}
        <button onClick={onSubmit}
          className="w-full h-[52px] bg-[#1E88E5] hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold text-[15px] transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
          </svg>
          Search
        </button>
      </div>

    </div>
  );
}