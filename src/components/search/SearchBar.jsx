import { useState, useRef, useEffect } from "react";

function ModernDropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-full flex items-center justify-between px-4 md:px-5
                   text-sm text-left bg-transparent
                   text-gray-600 dark:text-slate-300
                   hover:bg-gray-50 dark:hover:bg-[#13233f]
                   transition-colors"
      >
        <span className="truncate">{value || placeholder}</span>
        <svg
          className={`w-4 h-4 shrink-0 ml-2 text-gray-400 dark:text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden
                     rounded-2xl border border-gray-200 dark:border-[#1e3a5f]
                     bg-white dark:bg-[#0d1b35]
                     shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <div className="max-h-64 overflow-y-auto py-2">
            {options.map((option) => {
              const active = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors
                    ${
                      active
                        ? "bg-blue-50 text-[#1E88E5] dark:bg-[#14345c] dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-[#13233f]"
                    }`}
                >
                  <span className="truncate">{option}</span>
                  {active && (
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBar({
  searchText,
  onChangeSearch,
  selectedCategory,
  onChangeCategory,
  categories = [],
  budgetRange,
  onChangeBudget,
  onSubmit,
}) {
  const budgets = [
    "All Budgets",
    "$0-$500",
    "$500-$1000",
    "$1000-$2000",
    "$2000+",
  ];

  const categoryOptions =
    categories?.length > 0 ? categories : ["All Category"];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Desktop */}
      <div
        className="hidden md:flex items-stretch h-[64px] rounded-2xl overflow-visible
                   bg-white dark:bg-[#0d1b35]
                   border border-gray-200 dark:border-[#1e3a5f]
                   shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
      >
        <div
          className="flex items-center gap-3 px-6 min-w-0"
          style={{ flex: "2" }}
        >
          <svg
            className="w-[18px] h-[18px] text-gray-400 dark:text-slate-500 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>

          <input
            type="text"
            value={searchText}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="Search by title"
            className="flex-1 min-w-0 bg-transparent outline-none
                       text-sm text-gray-700 dark:text-slate-200
                       placeholder-gray-400 dark:placeholder-slate-500"
          />

          {searchText && (
            <button
              onClick={() => onChangeSearch("")}
              className="text-gray-300 hover:text-gray-500 dark:text-slate-600 dark:hover:text-slate-400 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="w-px self-stretch bg-gray-200 dark:bg-[#1e3a5f]" />

        {/* Category */}
        <div className="relative flex items-center" style={{ flex: "1" }}>
          <ModernDropdown
            value={selectedCategory}
            options={categoryOptions}
            onChange={onChangeCategory}
            placeholder="All Category"
          />
        </div>

        <div className="w-px self-stretch bg-gray-200 dark:bg-[#1e3a5f]" />

        {/* Budget */}
        <div className="relative flex items-center" style={{ flex: "1" }}>
          <ModernDropdown
            value={budgetRange}
            options={budgets}
            onChange={onChangeBudget}
            placeholder="All Budgets"
          />
        </div>

        <button
          onClick={onSubmit}
          className="px-10 bg-[#1E88E5] hover:bg-blue-600
                     dark:bg-blue-500 dark:hover:bg-blue-400
                     text-white font-semibold text-sm
                     transition-colors shrink-0 rounded-r-2xl"
        >
          Search
        </button>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div
          className="w-full rounded-2xl overflow-visible
                     bg-white dark:bg-[#0d1b35]
                     border border-gray-200 dark:border-[#1e3a5f]
                     shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-3 px-4 h-[54px] border-b border-gray-100 dark:border-[#1e3a5f]">
            <svg
              className="w-[17px] h-[17px] text-gray-400 dark:text-slate-500 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>

            <input
              type="text"
              value={searchText}
              onChange={(e) => onChangeSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Search by title"
              className="flex-1 bg-transparent outline-none text-[14px]
                         text-gray-700 dark:text-slate-200
                         placeholder-gray-400 dark:placeholder-slate-500"
            />

            <button
              onClick={onSubmit}
              className="w-9 h-9 rounded-xl bg-[#1E88E5] hover:bg-blue-600
                         flex items-center justify-center shrink-0
                         transition-colors active:scale-95"
            >
              <svg
                className="w-[18px] h-[18px] text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex h-[48px] divide-x divide-gray-100 dark:divide-[#1e3a5f]">
            <div className="relative flex-1">
              <ModernDropdown
                value={selectedCategory}
                options={categoryOptions}
                onChange={onChangeCategory}
                placeholder="All Category"
              />
            </div>

            <div className="relative flex-1">
              <ModernDropdown
                value={budgetRange}
                options={budgets}
                onChange={onChangeBudget}
                placeholder="All Budgets"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}