import { useState, useEffect } from "react";

const categories = [
  "All",
  "Freelancer",
  "Python Programming",
  "Designer",
  "Developer",
  "Writer",
  "Marketer",
  "Consultant",
  "Photographer",
  "Videographer",
];

export default function FreelancerSearchBarComponent({
  category = "All",
  searchText = "",
  onChangeCategory,
  onChangeSearch,
  onSubmitSearch,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // keep internal input synced with parent
  const [localSearch, setLocalSearch] = useState(searchText);

  useEffect(() => {
    setLocalSearch(searchText);
  }, [searchText]);

  const handleSearch = () => {
    onChangeSearch?.(localSearch);
    onSubmitSearch?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ✅ match Job SearchBar height
  const HEIGHT = "h-[56px]";

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full">
        <div
          className="
            flex items-center
            w-full
            bg-white
            border border-gray-100
            rounded-lg
            shadow-lg
            overflow-visible
          "
        >
          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((s) => !s)}
              className={`
                flex items-center gap-2
                px-4
                ${HEIGHT}
                text-gray-700 text-sm font-normal
                bg-transparent
                outline-none
                cursor-pointer
                whitespace-nowrap
              `}
            >
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <span className="truncate max-w-[110px]">{category}</span>

              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onChangeCategory?.(cat);
                      setDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 text-sm
                      hover:bg-gray-50 transition-colors
                      ${cat === category ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 shrink-0" />

          {/* Search Input */}
          <div className={`flex items-center flex-1 px-4 min-w-0 ${HEIGHT}`}>
            <svg className="w-4 h-4 text-gray-400 shrink-0 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, category, freelancer name"
              className="
                flex-1 min-w-0
                bg-transparent
                border-none outline-none
                text-gray-700 text-sm
                placeholder-gray-400
              "
            />

            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onChangeSearch?.("");
                }}
                className="ml-2 text-gray-300 hover:text-gray-500 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className={`
              ${HEIGHT}
              bg-[#1E88E5] hover:bg-blue-600
              text-white font-semibold text-sm
              px-8
              transition-colors duration-200
              whitespace-nowrap
              rounded-r-lg
            `}
          >
            Search
          </button>
        </div>
      </div>

      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </div>
  );
}