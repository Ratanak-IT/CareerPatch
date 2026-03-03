import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import defaultAvatar from "../../assets/anonimus.png";

export default function TalentByFreelancer({
  userId,
  name = "Thai Ratanak",
  skills = [],
  experienceYears = 0,
  location = "Phnom Penh",
  avatar,
}) {
  const navigate = useNavigate();

  const category = skills?.[0] || "No skill";
  const tag = skills?.[1] || skills?.[0] || "General";

  const getCategoryIcon = (skill) => {
    if (!skill) return "💼";
    const s = String(skill).toLowerCase();
    if (s.includes("design")) return "🎨";
    if (s.includes("java")) return "☕";
    if (s.includes("react")) return "⚛️";
    if (s.includes("node")) return "🟢";
    if (s.includes("marketing")) return "📢";
    if (s.includes("ui") || s.includes("ux")) return "🖌️";
    return "💼";
  };

  const categoryIcon = getCategoryIcon(category);

  const API_BASE = import.meta.env.VITE_API_URL;

  const avatarSrc = useMemo(() => {
    const normalizeUrl = (u) => {
      if (!u) return "";
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      if (!API_BASE) return u;
      return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
    };
    return normalizeUrl(avatar) || defaultAvatar;
  }, [avatar, API_BASE]);

  const onViewProfile = () => {
    if (!userId) return;
    navigate(`/freelancers/${userId}`);
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1
        bg-white border border-[#e8f0fe] shadow-[0_8px_32px_rgba(30,136,229,0.07)]
        dark:bg-[#0f2240] dark:border-[#1e3a5f] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <img
          src={avatarSrc}
          alt={name}
          onError={(e) => { e.currentTarget.src = defaultAvatar; }}
          className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[#bfdbfe] dark:border-[#1e3a5f]"
        />

        <div>
          <h3 className="font-bold text-[15px] leading-tight text-gray-900 dark:text-white">
            {name}
          </h3>

          <p className="text-[#1E88E5] text-[12px] font-medium mt-0.5 flex items-center gap-1 line-clamp-1">
            <span>{categoryIcon}</span>
            {category}
          </p>

          <p className="text-[12px] mt-0.5 flex items-center gap-1.5 text-gray-500 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
            {experienceYears}+ years experience
          </p>
        </div>
      </div>

      {/* Skill Tag */}
      <div>
        <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full text-[#1E88E5] bg-[#dbeafe] dark:bg-[rgba(30,136,229,0.2)] dark:text-[#60a5fa]">
          {tag}
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#e8f0fe] dark:bg-[#1e3a5f]" />

      {/* Location */}
      <p className="text-[12px] text-gray-500 dark:text-slate-300">
        Location:{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {location || "Unknown"}
        </span>
      </p>

      {/* View Profile */}
      <button
        type="button"
        className="w-full py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors duration-200 bg-[#1E88E5] hover:bg-[#2563EB] active:bg-blue-700"
        onClick={onViewProfile}
      >
        View Profile
      </button>
    </div>
  );
}