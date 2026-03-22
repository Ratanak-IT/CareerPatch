// src/components/sectionhome/MainSection.jsx
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import imgMain from "../../assets/imgmainsection.png";
import { useGetFreelancersQuery } from "../../services/freelancerApi";

/* ─── Avatar with animated tooltip ──────────────────────────────────────── */
function AvatarItem({ src, name, index, total }) {
  const [hovered, setHovered] = useState(false);

  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#6366F1",
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  return (
    <div
      className="relative"
      style={{ zIndex: hovered ? total + 10 : total - index }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 mb-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold
                   text-white bg-gray-900 dark:bg-slate-700 whitespace-nowrap shadow-lg pointer-events-none"
        style={{
          transform: hovered
            ? "translateX(-50%) translateY(0) scale(1)"
            : "translateX(-50%) translateY(4px) scale(0.9)",
          opacity: hovered ? 1 : 0,
          transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {name || "Freelancer"}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-slate-700" />
      </div>

      {/* Avatar circle */}
      <div
        className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border-2 border-white dark:border-[#0f172a]
                   overflow-hidden flex items-center justify-center text-white text-xs font-bold
                   transition-transform duration-200"
        style={{
          background: color,
          transform: hovered
            ? "translateY(-4px) scale(1.12)"
            : "translateY(0) scale(1)",
          marginLeft: index === 0 ? 0 : "-12px",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    </div>
  );
}

function AvatarGroup({ users, totalCount }) {
  const display = users.slice(0, 5);
  const overflow = totalCount > 5 ? totalCount - 5 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center" style={{ position: "relative" }}>
        {display.map((u, i) => (
          <AvatarItem
            key={u.id ?? i}
            src={u.profileImageUrl || null}
            name={u.fullName || u.companyName || null}
            index={i}
            total={display.length}
          />
        ))}

        {overflow > 0 && (
          <div
            className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border-2 border-white dark:border-[#0f172a]
                       bg-[#1E88E5] flex items-center justify-center text-white text-[11px] font-bold"
            style={{ marginLeft: "-12px", zIndex: 0 }}
          >
            +{overflow > 99 ? "99" : overflow}
          </div>
        )}
      </div>

      <p className="text-[12px] sm:text-sm font-medium text-gray-500 dark:text-slate-400">
        Over{" "}
        <span className="text-[#1E88E5] font-bold">
          {totalCount > 0 ? `${totalCount.toLocaleString()}+` : "12,800+"}
        </span>{" "}
        freelancers
      </p>
    </div>
  );
}

export default function MainSection() {
  const { data: raw, isLoading } = useGetFreelancersQuery();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);


  const { freelancers, totalCount } = React.useMemo(() => {
    if (raw?.total != null && Array.isArray(raw?.list)) {
      const withPhoto = raw.list.filter((u) => u?.profileImageUrl);
      const withoutPhoto = raw.list.filter((u) => !u?.profileImageUrl);
      return {
        freelancers: [...withPhoto, ...withoutPhoto],
        totalCount: raw.total,
      };
    }

    // Fallback: plain array (old API shape)
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.content)
          ? raw.content
          : Array.isArray(raw?.data?.content)
            ? raw.data.content
            : [];

    const withPhoto = list.filter((u) => u?.profileImageUrl);
    const withoutPhoto = list.filter((u) => !u?.profileImageUrl);
    return {
      freelancers: [...withPhoto, ...withoutPhoto],
      totalCount: list.length,
    };
  }, [raw]);

  return (
    <section
      className="w-full overflow-hidden bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/20
                 dark:from-[#0d1b2e] dark:via-[#0f2240] dark:to-[#0d1520]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div
        className="max-w-[1440px] mx-auto px-6 lg:px-[120px]
                   flex flex-col lg:flex-row items-center justify-start lg:justify-between
                   min-h-fit lg:min-h-[calc(100vh-89px)] pt-12 lg:pt-0"
      >
        {/* ── LEFT ──────────────────────────────────────────────────── */}
        <div
          className="w-full lg:w-[55%] flex flex-col text-center lg:text-left
                     items-center lg:items-start gap-4 lg:gap-7 z-10 mb-6 lg:mb-0"
        >
          {/* Badge */}
          <div
            data-aos="fade-down"
            data-aos-delay="0"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full
                       bg-[#1E88E5]/10 border border-[#1E88E5]/25"
          >
            <div className="flex items-center rounded-full px-0.5 bg-[#1E88E5] w-[28px] h-[16px]">
              <div className="rounded-full bg-white ml-auto w-[12px] h-[12px]" />
            </div>
            <span className="text-[#1E88E5] text-[11px] font-semibold uppercase tracking-wide">
              Find Your Dream Job
            </span>
          </div>

          {/* Heading */}
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-bold leading-[1.1] m-0 text-[32px] sm:text-[42px] lg:text-[56px] xl:text-[68px]"
          >
            <span className="text-[#1E88E5]">Freelance Jobs</span>
            <br />
            <span className="text-gray-900 dark:text-white">
              and Talents at
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Your </span>
            <span className="text-[#1E88E5]">Fingertips</span>
          </h1>

          {/* Description */}
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-sm sm:text-base leading-relaxed max-w-[480px]
                       text-gray-500 dark:text-slate-400 m-0"
          >
            Connect with top freelancers and clients on our platform. Find your
            perfect match for your next project.
          </p>


          <div data-aos="fade-up" data-aos-delay="300">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse
                                 border-2 border-white dark:border-[#0f172a]"
                      style={{ marginLeft: i === 0 ? 0 : "-12px" }}
                    />
                  ))}
                </div>
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
              </div>
            ) : (
              <AvatarGroup users={freelancers} totalCount={totalCount} />
            )}
          </div>
        </div>

        <div
  className="w-full lg:w-[45%] relative flex justify-center items-end self-end"
  style={{ animation: "heroFadeLeft 0.9s ease-out 0.15s both" }}
>
          <img
            src={imgMain}
            alt="Professional with Laptop"
            className="relative z-10 object-contain w-[90%] sm:w-[75%] lg:w-full h-auto -mt-4 lg:mt-0"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.2))",
              maxHeight: "65vh",
            }}
          />

          <div
            data-aos="zoom-in"
            data-aos-delay="500"
            className="absolute z-20 flex flex-col gap-0.5 rounded-xl p-3 sm:p-5
                       bg-white/95 backdrop-blur-sm shadow-xl dark:bg-slate-800/95
                       top-[15%] right-[8%] sm:right-[15%] lg:right-0"
            style={{ animation: "floatCard 3s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-slate-100">
                {totalCount > 0 ? `${totalCount}+` : "30K+"}
              </span>
              <span className="text-lg sm:text-xl">💼</span>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-slate-400">
              {totalCount > 0 ? "Freelancers" : "People got hired"}
            </span>
          </div>

          <div
            className="absolute -z-0 rounded-full bottom-0 right-1/2 translate-x-1/2
                       lg:translate-x-0 lg:right-0 w-[90%] aspect-square
                       bg-[#1E88E5]/10 blur-[80px]"
          />
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
