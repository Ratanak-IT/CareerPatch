
import { useState } from "react";

export default function ShareButton({
  url,
  title = "Check this out on CareerPatch!",
  label,
  size = "sm",   // "sm" | "md"
  className = "",
}) {
  const [copied,  setCopied]  = useState(false);
  const [animate, setAnimate] = useState(false);

  const fullUrl = url?.startsWith("http")
    ? url
    : `${window.location.origin}${url}`;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);

    // Try native share (mobile) first
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
        return;
      } catch {
        // User cancelled — fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: execCommand
      const el = document.createElement("textarea");
      el.value = fullUrl;
      el.style.position = "fixed";
      el.style.opacity  = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleShare}
      title={copied ? "Link copied!" : "Share"}
      className={`
        relative flex items-center gap-1.5 rounded-lg font-semibold transition-all
        ${isSmall ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm"}
        ${copied
          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
        }
        ${animate ? "scale-95" : "scale-100"}
        ${className}
      `}
    >
      {copied ? (
        <>
          <svg className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {label !== undefined && <span>Copied!</span>}
        </>
      ) : (
        <>
          <svg className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          {label !== undefined && <span>{label}</span>}
        </>
      )}

      {/* Tooltip */}
      {copied && !label && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                         bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded-lg
                         pointer-events-none">
          Copied!
        </span>
      )}
    </button>
  );
}