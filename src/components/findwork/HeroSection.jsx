// src/components/findwork/HeroSection.jsx
import SearchBar from "./SearchBar";

const AVATAR_SAMPLES = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
];

export default function HeroSection({
  searchText,
  onChangeSearch,
  experienceLevel,
  onChangeLevel,
  budgetRange,
  onChangeBudget,
  onSubmit,
}) {
  return (
    <div className="relative pb-10 sm:pb-14">
      {/* Hero card */}
      <div
        className="w-full rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 50%, #EFF6FF 100%)" }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 pt-10 pb-16 lg:pb-14 gap-6">
          {/* Text */}
          <div className="w-full lg:w-[55%] text-center lg:text-left">
            <h1 className="font-extrabold leading-tight text-[26px] sm:text-[34px] lg:text-[42px] text-gray-900 mb-3">
              Find Freelance Projects{" "}
              <span className="text-[#1E88E5]">That</span>
              <br />
              Match Your Skills
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-sm mx-auto lg:mx-0">
              Browse thousands of freelance opportunities tailored to your expertise.
            </p>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {AVATAR_SAMPLES.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Over <span className="text-[#1E88E5] font-bold">12800+</span> freelancers to</p>
                  <p className="text-xs text-gray-500">complete your projects</p>
                </div>
              </div>
              <button className="bg-[#1E88E5] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 shadow-md shadow-blue-200">
                Find your skill
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full lg:w-[45%] flex justify-center">
            <div className="relative w-[240px] sm:w-[300px] lg:w-[340px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 scale-[0.85] translate-y-4" />
              <div className="relative z-10 flex items-center justify-center h-[200px] sm:h-[240px]">
                <svg viewBox="0 0 280 220" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40" y="160" width="200" height="10" rx="4" fill="#E0E7FF"/>
                  <rect x="60" y="170" width="8" height="30" rx="2" fill="#C7D2FE"/>
                  <rect x="212" y="170" width="8" height="30" rx="2" fill="#C7D2FE"/>
                  <rect x="70" y="90" width="120" height="75" rx="8" fill="#1E88E5" opacity="0.9"/>
                  <rect x="75" y="95" width="110" height="60" rx="5" fill="#1565C0"/>
                  <rect x="82" y="105" width="60" height="4" rx="2" fill="#60A5FA"/>
                  <rect x="82" y="115" width="45" height="4" rx="2" fill="#93C5FD"/>
                  <rect x="82" y="125" width="55" height="4" rx="2" fill="#60A5FA"/>
                  <rect x="82" y="135" width="35" height="4" rx="2" fill="#93C5FD"/>
                  <circle cx="165" cy="120" r="14" fill="#3B82F6" opacity="0.8"/>
                  <path d="M160 113 l14 7 -14 7Z" fill="white"/>
                  <rect x="122" y="165" width="16" height="8" rx="2" fill="#93C5FD"/>
                  <rect x="112" y="173" width="36" height="5" rx="2" fill="#93C5FD"/>
                  <circle cx="200" cy="95" r="18" fill="#FFD6A5"/>
                  <rect x="183" y="113" width="34" height="40" rx="10" fill="#1E88E5"/>
                  <rect x="160" y="120" width="25" height="8" rx="4" fill="#FFD6A5"/>
                  <rect x="217" y="120" width="25" height="8" rx="4" fill="#FFD6A5"/>
                  <path d="M182 92 Q200 75 218 92 Q215 80 200 77 Q185 80 182 92Z" fill="#4B3B2A"/>
                  <circle cx="240" cy="60" r="22" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                  <circle cx="240" cy="60" r="2" fill="#1E88E5"/>
                  <line x1="240" y1="60" x2="240" y2="44" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="240" y1="60" x2="252" y2="64" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="255" cy="35" r="16" fill="#FEF3C7"/>
                  <text x="249" y="42" fontSize="18" fill="#F59E0B" fontWeight="bold">?</text>
                  <circle cx="48" cy="130" r="12" fill="#E0E7FF" stroke="#A5B4FC" strokeWidth="1.5"/>
                  <circle cx="48" cy="130" r="5" fill="white"/>
                  <rect x="35" y="75" width="10" height="10" rx="2" fill="#FCA5A5" opacity="0.6"/>
                  <circle cx="252" cy="95" r="5" fill="#86EFAC" opacity="0.7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar floated at bottom */}
      <div className="absolute bottom-7 left-0 right-0">
        <SearchBar
          searchText={searchText}
          onChangeSearch={onChangeSearch}
          experienceLevel={experienceLevel}
          onChangeLevel={onChangeLevel}
          budgetRange={budgetRange}
          onChangeBudget={onChangeBudget}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}