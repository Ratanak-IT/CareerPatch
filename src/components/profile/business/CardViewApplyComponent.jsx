import React, { useState } from "react";

// ── Dynamic Data ─────────────────────────────────────────────────
const pageData = {
  notifications: [
    { id: 1, name: "Chor Pong", action: "comment on your post", time: "1 minute ago", avatar: "https://i.pravatar.cc/48?img=11" },
    { id: 2, name: "Chor Pong", action: "comment on your post", time: "1 minute ago", avatar: "https://i.pravatar.cc/48?img=11" },
    { id: 3, name: "Chor Pong", action: "comment on your post", time: "1 minute ago", avatar: "https://i.pravatar.cc/48?img=11" },
    { id: 4, name: "Chor Pong", action: "comment on your post", time: "1 minute ago", avatar: "https://i.pravatar.cc/48?img=11" },
  ],
  profile: {
    fullName: "Thai Ratanak",
    phoneNumber: "0964735981",
    email: "ratanak1intel@gmail.com",
    jobTitle: "Software Development",
    description:
      "Motivated and detail-oriented Computer Science graduate with a strong foundation in software development, programming, and problem-solving. Passionate about building efficient, user-friendly applications and eager to apply my knowledge of modern technologies such as Java, Python, and web development frameworks in a real-world environment.",
    cv: {
      fileName: "Thai_Ratanak_CV.pdf",
      url: "#",
    },
  },
};

// ── PDF Icon ─────────────────────────────────────────────────────
const PdfIcon = () => (
  <svg viewBox="0 0 40 48" className="w-9 h-10 flex-shrink-0" fill="none">
    <rect x="0" y="0" width="40" height="48" rx="4" fill="#F3F4F6" />
    <path d="M8 28h24" stroke="#D1D5DB" strokeWidth="1" />
    <text x="4" y="44" fontSize="9" fontWeight="700" fill="#EF4444" fontFamily="Arial">PDF</text>
    <path d="M24 0v10h10" fill="none" stroke="#9CA3AF" strokeWidth="1.5" />
    <path d="M24 0l10 10" fill="none" stroke="#9CA3AF" strokeWidth="1.5" />
  </svg>
);

// ── Left Card: Notifications (378×570) ──────────────────────────
function NotificationsCard({ notifications }) {
  const [activeId, setActiveId] = useState(notifications[0]?.id);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 w-full lg:w-[378px] lg:h-[570px] lg:flex-shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {notifications.map((notif) => (
          <button
            key={notif.id}
            onClick={() => setActiveId(notif.id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors w-full
              ${activeId === notif.id ? "bg-gray-200" : "hover:bg-gray-50"}`}
          >
            <img
              src={notif.avatar}
              alt={notif.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-800 truncate">
                {notif.name}{" "}
                <span className="font-normal text-gray-600">{notif.action}</span>
              </span>
              <span className="text-xs text-gray-400 mt-0.5">{notif.time}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Right Section: Info (685×254) + Description + CV ────────────
function ProfileSection({ profile }) {
  const fields = [
    { label: "Full Name :", value: profile.fullName },
    { label: "Phone Number :", value: profile.phoneNumber },
    { label: "Email :", value: profile.email },
    { label: "Job Title", value: profile.jobTitle },
  ];

  return (
    <div className="flex flex-col gap-5 w-full lg:flex-1">

      {/* Info Table Card */}
      <div className="bg-[#F0F4F8] rounded-2xl border border-gray-200 w-full lg:h-[254px] p-6 flex flex-col justify-center">
        <div className="flex flex-col divide-y divide-gray-200">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-6 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-bold text-blue-600 w-[160px] flex-shrink-0">{label}</span>
              <span className="text-sm text-gray-700 flex-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-sm text-gray-500 leading-relaxed pl-2">{profile.description}</p>
      </div>

      {/* CV Document */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">CV Document</h3>
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <PdfIcon />
            <span className="text-sm text-gray-700">{profile.cv.fileName}</span>
          </div>
          <a
            href={profile.cv.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 border border-blue-400 rounded-md px-3 py-1 hover:bg-blue-50 transition-colors flex-shrink-0"
          >
            view
          </a>
        </div>
      </div>

    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
/**
 * Responsive:
 * 📱 Mobile  (< 640px)   — single column, stacked vertically
 * 📟 Tablet  (640–1023px) — notifications on top, profile below; max-w-2xl
 * 🖥  Desktop (≥ 1024px)  — side by side, fixed widths, max-w-[1200px], centered
 */
export default function CardViewApplyComponent({ data = pageData }) {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[1200px] flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-[18px]">
        <NotificationsCard notifications={data.notifications} />
        <ProfileSection profile={data.profile} />
      </div>
    </div>
  );
}