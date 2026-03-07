import { useEffect, useMemo, useState } from "react";
import {
  useGetAllJobsQuery,
  useGetCategoriesQuery,
} from "../services/servicesApi";
import HeroSection from "../components/findwork/HeroSection";
import JobsGrid from "../components/findwork/JobsGrid";

const PAGE_SIZE = 8;

export default function FindWork() {
  const { data, isLoading, isError } = useGetAllJobsQuery();
  const { data: categoriesData = [] } = useGetCategoriesQuery();

  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [budgetRange, setBudgetRange] = useState("All Budgets");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const jobs = useMemo(() => {
    let list = [];

    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data?.content)) list = data.content;
    else if (Array.isArray(data?.data?.content)) list = data.data.content;
    else if (Array.isArray(data?.data)) list = data.data;

    return list;
  }, [data]);

  const categoryList = useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    return categoriesData.filter(Boolean);
  }, [categoriesData]);

  const categoryMap = useMemo(() => {
    const map = {};

    categoryList.forEach((cat) => {
      if (cat?.id) {
        map[cat.id] = cat?.name || cat?.categoryName || cat?.title || "";
      }
    });

    return map;
  }, [categoryList]);

  const categories = useMemo(() => {
    return [
      "All Category",
      ...categoryList
        .map((cat) => cat?.name || cat?.categoryName || cat?.title)
        .filter(Boolean),
    ];
  }, [categoryList]);

  const filtered = useMemo(() => {
    const normalize = (value) => String(value || "").trim().toLowerCase();
    const q = normalize(appliedSearch);
    const selected = normalize(selectedCategory);

    return jobs.filter((job) => {
      const title = normalize(job?.title);
      const categoryName = normalize(categoryMap[job?.categoryId]);

      const matchQ = !q || title.includes(q) || categoryName.includes(q);

      const matchCategory =
        selected === "all category" || categoryName === selected;

      const budget = Number(job?.budget ?? 0);
      let matchBudget = true;

      if (budgetRange === "$0-$500") {
        matchBudget = budget <= 500;
      } else if (budgetRange === "$500-$1000") {
        matchBudget = budget > 500 && budget <= 1000;
      } else if (budgetRange === "$1000-$2000") {
        matchBudget = budget > 1000 && budget <= 2000;
      } else if (budgetRange === "$2000+") {
        matchBudget = budget > 2000;
      }

      return matchQ && matchCategory && matchBudget;
    });
  }, [jobs, appliedSearch, selectedCategory, budgetRange, categoryMap]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, budgetRange]);

  function handleSearch() {
    setAppliedSearch(searchText);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07111f]">
      <HeroSection
        searchText={searchText}
        onChangeSearch={setSearchText}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
        categories={categories}
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
          categoryMap={categoryMap}
        />
      </div>
    </div>
  );
}