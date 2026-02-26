import React from 'react';
import { useDarkMode } from '../navbar/NavbarComponent';

export default function PeopleLoveWorking() {
  const { darkMode } = useDarkMode();

  return (
    <section
      className="w-full py-20"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: darkMode
          ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)"
          : "#f8fafc",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── LEFT: Text & Stats ── */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2
              className="text-[#1E88E5] text-3xl md:text-4xl font-bold leading-tight max-w-md"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              People Love Working With CareerPatch
            </h2>
            <p
              className={`text-xs md:text-sm font-medium uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-gray-500"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Discover a platform built for trust, talent, and results.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">

            {/* Stat 1 */}
            <div className="space-y-2">
              <h3
                className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                4.9/5
              </h3>
              <p
                className={`text-[11px] leading-relaxed max-w-[180px] ${darkMode ? "text-slate-400" : "text-gray-400"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Discover a platform built for trust, talent, and results.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2">
              <h3
                className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Award Winner
              </h3>
              <ul
                className={`text-[11px] leading-relaxed list-disc list-inside ${darkMode ? "text-slate-400" : "text-gray-400"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <li>Recognized with leading software excellence awards</li>
              </ul>
            </div>

            {/* Stat 3 */}
            <div className="md:col-start-2 space-y-2">
              <h3
                className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                90%
              </h3>
              <p
                className={`text-[11px] leading-relaxed max-w-[180px] ${darkMode ? "text-slate-400" : "text-gray-400"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Customers report complete satisfaction with their freelancers.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Testimonial Card ── */}
        <div className="flex justify-center lg:justify-end lg:mt-10">
          <div
            className="rounded-2xl p-8 max-w-sm w-full"
            style={{
              background: darkMode ? "rgba(30,41,59,0.9)" : "#ffffff",
              border: `1px solid ${darkMode ? "#334155" : "#e8f0fe"}`,
              boxShadow: darkMode
                ? "0 20px 60px rgba(0,0,0,0.35)"
                : "0 20px 60px rgba(30,136,229,0.08)",
            }}
          >
            {/* Quote header */}
            <p
              className="font-bold text-sm mb-4"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: "#6366F1",
              }}
            >
              "Great job!"
            </p>

            {/* Testimonial body */}
            <p
              className={`text-xs md:text-[13px] leading-6 mb-8 italic ${darkMode ? "text-slate-300" : "text-gray-500"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              "CareerPatch made it simple to connect with the right professional.
              The process was smooth, and the results exceeded expectations."
            </p>

            {/* Divider */}
            <div
              className="pt-6 border-t flex items-center gap-4"
              style={{ borderColor: darkMode ? "#334155" : "#e8f0fe" }}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                alt="Sarika"
                className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                style={{ border: `2px solid ${darkMode ? "#334155" : "#e2e8f0"}` }}
              />
              <div className="flex flex-col">
                <h4
                  className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Sarika
                </h4>
                <span
                  className={`text-[10px] uppercase tracking-widest font-semibold ${darkMode ? "text-slate-400" : "text-gray-400"}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Nursing Assistant
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}