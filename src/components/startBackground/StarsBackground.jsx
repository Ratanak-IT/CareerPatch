// src/components/about/StarsBackground.jsx
import { useEffect, useRef, useCallback } from "react";

export default function StarsBackground({ className = "", starCount = 160 }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const starsRef  = useRef([]);
  const mouseRef  = useRef({ x: null, y: null }); // null = no mouse yet
  const tRef      = useRef(0);

  const isDark = () => document.documentElement.classList.contains("dark");

  const initStars = useCallback((w, h) => {
    starsRef.current = Array.from({ length: starCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.25 + 0.05; // drift speed px/frame
      return {
        // origin (for mouse parallax reference)
        ox:    Math.random() * w,
        oy:    Math.random() * h,
        // current rendered position
        x:     0,
        y:     0,
        r:     Math.random() * 1.2 + 0.5,
        // twinkle
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.006 + 0.002,
        // autonomous drift
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        // mouse parallax depth
        depth: Math.random() * 0.05 + 0.01,
      };
    });
    starsRef.current.forEach((s) => { s.x = s.ox; s.y = s.oy; });
  }, [starCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const parent = canvas.parentElement;

    /* ── Resize ─────────────────────────────────────────────── */
    const resize = () => {
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initStars(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    /* ── Mouse tracking ──────────────────────────────────────── */
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onMouseLeave = () => { mouseRef.current = { x: null, y: null }; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    /* ── Draw loop ───────────────────────────────────────────── */
    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      const dark      = isDark();
      const [r, g, b] = dark ? [255, 255, 255] : [99, 102, 241];
      const { x: mx, y: my } = mouseRef.current;
      const hasMouse = mx !== null && my !== null;

      tRef.current += 1;

      starsRef.current.forEach((s) => {

        /* ── 1. Autonomous drift (always running) ── */
        s.ox += s.vx;
        s.oy += s.vy;

        // Wrap around edges so stars never disappear
        if (s.ox < -4)     s.ox = w + 4;
        if (s.ox > w + 4)  s.ox = -4;
        if (s.oy < -4)     s.oy = h + 4;
        if (s.oy > h + 4)  s.oy = -4;

        /* ── 2. Mouse parallax offset (only when mouse present) ── */
        let targetX = s.ox;
        let targetY = s.oy;
        if (hasMouse) {
          targetX = s.ox + (mx - w / 2) * s.depth;
          targetY = s.oy + (my - h / 2) * s.depth;
        }

        // Lerp rendered position toward target
        s.x += (targetX - s.x) * 0.06;
        s.y += (targetY - s.y) * 0.06;

        /* ── 3. Twinkle ── */
        const alpha = 0.2 + 0.7 * (0.5 + 0.5 * Math.sin(tRef.current * s.twinkleSpeed + s.phase));

        /* ── 4. Draw glow + core ── */
        if (s.r > 1.2) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
          glow.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 0.3).toFixed(3)})`);
          glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const mo = new MutationObserver(() => {});
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}