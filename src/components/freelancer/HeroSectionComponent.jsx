// src/components/freelancer/HeroSectionComponent.jsx
import imgMain from "../../assets/modelforfindfreelancer.png";
import FreelancerSearchBarComponent from "./FreelancerSearchBarComponent";

export default function HeroSectionComponent({
  category,
  searchText,
  onChangeCategory,
  onChangeSearch,
  onSubmitSearch,
}) {
  return (
    <div
      className="relative w-full pb-7 sm:pb-[80px] md:pb-[30px]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Full-width background — same as MainSection / HeroSection ── */}
      <section
        className={[
          "w-full overflow-hidden relative",
          "bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/25",
          "dark:from-[#0d1b2e] dark:via-[#0f2240] dark:to-[#0d1520]",
          // bottom padding = half of SearchBar height so bar sits on the edge
          "pb-[88px] sm:pb-[44px] md:pb-[36px] py-15",
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

        {/* Inner — same max-width + padding as MainSection */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 pt-10 pb-16 lg:py-0 lg:h-[360px]">

          {/* LEFT — text */}
          <div className="w-full lg:w-[52%] text-center lg:text-left space-y-4">
            <h1 className="font-bold leading-[1.2] text-[22px] sm:text-[32px] md:text-[40px] lg:text-[48px] m-0 text-gray-900 dark:text-white">
              Discover{" "}
              <span className="text-[#1E88E5] dark:text-blue-400">our freelancers</span>{" "}and
              <br />
              work with{" "}
              <span className="text-[#1E88E5] dark:text-blue-400">the best talent</span>{" "}on
              <br />
              CarrerPatch
            </h1>
          </div>

          {/* RIGHT — image */}
          <div className="w-full lg:w-[48%] relative flex justify-center lg:justify-end items-end self-end">
            <div className="relative">
              <img
                src={imgMain}
                alt="Freelancer with Tablet"
                className="relative z-10 w-[200px] sm:w-[220px] md:w-[280px] lg:w-[340px] h-auto object-contain"
                style={{ filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.15))" }}
              />
              {/* Glow blob */}
              <div className="absolute -z-0 rounded-full pointer-events-none bottom-0 right-[5%] w-[70%] aspect-square bg-[#1E88E5]/10 blur-3xl opacity-0 dark:opacity-100" />
            </div>
          </div>
        </div>
      </section>

      {/* SearchBar — flush at bottom, same px as MainSection */}
      <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 md:px-[25px] lg:px-[120px] 2xl:px-60 z-20">
        <div className="max-w-[1440px] mx-auto">
          <FreelancerSearchBarComponent
            category={category}
            searchText={searchText}
            onChangeCategory={onChangeCategory}
            onChangeSearch={onChangeSearch}
            onSubmitSearch={onSubmitSearch}
          />
        </div>
      </div>
    </div>
  );
}