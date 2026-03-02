import React from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.png";

/* Load Poppins once */
if (!document.head.querySelector('link[href*="Poppins"]')) {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

// ── Social Icon ──
function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={[
        "w-10 h-10 rounded-full flex items-center justify-center no-underline flex-shrink-0 border-2",
        "transition-all duration-200 hover:shadow-md",
        // base
        "border-gray-300 text-gray-400 bg-white/70",
        // dark
        "dark:border-slate-600 dark:text-slate-400 dark:bg-slate-700/80",
        // hover
        "hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/90",
        "dark:hover:border-blue-500 dark:hover:text-blue-500 dark:hover:bg-blue-500/15",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

// ── Footer Nav Link ──
function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className={[
        "group flex items-center gap-2.5 no-underline",
        "transition-all duration-200 hover:translate-x-1.5",
        "text-slate-500 dark:text-slate-300",
        "hover:text-blue-500",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px" }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-300 dark:bg-slate-500 transition-colors duration-200" />
      {children}
    </Link>
  );
}

// ── Contact Row ──
function ContactRow({ icon, text }) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-default",
        "transition-all duration-200",
        // base
        "bg-white/60 border border-slate-200",
        // dark
        "dark:bg-slate-800/90 dark:border-slate-700",
        // hover
        "hover:bg-blue-50/90 hover:border-blue-200",
        "dark:hover:bg-blue-500/12 dark:hover:border-blue-500",
      ].join(" ")}
    >
      <span className="flex-shrink-0 flex text-gray-400 dark:text-slate-400 transition-colors duration-200">
        {icon}
      </span>
      <span
        className="text-slate-500 dark:text-slate-200"
        style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}
      >
        {text}
      </span>
    </div>
  );
}

// ── Section Heading ──
function SectionHeading({ title }) {
  return (
    <div className="mb-5">
      <h3
        className="text-slate-900 dark:text-slate-100"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          margin: "0 0 10px 0",
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
  const forClients = [
    { label: "Home", path: "/" },
    { label: "Find Work", path: "/findwork" },
    { label: "Find Freelancers", path: "/findfreelan" },
    { label: "About Us", path: "/about" },
  ];

  const forFreelancers = [
    { label: "Find Work", path: "/findwork" },
    { label: "Create Account", path: "/register" },
  ];

  return (
    <footer style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── MAIN BODY ── */}
      <div
        className={[
          "relative overflow-hidden transition-all duration-300",
          "border-t border-slate-200",
          "dark:border-[#1e3a5f]",
          // light gradient
          "bg-[linear-gradient(150deg,#f8fbff_0%,#eef4ff_45%,#e0edff_75%,#d4e6ff_100%)]",
          // dark gradient
          "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_35%,#111827_65%,#0d1520_100%)]",
        ].join(" ")}
      >
        {/* Glowing blobs (LIGHT) */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(59,108,244,0.07)_0%,transparent_70%)] dark:hidden" />
        <div className="absolute -bottom-10 left-[5%] w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_70%)] dark:hidden" />

        {/* Glowing blobs (DARK) */}
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full pointer-events-none opacity-30 bg-[radial-gradient(circle,rgba(59,108,244,0.25)_0%,transparent_65%)] hidden dark:block" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20 bg-[radial-gradient(circle,rgba(124,58,237,0.3)_0%,transparent_65%)] hidden dark:block" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full pointer-events-none opacity-15 bg-[radial-gradient(circle,rgba(59,130,246,0.35)_0%,transparent_70%)] hidden dark:block" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] pt-16 pb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-5">
            {/* ── COL 1: Brand ── */}
            <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block no-underline leading-none">
                <img
                  src={logo}
                  alt="CareerPatch"
                  className="object-contain block"
                  style={{ width: "226px", height: "69px" }}
                />
              </Link>

              <p
                className="text-slate-500 dark:text-slate-400"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.75",
                  margin: 0,
                  maxWidth: "260px",
                }}
              >
                Powerful Freelance Marketplace connecting Clients &amp;
                Freelancers with ease.
              </p>

              <div className="h-px w-3/4 bg-[linear-gradient(to_right,#cbd5e1,transparent)] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.4),transparent)]" />

              {/* Follow us */}
              <div>
                <p
                  className="text-blue-500"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 12px 0",
                  }}
                >
                  Follow us
                </p>

                <div className="flex items-center gap-2.5">
                  <SocialIcon href="#" label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </SocialIcon>

                  <SocialIcon href="#" label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </SocialIcon>

                  <SocialIcon href="#" label="Telegram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </SocialIcon>
                </div>
              </div>
            </div>

            {/* ── COL 2: For Clients ── */}
            <div className="flex flex-col">
              <SectionHeading title="For Clients" />
              <div className="flex flex-col gap-3">
                {forClients.map((item) => (
                  <FooterLink key={item.path} to={item.path}>
                    {item.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* ── COL 3: For Freelancers ── */}
            <div className="flex flex-col">
              <SectionHeading title="For Freelancers" />
              <div className="flex flex-col gap-3">
                {forFreelancers.map((item) => (
                  <FooterLink key={item.path} to={item.path}>
                    {item.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* ── COL 4: Contact Us ── */}
            <div className="flex flex-col">
              <SectionHeading title="Contact Us" />
              <div className="flex flex-col gap-2.5">
                <ContactRow
                  text="Kenya"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                />
                <ContactRow
                  text="+25470000000"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.95-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
                    </svg>
                  }
                />
                <ContactRow
                  text="bluelance@gmail.com"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-14 h-px bg-[linear-gradient(to_right,transparent,#cbd5e1_20%,#cbd5e1_80%,transparent)] dark:bg-[linear-gradient(to_right,transparent,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.3)_80%,transparent)]" />
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="bg-[linear-gradient(90deg,#1e3a8a_0%,#2563eb_40%,#3B6CF4_60%,#7C3AED_100%)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="m-0 text-center sm:text-left text-[13.5px] text-white/75"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            CareerPatch 2026. All right reserved
          </p>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="no-underline transition-colors duration-200 text-[13px] text-white/60 hover:text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
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