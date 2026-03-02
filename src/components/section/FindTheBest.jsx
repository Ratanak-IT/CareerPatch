import React from "react";
import ButtonComponent from "../button/ButtonComponent";
import girlImg from "../../assets/girl.png";

export default function FindTheBest() {
  return (
    <section
      className={[
        "w-full py-8 lg:py-24 transition-colors duration-300",
        "bg-[#f8f9fb]",
        "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col lg:flex-row items-center gap-0 lg:gap-8">
        {/* ── LEFT: Image + floating stat cards ── */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          {/* Stat card: 500+ freelancers */}
          <div
            className={[
              "absolute top-8 right-8 lg:right-4 z-10 rounded-2xl px-6 py-4 shadow-lg",
              "bg-white",
              "dark:bg-[rgba(15,34,64,0.95)]",
              "shadow-[0_8px_32px_rgba(30,136,229,0.12)]",
              "min-w-[140px]",
            ].join(" ")}
          >
            <p className="text-[28px] font-bold text-[#1E88E5] leading-none">
              500+
            </p>
            <p className="text-sm mt-1 text-gray-500 dark:text-slate-400">
              freelancers
            </p>
          </div>

          {/* Stat card: 300+ freelance work Posted */}
          <div
            className={[
              "absolute bottom-40 right-8 lg:right-4 z-10 rounded-2xl px-6 py-4 shadow-lg",
              "bg-white",
              "dark:bg-[rgba(15,34,64,0.95)]",
              "shadow-[0_8px_32px_rgba(30,136,229,0.12)]",
              "min-w-[180px]",
            ].join(" ")}
          >
            <p className="text-[28px] font-bold text-[#1E88E5] leading-none">
              300+
            </p>
            <p className="text-sm mt-1 text-gray-500 dark:text-slate-400">
              freelance work Posted
            </p>
          </div>

          {/* Girl image — no background, transparent PNG */}
          <img
            src={girlImg}
            alt="Professional freelancer"
            className="relative z-0 w-full max-w-[460px] object-contain select-none"
            style={{ maxHeight: "520px" }}
            draggable={false}
          />
        </div>

        {/* ── RIGHT: Text ── */}
        <div className="w-full lg:w-1/2 space-y-6 lg:pl-8">
          {/* Heading */}
          <h2 className="font-bold leading-[1.2] text-[32px] md:text-[40px] lg:text-[48px]">
            <span className="text-gray-900 dark:text-white">Find The Best </span>
            <span className="text-[#1E88E5]">Freelancers</span>
            <br />
            <span className="text-gray-900 dark:text-white">Here</span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base leading-relaxed max-w-[480px] text-gray-400 dark:text-slate-400">
            Professional freelance banner with bold tagline, stats, and clean
            trust-focused design.
          </p>

          {/* Button */}
          <div className="pt-2">
            <ButtonComponent
              text={
                <span className="flex items-center gap-2">
                  Find freelancer
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              }
              onClick={() => console.log("Find freelancer clicked")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}