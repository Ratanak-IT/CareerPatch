import React from "react";

// ── Dynamic Data ─────────────────────────────────────────────────
const companyData = {
  aboutCompany: {
    title: "About Company",
    description:
      "Delivering reliable technology services, software development, and smart business solutions.",
  },
  whyWorkWithUs: {
    title: "Why Work With Us",
    perks: [
      "Remote Friendly",
      "Flexible Schedule",
      "Long-Term Projects",
      "Competitive Payment",
    ],
  },
  contactInfo: {
    title: "Contact Info",
    email: "contact@technova.com",
    phone: "+855 97 000 000",
    website: "www.technovasolutions.com",
    location: "Phnom Penh, Cambodia",
  },
};

// ── Icons ────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 5.17 2 2 0 012.1 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ── Sub-cards ────────────────────────────────────────────────────
function AboutCard({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-900 mb-2">{data.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{data.description}</p>
    </div>
  );
}

function WhyWorkCard({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-900 mb-3">{data.title}</h3>
      <ul className="flex flex-col gap-2.5">
        {data.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5">
            <span className="flex-shrink-0">
              <CheckIcon />
            </span>
            <span className="text-sm text-gray-600">{perk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard({ data }) {
  const items = [
    { icon: <EmailIcon />, label: data.email },
    { icon: <PhoneIcon />, label: data.phone },
    { icon: <GlobeIcon />, label: data.website },
    { icon: <LocationIcon />, label: data.location },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-900 mb-4">{data.title}</h3>
      <div className="flex flex-col gap-4">
        {items.map(({ icon, label }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              {icon}
            </span>
            <span className="text-sm text-gray-600 leading-snug break-all">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
/**
 * Responsive breakpoints:
 * 📱 Mobile  (< 640px)   — single column, full width, stacked
 * 📟 Tablet  (640–1023px) — two-column grid, cards auto-sized
 * 🖥  Desktop (≥ 1024px)  — fixed 240px wide single column, centered on page
 */
export default function CardBusinessInformationComponent({ data = companyData }) {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 sm:p-8">

      {/* ── Mobile: single col | Tablet: 2-col grid | Desktop: fixed 240px column ── */}
      <div
        className="
          w-full
          flex flex-col gap-5
          sm:grid sm:grid-cols-2 sm:gap-5 sm:max-w-xl
          lg:flex lg:flex-col lg:gap-5 lg:w-[240px]
        "
      >
        <AboutCard data={data.aboutCompany} />
        <WhyWorkCard data={data.whyWorkWithUs} />
        <ContactCard data={data.contactInfo} />
      </div>

    </div>
  );
}