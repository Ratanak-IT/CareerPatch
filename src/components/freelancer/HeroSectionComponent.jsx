import { useState } from "react";
import imgMain from "../../assets/modelforfindfreelancer.png";
import FreelancerSearchBarComponent from "./FreelancerSearchBarComponent";
import { useGetFreelancersQuery } from "../../services/freelancerApi";

/* ─── Avatar with tooltip ────────────────────────────────────────────────── */
function AvatarItem({ src, name, index }) {
  const [hovered, setHovered] = useState(false);

  const initials = (name || "?")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const colors = [
    "#3B82F6", "#8B5CF6", "#EC4899",
    "#10B981", "#F59E0B", "#06B6D4",
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  return (
    <div
      className="relative"
      style={{ marginLeft: index === 0 ? 0 : "-12px", zIndex: hovered ? 20 : 10 - index }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 mb-2 px-2.5 py-1 rounded-lg
                   text-[11px] font-semibold text-white bg-gray-900 dark:bg-slate-700
                   whitespace-nowrap shadow-lg pointer-events-none"
        style={{
          transform: hovered
            ? "translateX(-50%) translateY(0) scale(1)"
            : "translateX(-50%) translateY(4px) scale(0.9)",
          opacity: hovered ? 1 : 0,
          transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {name || "Freelancer"}
        <span className="absolute top-full left-1/2 -translate-x-1/2
                         border-4 border-transparent border-t-gray-900 dark:border-t-slate-700" />
      </div>

      {/* Circle */}
      <div
        className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a]
                   overflow-hidden flex items-center justify-center
                   text-white text-xs font-bold transition-transform duration-200"
        style={{
          background: color,
          transform: hovered ? "translateY(-4px) scale(1.12)" : "translateY(0) scale(1)",
        }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Avatar group ───────────────────────────────────────────────────────── */
function AvatarGroup({ users, totalCount }) {
  const display  = users.slice(0, 3);
  const overflow = totalCount > 3 ? totalCount - 3 : 0;

  return (
    <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {display.map((u, i) => (
            <AvatarItem
              key={u.id ?? i}
              src={u.profileImageUrl || null}
              name={u.fullName || u.companyName || null}
              index={i}
            />
          ))}
          {overflow > 0 && (
            <div
              className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a]
                         bg-[#1E88E5] flex items-center justify-center
                         text-white text-[11px] font-bold"
              style={{ marginLeft: "-12px" }}
            >
              +{overflow > 99 ? "99" : overflow}
            </div>
          )}
        </div>
        <p className="text-xs font-medium text-gray-400 dark:text-slate-400 text-left m-0">
          Over{" "}
          <span className="text-[#1E88E5] font-bold">
            {totalCount > 0 ? `${totalCount.toLocaleString()}+` : "12,800+"}
          </span>
          <br />
          freelancers available
        </p>
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {[0, 1, 2].map((i) => (
          <div key={i}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a]
                       bg-gray-200 dark:bg-slate-700 animate-pulse"
            style={{ marginLeft: i === 0 ? 0 : "-12px" }}
          />
        ))}
      </div>
      <div className="h-4 w-36 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

/* ─── HeroSectionComponent ───────────────────────────────────────────────── */
export default function HeroSectionComponent({
  category,
  searchText,
  onChangeCategory,
  onChangeSearch,
  onSubmitSearch,
}) {
  const { data: raw, isLoading } = useGetFreelancersQuery();

  const { freelancers, totalCount } = (() => {
    if (raw?.total != null && Array.isArray(raw?.list)) {
      return { freelancers: raw.list, totalCount: raw.total };
    }
    const list =
      Array.isArray(raw)                ? raw :
      Array.isArray(raw?.data)          ? raw.data :
      Array.isArray(raw?.content)       ? raw.content :
      Array.isArray(raw?.data?.content) ? raw.data.content : [];
    return { freelancers: list, totalCount: list.length };
  })();

  return (
    <div
      className="relative w-full pb-7 sm:pb-[80px] md:pb-[30px]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <section
        className={[
          "w-full overflow-hidden relative",
          "bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/25",
          "dark:from-[#0d1b2e] dark:via-[#0f2240] dark:to-[#0d1520]",
          "pb-[88px] sm:pb-[44px] md:pb-[36px]",
        ].join(" ")}
      >
        {/* Dot-grid — dark only */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[120px]">
          <div className="flex flex-col lg:flex-row items-center justify-between
                          gap-8 lg:gap-0 pt-12 lg:pt-16 pb-4">

            {/* ── LEFT ── */}
            <div className="w-full lg:w-[52%] flex flex-col gap-5
                            items-center lg:items-start text-center lg:text-left">

              {/* Badge — matches FindWork */}
              <div className="flex items-center gap-2.5 w-fit px-4 py-2 rounded-full
                              bg-[#1E88E5]/10 border border-[#1E88E5]/25">
                <div className="flex items-center rounded-full px-0.5 bg-[#1E88E5]"
                  style={{ width: "32px", height: "18px" }}>
                  <div className="rounded-full bg-white ml-auto" style={{ width: "14px", height: "14px" }} />
                </div>
                <span className="text-[#1E88E5] text-[11px] font-bold uppercase tracking-widest">
                  Find Top Freelancers
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-bold leading-[1.1] m-0
                             text-[28px] sm:text-[38px] md:text-[46px] lg:text-[52px] xl:text-[60px]
                             text-slate-900 dark:text-white">
                <span className="text-[#1E88E5]">Discover Freelancers</span>
                <br />
                and Work with the{" "}
                <span className="text-[#1E88E5]">Best Talent</span>
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base leading-relaxed max-w-[480px] m-0
                            text-gray-500 dark:text-slate-400">
                Browse thousands of skilled freelancers ready to bring your
                ideas to life. Find the perfect match for your project.
              </p>

              {/* Avatars — real freelancer API */}
              {isLoading ? (
                <AvatarSkeleton />
              ) : (
                <AvatarGroup users={freelancers} totalCount={totalCount} />
              )}
            </div>

            {/* ── RIGHT — keep original image ── */}
            <div className="w-full lg:w-[44%] relative flex justify-center lg:justify-end items-end self-end">
              <img
                src={imgMain}
                alt="Freelancer with Tablet"
                className="relative z-10 w-[75%] sm:w-[55%] lg:w-full h-auto object-contain
                           max-h-[260px] sm:max-h-[320px] lg:max-h-[380px]"
                style={{ filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.15))" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SearchBar — flush at bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-[120px] 2xl:px-[50px] z-20">
        <div className="max-w-[1440px] 2xl:px-30 mx-auto">
          <FreelancerSearchBarComponent
            category={category}
            searchText={searchText}
            onChangeCategory={onChangeCategory}
            onChangeSearch={onChangeSearch}
            onSubmitSearch={onSubmitSearch}
          />
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}