import React from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import { useDarkMode } from "../navbar/NavbarComponent";

if (!document.head.querySelector('link[href*="Poppins"]')) {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

// ── Social Icon ──
function SocialIcon({ href, label, children, darkMode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full flex items-center justify-center no-underline flex-shrink-0 border-2 transition-all duration-200 hover:shadow-md"
      style={{
        borderColor: darkMode ? "#475569" : "#d1d5db",
        color: darkMode ? "#94a3b8" : "#9ca3af",
        background: darkMode ? "rgba(51,65,85,0.8)" : "rgba(255,255,255,0.7)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#3b82f6";
        e.currentTarget.style.color = "#3b82f6";
        e.currentTarget.style.background = darkMode ? "rgba(59,130,246,0.15)" : "rgba(239,246,255,0.9)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = darkMode ? "#475569" : "#d1d5db";
        e.currentTarget.style.color = darkMode ? "#94a3b8" : "#9ca3af";
        e.currentTarget.style.background = darkMode ? "rgba(51,65,85,0.8)" : "rgba(255,255,255,0.7)";
      }}
    >
      {children}
    </a>
  );
}

// ── Footer Nav Link ──
function FooterLink({ to, children, darkMode }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2.5 no-underline transition-all duration-200 hover:translate-x-1.5"
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: "15px",
        color: darkMode ? "#cbd5e1" : "#64748b",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; }}
      onMouseLeave={e => { e.currentTarget.style.color = darkMode ? "#cbd5e1" : "#64748b"; }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200"
        style={{ background: darkMode ? "#64748b" : "#cbd5e1" }}
      />
      {children}
    </Link>
  );
}

// ── Contact Row ──
function ContactRow({ icon, text, darkMode }) {
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-default transition-all duration-200"
      style={{
        background: darkMode ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.6)",
        border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = darkMode ? "rgba(59,130,246,0.12)" : "rgba(239,246,255,0.9)";
        e.currentTarget.style.border = `1px solid ${darkMode ? "#3b82f6" : "#bfdbfe"}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = darkMode ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.6)";
        e.currentTarget.style.border = `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`;
      }}
    >
      <span
        className="flex-shrink-0 flex transition-colors duration-200"
        style={{ color: darkMode ? "#94a3b8" : "#9ca3af" }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "14px",
          color: darkMode ? "#e2e8f0" : "#64748b",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ── Section Heading ──
function SectionHeading({ title, darkMode }) {
  return (
    <div className="mb-5">
      <h3
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          margin: "0 0 10px 0",
          // Force color — overrides DaisyUI/Tailwind base h3 styles completely
          color: darkMode ? "#f1f5f9" : "#0f172a",
        }}
      >
        {title}
      </h3>
      <div
        className="w-9 h-0.5 rounded-full"
        style={{ background: "linear-gradient(to right, #3B6CF4, #7C3AED)" }}
      />
    </div>
  );
}

// ── Footer ──
export default function FooterComponent() {
  const { darkMode } = useDarkMode();

  const forClients = [
    { label: "Home", path: "/" },
    { label: "Find Work",     path: "/findwork" },
    { label: "Find Freelancers",    path: "/findfreelan" },
    { label: "About Us",   path: "/about" },
  ];

  const forFreelancers = [
    { label: "Find Work",      path: "/findwork" },
    { label: "Create Account", path: "/register" },
  ];

  return (
    <footer style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── MAIN BODY ── */}
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          borderTop: `1px solid ${darkMode ? "#1e3a5f" : "#e2e8f0"}`,
          background: darkMode
            ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 35%, #111827 65%, #0d1520 100%)"
            : "linear-gradient(150deg, #f8fbff 0%, #eef4ff 45%, #e0edff 75%, #d4e6ff 100%)",
        }}
      >
        {/* Glowing blobs */}
        {darkMode ? (
          <>
            <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full pointer-events-none opacity-30"
                 style={{ background: "radial-gradient(circle, rgba(59,108,244,0.25) 0%, transparent 65%)" }} />
            <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20"
                 style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 65%)" }} />
            <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full pointer-events-none opacity-15"
                 style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)" }} />
          </>
        ) : (
          <>
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(59,108,244,0.07) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-10 left-[5%] w-64 h-64 rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)" }} />
          </>
        )}

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] pt-16 pb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-5">

            {/* ── COL 1: Brand ── */}
            <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block no-underline leading-none">
                {/* Logo: always original colors — no invert in dark mode */}
                <img
                  src={logo}
                  alt="CareerPatch"
                  className="object-contain block"
                  style={{ width: "226px", height: "69px" }}
                />
              </Link>

              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.75",
                  margin: 0,
                  maxWidth: "260px",
                  color: darkMode ? "#94a3b8" : "#64748b",
                }}
              >
                Powerful Freelance Marketplace connecting Clients &amp; Freelancers with ease.
              </p>

              <div
                className="h-px w-3/4"
                style={{
                  background: darkMode
                    ? "linear-gradient(to right, rgba(100,116,139,0.4), transparent)"
                    : "linear-gradient(to right, #cbd5e1, transparent)",
                }}
              />

              {/* Follow us */}
              <div>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#3b82f6",
                    margin: "0 0 12px 0",
                  }}
                >
                  Follow us
                </p>
                <div className="flex items-center gap-2.5">
                  <SocialIcon href="#" label="Facebook" darkMode={darkMode}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </SocialIcon>
                  <SocialIcon href="#" label="Instagram" darkMode={darkMode}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                    </svg>
                  </SocialIcon>
                  <SocialIcon href="#" label="Telegram" darkMode={darkMode}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </SocialIcon>
                </div>
              </div>
            </div>

            {/* ── COL 2: For Clients ── */}
            <div className="flex flex-col">
              <SectionHeading title="For Clients" darkMode={darkMode} />
              <div className="flex flex-col gap-3">
                {forClients.map((item) => (
                  <FooterLink key={item.path} to={item.path} darkMode={darkMode}>{item.label}</FooterLink>
                ))}
              </div>
            </div>

            {/* ── COL 3: For Freelancers ── */}
            <div className="flex flex-col">
              <SectionHeading title="For Freelancers" darkMode={darkMode} />
              <div className="flex flex-col gap-3">
                {forFreelancers.map((item) => (
                  <FooterLink key={item.path} to={item.path} darkMode={darkMode}>{item.label}</FooterLink>
                ))}
              </div>
            </div>

            {/* ── COL 4: Contact Us ── */}
            <div className="flex flex-col">
              <SectionHeading title="Contact Us" darkMode={darkMode} />
              <div className="flex flex-col gap-2.5">
                <ContactRow darkMode={darkMode} text="Kenya"
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                />
                <ContactRow darkMode={darkMode} text="+25470000000"
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.95-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/></svg>}
                />
                <ContactRow darkMode={darkMode} text="bluelance@gmail.com"
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mt-14 h-px"
            style={{
              background: darkMode
                ? "linear-gradient(to right, transparent, rgba(100,116,139,0.3) 20%, rgba(100,116,139,0.3) 80%, transparent)"
                : "linear-gradient(to right, transparent, #cbd5e1 20%, #cbd5e1 80%, transparent)",
            }}
          />
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 40%, #3B6CF4 60%, #7C3AED 100%)" }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="m-0 text-center sm:text-left"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.75)" }}
          >
            CareerPatch 2026. All right reserved
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="no-underline transition-colors duration-200"
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
