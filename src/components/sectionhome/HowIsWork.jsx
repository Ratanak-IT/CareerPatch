// src/components/sectionhome/HowIsWork.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HowIsWork() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  const steps = [
    {
      id: 1,
      title: "Create Account",
      desc: "First you have to create a account here",
      iconPath:
        "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      id: 2,
      title: "Search work",
      desc: "Search the best freelance work here",
      iconPath:
        "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7",
    },
    {
      id: 3,
      title: "Save and apply",
      desc: "Apply or save and start your work",
      iconPath:
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  ];

  return (
    <section
      className={[
        "w-full py-16 transition-colors duration-300",
        "bg-white",
        "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-[120px]">

        {/* Title */}
        <h2
          data-aos="fade-down"
          data-aos-delay="0"
          className="text-center text-[#1E88E5] text-4xl font-bold"
        >
          How it works
        </h2>

        {/* Cards container */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className={[
            "mt-[30px] grid grid-cols-1 md:grid-cols-3 gap-[20px] rounded-2xl p-12 transition-all duration-300",
            "bg-white border border-[#f1f5f9] shadow-[0_10px_40px_rgba(0,0,0,0.04)]",
            "dark:bg-[rgba(30,41,59,0.8)] dark:border-[#1e3a5f] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]",
          ].join(" ")}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-aos="fade-up"
              data-aos-delay={200 + index * 120}
              className="group flex flex-col items-center text-center cursor-default"
            >
              {/* Icon circle */}
              <div
                className={[
                  "w-20 h-20 rounded-full flex items-center justify-center mb-6",
                  "transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_0_8px_rgba(30,136,229,0.12)]",
                  "bg-[#F3F4F6]",
                  "dark:bg-[rgba(30,136,229,0.15)]",
                ].join(" ")}
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
              <span className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-[#1E88E5]">
                Step {step.id}
              </span>

              <h3 className="text-xl font-bold mb-2 transition-colors duration-300 text-gray-800 dark:text-white">
                {step.title}
              </h3>

              <p className="text-sm leading-relaxed max-w-[200px] transition-colors duration-300 text-gray-400 dark:text-slate-400">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}