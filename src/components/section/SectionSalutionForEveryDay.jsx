import React from "react";
import ButtonComponent from "../button/ButtonComponent";
import { Link } from "react-router";

const FEATURES = [
  "The best for every budget",
  "Quality work done quickly",
  "Protected payments, every time",
  "24/7 support",
];

export default function SectionSolutionForEveryNeed() {
  return (
    <section
      className={[
        "w-full mt-10 transition-colors duration-300",
        "bg-white",
        "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* ── LEFT: Text ── */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Label */}
          <p className="text-sm font-medium text-gray-400 dark:text-slate-400">
            For Clients
          </p>

          {/* Heading */}
          <h2 className="font-bold leading-[1.15] text-[32px] md:text-[40px] lg:text-[48px]">
            <span className="text-[#1E88E5]">
              Find Talent Your Way –{" "}
            </span>
            <br className="hidden sm:block" />
            <span className="text-[#1E88E5]">Freelance </span>
            <span className="text-gray-900 dark:text-white">
              Solutions for Every Need
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base leading-relaxed max-w-[480px] text-gray-400 dark:text-slate-400">
            Client-focused ad with clear benefits: affordable, fast, secure,
            and supported.
          </p>

          {/* Contact button */}
          <Link to="/about#contact">
          <div className="pt-2">
            <ButtonComponent
              text={
                <span className="flex items-center gap-2">
                  Contact
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
              onClick={() => console.log("Contact clicked")}
            />
          </div>
          </Link>
        </div>

        {/* ── RIGHT: Image + floating pills ── */}
        <div className="w-full lg:w-1/2 relative">
          {/* Photo */}
          <div className="relative rounded-3xl overflow-hidden h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Clients working together"
              className="w-full h-full object-cover"
            />

            {/* Slight overlay */}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

            {/* Floating feature pills */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 backdrop-blur-sm">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#1E88E5]/95 shadow-[0_4px_16px_rgba(30,136,229,0.35)]"
                >
                  {/* Checkmark */}
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1E88E5"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <span className="text-white text-[13px] font-medium whitespace-nowrap">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative glow blob */}
          <div className="absolute -z-10 -bottom-6 -right-6 w-2/3 h-2/3 rounded-full bg-[#1E88E5]/10 blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}