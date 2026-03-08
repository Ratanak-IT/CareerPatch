// src/components/about/TechCard.jsx

export function TechCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3
                    p-3 sm:p-4 rounded-xl border
                    bg-white border-slate-200
                    dark:bg-[#1e293b] dark:border-slate-700 w-full">
      <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
      <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}

export default function TechCard({ tech }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3
                    p-3 sm:p-4 rounded-xl border
                    bg-white border-slate-200
                    dark:bg-[#1e293b] dark:border-slate-700
                    w-full transition-colors">
      <img src={tech.icon} alt={tech.name} className="h-8 w-8 object-contain" draggable="false" />
      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap text-center sm:text-left
                       text-gray-700 dark:text-slate-200">
        {tech.name}
      </span>
    </div>
  );
}