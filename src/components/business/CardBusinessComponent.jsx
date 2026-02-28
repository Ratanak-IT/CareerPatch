import { useState } from "react";


// Single Job Card Component

const JobCard = ({
  image,
  title,
  description,
  tags,
  date,
  company,
  avatar,
}) => {
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-white rounded-2xl shadow-lg flex flex-col w-full h-[486px] overflow-hidden">

      {/* Image */}
      <div className="relative h-[190px]">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Heart Button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? "#2563eb" : "none"}
            stroke={liked ? "#2563eb" : "#9ca3af"}
            strokeWidth={2}
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-3">

        {/* Title */}
        <h2 className="text-blue-600 font-bold text-lg mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 flex-1 overflow-hidden">
          {description}
        </p>

        {/* Tags + Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="text-gray-400 text-xs whitespace-nowrap">
            {date}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={avatar}
              alt={company}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-gray-700 text-sm font-medium">
              {company}
            </span>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute bottom-8 right-0 bg-white  shadow-lg w-32 py-1 z-10">
                {["Delete", "Update"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


// Dynamic Card Data

const cardsData = [
  {
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    title: "UX/UI Designer",
    description:
      "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.",
    tags: ["Figma", "Design"],
    date: "Feb 21, 2026",
    company: "CreativeTech",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    title: "Frontend Developer",
    description:
      "Build performant, accessible web apps using React and modern CSS.",
    tags: ["React", "Tailwind"],
    date: "Feb 22, 2026",
    company: "CodeFactory",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    title: "Data Analyst",
    description:
      "Analyze datasets to provide actionable insights using SQL and BI tools.",
    tags: ["SQL", "Tableau"],
    date: "Feb 23, 2026",
    company: "DataVision",
    avatar: "https://i.pravatar.cc/40?img=9",
  },
  {
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=600&q=80",
    title: "Backend Developer",
    description:
      "Develop scalable backend services using Node.js and databases.",
    tags: ["Node", "MongoDB"],
    date: "Feb 24, 2026",
    company: "ServerPro",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];


// Main Component (4 Cards Horizontal)

export default function CardBusinessComponent() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cardsData.map((card, index) => (
          <JobCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}