import { useState } from "react";

export default function JobCard({
  title = "UX/UI Designer",
  description = "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.",
  date = "February 21, 2026",
  tags = ["Figma", "Design"],
  level = "Expert",
  posterName = "Jordan",
  posterAvatar = "https://i.pinimg.com/736x/ca/c6/d8/cac6d852725aa673ffe24f9f955e6ba1.jpg",
  imageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  onApply = () => {},
  onSave = () => {},
}) {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Lora:wght@600;700&display=swap"
        rel="stylesheet"
      />

      {/* Outer background */}
      <div
        className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div
          className="
            w-full
            max-w-[285px]
            sm:max-w-[340px]
            md:max-w-[360px]
            lg:max-w-[285px]
            rounded-[28px]
            overflow-hidden
            bg-white
            flex
            flex-col
            lg:h-[505px]
          "
          style={{
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* ── IMAGE ── */}
          <div
            className="
              relative
              h-[200px]
              sm:h-[210px]
              md:h-[215px]
              lg:h-[220px]
              w-full
              overflow-hidden
            "
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

            {/* Heart button */}
            <div className="absolute top-3.5 right-3.5 flex">
              <button
                onClick={() => {
                  setSaved(!saved);
                  onSave();
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 shadow transition-all hover:scale-110 hover:bg-[#2563EB] active:scale-95"
                title={saved ? "Unsave" : "Save"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={saved ? "#2563EB" : "none"}
                  stroke={saved ? "#2563EB" : "white"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-200 ease-in-out"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── CARD BODY ── */}
          <div className="flex flex-col flex-1 px-6 pt-5 pb-6">
            {/* Title + Description: fixed 285px wide x 96px tall */}
            <div className="w-full mb-4">
              <h2
                className="text-[1.25rem] font-bold text-[#2563EB] mb-1 leading-snug"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {title}
              </h2>
              <p className="text-[0.82rem] text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex items-start justify-between">
              {/* Left: date + tags */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[0.78rem] text-slate-400 font-medium tracking-wide">
                  Date: {date}
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#2563EB] text-white text-[0.70rem] font-semibold px-3 py-0.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: level */}
              <div className="text-right">
                <div className="text-[0.75rem] text-slate-400 mb-0.5">Level:</div>
                <div className="text-[0.9rem] text-[#2563EB] font-semibold">
                  {level}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-4 -mx-6 sm:-mx-7 md:-mx-8" />

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              {/* Poster */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-100">
                  {posterAvatar ? (
                    <img
                      src={posterAvatar}
                      alt={posterName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white font-bold text-base">
                      {posterName.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-[0.95rem] font-semibold text-slate-800">
                  {posterName}
                </span>
              </div>

              {/* Apply button */}
              <button
                onClick={onApply}
                className="bg-[#2563EB] active:scale-95 text-white font-bold text-[0.78rem] px-4 py-2.5 rounded-2xl transition-all duration-200 shadow-[0_4px_18px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}