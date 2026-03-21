import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import logo        from "../../assets/logo.png";
import logoDark    from "../../assets/logodark.jpg";
import defaultProfile from "../../assets/userdefault.png";

import { logout as logoutAction, selectAuthUser } from "../../features/auth/authSlice";
import { useDarkMode } from "./NavbarComponent";
import { useMessageNotifications } from "../../hooks/useMessageNotifications";

// ── API imports for cache reset on logout ────────────────────────────────────
import { authApi }         from "../../services/authApi";
import { freelancerApi }   from "../../services/freelancerApi";
import { userApi }         from "../../services/userApi";
import { freelancerPostApi } from "../../services/freelancerPostApi";
import { profileApi }      from "../../services/profileApi";
import { serviceApi }      from "../../services/servicesApi";
import { categoriesApi }   from "../../services/categoriesApi";
import { apiSlice }        from "../../services/apiSlice";
import { detailworkApi }   from "../../services/detailworkApi";
import { jobsApi }         from "../../services/JobsApi";

/* ─── Dark mode icon ─────────────────────────────────────────────────────── */
function DarkIcon({ darkMode }) {
  return darkMode ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ─── useIsDark — watches <html class="dark"> ────────────────────────────── */
function useIsDark() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ─── NavLink ────────────────────────────────────────────────────────────── */
function NavLink({ to, label, active, onClick }) {
  return (
    <Link to={to} onClick={onClick}
      style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px" }}
      className={`px-4 py-2 rounded-lg no-underline whitespace-nowrap transition-all duration-200
        ${active
          ? "font-semibold text-blue-500"
          : "text-gray-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}>
      {label}
    </Link>
  );
}

/* ─── timeAgoShort ───────────────────────────────────────────────────────── */
function timeAgoShort(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

/* ─── Bell icon ──────────────────────────────────────────────────────────── */
const BellIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════ */
export default function NavbarAfterLogin() {
  const { darkMode, toggleDark } = useDarkMode();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useSelector(selectAuthUser);
  const isDark    = useIsDark();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const myId = user?.id || user?.userId || null;
  const { notifications, unreadCount, markRead, markAllRead } =
    useMessageNotifications(myId);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  const isActive   = (p) => location.pathname === p;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/",           label: "Home"            },
    { path: "/findwork",   label: "Find work"       },
    { path: "/findfreelan",label: "Find Freelancers"},
    { path: "/about",      label: "About"           },
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

  // ── ✅ Logout — reset ALL RTK Query caches so next user gets fresh data ──
  const onLogout = () => {
    dispatch(authApi.util.resetApiState());
    dispatch(freelancerApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
    dispatch(freelancerPostApi.util.resetApiState());
    dispatch(profileApi.util.resetApiState());
    dispatch(serviceApi.util.resetApiState());
    dispatch(categoriesApi.util.resetApiState());
    dispatch(apiSlice.util.resetApiState());
    dispatch(detailworkApi.util.resetApiState());
    dispatch(jobsApi.util.resetApiState());
    dispatch(logoutAction());
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  return (
    <header className="w-full border-b shadow-sm sticky top-0 z-50 transition-colors duration-300
                       bg-white dark:bg-[#0f172a] border-slate-100 dark:border-[#1e293b]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px]
                      flex items-center justify-between h-[72px] sm:h-[80px] lg:h-[89px]">

        {/* ── LOGO ── */}
        <Link to="/" className="no-underline leading-none shrink-0">
          <img src={isDark ? logoDark : logo} alt="CareerPatch"
            className="block object-contain w-[130px] sm:w-[170px] lg:w-[210px]" />
        </Link>

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <NavLink key={path} to={path} label={label} active={isActive(path)} />
          ))}
        </nav>

        {/* ── DESKTOP RIGHT ── */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          {/* Dark toggle */}
          <button onClick={toggleDark} aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-transparent border-0 cursor-pointer text-blue-500 hover:opacity-75 transition-opacity">
            <DarkIcon darkMode={darkMode} />
          </button>

          {/* ── Notifications ── */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full
                         bg-transparent border-0 cursor-pointer text-blue-500 hover:opacity-75 relative">
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full
                                 bg-red-500 text-white text-[10px] font-bold
                                 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 z-[1000] w-[340px]
                             rounded-2xl overflow-hidden
                             bg-white dark:bg-[#1e293b]
                             shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)]
                             dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4
                               border-b border-slate-100 dark:border-[#1e293b]">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-white text-[11px] font-semibold bg-blue-500">
                        {unreadCount} new
                      </span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className="text-xs text-blue-500 bg-transparent border-0 cursor-pointer"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-xs text-slate-400 dark:text-slate-500"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>No new messages</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id}
                        className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors
                                   bg-blue-50/80 dark:bg-blue-500/[0.08]
                                   hover:bg-slate-50 dark:hover:bg-white/[0.04]
                                   border-b border-slate-50 dark:border-[#1e293b]"
                        onClick={() => { markRead(n.id); setNotifOpen(false); navigate("/chat", { state: { openConvId: n.convId } }); }}>
                        {n.senderAvatar ? (
                          <img src={n.senderAvatar} alt=""
                            className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center
                                          text-white text-xs font-bold
                                          bg-gradient-to-br from-blue-500 to-indigo-500">
                            {n.senderName?.slice(0, 1)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 mb-0.5 truncate"
                            style={{ fontFamily: "'Poppins', sans-serif" }}>{n.senderName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5 truncate"
                            style={{ fontFamily: "'Poppins', sans-serif" }}>{n.preview}</p>
                          <p className="text-[11px] text-blue-500"
                            style={{ fontFamily: "'Poppins', sans-serif" }}>{timeAgoShort(n.time)}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full shrink-0 mt-1 bg-blue-500" />
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 text-center border-t border-slate-100 dark:border-[#1e293b]">
                  <button onClick={() => { setNotifOpen(false); navigate("/chat"); }}
                    className="text-[13px] text-blue-500 bg-transparent border-0 cursor-pointer"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    View all messages →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Profile dropdown ── */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
              aria-label="Profile menu"
              className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0">
              <img src={profileSrc} alt="Profile"
                className="w-10 h-10 rounded-full object-cover shrink-0
                           ring-[2.5px] ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-[#0f172a]"
                onError={(e) => (e.currentTarget.src = defaultProfile)} />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
                className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 z-[1000] w-[230px]
                             rounded-2xl overflow-hidden
                             bg-white dark:bg-[#1e293b]
                             shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)]
                             dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]">

                {/* User info */}
                <div className="flex items-center gap-3 px-5 py-4
                               border-b border-slate-100 dark:border-[#334155]">
                  <img src={profileSrc} alt=""
                    className="w-[38px] h-[38px] rounded-full object-cover shrink-0 ring-2 ring-blue-500"
                    onError={(e) => (e.currentTarget.src = defaultProfile)} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 m-0"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>{displayName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 m-0"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>{displayRole}</p>
                  </div>
                </div>

                {/* My Profile */}
                <Link to="/profile" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 no-underline transition-colors
                             text-slate-700 dark:text-slate-300
                             hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-500">
                  <span>👤</span>
                  <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    My Profile
                  </span>
                </Link>

                {/* Logout */}
                <div className="border-t border-slate-100 dark:border-[#334155] py-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-5 py-3 border-0 bg-transparent cursor-pointer
                               text-left text-red-500 transition-colors
                               hover:bg-red-50 dark:hover:bg-red-500/[0.08]">
                    <span>🚪</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Log out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MOBILE HEADER ROW ── */}
        <div className="lg:hidden flex items-center gap-1">
          {/* Dark toggle */}
          <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center text-blue-500 bg-transparent border-0 cursor-pointer">
            <DarkIcon darkMode={darkMode} />
          </button>

          {/* Bell */}
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); setMobileOpen(false); }}
            className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer text-blue-500 relative">
            <BellIcon size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Avatar → /profile */}
          <button onClick={() => navigate("/profile")}
            className="bg-transparent border-0 cursor-pointer p-0 flex items-center"
            aria-label="My profile">
            <img src={profileSrc} alt="Profile"
              className="w-[34px] h-[34px] rounded-full object-cover ring-2 ring-blue-500"
              onError={(e) => (e.currentTarget.src = defaultProfile)} />
          </button>

          {/* Hamburger */}
          <button
            onClick={() => { setMobileOpen((o) => !o); setNotifOpen(false); }}
            className="w-10 h-10 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer
                       text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

      {/* ── MOBILE NOTIFICATION PANEL ── */}
      {notifOpen && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="lg:hidden absolute left-3 right-3 top-[calc(100%+6px)] z-50
                       rounded-2xl overflow-hidden shadow-2xl
                       bg-white dark:bg-[#1e293b]
                       border border-slate-100 dark:border-[#1e293b]">
          <div className="flex items-center justify-between px-4 py-3
                         border-b border-slate-100 dark:border-[#334155]">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              style={{ fontFamily: "'Poppins', sans-serif" }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="text-xs text-blue-500 bg-transparent border-0 cursor-pointer">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-1">
                <p className="text-xs text-slate-400 dark:text-slate-500"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>No new messages</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                             bg-blue-50/80 dark:bg-blue-500/[0.08]
                             hover:bg-slate-50 dark:hover:bg-white/[0.04]
                             border-b border-slate-50 dark:border-[#1e293b]"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => { markRead(n.id); setNotifOpen(false); navigate("/chat", { state: { openConvId: n.convId } }); }}>
                  {n.senderAvatar ? (
                    <img src={n.senderAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                                    text-white text-xs font-bold bg-gradient-to-br from-blue-500 to-indigo-500">
                      {n.senderName?.slice(0, 1)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 mb-0.5 truncate"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>{n.senderName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>{n.preview}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full shrink-0 mt-1 bg-blue-500" />
                </div>
              ))
            )}
          </div>
          {/* View all messages footer */}
          <div className="px-4 py-3 text-center border-t border-slate-100 dark:border-[#334155]">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => { setNotifOpen(false); navigate("/chat"); }}
              className="text-[13px] text-blue-500 bg-transparent border-0 cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              View all messages →
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE NAV MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-[#1e293b]
                       bg-white dark:bg-[#0f172a]">
          <nav className="flex flex-col px-4 sm:px-8 py-2">
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                className={`py-3 no-underline block transition-colors border-b border-slate-100 dark:border-[#1e293b]
                  ${isActive(path)
                    ? "text-blue-500 font-semibold"
                    : "text-gray-600 dark:text-slate-300 hover:text-blue-500"}`}
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px" }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* User row */}
          <div className="flex items-center gap-3 px-4 sm:px-8 py-4
                         border-t border-slate-100 dark:border-[#1e293b]">
            <img src={profileSrc} alt="Profile"
              className="w-[42px] h-[42px] rounded-full object-cover shrink-0 ring-2 ring-blue-500"
              onError={(e) => (e.currentTarget.src = defaultProfile)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate m-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}>{displayName}</p>
              <p className="text-xs text-blue-500 m-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}>{displayRole}</p>
            </div>
            <Link to="/profile" onClick={() => setMobileOpen(false)}
              className="text-xs font-semibold text-blue-500 no-underline whitespace-nowrap
                         px-3 py-1.5 rounded-lg border border-blue-500 transition-colors
                         hover:bg-blue-50 dark:hover:bg-blue-500/10">
              Profile
            </Link>
            <button onClick={() => { setMobileOpen(false); onLogout(); }}
              className="text-xs font-semibold text-red-500 bg-transparent border-0 cursor-pointer whitespace-nowrap">
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}