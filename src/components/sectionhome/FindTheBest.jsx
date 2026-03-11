import React from "react";
import ButtonComponent from "../button/ButtonComponent";
import girlImg from "../../assets/girl.png";
import { Link } from "react-router";

export default function FindTheBest() {
  return (
    <section
      className={[
        "w-full overflow-hidden transition-colors duration-300",
        "py-10 sm:py-12 md:py-16 lg:py-24",
        "bg-[#f8f9fb]",
        "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div
        className="
          max-w-[1440px] mx-auto
          px-4 sm:px-6 md:px-8 lg:px-[120px]
          flex flex-col lg:flex-row
          items-center
          gap-10 lg:gap-8
        "
      >
        {/* LEFT: Image + floating stat cards */}
        <div className="w-full lg:w-1/2 relative flex justify-center order-1">
          {/* 500+ freelancers */}
          <div
            className="
              absolute z-10
              top-20 right-2
              sm:top-10 sm:right-6
              md:top-40 md:right-30
              lg:top-45 lg:right-4
              rounded-2xl px-4 py-3 sm:px-5 sm:py-4
              min-w-[120px] sm:min-w-[140px]
              bg-white dark:bg-[rgba(15,34,64,0.95)]
              shadow-[0_8px_32px_rgba(30,136,229,0.12)]
            "
          >
            <p className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-[#1E88E5] leading-none">
              500+
            </p>
            <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-slate-400">
              freelancers
            </p>
          </div>

          {/* 300+ freelance work posted */}
          <div
            className="
              absolute z-10
              bottom-15 left-15
              sm:bottom-16 sm:left-4
              md:bottom-25 md:left-60
              lg:bottom-28 lg:left-30
              rounded-2xl px-4 py-3 sm:px-5 sm:py-4
              min-w-[150px] sm:min-w-[180px]
              bg-white dark:bg-[rgba(15,34,64,0.95)]
              shadow-[0_8px_32px_rgba(30,136,229,0.12)]
            "
          >
            <p className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-[#1E88E5] leading-none">
              300+
            </p>
            <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-slate-400">
              freelance work posted
            </p>
          </div>

          {/* Image */}
          <img
            src={girlImg}
            alt="Professional freelancer"
            className="
              relative z-0
              w-full
              max-w-[260px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[460px]
              h-auto object-contain select-none
            "
            style={{ maxHeight: "520px" }}
            draggable={false}
          />
        </div>

        {/* RIGHT: Text */}
        <div
          className="
            w-full lg:w-1/2
            space-y-5 sm:space-y-6
            text-center lg:text-left
            order-2
            lg:pl-8
          "
        >
          <h2 className="font-bold leading-[1.2] text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px]">
            <span className="text-gray-900 dark:text-white">Find The Best </span>
            <span className="text-[#1E88E5]">Freelancers</span>
            <br />
            <span className="text-gray-900 dark:text-white">Here</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto lg:mx-0 text-gray-500 dark:text-slate-400">
            Professional freelance banner with bold tagline, stats, and clean
            trust-focused design.
          </p>

          <div className="pt-1 sm:pt-2 flex justify-center lg:justify-start">
            <Link to="/findfreelan">
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
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}