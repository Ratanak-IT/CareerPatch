export default function JobCardSkeleton() {
  return (
    <div className="flex flex-col w-full rounded-2xl overflow-hidden
                    bg-white dark:bg-slate-800
                    border border-gray-100 dark:border-slate-700
                    shadow-sm">

      {/* Image */}
      <div
        className="shrink-0 bg-gray-200 dark:bg-slate-700 animate-pulse"
        style={{ height: "clamp(140px, 20vw, 230px)" }}
      />

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">

        {/* Title */}
        <div className="h-3 sm:h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />

        {/* Description */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="h-2 sm:h-2.5 w-full rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2 sm:h-2.5 w-full rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2 sm:h-2.5 w-2/3  rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Date + Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2.5 w-12 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mb-3">
          <div className="h-4 sm:h-5 w-16 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 sm:h-5 w-14 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 mb-3" />

        {/* Author + Apply button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse shrink-0" />
            <div className="h-2.5 sm:h-3 w-20 sm:w-24 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <div className="h-7 w-20 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>

      </div>
    </div>
  );
}