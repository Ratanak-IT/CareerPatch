import React, { useMemo } from "react";

export type LogoItem = {
  name: string;
  src: string;
  href?: string;
};

type LogoLoopProps = {
  logos: LogoItem[];
  speedSeconds?: number;
  logoHeight?: number;
  gapClassName?: string;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  cardClassName?: string;
};

export default function LogoLoop({
  logos,
  speedSeconds = 20,
  logoHeight = 40,
  gapClassName = "gap-6",
  pauseOnHover = true,
  fadeOut = true,
  cardClassName = "",
}: LogoLoopProps) {
  const loopItems = useMemo(() => [...logos, ...logos], [logos]);

  return (
    <div className="relative overflow-hidden">
      {fadeOut && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white/80 to-transparent dark:from-[#1e293b]/80" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white/80 to-transparent dark:from-[#1e293b]/80" />
        </>
      )}

      <div
        className={[
          "flex w-max shrink-0 animate-logo-loop",
          gapClassName,
          pauseOnHover ? "hover:[animation-play-state:paused]" : "",
        ].join(" ")}
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {loopItems.map((logo, index) => {
          const content = (
            <div
              className={[
                "flex h-20 min-w-[140px] items-center justify-center rounded-2xl",
                "border border-slate-200 bg-white/70 px-5 shadow-sm",
                "transition duration-300 hover:scale-105 hover:shadow-md",
                "dark:border-slate-700 dark:bg-slate-800/70",
                cardClassName,
              ].join(" ")}
            >
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                draggable={false}
                className="w-auto object-contain"
                style={{ height: `${logoHeight}px` }}
              />
            </div>
          );

          return (
            <div key={`${logo.name}-${index}`} className="shrink-0">
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={logo.name}
                  title={logo.name}
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}