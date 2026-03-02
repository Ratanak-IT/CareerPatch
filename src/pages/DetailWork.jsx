import JobDetailComponent from "../components/detailwork/JobDetailComponent";
import CommentSectionComponent from "../components/detailwork/CommentSectionComponent";

// ── Dynamic Data ──────────────────────────────────────────────────────────────
const defaultData = {
  job: {
    company: { name: "ABA Bank", logo: "ABA", logoColor: "#2B5F75" },
    title: "UX-UI Designer",
    location: "Phnom Penh (Khan Sek Sok.)",
    postedAgo: "2 days ago",
    description:
      "ABA Bank is seeking a talented UX/UI designer to overhaul our existing mobile application and improve user experience.",
    responsibilities: [
      "Collaborate with product managers & developers",
      "Create wireframes & prototypes",
      "Visual design & branding",
      "Improve user experience",
      "Usability testing",
    ],
    requirements: [
      "5+ years of experience with Figma or Sketch",
      "Strong portfolio showcasing relevant projects",
    ],
    skills: ["Figma", "Design"],
  },
  panel: {
    projectCost: "$1500",
    experience: "Expert",
    duration: "1–2 months",
    deadline: "Mar 1, 2026",
    comments: [
      {
        id: 1,
        author: "Eung Lizuia",
        avatarUrl: "https://i.pravatar.cc/40?img=47",
        text: "So amazing",
        timeAgo: "2 hours ago",
      },
    ],
  },
};

export default function DetailWork({ data = defaultData }) {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#F3F6FA", fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Desktop: side by side */}
        <div className="hidden lg:flex gap-5 items-start">
          <div style={{ width: 716 }}>
            <JobDetailComponent job={data.job} />
          </div>
          <div style={{ width: 420 }}>
            <CommentSectionComponent data={data.panel} />
          </div>
        </div>

        {/* Mobile & Tablet: stacked (panel first) */}
        <div className="flex lg:hidden flex-col gap-4">
          <CommentSectionComponent data={data.panel} />
          <JobDetailComponent job={data.job} />
        </div>

      </div>
    </div>
  );
}