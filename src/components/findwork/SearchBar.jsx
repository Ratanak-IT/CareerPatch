// src/components/findwork/SearchBar.jsx

export default function SearchBar({
  searchText,
  onChangeSearch,
  experienceLevel,
  onChangeLevel,
  budgetRange,
  onChangeBudget,
  onSubmit,
}) {
  const levels  = ["All Levels", "Junior", "Mid-level", "Senior", "Expert"];
  const budgets = ["All Budgets", "$0–$500", "$500–$1000", "$1000–$2000", "$2000+"];

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-0 overflow-hidden">
      {/* Search input */}
      <div className="flex items-center flex-1 px-4 py-3 sm:py-0 gap-2 border-b sm:border-b-0 sm:border-r border-gray-100">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchText}
          onChange={(e) => onChangeSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Search by title"
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        {searchText && (
          <button onClick={() => onChangeSearch("")} className="text-gray-300 hover:text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Experience Level */}
      <div className="relative border-b sm:border-b-0 sm:border-r border-gray-100">
        <select
          value={experienceLevel}
          onChange={(e) => onChangeLevel(e.target.value)}
          className="appearance-none w-full sm:w-44 px-4 py-3 sm:h-[56px] text-sm text-gray-600 bg-transparent outline-none cursor-pointer pr-8"
        >
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Budget Range */}
      <div className="relative border-b sm:border-b-0 sm:border-r border-gray-100">
        <select
          value={budgetRange}
          onChange={(e) => onChangeBudget(e.target.value)}
          className="appearance-none w-full sm:w-40 px-4 py-3 sm:h-[56px] text-sm text-gray-600 bg-transparent outline-none cursor-pointer pr-8"
        >
          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Search Button */}
      <button
        onClick={onSubmit}
        className="bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold text-sm px-8 py-3 sm:py-0 sm:h-[56px] transition-colors duration-200 whitespace-nowrap"
      >
        Search
      </button>
    </div>
  );
}