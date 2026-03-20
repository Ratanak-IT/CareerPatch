import { useEffect, useRef } from "react";
import { getJobId } from "../../utils/jobUtils";
import JobCardSkeleton from "../loading/JobsCardSkeleton";
import JobCard from "./JobCard";

export default function JobsGrid({
  filtered,
  visibleCount,
  setVisibleCount,
  isLoading,
  isError,
  categoryMap = {},
  pageSize = 8,
}) {
  const observerRef = useRef(null);

  const filteredNoDraft = (filtered || []).filter(
    (j) => (j?.status || "OPEN") !== "DRAFT",
  );

  const visible = filteredNoDraft.slice(0, visibleCount);
  const hasMore = setVisibleCount && visibleCount < filteredNoDraft.length;

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + pageSize, filteredNoDraft.length),
          );
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [hasMore, pageSize, filteredNoDraft.length, setVisibleCount]);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center py-10">
        Failed to load jobs. Please try again.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((job) => (
          <JobCard
            key={getJobId(job) || job?.title}
            job={job}
            categoryMap={categoryMap}
          />
        ))}
      </div>

      {filteredNoDraft.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            className="w-14 h-14 mb-4 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
          <p className="font-semibold text-gray-500 dark:text-slate-400">
            No jobs found
          </p>
          <p className="text-xs mt-1 text-gray-400 dark:text-slate-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {hasMore && (
        <div
          ref={observerRef}
          className="flex justify-center items-center py-10"
        >
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] animate-bounce" />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
