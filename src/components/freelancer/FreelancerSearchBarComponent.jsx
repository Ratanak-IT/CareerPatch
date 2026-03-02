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

  return (
    <div className="flex items-center justify-center w-full ">
      <div className="relative w-full">
        <div
          className="
            flex items-center
            w-full
            
            bg-white
            border border-gray-200
            rounded-lg
            shadow-sm
            overflow-visible
          "
        >
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="
                flex items-center gap-1.5 sm:gap-2
                px-3 sm:px-4 md:px-5
                h-[60px] sm:h-[80px] md:h-[100px]
                text-gray-700
                text-sm sm:text-base
                font-normal
                bg-transparent
                border-none
                outline-none
                cursor-pointer
                whitespace-nowrap
              "
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <span className="truncate max-w-[70px] sm:max-w-[90px] md:max-w-[120px]">
                {category}
              </span>

              <svg
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onChangeCategory?.(cat);
                      setDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 sm:py-2.5 text-sm
                      hover:bg-gray-50 transition-colors
                      ${
                        cat === category
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 sm:h-7 md:h-8 bg-gray-300 flex-shrink-0" />

          {/* Search Input */}
          <div className="flex items-center flex-1 px-3 sm:px-4 md:px-5 min-w-0">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 mr-2 sm:mr-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
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
                flex-1
                bg-transparent
                border-none
                outline-none
                text-gray-500
                text-sm sm:text-base
                placeholder-gray-400
                min-w-0
              "
            />

            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  onChangeSearch?.("");
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0 pr-2 sm:pr-3">
            <button
              onClick={handleSearch}
              className="
                bg-blue-500
                hover:bg-blue-600
                active:bg-blue-700
                text-white
                font-medium
                text-sm sm:text-base
                px-4 sm:px-6 md:px-7
                py-2 sm:py-2.5 md:py-3
                rounded-md
                transition-colors duration-150
                whitespace-nowrap
                cursor-pointer
              "
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </div>
  );
}