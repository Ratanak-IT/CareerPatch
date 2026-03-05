import React from "react";

// ── Sample dynamic data ──────────────────────────────────────────
const profileData = {
  aboutMe:
    "I am committed to delivering quality work, meeting deadlines, and maintaining clear communication throughout every project.",
  contact: {
    email: "ratanak@gmail.com",
    phone: "+885- 97887766",
    location: "Phnom Penh, Cambodia",
  },
  languages: ["Khmer", "English"],
  workExperience: [
    { id: 1, title: "Web developer", period: "September 2020-November 2023.", description: null },
    { id: 2, title: "Java developer", period: "December 2023 - January 2025.", description: null },
    {
      id: 3,
      title: null,
      period: null,
      description:
        "Designed, developed, and deployed Shopify stores tailored to client requirements, ensuring high-quality user experiences.",
    },
  ],
  skills: ["React.js", "Next.js", "Java", "PostgresSQL", "Python", "Webdesign"],
};

// ── Icons ────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 5.17 2 2 0 012.1 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ── Left Card ────────────────────────────────────────────────────
function LeftCard({ data }) {
  return (
    <div className="flex flex-col gap-4 w-full lg:w-[285px] lg:flex-shrink-0">
      {/* About Me */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm font-bold text-gray-900 mb-2">About Me</p>
        <p className="text-sm text-gray-500 leading-relaxed">{data.aboutMe}</p>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm font-bold text-gray-900 mb-3">Contact Info</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <EmailIcon />
            </span>
            <span className="text-sm text-gray-600 break-all">{data.contact.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <PhoneIcon />
            </span>
            <span className="text-sm text-gray-600">{data.contact.phone}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <LocationIcon />
            </span>
            <span className="text-sm text-gray-600 leading-snug">{data.contact.location}</span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm font-bold text-gray-900 mb-3">Languages</p>
        <div className="flex flex-col gap-2">
          {data.languages.map((lang) => (
            <span key={lang} className="text-sm text-gray-600">{lang}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Middle Card ──────────────────────────────────────────────────
function MiddleCard({ experiences }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7 shadow-sm w-full lg:w-[488px] lg:flex-shrink-0 lg:h-[317px] flex flex-col overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Work experience</h2>
      <div className="border-t border-gray-200 mb-2" />
      <div className="flex flex-col overflow-y-auto flex-1">
        {experiences.map((exp, idx) => (
          <div key={exp.id}>
            <div className="py-4">
              {exp.title && <p className="text-base font-bold text-gray-900 mb-1">{exp.title}</p>}
              {exp.period && <p className="text-sm text-gray-500">{exp.period}</p>}
              {exp.description && (
                <p className="text-base font-bold text-gray-900 leading-snug">{exp.description}</p>
              )}
            </div>
            {idx < experiences.length - 1 && <div className="border-t border-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Right Card ───────────────────────────────────────────────────
function RightCard({ skills }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7 shadow-sm w-full lg:w-[390px] lg:flex-shrink-0 lg:h-[505px] flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Skill</h2>
      <div className="border-t border-gray-200 mb-5" />
      {/* Mobile: 2 cols | Tablet: 3 cols | Desktop: 1 col */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <CheckIcon />
            </span>
            <span className="text-sm md:text-base font-medium text-gray-800">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
/**
 * Responsive breakpoints:
 *
 * 📱 Mobile  (< 640px)   — single column, cards stacked vertically, full width
 * 📟 Tablet  (640-1023px) — two-column grid: Left card spans both cols on top,
 *                           Work Experience & Skills side by side below
 * 🖥 Desktop (≥ 1024px)  — three columns in a row, fixed widths, centered at max 1200px
 */
export default function ProfileCardLayout({ data = profileData }) {
  return (
    <div className="w-full ">

      {/* ── Mobile: flex-col  |  Tablet: grid 2-col  |  Desktop: flex-row ── */}
      <div className="w-full max-w-[1200px]">

        {/* Mobile & Desktop: single flex column / row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-[18px]">

          {/* LEFT — full width on mobile/tablet, fixed 285px on desktop */}
          {/* On tablet we use a nested 2-col grid to place Middle + Right side-by-side */}
          <div className="w-full lg:w-[285px] lg:flex-shrink-0">
            <LeftCard data={data} />
          </div>

          {/* MIDDLE + RIGHT: stacked on mobile, side-by-side on tablet, inline on desktop */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:flex lg:flex-row lg:gap-[18px] w-full">
            <MiddleCard experiences={data.workExperience} />
            <RightCard skills={data.skills} />
          </div>

        </div>
      </div>
    </div>
  );
}