// src/components/freelancer/TalentByFreelancerSkeleton.jsx

export default function TalentByFreelancerSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4
        bg-white border border-[#e8f0fe] shadow-[0_4px_20px_rgba(30,136,229,0.07)]
        dark:bg-[#0d1b2e] dark:border-[#1e3a5f] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Avatar + Name ── */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse shrink-0" />

        <div className="flex-1 flex flex-col gap-1.5">
          {/* Name */}
          <div className="h-3.5 w-2/3 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          {/* Category */}
          <div className="h-3 w-1/2 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          {/* Experience */}
          <div className="h-2.5 w-5/12 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#e8f0fe] dark:bg-[#1e3a5f]" />

      {/* ── Skill pills ── */}
      <div className="flex flex-wrap gap-1.5">
        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-6 w-14 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>

      {/* ── Location + Arrow ── */}
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
}