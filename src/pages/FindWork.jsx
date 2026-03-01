// src/pages/FindWork.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useGetAllJobsQuery, useGetCategoriesQuery } from "../services/servicesApi";
import { useGetUserByIdQuery } from "../services/userApi";
import { useBookmarks } from "../hooks/useBookmarks";

// ─── Constants ────────────────────────────────────────────────────────────────
const FALLBACK_IMAGE  = "https://placehold.co/400x220?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/40x40?text=?";

const AVATAR_SAMPLES = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function getJobId(job) {
  return job?.id ?? job?.jobId ?? job?._id ?? null;
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job }) {
  const { data: userRes } = useGetUserByIdQuery(job?.userId, { skip: !job?.userId });
  const user = userRes?.data || userRes;

  const jobId        = getJobId(job);
  const title        = job?.title       || "Untitled";
  const description  = job?.description || "No description available.";
  const categoryName = job?.category?.name || job?.categoryName || null;
  const date         = formatDate(job?.createdAt);
  const authorName   = user?.fullName || user?.companyName || "Business";
  const authorAvatar = user?.profileImageUrl || FALLBACK_AVATAR;
  const level        = job?.level || job?.experienceLevel || "Expert";

  const image =
    (Array.isArray(job?.jobImages) && job.jobImages[0]) ||
    (Array.isArray(job?.imageUrls) && job.imageUrls[0]) ||
    FALLBACK_IMAGE;

  const tags = [];
  if (categoryName) tags.push(categoryName);
  if (job?.skills?.[0]) tags.push(job.skills[0]);

  const { liked, toggle } = useBookmarks({ id: jobId, type: "job" });

  if (!jobId) return null;

  return (
    <Link
      to={`/jobs/${jobId}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col w-full border border-gray-100 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 176 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
        {/* Bookmark button */}
        <button
          onClick={toggle}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={liked ? "Remove bookmark" : "Bookmark"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill={liked ? "#3B82F6" : "none"}
            stroke={liked ? "#3B82F6" : "#9ca3af"}
            strokeWidth="1.8" className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-[#1E88E5] font-bold text-sm mb-1 truncate">{title}</h3>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
          {description}
        </p>

        {/* Date + Level */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <span>Date: {date}</span>
          <span className="text-[#1E88E5] font-semibold">
            Level: <span className="text-red-500">{level}</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="bg-[#1E88E5] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>

        <div className="border-t border-gray-100 mb-3" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img src={authorAvatar} alt={authorName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
            />
            <span className="text-gray-700 text-xs font-medium truncate max-w-[80px]">{authorName}</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
          >
            Apply Now
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({ searchText, onChangeSearch, experienceLevel, onChangeLevel, budgetRange, onChangeBudget, onSubmit }) {
  const levels = ["All Levels", "Junior", "Mid-level", "Senior", "Expert"];
  const budgets = ["All Budgets", "$0–$500", "$500–$1000", "$1000–$2000", "$2000+"];

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-0 overflow-hidden">
      {/* Search input */}
      <div className="flex items-center flex-1 px-4 py-3 sm:py-0 gap-2 border-b sm:border-b-0 sm:border-r border-gray-100">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchText}
          onChange={(e) => onChangeSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Search by title"
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        {searchText && (
          <button onClick={() => onChangeSearch("")} className="text-gray-300 hover:text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Experience Level */}
      <div className="relative border-b sm:border-b-0 sm:border-r border-gray-100">
        <select
          value={experienceLevel}
          onChange={(e) => onChangeLevel(e.target.value)}
          className="appearance-none w-full sm:w-44 px-4 py-3 sm:h-[56px] text-sm text-gray-600 bg-transparent outline-none cursor-pointer pr-8"
        >
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {/* Budget Range */}
      <div className="relative border-b sm:border-b-0 sm:border-r border-gray-100">
        <select
          value={budgetRange}
          onChange={(e) => onChangeBudget(e.target.value)}
          className="appearance-none w-full sm:w-40 px-4 py-3 sm:h-[56px] text-sm text-gray-600 bg-transparent outline-none cursor-pointer pr-8"
        >
          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {/* Search Button */}
      <button
        onClick={onSubmit}
        className="bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold text-sm px-8 py-3 sm:py-0 sm:h-[56px] transition-colors duration-200 whitespace-nowrap"
      >
        Search
      </button>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ searchText, onChangeSearch, experienceLevel, onChangeLevel, budgetRange, onChangeBudget, onSubmit }) {
  return (
    <div className="relative pb-10 sm:pb-14">
      {/* Hero card */}
      <div className="w-full rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 50%, #EFF6FF 100%)" }}>
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 pt-10 pb-16 lg:pb-14 gap-6">
          {/* Text */}
          <div className="w-full lg:w-[55%] text-center lg:text-left">
            <h1 className="font-extrabold leading-tight text-[26px] sm:text-[34px] lg:text-[42px] text-gray-900 mb-3">
              Find Freelance Projects{" "}
              <span className="text-[#1E88E5]">That</span>
              <br />
              Match Your Skills
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-sm mx-auto lg:mx-0">
              Browse thousands of freelance opportunities tailored to your expertise.
            </p>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {AVATAR_SAMPLES.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Over <span className="text-[#1E88E5] font-bold">12800+</span> freelancers to</p>
                  <p className="text-xs text-gray-500">complete your projects</p>
                </div>
              </div>
              <button className="bg-[#1E88E5] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 shadow-md shadow-blue-200">
                Find your skill
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full lg:w-[45%] flex justify-center">
            <div className="relative w-[240px] sm:w-[300px] lg:w-[340px]">
              {/* Decorative circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 scale-[0.85] translate-y-4" />
              {/* Placeholder illustration */}
              <div className="relative z-10 flex items-center justify-center h-[200px] sm:h-[240px]">
                <svg viewBox="0 0 280 220" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Desk */}
                  <rect x="40" y="160" width="200" height="10" rx="4" fill="#E0E7FF"/>
                  <rect x="60" y="170" width="8" height="30" rx="2" fill="#C7D2FE"/>
                  <rect x="212" y="170" width="8" height="30" rx="2" fill="#C7D2FE"/>
                  {/* Monitor */}
                  <rect x="70" y="90" width="120" height="75" rx="8" fill="#1E88E5" opacity="0.9"/>
                  <rect x="75" y="95" width="110" height="60" rx="5" fill="#1565C0"/>
                  {/* Screen glow lines */}
                  <rect x="82" y="105" width="60" height="4" rx="2" fill="#60A5FA"/>
                  <rect x="82" y="115" width="45" height="4" rx="2" fill="#93C5FD"/>
                  <rect x="82" y="125" width="55" height="4" rx="2" fill="#60A5FA"/>
                  <rect x="82" y="135" width="35" height="4" rx="2" fill="#93C5FD"/>
                  {/* Play button */}
                  <circle cx="165" cy="120" r="14" fill="#3B82F6" opacity="0.8"/>
                  <path d="M160 113 l14 7 -14 7Z" fill="white"/>
                  {/* Monitor stand */}
                  <rect x="122" y="165" width="16" height="8" rx="2" fill="#93C5FD"/>
                  <rect x="112" y="173" width="36" height="5" rx="2" fill="#93C5FD"/>
                  {/* Person */}
                  <circle cx="200" cy="95" r="18" fill="#FFD6A5"/>
                  <rect x="183" y="113" width="34" height="40" rx="10" fill="#1E88E5"/>
                  {/* Arms */}
                  <rect x="160" y="120" width="25" height="8" rx="4" fill="#FFD6A5"/>
                  <rect x="217" y="120" width="25" height="8" rx="4" fill="#FFD6A5"/>
                  {/* Hair */}
                  <path d="M182 92 Q200 75 218 92 Q215 80 200 77 Q185 80 182 92Z" fill="#4B3B2A"/>
                  {/* Clock */}
                  <circle cx="240" cy="60" r="22" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                  <circle cx="240" cy="60" r="2" fill="#1E88E5"/>
                  <line x1="240" y1="60" x2="240" y2="44" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="240" y1="60" x2="252" y2="64" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                  {/* Question mark bubble */}
                  <circle cx="255" cy="35" r="16" fill="#FEF3C7"/>
                  <text x="249" y="42" fontSize="18" fill="#F59E0B" fontWeight="bold">?</text>
                  {/* Gear */}
                  <circle cx="48" cy="130" r="12" fill="#E0E7FF" stroke="#A5B4FC" strokeWidth="1.5"/>
                  <circle cx="48" cy="130" r="5" fill="white"/>
                  {/* Floating shapes */}
                  <rect x="35" y="75" width="10" height="10" rx="2" fill="#FCA5A5" opacity="0.6"/>
                  <circle cx="252" cy="95" r="5" fill="#86EFAC" opacity="0.7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar floated at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6">
        <SearchBar
          searchText={searchText}
          onChangeSearch={onChangeSearch}
          experienceLevel={experienceLevel}
          onChangeLevel={onChangeLevel}
          budgetRange={budgetRange}
          onChangeBudget={onChangeBudget}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function FindWork() {
  const { data, isLoading, isError } = useGetAllJobsQuery();

  const [searchText,      setSearchText]      = useState("");
  const [appliedSearch,   setAppliedSearch]   = useState("");
  const [experienceLevel, setExperienceLevel] = useState("All Levels");
  const [budgetRange,     setBudgetRange]      = useState("All Budgets");
  const [visibleCount,    setVisibleCount]     = useState(PAGE_SIZE);

  const jobs = useMemo(() => {
    if (Array.isArray(data))                return data;
    if (Array.isArray(data?.content))       return data.content;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    if (Array.isArray(data?.data))          return data.data;
    return [];
  }, [data]);

  // Filter jobs
  const filtered = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    return jobs.filter((job) => {
      const title    = (job?.title || "").toLowerCase();
      const catName  = (job?.category?.name || job?.categoryName || "").toLowerCase();
      const matchQ   = !q || title.includes(q) || catName.includes(q);

      const level    = job?.level || job?.experienceLevel || "";
      const matchLvl = experienceLevel === "All Levels" || level.toLowerCase().includes(experienceLevel.toLowerCase());

      const budget   = job?.budget ?? 0;
      let matchBudg  = true;
      if (budgetRange === "$0–$500")    matchBudg = budget <= 500;
      if (budgetRange === "$500–$1000") matchBudg = budget > 500  && budget <= 1000;
      if (budgetRange === "$1000–$2000")matchBudg = budget > 1000 && budget <= 2000;
      if (budgetRange === "$2000+")     matchBudg = budget > 2000;

      return matchQ && matchLvl && matchBudg;
    });
  }, [jobs, appliedSearch, experienceLevel, budgetRange]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="mt-6">
          <HeroSection
            searchText={searchText}
            onChangeSearch={setSearchText}
            experienceLevel={experienceLevel}
            onChangeLevel={setExperienceLevel}
            budgetRange={budgetRange}
            onChangeBudget={setBudgetRange}
            onSubmit={() => { setAppliedSearch(searchText); setVisibleCount(PAGE_SIZE); }}
          />
        </div>

        {/* Cards grid */}
        <div className="mt-6 pb-16">
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="w-9 h-9 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {isError && (
            <p className="text-red-500 text-center py-10">Failed to load jobs. Please try again.</p>
          )}

          {!isLoading && !isError && (
            <>
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visible.map((job) => (
                  <JobCard key={getJobId(job) || job?.title} job={job} />
                ))}
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <svg className="w-14 h-14 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                  </svg>
                  <p className="font-semibold text-gray-500">No jobs found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                </div>
              )}

              {/* See More button */}
              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold text-sm px-10 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md shadow-blue-100 hover:shadow-lg active:scale-95"
                  >
                    See More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}