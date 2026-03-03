// src/components/findwork/JobsGrid.jsx
import JobCard, { getJobId } from "./JobCard";

const PAGE_SIZE = 8;

export default function JobsGrid({ filtered, visibleCount, onSeeMore, isLoading, isError }) {
  const visible = filtered.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-9 h-9 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center py-10">Failed to load jobs. Please try again.</p>
    );
  }

  return (
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
            <path
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            />
          </svg>
          <p className="font-semibold text-gray-500">No jobs found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* See More */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onSeeMore}
            className="bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold text-sm px-10 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md shadow-blue-100 hover:shadow-lg active:scale-95"
          >
            See More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}