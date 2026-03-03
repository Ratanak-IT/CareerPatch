import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import logo from "../../assets/logo.png";
import defaultProfileImg from "../../assets/userdefault.png";

import senghourImg from "../../assets/seanghour.png";
import nakkhImg from "../../assets/ratanalkkh.png";
import sokkhim from "../../assets/khim.png";
import pong from "../../assets/chhor pong.png";

import {
  logout as logoutAction,
  selectAuthUser,
} from "../../features/auth/authSlice";

/* ── Desktop Nav Link ── */
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

/* ── Dark Mode Icon ── */
function DarkIcon({ size = 24, darkMode }) {
  return darkMode ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ── Notifications sample ── */
const NOTIFICATIONS = [
  {
    id: 1,
    image: pong,
    title: "New project proposal",
    desc: "Ali Hassan sent you a proposal",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    image: sokkhim,
    title: "Contract signed",
    desc: "Your contract with Nova Studio is live",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    image: nakkhImg,
    title: "New review received",
    desc: "You received a 5-star rating",
    time: "3h ago",
    read: true,
  },
  {
    id: 4,
    image: senghourImg,
    title: "Payment received",
    desc: "$320 has been added to your wallet",
    time: "1d ago",
    read: true,
  },
];

export default function NavbarAfterLogin() {
  // ✅ DARK MODE (NO CONTEXT)
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // init from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("theme"); // "dark" | "light" | null
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      // no saved -> keep current html class (or follow system if you want)
      setDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/findwork", label: "Find work" },
    { path: "/findfreelan", label: "Find Freelancers" },
    { path: "/about", label: "About" },
  ];

  const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    zIndex: 999,
    borderRadius: "16px",
    boxShadow: darkMode
      ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)"
      : "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
    background: darkMode ? "#1e293b" : "#ffffff",
    overflow: "hidden",
  };

  // --- Dynamic user fields (safe fallback) ---
  const displayName = useMemo(() => {
    if (!user) return "User";
    return (
      user.fullName ||
      user.name ||
      user.username ||
      user.email?.split("@")?.[0] ||
      "User"
    );
  }, [user]);

  const displayRole = useMemo(() => {
    if (!user) return "Member";
    const raw = user.userType || user.role || user.accountType || user.type || "Member";
    const v = String(raw).toUpperCase();
    if (v.includes("FREELANCER")) return "Freelancer";
    if (v.includes("BUSINESS")) return "Business Owner";
    return String(raw);
  }, [user]);

  // ✅ Profile image normalize (relative url fix)
  const profileSrc = useMemo(() => {
    const url = user?.profileImageUrl;
    if (url && typeof url === "string") return url;
    return defaultProfileImg;
  }, [user]);

  const onLogout = () => {
    dispatch(logoutAction());
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="w-full border-b shadow-sm transition-colors duration-300 sticky top-0 z-100"
      style={{
        background: darkMode ? "#0f172a" : "#ffffff",
        borderColor: darkMode ? "#1e293b" : "#f1f5f9",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] flex items-center justify-between h-[89px]">
        {/* LOGO */}
        <Link to="/" className="no-underline leading-none flex-shrink-0">
          <img
            src={logo}
            alt="CareerPatch"
            className="block object-contain flex-shrink-0 w-[140px] h-[43px] sm:w-[180px] sm:h-[55px] lg:w-[226px] lg:h-[69px]"
            style={{ filter: "none" }}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <NavItem
              key={path}
              to={path}
              label={label}
              active={isActive(path)}
              darkMode={darkMode}
            />
          ))}
        </nav>

        {/* RIGHT ACTIONS (desktop) */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full border-0 bg-transparent cursor-pointer transition-all duration-200 hover:opacity-75"
            style={{ color: "#3b82f6" }}
          >
            <DarkIcon size={24} darkMode={darkMode} />
          </button>

          {/* NOTIFICATION */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setNotifOpen((o) => !o);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full border-0 bg-transparent cursor-pointer transition-all duration-200 hover:opacity-75"
              style={{ color: "#3b82f6", position: "relative" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold"
                  style={{
                    width: "18px",
                    height: "18px",
                    fontSize: "11px",
                    background: "#ef4444",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div style={{ ...dropdownStyle, width: "360px" }}>
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    borderBottom: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: darkMode ? "#f1f5f9" : "#0f172a",
                    }}
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span
                        className="ml-2 px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                        style={{ background: "#3b82f6", fontFamily: "'Poppins', sans-serif" }}
                      >
                        {unreadCount} new
                      </span>
                    )}
                  </span>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all duration-150"
                      style={{
                        background: n.read
                          ? "transparent"
                          : darkMode
                          ? "rgba(59,130,246,0.08)"
                          : "rgba(239,246,255,0.8)",
                        borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f8fafc"}`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = darkMode
                          ? "rgba(255,255,255,0.04)"
                          : "#f8fafc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = n.read
                          ? "transparent"
                          : darkMode
                          ? "rgba(59,130,246,0.08)"
                          : "rgba(239,246,255,0.8)")
                      }
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
                        )
                      }
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden">
                        <img src={n.image} alt="avatar" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "13.5px",
                            fontWeight: n.read ? 400 : 600,
                            color: darkMode ? "#e2e8f0" : "#0f172a",
                            margin: "0 0 2px 0",
                          }}
                        >
                          {n.title}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "12px",
                            color: darkMode ? "#94a3b8" : "#64748b",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {n.desc}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "11px",
                            color: "#3b82f6",
                            margin: 0,
                          }}
                        >
                          {n.time}
                        </p>
                      </div>

                      {!n.read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: "#3b82f6" }} />
                      )}
                    </div>
                  ))}
                </div>

                <div
                  className="px-5 py-3 text-center"
                  style={{ borderTop: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}` }}
                >
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "13px",
                      color: "#3b82f6",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setProfileOpen((o) => !o);
                setNotifOpen(false);
              }}
              aria-label="Profile menu"
              className="flex items-center gap-2 rounded-full border-0 bg-transparent cursor-pointer p-0 transition-all duration-200"
              style={{ outline: "none" }}
            >
              <img
                src={profileSrc}
                alt="Profile"
                className="object-cover rounded-full flex-shrink-0"
                style={{
                  width: "42px",
                  height: "42px",
                  border: `2.5px solid #3b82f6`,
                  boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
                  transition: "box-shadow 0.2s ease",
                }}
                onError={(e) => (e.currentTarget.src = defaultProfileImg)}
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={darkMode ? "#94a3b8" : "#64748b"}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transition: "transform 0.2s ease",
                  transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {profileOpen && (
              <div style={{ ...dropdownStyle, width: "240px" }}>
                {/* User header */}
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  style={{ borderBottom: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}` }}
                >
                  <img
                    src={profileSrc}
                    alt="Profile"
                    className="rounded-full object-cover flex-shrink-0"
                    style={{ width: "40px", height: "40px", border: "2px solid #3b82f6" }}
                    onError={(e) => {
                      e.currentTarget.src = defaultProfileImg;
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: darkMode ? "#f1f5f9" : "#0f172a",
                        margin: 0,
                      }}
                    >
                      {displayName}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        color: darkMode ? "#64748b" : "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {displayRole}
                    </p>
                  </div>
                </div>

                {/* ONLY profile menu */}
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 no-underline transition-all duration-150"
                  style={{ color: darkMode ? "#cbd5e1" : "#374151" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc";
                    e.currentTarget.style.color = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = darkMode ? "#cbd5e1" : "#374151";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>👤</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                    My Profile
                  </span>
                </Link>

                {/* Logout */}
                <div
                  style={{
                    borderTop: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`,
                    padding: "8px 0",
                  }}
                >
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 border-0 bg-transparent cursor-pointer transition-all duration-150 text-left"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = darkMode
                        ? "rgba(239,68,68,0.08)"
                        : "rgba(254,242,242,0.8)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: "16px" }}>🚪</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                      Log out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE: dark + notif + profile + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center text-blue-500 bg-transparent border-0 cursor-pointer"
          >
            <DarkIcon size={20} darkMode={darkMode} />
          </button>

          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer relative"
            style={{ color: "#3b82f6" }}
            aria-label="Notifications"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
            )}
          </button>

          <button
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="bg-transparent border-0 cursor-pointer p-0"
            aria-label="Profile"
          >
            <img
              src={profileSrc}
              alt="Profile"
              className="object-cover rounded-full"
              style={{ width: "34px", height: "34px", border: "2px solid #3b82f6" }}
              onError={(e) => {
                e.currentTarget.src = defaultProfileImg;
              }}
            />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={[
              "w-10 h-10 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer transition-colors duration-200",
              darkMode ? "text-slate-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t transition-colors duration-300"
          style={{
            background: darkMode ? "#0f172a" : "#ffffff",
            borderColor: darkMode ? "#1e293b" : "#f1f5f9",
          }}
        >
          <nav className="flex flex-col px-4 sm:px-8 py-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "17px",
                  color: isActive(path) ? "#3b82f6" : darkMode ? "#cbd5e1" : "#4b5563",
                  fontWeight: isActive(path) ? 600 : 400,
                }}
                className="py-3 no-underline transition-colors duration-200 border-b"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile user info */}
          <div
            className="flex items-center gap-3 px-4 sm:px-8 py-4"
            style={{ borderTop: `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}` }}
          >
            <img
              src={profileSrc}
              alt="Profile"
              className="rounded-full object-cover flex-shrink-0"
              style={{ width: "44px", height: "44px", border: "2px solid #3b82f6" }}
              onError={(e) => {
                e.currentTarget.src = defaultProfileImg;
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: darkMode ? "#f1f5f9" : "#0f172a",
                  margin: 0,
                }}
              >
                {displayName}
              </p>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  color: "#3b82f6",
                  margin: 0,
                }}
              >
                {displayRole}
              </p>
            </div>

            <button
              onClick={() => {
                setMobileOpen(false);
                onLogout();
              }}
              style={{
                marginLeft: "auto",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}