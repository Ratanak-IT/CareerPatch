// src/components/navbar/NavbarAfterLogin.jsx
// ✅ FIXED: Uses shared DarkModeContext — dark mode toggle now works correctly
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import logo            from "../../assets/logo.png";
import defaultProfile  from "../../assets/userdefault.png";
import senghourImg     from "../../assets/seanghour.png";
import nakkhImg        from "../../assets/ratanalkkh.png";
import sokkhim         from "../../assets/khim.png";
import pong            from "../../assets/chhor pong.png";

import { logout as logoutAction, selectAuthUser } from "../../features/auth/authSlice";

// ✅ CRITICAL FIX: import from context — not manage own state
import { useDarkMode } from "./NavbarComponent";

/* ─── Sub-components ────────────────────────────────────────────────────── */
function DarkIcon({ size = 22, darkMode }) {
  return darkMode ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function NavLink({ to, label, active, darkMode, onClick }) {
  return (
    <Link to={to} onClick={onClick}
      style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px" }}
      className={[
        "px-4 py-2 rounded-lg no-underline whitespace-nowrap transition-all duration-200",
        active
          ? "font-semibold text-blue-500"
          : darkMode
            ? "text-slate-300 hover:text-blue-400 hover:bg-blue-900/20"
            : "text-gray-600 hover:text-blue-500 hover:bg-blue-50",
      ].join(" ")}>
      {label}
    </Link>
  );
}

const NOTIFICATIONS = [
  { id: 1, image: pong,        title: "New project proposal", desc: "Ali Hassan sent you a proposal",         time: "2m ago",  read: false },
  { id: 2, image: sokkhim,     title: "Contract signed",       desc: "Your contract with Nova Studio is live", time: "1h ago",  read: false },
  { id: 3, image: nakkhImg,    title: "New review received",   desc: "You received a 5-star rating",           time: "3h ago",  read: true  },
  { id: 4, image: senghourImg, title: "Payment received",      desc: "$320 added to your wallet",              time: "1d ago",  read: true  },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function NavbarAfterLogin() {
  // ✅ Single source of truth for dark mode — fixes the bug
  const { darkMode, toggleDark } = useDarkMode();

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useSelector(selectAuthUser);

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const isActive     = (p) => location.pathname === p;
  const unreadCount  = notifications.filter((n) => !n.read).length;
  const markAllRead  = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setNotifOpen(false); }, [location.pathname]);

  const navLinks = [
    { path: "/",            label: "Home" },
    { path: "/findwork",    label: "Find work" },
    { path: "/findfreelan", label: "Find Freelancers" },
    { path: "/about",       label: "About" },
  ];

  const displayName = useMemo(() => {
    if (!user) return "User";
    return user.fullName || user.name || user.username || user.email?.split("@")?.[0] || "User";
  }, [user]);

  const displayRole = useMemo(() => {
    if (!user) return "Member";
    const v = String(user.userType || user.role || "Member").toUpperCase();
    if (v.includes("FREELANCER")) return "Freelancer";
    if (v.includes("BUSINESS"))   return "Business Owner";
    return "Member";
  }, [user]);

  const profileSrc = useMemo(() => {
    const url = user?.profileImageUrl;
    return url && typeof url === "string" ? url : defaultProfile;
  }, [user]);

  const onLogout = () => {
    dispatch(logoutAction());
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  /* theme vars */
  const bg  = darkMode ? "#0f172a" : "#ffffff";
  const bdr = darkMode ? "#1e293b" : "#f1f5f9";
  const txt = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";

  const dropStyle = (w) => ({
    position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 1000,
    width: w, borderRadius: "16px", background: darkMode ? "#1e293b" : "#fff",
    boxShadow: darkMode
      ? "0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.06)"
      : "0 20px 60px rgba(0,0,0,0.12),0 0 0 1px rgba(0,0,0,0.06)",
    overflow: "hidden",
  });

  const pFont = (sz, w=400) => ({
    fontFamily: "'Poppins', sans-serif", fontSize: sz, fontWeight: w, margin: 0,
  });

  /* ─── Render ────────────────────────────────────────────────────────────── */
  return (
    <header className="w-full border-b shadow-sm sticky top-0 z-50 transition-colors duration-300"
      style={{ background: bg, borderColor: bdr }}>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] flex items-center justify-between h-[72px] sm:h-[80px] lg:h-[89px]">

        {/* LOGO */}
        <Link to="/" className="no-underline leading-none flex-shrink-0">
          <img src={logo} alt="CareerPatch" style={{ filter: "none" }}
            className="block object-contain w-[130px] sm:w-[170px] lg:w-[210px]" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <NavLink key={path} to={path} label={label} active={isActive(path)} darkMode={darkMode} />
          ))}
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

          {/* Dark toggle */}
          <button onClick={toggleDark} aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full border-0 bg-transparent cursor-pointer hover:opacity-75 transition-opacity"
            style={{ color: "#3b82f6" }}>
            <DarkIcon size={22} darkMode={darkMode} />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full border-0 bg-transparent cursor-pointer hover:opacity-75 relative"
              style={{ color: "#3b82f6" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white"
                  style={{ width: 18, height: 18, fontSize: 10, fontWeight: 700, background: "#ef4444" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div style={dropStyle("340px")}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: `1px solid ${bdr}` }}>
                  <span style={{ ...pFont("14px", 600), color: txt }}>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-white"
                        style={{ fontSize: 11, fontWeight: 600, background: "#3b82f6" }}>
                        {unreadCount} new
                      </span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      style={{ ...pFont("12px", 500), color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>
                      Mark all read
                    </button>
                  )}
                </div>
                {/* List */}
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {notifications.map((n) => (
                    <div key={n.id}
                      className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors"
                      style={{
                        background: n.read ? "transparent" : darkMode ? "rgba(59,130,246,0.08)" : "rgba(239,246,255,0.8)",
                        borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f8fafc"}`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.04)" : "#f8fafc")}
                      onMouseLeave={e => (e.currentTarget.style.background = n.read ? "transparent" : darkMode ? "rgba(59,130,246,0.08)" : "rgba(239,246,255,0.8)")}
                      onClick={() => setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                      <img src={n.image} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p style={{ ...pFont("13px", n.read ? 400 : 600), color: darkMode ? "#e2e8f0" : "#0f172a", marginBottom: 2 }}>{n.title}</p>
                        <p style={{ ...pFont("11px"), color: sub, marginBottom: 3 }}>{n.desc}</p>
                        <p style={{ ...pFont("11px"), color: "#3b82f6" }}>{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: "#3b82f6" }} />}
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 text-center" style={{ borderTop: `1px solid ${bdr}` }}>
                  <Link to="/notifications" onClick={() => setNotifOpen(false)}
                    style={{ ...pFont("13px", 500), color: "#3b82f6", textDecoration: "none" }}>
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div ref={profileRef} className="relative">
            <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
              aria-label="Profile menu"
              className="flex items-center gap-2 border-0 bg-transparent cursor-pointer p-0">
              <img src={profileSrc} alt="Profile" className="rounded-full object-cover flex-shrink-0"
                style={{ width: 40, height: 40, border: "2.5px solid #3b82f6", boxShadow: "0 0 0 3px rgba(59,130,246,0.15)" }}
                onError={e => (e.currentTarget.src = defaultProfile)} />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={sub} strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {profileOpen && (
              <div style={dropStyle("230px")}>
                {/* User info */}
                <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${bdr}` }}>
                  <img src={profileSrc} alt="" className="rounded-full object-cover flex-shrink-0"
                    style={{ width: 38, height: 38, border: "2px solid #3b82f6" }}
                    onError={e => (e.currentTarget.src = defaultProfile)} />
                  <div>
                    <p style={{ ...pFont("14px", 600), color: txt }}>{displayName}</p>
                    <p style={{ ...pFont("12px"), color: sub }}>{displayRole}</p>
                  </div>
                </div>
                {/* My Profile */}
                <Link to="/profile" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 no-underline transition-colors"
                  style={{ color: darkMode ? "#cbd5e1" : "#374151" }}
                  onMouseEnter={e => { e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc"; e.currentTarget.style.color = "#3b82f6"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = darkMode ? "#cbd5e1" : "#374151"; }}>
                  <span>👤</span>
                  <span style={pFont("14px", 500)}>My Profile</span>
                </Link>
                {/* Logout */}
                <div style={{ borderTop: `1px solid ${bdr}`, padding: "6px 0" }}>
                  <button onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-5 py-3 border-0 bg-transparent cursor-pointer text-left transition-colors"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={e => (e.currentTarget.style.background = darkMode ? "rgba(239,68,68,0.08)" : "#fff5f5")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <span>🚪</span>
                    <span style={pFont("14px", 500)}>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MOBILE HEADER ROW ─────────────────────────────────────────── */}
        <div className="lg:hidden flex items-center gap-1">
          {/* Dark toggle */}
          <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center text-blue-500 bg-transparent border-0 cursor-pointer">
            <DarkIcon size={20} darkMode={darkMode} />
          </button>

          {/* Notification bell */}
          <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); setMobileOpen(false); }}
            className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer relative"
            style={{ color: "#3b82f6" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
            )}
          </button>

          {/* ✅ Profile avatar → navigate directly to /profile on mobile tap */}
          <button onClick={() => navigate("/profile")}
            className="bg-transparent border-0 cursor-pointer p-0 flex items-center"
            aria-label="My profile">
            <img src={profileSrc} alt="Profile" className="rounded-full object-cover"
              style={{ width: 34, height: 34, border: "2px solid #3b82f6" }}
              onError={e => (e.currentTarget.src = defaultProfile)} />
          </button>

          {/* Hamburger */}
          <button onClick={() => { setMobileOpen(o => !o); setNotifOpen(false); }}
            className={[
              "w-10 h-10 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer transition-colors",
              darkMode ? "text-slate-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}>
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

      {/* ── MOBILE NOTIFICATION PANEL ────────────────────────────────────── */}
      {notifOpen && (
        <div className="lg:hidden absolute left-3 right-3 z-50 rounded-2xl overflow-hidden shadow-2xl"
          style={{ top: "calc(100% + 6px)", background: darkMode ? "#1e293b" : "#fff", border: `1px solid ${bdr}` }}>
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${bdr}` }}>
            <span style={{ ...pFont("14px", 600), color: txt }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                style={{ ...pFont("12px", 500), color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {notifications.map((n) => (
              <div key={n.id}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                style={{
                  background: n.read ? "transparent" : darkMode ? "rgba(59,130,246,0.08)" : "rgba(239,246,255,0.8)",
                  borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f8fafc"}`,
                }}
                onClick={() => { setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x)); setNotifOpen(false); }}>
                <img src={n.image} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p style={{ ...pFont("13px", n.read ? 400 : 600), color: darkMode ? "#e2e8f0" : "#0f172a", marginBottom: 2 }}>{n.title}</p>
                  <p style={{ ...pFont("11px"), color: sub }}>{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MOBILE NAV MENU ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t" style={{ background: bg, borderColor: bdr }}>
          <nav className="flex flex-col px-4 sm:px-8 py-2">
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: "16px",
                  color: isActive(path) ? "#3b82f6" : darkMode ? "#cbd5e1" : "#4b5563",
                  fontWeight: isActive(path) ? 600 : 400,
                  borderBottom: `1px solid ${bdr}`,
                  padding: "12px 0",
                  textDecoration: "none",
                  display: "block",
                  transition: "color 0.2s",
                }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* User info row */}
          <div className="flex items-center gap-3 px-4 sm:px-8 py-4"
            style={{ borderTop: `1px solid ${bdr}` }}>
            <img src={profileSrc} alt="Profile" className="rounded-full object-cover flex-shrink-0"
              style={{ width: 42, height: 42, border: "2px solid #3b82f6" }}
              onError={e => (e.currentTarget.src = defaultProfile)} />
            <div className="flex-1 min-w-0">
              <p style={{ ...pFont("14px", 600), color: txt }} className="truncate">{displayName}</p>
              <p style={{ ...pFont("12px"), color: "#3b82f6" }}>{displayRole}</p>
            </div>
            <Link to="/profile" onClick={() => setMobileOpen(false)}
              style={{ ...pFont("12px", 600), color: "#3b82f6", textDecoration: "none",
                padding: "5px 12px", border: "1px solid #3b82f6", borderRadius: 8, whiteSpace: "nowrap" }}>
              Profile
            </Link>
            <button onClick={() => { setMobileOpen(false); onLogout(); }}
              style={{ ...pFont("12px", 600), color: "#ef4444", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
