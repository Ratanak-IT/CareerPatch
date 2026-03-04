// src/components/findwork/HeroSection.jsx
import SearchBar from "./SearchBar";
import sectionpagefind from "../../assets/sectionpagefind.png";
import qestion from "../../assets/qestion.png";
import khim from "../../assets/khim.png";
import kormva from "../../assets/kormva.png";
import ratanalkkh from "../../assets/ratanalkkh.png";

const AVATARS = [
  { src: khim,       alt: "Khim" },
  { src: kormva,     alt: "Kormva" },
  { src: ratanalkkh, alt: "Ratanalkkh" },
];

export default function HeroSection({
  searchText, onChangeSearch,
  experienceLevel, onChangeLevel,
  budgetRange, onChangeBudget, onSubmit,
}) {
  return (
    <section
      className={[
        "w-full overflow-hidden relative",
        // mobile SearchBar = 3 rows ~180px | desktop = 60px
        "pb-[164px] md:pb-[68px]",
        "bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/25",
        "dark:bg-gradient-to-br dark:from-[#0d1b2e] dark:via-[#0f2240] dark:to-[#0d1520]",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Dot-grid dark only */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-20 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Inner wrapper same as MainSection */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">

        {/* LEFT */}
        <div className="w-full lg:w-[48%] space-y-7 py-16 lg:py-20 text-center lg:text-left">

          {/* Badge */}
          <div className="flex items-center gap-2.5 w-fit mx-auto lg:mx-0 px-4 py-2 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/25">
            <div className="flex items-center rounded-full px-0.5 bg-[#1E88E5]" style={{ width: "32px", height: "18px" }}>
              <div className="rounded-full bg-white ml-auto" style={{ width: "14px", height: "14px" }} />
            </div>
            <span className="text-[#1E88E5] text-[12px] font-semibold uppercase tracking-wide">Find Your Dream Job</span>
          </div>

          {/* Heading same scale as MainSection: 40/52/64 */}
          <h1 className="font-bold leading-[1.1] text-[40px] md:text-[52px] lg:text-[64px] m-0">
            <span className="text-[#1E88E5]">Find Freelance Projects</span>
            <br />
            <span className="text-gray-900 dark:text-white">That Match Your</span>
            <br />
            <span className="text-gray-900 dark:text-white">Skills</span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base leading-relaxed max-w-[480px] mx-auto lg:mx-0 m-0 text-gray-400 dark:text-slate-400">
            Browse thousands of freelance opportunities tailored to your expertise.
            Find your perfect match for your next project.
          </p>

          {/* Avatars + CTA */}
          <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {AVATARS.map(({ src, alt }, i) => (
                  <img key={i} src={src} alt={alt} className="w-10 h-10 rounded-full object-cover object-top border-2 border-white dark:border-[#0f172a]" />
                ))}
              </div>
              <p className="text-[12px] leading-snug m-0 text-gray-400 dark:text-slate-400 text-left">
                Over <span className="text-[#1E88E5] font-bold">12800+</span> freelancers to
                <br />complete your projects
              </p>
            </div>
            <button className="inline-flex items-center gap-2 bg-[#1E88E5] hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 dark:shadow-blue-900 whitespace-nowrap">
              Find your skill
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT same as MainSection */}
        <div className="w-full lg:w-[52%] relative flex justify-center lg:justify-end items-end self-end">
          <img
            src={sectionpagefind} alt="Freelancer working"
            className="relative z-10 w-full object-contain object-bottom max-w-[460px]"
            style={{ filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.15))" }}
          />
          <img
            src={qestion} alt="Question mark"
            className="absolute z-20 object-contain top-[5%] right-[5%] w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
          />
          {/* 30K+ card same as MainSection */}
          <div
            className="absolute z-20 rounded-2xl p-4 lg:p-5 flex flex-col gap-1.5 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.1)] dark:bg-slate-800 dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            style={{ top: "32%", right: "2%", minWidth: "130px", animation: "floatCard 3s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-extrabold leading-none text-gray-900 dark:text-slate-100">30K+</span>
              <span className="text-xl">&#x1F4BC;</span>
            </div>
            <span className="text-[13px] font-medium text-gray-400 dark:text-slate-400">People got hired</span>
          </div>
          <div className="absolute -z-0 rounded-full pointer-events-none bottom-0 right-[5%] w-[70%] aspect-square bg-[#1E88E5]/10 blur-3xl" />
        </div>
      </div>

      {/* SearchBar flush at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-[120px]">
        <div className="max-w-[1440px] mx-auto">
          <SearchBar
            searchText={searchText} onChangeSearch={onChangeSearch}
            experienceLevel={experienceLevel} onChangeLevel={onChangeLevel}
            budgetRange={budgetRange} onChangeBudget={onChangeBudget} onSubmit={onSubmit}
          />
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}