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

// Desktop SearchBar = 64px  → half = 32px
// Mobile SearchBar  = 52+48+12+48 = 160px → half = 80px

export default function HeroSection({
  searchText, onChangeSearch,
  experienceLevel, onChangeLevel,
  budgetRange, onChangeBudget, onSubmit,
}) {
  return (
    <div
      className="relative w-full"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Hero background ── */}
      <section
        className={[
          "w-full overflow-hidden relative",
          "bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/25",
          "dark:from-[#0d1b2e] dark:via-[#0f2240] dark:to-[#0d1520]",
          // bottom padding = half of SearchBar height so bar sits on the edge
          "pb-[51px] md:pb-[32px]",
        ].join(" ")}
      >
        {/* Dot-grid — dark only */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[120px]">
          <div className="flex flex-col lg:flex-row items-center justify-between
                          gap-8 lg:gap-0 pt-12 lg:pt-16 pb-4">

            {/* LEFT */}
            <div className="w-full lg:w-[52%] flex flex-col gap-5
                            items-center lg:items-start text-center lg:text-left">

              {/* Badge */}
              <div className="flex items-center gap-2.5 w-fit px-4 py-2 rounded-full
                              bg-[#1E88E5]/10 border border-[#1E88E5]/25">
                <div className="flex items-center rounded-full px-0.5 bg-[#1E88E5]"
                  style={{ width: "32px", height: "18px" }}>
                  <div className="rounded-full bg-white ml-auto"
                    style={{ width: "14px", height: "14px" }} />
                </div>
                <span className="text-[#1E88E5] text-[11px] font-bold uppercase tracking-widest">
                  Find Your Dream Job
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-bold leading-[1.1] m-0
                             text-[28px] sm:text-[38px] md:text-[46px] lg:text-[52px] xl:text-[60px]
                             text-slate-900 dark:text-white">
                <span className="text-[#1E88E5]">Find Freelance Projects</span>
                <br />
                That Match Your{" "}
                <span className="text-[#1E88E5]">Skills</span>
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base leading-relaxed max-w-[480px] m-0
                            text-gray-500 dark:text-slate-400">
                Browse thousands of freelance opportunities tailored to your expertise.
                Connect with the best clients worldwide.
              </p>

              {/* Avatars + CTA */}
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {AVATARS.map(({ src, alt }, i) => (
                      <img key={i} src={src} alt={alt}
                        className="w-10 h-10 rounded-full border-2 border-white
                                   dark:border-[#0f172a] object-cover" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-400 dark:text-slate-400 text-left m-0">
                    Over <span className="text-[#1E88E5] font-bold">12,800+</span>
                    <br />freelancers to complete your projects
                  </p>
                </div>

                <button className="inline-flex items-center gap-2
                                   bg-[#1E88E5] hover:bg-blue-600
                                   dark:bg-blue-500 dark:hover:bg-blue-400
                                   text-white font-semibold text-sm
                                   px-6 py-3 rounded-xl transition-colors duration-200">
                  Find your skill
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
                    strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* RIGHT — image */}
            <div className="w-full lg:w-[44%] relative flex justify-center lg:justify-end items-end self-end">
              <img
                src={sectionpagefind}
                alt="Freelancer working"
                className="relative z-10 w-[75%] sm:w-[55%] lg:w-full h-auto object-contain
                           max-h-[260px] sm:max-h-[320px] lg:max-h-[380px]"
                style={{ filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.12))" }}
              />

              {/* Question mark */}
              <img
                src={qestion} alt="?"
                className="absolute z-20 object-contain w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                style={{ top: "4%", right: "18%" }}
              />

              {/* 30K+ card */}
              <div
                className="hidden sm:flex absolute z-20 flex-col gap-1
                           rounded-2xl p-3 lg:p-4
                           bg-white shadow-[0_16px_48px_rgba(0,0,0,0.1)]
                           dark:bg-slate-800 dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
                style={{ top: "20%", right: "8%", minWidth: "110px",
                  animation: "floatCard 3s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[18px] lg:text-[20px] font-extrabold leading-none
                                   text-gray-900 dark:text-slate-100">30K+</span>
                  <span className="text-base lg:text-lg">💼</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide
                                 text-gray-400 dark:text-slate-400">Hired Experts</span>
              </div>

              <div className="absolute -z-0 rounded-full pointer-events-none
                              bottom-0 right-[5%] w-[65%] aspect-square
                              bg-[#1E88E5]/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SearchBar — centered on section bottom edge ── */}
      {/* translateY(50%) pulls it up so exactly half sits inside, half outside */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-6 lg:px-[120px]"
        style={{ transform: "translateY(50%)" }}
      >
        <div className="max-w-[1440px] mx-auto">
          <SearchBar
            searchText={searchText} onChangeSearch={onChangeSearch}
            experienceLevel={experienceLevel} onChangeLevel={onChangeLevel}
            budgetRange={budgetRange} onChangeBudget={onChangeBudget}
            onSubmit={onSubmit}
          />
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}