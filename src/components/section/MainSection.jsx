import React from 'react';
import imgMain from '../../assets/imgmainsection.png';
import avatar1 from '../../assets/chhor pong.png';
import avatar2 from '../../assets/khim.png';
import avatar3 from '../../assets/ratanalkkh.png';
import { useDarkMode } from '../navbar/NavbarComponent';

export default function MainSection() {
  const { darkMode } = useDarkMode();

  return (
    <section
      className={[
        "w-full overflow-hidden min-h-[calc(100vh-89px)]",
        darkMode
          ? "bg-gradient-to-br from-[#0d1b2e] via-[#0f2240] to-[#0d1520]"
          : "bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/25",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0 min-h-[calc(100vh-89px)]">

        {/* ── LEFT: Text ── */}
        <div className="w-full lg:w-[48%] space-y-7 py-16 lg:py-20">

          {/* Badge */}
          <div className="flex items-center gap-2.5 w-fit px-4 py-2 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/25">
            <div className="flex items-center rounded-full px-0.5 bg-[#1E88E5]" style={{ width: "32px", height: "18px" }}>
              <div className="rounded-full bg-white ml-auto" style={{ width: "14px", height: "14px" }} />
            </div>
            <span className="text-[#1E88E5] text-[12px] font-semibold uppercase tracking-wide">
              Find Your Dream Job
            </span>
          </div>

          {/* Heading — blue + white in dark, blue + dark in light */}
          <h1 className="font-bold leading-[1.1] text-[40px] md:text-[52px] lg:text-[64px] m-0">
            <span className="text-[#1E88E5]">Freelance Jobs</span><br />
            <span className={darkMode ? "text-white" : "text-gray-900"}>and Talents at</span><br />
            <span className={darkMode ? "text-white" : "text-gray-900"}>Your </span>
            <span className="text-[#1E88E5]">Fingertips</span>
          </h1>

          {/* Description */}
          <p className={`text-sm md:text-base leading-relaxed max-w-[480px] m-0 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
            Connect with top freelancers and clients on our platform!{" "}
            find your perfect match for your next project.
          </p>

          {/* Avatars + stat */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-3">
              {[avatar1, avatar2, avatar3].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="freelancer"
                  className={`w-10 h-10 rounded-full object-cover border-2 ${darkMode ? "border-[#0f172a]" : "border-white"}`}
                />
              ))}
            </div>
            <p className={`text-[12px] leading-snug m-0 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
              Over <span className="text-[#1E88E5] font-bold">12800+</span> freelancers to<br />complete your projects
            </p>
          </div>
        </div>

        {/* ── RIGHT: Image + floating card ── */}
        <div className="w-full lg:w-[52%] relative flex justify-center lg:justify-end items-end self-end">

          <img
            src={imgMain}
            alt="Professional with Laptop"
            className="relative z-10 w-full object-contain object-bottom max-w-[520px]"
            style={{
              maxHeight: "calc(100vh - 89px)",
              filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.15))",
            }}
          />

          {/* Floating 30K+ card */}
          <div
            className={`absolute z-20 rounded-2xl p-5 flex flex-col gap-1.5 min-w-[150px] ${darkMode ? "bg-slate-800 shadow-[0_16px_48px_rgba(0,0,0,0.4)]" : "bg-white shadow-[0_16px_48px_rgba(0,0,0,0.1)]"}`}
            style={{ top: "32%", right: "2%", animation: "floatCard 3s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2">
              <span className={`text-[22px] font-extrabold leading-none ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                30K+
              </span>
              <span className="text-xl">💼</span>
            </div>
            <span className={`text-[13px] font-medium ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
              People got hired
            </span>
          </div>

          {/* Glow blob */}
          <div className="absolute -z-0 rounded-full pointer-events-none bottom-0 right-[5%] w-[70%] aspect-square bg-[#1E88E5]/10 blur-3xl" />
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