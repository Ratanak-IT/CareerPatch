import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation } from "react-router";
import logo from "../../assets/logo.png";

if (!document.head.querySelector('link[href*="Poppins"]')) {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

// ── Dark Mode Context ──
export const DarkModeContext = createContext({ darkMode: false, toggleDark: () => {} });
export const useDarkMode = () => useContext(DarkModeContext);

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("cp-dark-mode") === "true"; }
    catch { return false; }
  });

  const toggleDark = () => setDarkMode(p => !p);

  useEffect(() => {
    try { localStorage.setItem("cp-dark-mode", String(darkMode)); } catch {}
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.style.background = "#0f172a";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.style.background = "#ffffff";
    }
    document.documentElement.style.background = "";
    document.body.style.transition = "background 0.3s ease";
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// ── Desktop Nav Link ──
function NavItem({ to, label, active, darkMode }) {
  return (
    <Link
      to={to}
      style={{ fontFamily: "'Poppins', sans-serif", fontSize: "20px" }}
      className={[
        "px-4 py-2 rounded-lg no-underline whitespace-nowrap transition-all duration-200",
        active
          ? "font-medium text-blue-500"
          : darkMode
            ? "font-normal text-slate-300 hover:text-blue-400 hover:bg-blue-900/20"
            : "font-normal text-gray-600 hover:text-blue-500 hover:bg-blue-50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

// ── Dark Mode Icon ──
function DarkIcon({ size = 24, darkMode }) {
  return darkMode ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

// ── Main Navbar ──
export default function NavbarComponent() {
  const { darkMode, toggleDark } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/",            label: "Home" },
    { path: "/findwork",    label: "Find work" },
    { path: "/findfreelan", label: "Find Freelancers" },
    { path: "/about",       label: "About" },
  ];

  return (
    <header className={[
      "w-full border-b shadow-sm transition-colors duration-300 sticky top-0 z-50",
      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100",
    ].join(" ")}>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] flex items-center justify-between h-[89px]">

        {/* ── LOGO ── */}
        <Link to="/" className="no-underline leading-none flex-shrink-0">
          <img
            src={logo}
            alt="CareerPatch"
            className="block object-contain flex-shrink-0 !w-[160px] !h-[49px] sm:!w-[200px] sm:!h-[61px] lg:!w-[226px] lg:!h-[69px]"
            style={{ filter: "none" }}
          />
        </Link>

        {/* ── DESKTOP: nav links center ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <NavItem key={path} to={path} label={label} active={isActive(path)} darkMode={darkMode} />
          ))}
        </nav>

        {/* ── DESKTOP: dark toggle + Login + Sign in ── */}
        <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="w-7 h-7 flex items-center justify-center text-blue-500 bg-transparent border-0 cursor-pointer hover:opacity-75 transition-opacity"
          >
            <DarkIcon size={27} darkMode={darkMode} />
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "20px", fontWeight: 600, borderRadius: "15px", padding: "8px 20px" }}
              className="border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 no-underline inline-flex items-center whitespace-nowrap transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "20px", fontWeight: 600, borderRadius: "15px", padding: "8px 20px" }}
              className="bg-blue-500 hover:bg-blue-600 text-white no-underline inline-flex items-center whitespace-nowrap transition-colors duration-200 shadow-sm"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* ── MOBILE: only dark toggle + hamburger outside ── */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center text-blue-500 bg-transparent border-0 cursor-pointer"
          >
            <DarkIcon size={22} darkMode={darkMode} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className={[
              "w-10 h-10 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer transition-colors duration-200",
              darkMode ? "text-slate-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="15" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN: nav links + Login + Sign in inside ── */}
      {mobileOpen && (
        <div className={[
          "lg:hidden border-t transition-colors duration-300",
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100",
        ].join(" ")}>

          {/* Nav links */}
          <nav className="flex flex-col px-4 sm:px-8 py-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "17px" }}
                className={[
                  "py-3 no-underline transition-colors duration-200 border-b",
                  darkMode ? "border-slate-800" : "border-gray-100",
                  isActive(path)
                    ? "font-medium text-blue-500"
                    : darkMode ? "text-slate-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-500",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Login + Sign in — inside dropdown only */}
          <div className="flex gap-3 px-4 sm:px-8 py-4">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px", fontWeight: 600, borderRadius: "12px" }}
              className="flex-1 text-center py-2.5 border-2 border-blue-500 text-blue-500 bg-transparent no-underline hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px", fontWeight: 600, borderRadius: "12px" }}
              className="flex-1 text-center py-2.5 bg-blue-500 hover:bg-blue-600 text-white no-underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
