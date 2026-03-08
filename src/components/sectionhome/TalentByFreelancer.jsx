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
  const visibleTags = skills.slice(0, 3);
  const extraCount = skills.length - 3;

  const getCategoryIcon = (skill) => {
    if (!skill) return "💼";
    const s = String(skill).toLowerCase();
    if (s.includes("design")) return "🎨";
    if (s.includes("java")) return "☕";
    if (s.includes("react")) return "⚛️";
    if (s.includes("node")) return "🟢";
    if (s.includes("marketing")) return "📢";
    if (s.includes("ui") || s.includes("ux")) return "🖌️";
    if (s.includes("python")) return "🐍";
    if (s.includes("mobile") || s.includes("flutter")) return "📱";
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
      onClick={onViewProfile}
      className="group rounded-2xl p-5 flex flex-col gap-4 cursor-pointer
        transition-all duration-300 hover:-translate-y-1
        bg-white border border-[#e8f0fe] shadow-[0_4px_20px_rgba(30,136,229,0.07)]
        hover:shadow-[0_12px_40px_rgba(30,136,229,0.16)] hover:border-[#93c5fd]
        dark:bg-[#0d1b2e] dark:border-[#1e3a5f] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)] dark:hover:border-[#2563EB]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Avatar + Name ── */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={avatarSrc}
            alt={name}
            onError={(e) => { e.currentTarget.src = defaultAvatar; }}
            className="w-14 h-14 rounded-full object-cover
              border-2 border-[#bfdbfe] dark:border-[#1e3a5f]"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400
            border-2 border-white dark:border-[#0d1b2e]" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[15px] leading-tight text-gray-900 dark:text-white truncate
            group-hover:text-[#1E88E5] dark:group-hover:text-[#60a5fa] transition-colors duration-200">
            {name}
          </h3>
          <p className="text-[#1E88E5] dark:text-[#60a5fa] text-[12px] font-medium mt-0.5
            flex items-center gap-1 line-clamp-1">
            <span>{categoryIcon}</span>
            {category}
          </p>
          <p className="text-[11px] mt-0.5 flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
            {experienceYears}+ years experience
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#e8f0fe] dark:bg-[#1e3a5f]" />

      {/* ── Skill pills ── */}
      <div className="flex flex-wrap gap-1.5">
        {visibleTags.map((skill, i) => (
          <span key={i}
            className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full
              text-[#1E88E5] bg-[#dbeafe] border border-[#bfdbfe]
              dark:text-[#93c5fd] dark:bg-[#1a3a6e] dark:border-[#1e3a5f]">
            {skill}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full
            text-white bg-[#1E88E5] dark:bg-[#1a3a6e] dark:text-[#93c5fd]">
            +{extraCount}
          </span>
        )}
      </div>

      {/* ── Location as plain text ── */}
      <div className="flex justify-between">

      <p className="text-[12px] text-gray-500 dark:text-slate-400 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 shrink-0 text-[#1E88E5] dark:text-[#60a5fa]"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        {location || "Unknown"}
      </p>

      {/* ── Arrow CTA ── */}
     
        <span className="flex items-center gap-1.5 text-[11px] font-semibold
          text-gray-300 dark:text-slate-600
          group-hover:text-[#1E88E5] dark:group-hover:text-[#60a5fa]
          transition-all duration-200 group-hover:translate-x-1">
         
          <span className="w-6 h-6 rounded-full flex items-center justify-center
            bg-gray-100 dark:bg-[#1e3a5f]
            group-hover:bg-[#1E88E5] dark:group-hover:bg-[#2563EB]
            transition-all duration-200">
            <svg className="w-3 h-3 text-gray-400 dark:text-slate-500
              group-hover:text-white transition-colors duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </span>
                </div>
    </div>
  );
}