import React from "react";

export default function PeopleLoveWorking() {
  return (
    <section
      className={[
        "w-full py-20",
        "bg-[#f8fafc]",
        "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* ── LEFT: Text & Stats ── */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-[#1E88E5] text-3xl md:text-4xl font-bold leading-tight max-w-md">
              People Love Working With CareerPatch
            </h2>

            <p className="text-xs md:text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Discover a platform built for trust, talent, and results.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
            {/* Stat 1 */}
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                4.9/5
              </h3>
              <p className="text-[11px] leading-relaxed max-w-[180px] text-gray-400 dark:text-slate-400">
                Discover a platform built for trust, talent, and results.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Award Winner
              </h3>
              <ul className="text-[11px] leading-relaxed list-disc list-inside text-gray-400 dark:text-slate-400">
                <li>Recognized with leading software excellence awards</li>
              </ul>
            </div>

            {/* Stat 3 */}
            <div className="md:col-start-2 space-y-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                90%
              </h3>
              <p className="text-[11px] leading-relaxed max-w-[180px] text-gray-400 dark:text-slate-400">
                Customers report complete satisfaction with their freelancers.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Testimonial Card ── */}
        <div className="flex justify-center lg:justify-end lg:mt-10">
          <div
            className={[
              "rounded-2xl p-8 max-w-sm w-full",
              "bg-white border border-[#e8f0fe] shadow-[0_20px_60px_rgba(30,136,229,0.08)]",
              "dark:bg-[rgba(30,41,59,0.9)] dark:border-[#334155] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
            ].join(" ")}
          >
            {/* Quote header */}
            <p className="font-bold text-sm mb-4 text-[#6366F1]">
              "Great job!"
            </p>

            {/* Testimonial body */}
            <p className="text-xs md:text-[13px] leading-6 mb-8 italic text-gray-500 dark:text-slate-300">
              "CareerPatch made it simple to connect with the right professional.
              The process was smooth, and the results exceeded expectations."
            </p>

            {/* Divider */}
            <div className="pt-6 border-t border-[#e8f0fe] dark:border-[#334155] flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                alt="Sarika"
                className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300 border-2 border-[#e2e8f0] dark:border-[#334155]"
              />

              <div className="flex flex-col">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  Sarika
                </h4>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-slate-400">
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