import { useContext } from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import logoDark from "../../assets/logodark.jpg";
import { DarkModeContext } from "../navbar/NavbarComponent";

if (!document.head.querySelector('link[href*="Poppins"]')) {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/istad.co",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1877F2" />
        <path
          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@istad7665",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <polygon points="10,9 16,12 10,15" fill="white" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@istad369",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#000000" />
        <path d="M14 3v10.5a3.5 3.5 0 1 1-2-3.2V3h2z" fill="white" />
        <path d="M14 3c1.5 2.5 3.5 4 6 4v2c-2.5 0-4.5-1-6-2.5" fill="white" />
      </svg>
    ),
  },
];

function SectionHeading({ title }) {
  return (
    <div className="mb-4">
      <h3
        className="text-slate-900 dark:text-slate-100 text-[15px] font-bold m-0 mb-2"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {title}
      </h3>
      <div
        className="w-8 h-0.5 rounded-full"
        style={{ background: "linear-gradient(to right, #3B6CF4, #7C3AED)" }}
      />
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2.5 no-underline transition-all duration-200
                 hover:translate-x-1 text-slate-500 dark:text-slate-300 hover:text-blue-500"
      style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-300 dark:bg-slate-500
                       group-hover:bg-blue-500 transition-colors duration-200"
      />
      {children}
    </Link>
  );
}

export default function FooterComponent() {
  // ── Read darkMode from the same context the Navbar uses ──
  const { darkMode } = useContext(DarkModeContext);

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
  const contactInfo = [{ label: "Contact", path: "/contact" }];

  return (
    <footer style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="relative overflow-hidden transition-all duration-300 border-t border-slate-200 dark:border-[#1e3a5f] bg-[linear-gradient(150deg,#f8fbff_0%,#eef4ff_45%,#e0edff_75%,#d4e6ff_100%)] dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_35%,#111827_65%,#0d1520_100%)]">
        {/* Blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(59,108,244,0.07)_0%,transparent_70%)] dark:hidden" />
        <div className="absolute -bottom-10 left-[5%] w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_70%)] dark:hidden" />
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full pointer-events-none opacity-30 bg-[radial-gradient(circle,rgba(59,108,244,0.25)_0%,transparent_65%)] hidden dark:block" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20 bg-[radial-gradient(circle,rgba(124,58,237,0.3)_0%,transparent_65%)] hidden dark:block" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-[120px] pt-14 pb-10 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 md:gap-8 lg:gap-12">
            {/* Brand */}
            <div className="flex flex-col gap-5 md:w-[220px] lg:w-[260px] flex-shrink-0">
              <Link to="/" className="inline-block no-underline leading-none">
                <img
                  src={darkMode ? logoDark : logo}
                  alt="CareerPatch"
                  className="object-contain block transition-opacity duration-300"
                  style={{
                    width: "200px",
                    height: "61px",
                    // multiply removes white bg on light logo; normal on dark logo
                    mixBlendMode: darkMode ? "normal" : "multiply",
                  }}
                />
              </Link>

              <p
                className="text-slate-500 dark:text-slate-400 m-0"
                style={{
                  fontSize: "14px",
                  lineHeight: "1.75",
                  maxWidth: "240px",
                }}
              >
                Powerful Freelance Marketplace connecting Clients &amp;
                Freelancers with ease.
              </p>

              <div className="h-px w-3/4 bg-[linear-gradient(to_right,#cbd5e1,transparent)] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.4),transparent)]" />

              <div>
                <p
                  className="text-blue-500 m-0 mb-3"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Follow us
                </p>
                <div className="flex items-center gap-2.5">
                  {socials.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0
                                  border-gray-300 bg-white/70 dark:border-slate-600 dark:bg-slate-700/80
                                  hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-500
                                  dark:hover:bg-blue-500/15 transition-all duration-200 hover:shadow-md"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav grid:
                mobile → 2 cols: [Clients | Freelancers] / [Contact spans 2]
                md+    → 3 cols: [Clients | Freelancers | Contact]  */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
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

              <div className="flex flex-col col-span-2 md:col-span-1">
                <SectionHeading title="Contact Us" />
                <div className="flex flex-col gap-3">
                  {contactInfo.map((item) => (
                    <FooterLink key={item.path} to={item.path}>
                      {item.label}
                    </FooterLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 h-px bg-[linear-gradient(to_right,transparent,#cbd5e1_20%,#cbd5e1_80%,transparent)] dark:bg-[linear-gradient(to_right,transparent,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.3)_80%,transparent)]" />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[13px] text-slate-400 dark:text-slate-500 m-0">
              © {new Date().getFullYear()} CareerPatch. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-[13px] text-slate-400 dark:text-slate-500 no-underline
                             hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
