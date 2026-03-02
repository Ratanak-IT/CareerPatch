// src/pages/FindWork.jsx
import { useMemo, useState } from "react";
import { useGetAllJobsQuery } from "../services/servicesApi";
import HeroSection from "../components/findwork/HeroSection";
import JobsGrid from "../components/findwork/JobsGrid";

const PAGE_SIZE = 8;

export default function FindWork() {
  const { data, isLoading, isError } = useGetAllJobsQuery();

  const [searchText,      setSearchText]      = useState("");
  const [appliedSearch,   setAppliedSearch]   = useState("");
  const [experienceLevel, setExperienceLevel] = useState("All Levels");
  const [budgetRange,     setBudgetRange]      = useState("All Budgets");
  const [visibleCount,    setVisibleCount]     = useState(PAGE_SIZE);

  // Normalize the jobs array from any API shape
  const jobs = useMemo(() => {
    if (Array.isArray(data))                return data;
    if (Array.isArray(data?.content))       return data.content;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    if (Array.isArray(data?.data))          return data.data;
    return [];
  }, [data]);

  // Filter
  const filtered = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    return jobs.filter((job) => {
      const title   = (job?.title || "").toLowerCase();
      const catName = (job?.category?.name || job?.categoryName || "").toLowerCase();
      const matchQ  = !q || title.includes(q) || catName.includes(q);

      const level    = job?.level || job?.experienceLevel || "";
      const matchLvl = experienceLevel === "All Levels" || level.toLowerCase().includes(experienceLevel.toLowerCase());

      const budget  = job?.budget ?? 0;
      let matchBudg = true;
      if (budgetRange === "$0–$500")     matchBudg = budget <= 500;
      if (budgetRange === "$500–$1000")  matchBudg = budget > 500  && budget <= 1000;
      if (budgetRange === "$1000–$2000") matchBudg = budget > 1000 && budget <= 2000;
      if (budgetRange === "$2000+")      matchBudg = budget > 2000;

      return matchQ && matchLvl && matchBudg;
    });
  }, [jobs, appliedSearch, experienceLevel, budgetRange]);

  function handleSearch() {
    setAppliedSearch(searchText);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Hero + Search Bar */}
        <div className="mt-6">
          <HeroSection
            searchText={searchText}
            onChangeSearch={setSearchText}
            experienceLevel={experienceLevel}
            onChangeLevel={setExperienceLevel}
            budgetRange={budgetRange}
            onChangeBudget={setBudgetRange}
            onSubmit={handleSearch}
          />
        </div>

        {/* Jobs Grid */}
        <div className="mt-6 pb-16">
          <JobsGrid
            filtered={filtered}
            visibleCount={visibleCount}
            onSeeMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

      </div>
    </div>
  );
}