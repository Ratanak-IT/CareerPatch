import React from "react";
import { useDarkMode } from "../navbar/NavbarComponent";
import defaultAvatar from "../../assets/ratanak.png";

export default function TalentByFreelancer({
  name = "Thai Ratanak",
  skills = [],
  experienceYears = 0,
  location = "Phnom Penh",
  avatar,
}) {
  const { darkMode } = useDarkMode();

  // ===== Skill Mapping =====
  const category = skills?.[0] || "No skill";
  const tag = skills?.[1] || skills?.[0] || "General";

  // ===== Dynamic Icon Based on Skill =====
  const getCategoryIcon = (skill) => {
    if (!skill) return "💼";
    const s = skill.toLowerCase();

    if (s.includes("design")) return "🎨";
    if (s.includes("java")) return "☕";
    if (s.includes("react")) return "⚛️";
    if (s.includes("node")) return "🟢";
    if (s.includes("marketing")) return "📢";
    if (s.includes("ui") || s.includes("ux")) return "🖌️";

    return "💼";
  };

  const categoryIcon = getCategoryIcon(category);

  // ===== Avatar Fallback =====
  const avatarSrc = avatar || defaultAvatar;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: darkMode ? "rgba(15,34,64,0.85)" : "#ffffff",
        border: `1px solid ${darkMode ? "#1e3a5f" : "#e8f0fe"}`,
        boxShadow: darkMode
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 8px 32px rgba(30,136,229,0.07)",
      }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <img
          src={avatarSrc}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
          className="w-14 h-14 rounded-full object-cover shrink-0"
          style={{
            border: `2px solid ${darkMode ? "#1e3a5f" : "#bfdbfe"}`,
          }}
        />

        <div>
          <h3
            className={`font-bold text-[15px] leading-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {name}
          </h3>

          <p className="text-[#1E88E5] text-[12px] font-medium mt-0.5 flex items-center gap-1 line-clamp-1">
            <span>{categoryIcon}</span>
            {category}
          </p>

          <p
            className={`text-[12px] mt-0.5 flex items-center gap-1.5 ${
              darkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
            {experienceYears}+ years experience
          </p>
        </div>
      </div>

      {/* Skill Tag */}
      <div>
        <span
          className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full text-[#1E88E5]"
          style={{
            background: darkMode
              ? "rgba(30,136,229,0.15)"
              : "#dbeafe",
          }}
        >
          {tag}
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{
          background: darkMode ? "#1e3a5f" : "#e8f0fe",
        }}
      />

      {/* Location */}
      <p
        className={`text-[12px] ${
          darkMode ? "text-slate-400" : "text-gray-500"
        }`}
      >
        Location:{" "}
        <span
          className={`font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {location || "Unknown"}
        </span>
      </p>

      {/* View Profile */}
      <button
        className="w-full py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors duration-200"
        style={{ background: "#1E88E5" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#2563EB")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#1E88E5")
        }
      >
        View Profile
      </button>
    </div>
  );
}