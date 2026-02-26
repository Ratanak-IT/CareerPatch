import React from 'react';
import { useDarkMode } from '../navbar/NavbarComponent';

export default function HowIsWork() {
  const { darkMode } = useDarkMode();

  const steps = [
    {
      id: 1,
      title: "Create Account",
      desc: "First you have to create a account here",
      iconPath: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    },
    {
      id: 2,
      title: "Search work",
      desc: "Search the best freelance work here",
      iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
    },
    {
      id: 3,
      title: "Save and apply",
      desc: "Apply or save and start your work",
      iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }
  ];

  return (
    <section
      className="w-full py-16 transition-colors duration-300"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: darkMode
          ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)"
          : "#ffffff",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-[120px]">

        {/* Title */}
        <h2
          className="text-center text-[#1E88E5] text-4xl font-bold"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          How it works
        </h2>

        {/* Cards container */}
        <div
          className="mt-[30px] grid grid-cols-1 md:grid-cols-3 gap-[20px] rounded-2xl p-12 transition-all duration-300"
          style={{
            background: darkMode ? "rgba(30,41,59,0.8)" : "#ffffff",
            border: `1px solid ${darkMode ? "#1e3a5f" : "#f1f5f9"}`,
            boxShadow: darkMode
              ? "0 10px 40px rgba(0,0,0,0.3)"
              : "0 10px 40px rgba(0,0,0,0.04)",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.id}
              className="group flex flex-col items-center text-center cursor-default"
            >
              {/* Icon circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
                style={{
                  background: darkMode ? "rgba(30,136,229,0.15)" : "#F3F4F6",
                }}
              >
                <svg
                  className="w-10 h-10 text-[#1E88E5] group-hover:text-[#2563EB] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d={step.iconPath}
                  />
                </svg>
              </div>

              {/* Step number badge */}
              <span
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#1E88E5",
                }}
              >
                Step {step.id}
              </span>

              <h3
                className={`text-xl font-bold mb-2 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {step.title}
              </h3>
              <p
                className={`text-sm leading-relaxed max-w-[200px] transition-colors duration-300 ${darkMode ? "text-slate-400" : "text-gray-400"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}