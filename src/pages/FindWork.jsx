// src/pages/FindWork.jsx
// TEMPORARY: added console.log to reveal real job object fields from the API.
// Remove the log lines once the correct field names are confirmed.
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

  const jobs = useMemo(() => {
    let list = [];
    if (Array.isArray(data))                list = data;
    else if (Array.isArray(data?.content))       list = data.content;
    else if (Array.isArray(data?.data?.content)) list = data.data.content;
    else if (Array.isArray(data?.data))          list = data.data;

    // ── DEBUG: log the first job so we can see the real field names ──────
    if (list.length > 0) {
      console.log("🔍 Job object keys:", Object.keys(list[0]));
      console.log("🔍 First job full object:", list[0]);
    }
    // ── END DEBUG ─────────────────────────────────────────────────────────

    return list;
  }, [data]);

  const filtered = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    return jobs.filter((job) => {
      const title   = (job?.title || "").toLowerCase();
      const catName = (job?.category?.name || job?.categoryName || "").toLowerCase();
      const matchQ  = !q || title.includes(q) || catName.includes(q);
      const level   = job?.level || job?.experienceLevel || "";
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#07111f]">
      <HeroSection
        searchText={searchText}
        onChangeSearch={setSearchText}
        experienceLevel={experienceLevel}
        onChangeLevel={setExperienceLevel}
        budgetRange={budgetRange}
        onChangeBudget={setBudgetRange}
        onSubmit={handleSearch}
      />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] pt-16 md:pt-14 pb-16">
        <JobsGrid
          filtered={filtered}
          visibleCount={visibleCount}
          onSeeMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}