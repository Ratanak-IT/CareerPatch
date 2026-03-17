import LogoLoop, { type LogoItem } from "./LogoLoop";

const technologies: LogoItem[] = [
  { name: "React", src: "/logos/react.svg", href: "https://react.dev" },
  { name: "Vite", src: "/logos/vite.svg", href: "https://vite.dev" },
  { name: "Tailwind CSS", src: "/logos/tailwind.svg", href: "https://tailwindcss.com" },
  { name: "TypeScript", src: "/logos/typescript.svg", href: "https://www.typescriptlang.org" },
  { name: "Node.js", src: "/logos/node.svg", href: "https://nodejs.org" },
  { name: "Firebase", src: "/logos/firebase.svg", href: "https://firebase.google.com" },
];

type TechnologiesUsedProps = {
  isLoading?: boolean;
};

export default function TechnologiesUsed({
  isLoading = false,
}: TechnologiesUsedProps) {
  return (
    <div
      className="mx-auto mt-6 w-full max-w-7xl rounded-3xl border
                 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md
                 border-slate-200 dark:border-slate-700
                 p-5 sm:p-6 md:p-8 shadow-sm transition-colors"
    >
      <h2 className="mb-6 text-left text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Technologies Used
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      ) : (
        <LogoLoop
          logos={technologies}
          speedSeconds={18}
          logoHeight={40}
          pauseOnHover
          fadeOut
        />
      )}
    </div>
  );
}