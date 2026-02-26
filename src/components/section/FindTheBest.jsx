import React from 'react';
import ButtonComponent from '../button/ButtonComponent';
import { useDarkMode } from '../navbar/NavbarComponent';
import girlImg from '../../assets/girl.png';

const STATS = [
  { value: '500+', label: 'freelancers' },
  { value: '300+', label: 'freelance work Posted' },
];

export default function FindTheBest() {
  const { darkMode } = useDarkMode();

  return (
    <section
      className="w-full py-8 lg:py-24 transition-colors duration-300"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: darkMode
          ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)"
          : "#f8f9fb",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col lg:flex-row items-center gap-0 lg:gap-8">

        {/* ── LEFT: Image + floating stat cards ── */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          {/* Stat card: 500+ freelancers */}
          <div
            className="absolute top-8 right-8 lg:right-4 z-10 rounded-2xl px-6 py-4 shadow-lg"
            style={{
              background: darkMode ? "rgba(15,34,64,0.95)" : "#ffffff",
              boxShadow: "0 8px 32px rgba(30,136,229,0.12)",
              minWidth: "140px",
            }}
          >
            <p
              className="text-[28px] font-bold text-[#1E88E5] leading-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              500+
            </p>
            <p
              className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-gray-500"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              freelancers
            </p>
          </div>

          {/* Stat card: 300+ freelance work Posted */}
          <div
            className="absolute bottom-40 right-8 lg:right-4 z-10 rounded-2xl px-6 py-4 shadow-lg"
            style={{
              background: darkMode ? "rgba(15,34,64,0.95)" : "#ffffff",
              boxShadow: "0 8px 32px rgba(30,136,229,0.12)",
              minWidth: "180px",
            }}
          >
            <p
              className="text-[28px] font-bold text-[#1E88E5] leading-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              300+
            </p>
            <p
              className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-gray-500"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
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
          <h2
            className="font-bold leading-[1.2] text-[32px] md:text-[40px] lg:text-[48px]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className={darkMode ? "text-white" : "text-gray-900"}>
              Find The Best{" "}
            </span>
            <span className="text-[#1E88E5]">Freelancers</span>
            <br />
            <span className={darkMode ? "text-white" : "text-gray-900"}>Here</span>
          </h2>

          {/* Description */}
          <p
            className={`text-sm md:text-base leading-relaxed max-w-[480px] ${
              darkMode ? "text-slate-400" : "text-gray-400"
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Professional freelance banner with bold tagline, stats, and clean trust-focused design.
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
              onClick={() => console.log('Find freelancer clicked')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}