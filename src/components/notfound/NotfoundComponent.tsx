import { useState, useEffect, useRef } from "react";

const Blob = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      d="M44.7,-67.1C56.3,-60.3,62.6,-44.6,68.2,-29.1C73.8,-13.6,78.7,1.7,75.4,15.4C72.1,29.1,60.6,41.2,47.6,50.5C34.6,59.8,20.1,66.3,4.2,70.2C-11.7,74.1,-29,75.4,-42.8,68.7C-56.6,62,-66.9,47.3,-72.1,31.2C-77.3,15.1,-77.4,-2.4,-71.4,-17C-65.4,-31.6,-53.3,-43.3,-40.3,-50.5C-27.3,-57.7,-13.6,-60.5,2.1,-63.5C17.8,-66.5,33.1,-73.9,44.7,-67.1Z"
      transform="translate(100 100)"
    />
  </svg>
);

export default function NotFound() {
  const [show, setShow] = useState(false);
  const [num, setNum] = useState(0);
  const canvasRef = useRef(null);
  const darkRef = useRef(false);

  useEffect(() => {
    // Sync dark class from <html> for canvas color
    darkRef.current = document.documentElement.classList.contains("dark");
    setTimeout(() => setShow(true), 100);
  }, []);

  // Count-up 404
  useEffect(() => {
    if (!show) return;
    let n = 0;
    const iv = setInterval(() => {
      n += 11;
      if (n >= 404) { setNum(404); clearInterval(iv); }
      else setNum(n);
    }, 16);
    return () => clearInterval(iv);
  }, [show]);

  // Particle canvas — adapts color based on dark class
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H;
    const pts = [];

    const isDark = () => document.documentElement.classList.contains("dark");

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      pts.length = 0;
      for (let i = 0; i < 38; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .4,
          vy: (Math.random() - .5) * .4,
          r: Math.random() * 1.5 + .5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();
      const dotColor  = dark ? "167,139,250" : "109,40,217";
      const lineColor = dark ? "167,139,250" : "109,40,217";

      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${dark ? 0.35 : 0.2})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });

      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor},${(dark ? 0.12 : 0.07) * (1 - d / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }));

      raf = requestAnimationFrame(draw);
    };

    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const fade = (d) => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(22px)",
    transition: `opacity .7s ease ${d}ms, transform .7s ease ${d}ms`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,900;1,700&family=Geist+Mono:wght@300;400;500&display=swap');
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-rev  { to { transform: rotate(-360deg); } }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.5);opacity:1} }
        .spin-slow  { animation: spin-slow 22s linear infinite; }
        .spin-rev   { animation: spin-rev  16s linear infinite; }
        .float-anim { animation: float 5s ease-in-out infinite; }
        .blink      { animation: blink 1.1s step-end infinite; }
        .pulse-dot  { animation: pulse-dot 1.5s ease-in-out infinite; }
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-mono-g   { font-family: 'Geist Mono', monospace; }
      `}</style>

      {/* Root — light default, dark:bg switches when .dark on <html> */}
      <div className="relative min-h-screen w-full overflow-hidden
        bg-slate-50 dark:bg-[#0f0f13]
        transition-colors duration-500">

        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Background blobs */}
        <Blob className="absolute -top-32 -left-32 w-[520px]
          opacity-[0.07] dark:opacity-[0.05]
          text-violet-400 dark:text-violet-500
          pointer-events-none" />
        <Blob className="absolute -bottom-40 -right-20 w-[480px]
          opacity-[0.05] dark:opacity-[0.04]
          text-emerald-400 dark:text-emerald-500
          pointer-events-none rotate-180" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0
            opacity-40 dark:opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center">

          {/* Rings + 404 */}
          <div className="relative flex items-center justify-center mb-8" style={fade(0)}>
            {/* Outer ring */}
            <div className="spin-slow absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full
              border border-dashed
              border-violet-300/50 dark:border-violet-500/20" />
            {/* Mid ring */}
            <div className="spin-rev absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full
              border
              border-violet-200/60 dark:border-violet-400/15" />
            {/* Inner glow */}
            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full
              bg-gradient-to-br
              from-violet-100 to-indigo-100
              dark:from-violet-900/30 dark:to-indigo-900/20
              blur-xl" />

            {/* 404 number */}
            <div className="relative z-10 float-anim">
              <div
                className="font-fraunces font-black text-[6rem] sm:text-[8rem] leading-none select-none
                  text-transparent bg-clip-text
                  bg-gradient-to-br
                  from-violet-600 via-indigo-500 to-violet-400
                  dark:from-violet-300 dark:via-indigo-300 dark:to-violet-200"
                style={{ letterSpacing: "-0.04em" }}
              >
                {String(num).padStart(3, "0")}
              </div>
            </div>
          </div>

          {/* Badge */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-white dark:bg-white/5
              border border-slate-200 dark:border-white/10
              shadow-sm mb-5
              font-mono-g text-xs tracking-widest uppercase
              text-slate-500 dark:text-slate-400"
            style={fade(150)}
          >
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
            HTTP · Page Not Found
          </div>

          {/* Heading */}
          <h1
            className="font-fraunces font-black text-4xl sm:text-5xl md:text-6xl leading-tight
              text-slate-900 dark:text-white
              mb-4 max-w-xl"
            style={{ ...fade(250), letterSpacing: "-0.03em" }}
          >
            Whoops,{" "}
            <span className="italic font-light text-violet-500 dark:text-violet-300">
              nothing
            </span>{" "}
            here.
          </h1>

          {/* Description */}
          <p
            className="font-mono-g text-sm sm:text-base font-light
              text-slate-500 dark:text-slate-400
              max-w-sm leading-relaxed mb-10"
            style={fade(350)}
          >
            The page you're after has gone missing — moved, deleted,
            or it never existed to begin with.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto"
            style={fade(450)}
          >
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2
                font-mono-g text-sm font-medium tracking-wide
                px-7 py-3 rounded-2xl
                bg-gradient-to-r from-violet-600 to-indigo-600
                hover:from-violet-500 hover:to-indigo-500
                text-white shadow-lg shadow-violet-500/25
                hover:-translate-y-0.5 hover:shadow-violet-500/40
                transition-all duration-200"
            >
              ← Back Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2
                font-mono-g text-sm font-medium tracking-wide
                px-7 py-3 rounded-2xl
                bg-white dark:bg-white/5
                border border-slate-200 dark:border-white/10
                text-slate-600 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-white/10
                hover:-translate-y-0.5 shadow-sm
                transition-all duration-200"
            >
              Go Back
            </button>
          </div>

          {/* URL path */}
          <div
            className="mt-10 font-mono-g text-xs
              text-slate-400 dark:text-slate-600
              flex items-center gap-2"
            style={fade(550)}
          >
            <span className="w-5 h-px bg-slate-300 dark:bg-slate-700" />
            <span className="text-violet-400 dark:text-violet-600">404</span>
            &nbsp;·&nbsp;
            {typeof window !== "undefined" ? window.location.pathname : "/"}
            <span className="blink w-0.5 h-3 bg-violet-400 dark:bg-violet-600 inline-block ml-0.5 rounded-sm" />
            <span className="w-5 h-px bg-slate-300 dark:bg-slate-700" />
          </div>

        </div>
      </div>
    </>
  );
}