import { useState } from "react";
import BusinessProfileCardComponent from "../components/profile/business/BusinessProfileCardComponent";
import CardBusinessInformationComponent from "../components/profile/business/CardBusinessInformation";
import CardViewApplyComponent from "../components/profile/business/CardViewApplyComponent";
import CardBusinessComponent from "../components/business/CardBusinessComponent";
import CardFreelancerPostComponent from "../components/freelancer/CardFreelancerPostComponent";

// ── Tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: 1, label: "Information" },
  { id: 2, label: "Favorites" },
  { id: 3, label: "View Apply" },
];

// ── Job cards data ────────────────────────────────────────────────
const jobCards = [
  {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    title: "UX/UI Designer",
    description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.",
    tags: ["Figma", "Design"],
    date: "February 21, 2026",
    company: "CreativeTech",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    title: "UX/UI Designer",
    description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.",
    tags: ["Figma", "Design"],
    date: "February 21, 2026",
    company: "CreativeTech",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    title: "UX/UI Designer",
    description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.",
    tags: ["Figma", "Design"],
    date: "February 21, 2026",
    company: "CreativeTech",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
];

// ── Tab Bar ───────────────────────────────────────────────────────
function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="w-full flex justify-center px-4 mt-5">
      <div className="flex w-full max-w-3xl bg-white rounded-xl border border-purple-400 overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-300
              ${activeTab === tab.id
                ? "rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                : "text-purple-600 bg-white hover:bg-purple-50 rounded-xl"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Information Tab ───────────────────────────────────────────────
function InformationTab() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">

      {/* Left: sidebar info — component renders itself at its own size */}
      <div className="flex-shrink-0">
        <CardBusinessInformationComponent />
      </div>

      {/* Right: Job Announcement */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Job Announcement</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-1.5 rounded-lg transition-colors">
            Post
          </button>
        </div>

        {/* Cards rendered at their own fixed size (285×486 from component) */}
        <div className="flex flex-wrap gap-5">
          {jobCards.map((card, idx) => (
            <CardBusinessComponent key={idx} {...card} />
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Favorites Tab ─────────────────────────────────────────────────
function FavoritesTab() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Freelancer</h2>
      <CardFreelancerPostComponent />

      <h2 className="text-xl font-bold text-blue-600 mt-8 mb-4">Job Announcement</h2>
      <CardFreelancerPostComponent />
    </div>
  );
}

// ── View Apply Tab ────────────────────────────────────────────────
function ViewApplyTab() {
  return (
    <div className="mt-6">
      <CardViewApplyComponent />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function ProfileBusiness() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 pt-6 pb-10">

        {/* 1. Profile header card */}
        <BusinessProfileCardComponent />

        {/* 2. Tab navigation */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 3. Tab content */}
        {activeTab === 1 && <InformationTab />}
        {activeTab === 2 && <FavoritesTab />}
        {activeTab === 3 && <ViewApplyTab />}

      </div>
    </div>
  );
}