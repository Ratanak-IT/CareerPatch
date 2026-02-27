import { useState } from "react";


// ── Safe image import — falls back to placeholder if asset missing ──
let avatarImg = "";
try {
  avatarImg = new URL("../../assets/freelancerproject.jpg", import.meta.url).href;
} catch {
  avatarImg = "https://placehold.co/285x253?text=No+Image";
}

const CARDS_DATA = [
  {
    id: 1,
    image: avatarImg,
    title: "UX/UI Designer",
    description:
      "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.",
    tags: ["Figma", "Design"],
    date: "Feb 21, 2026",
    author: "Cristian",
    avatar: avatarImg,
  },
  {
    id: 2,
    image: avatarImg,
    title: "Frontend Developer",
    description:
      "Build performant, accessible web apps using React and Tailwind. Collaborate closely with design and backend teams.",
    tags: ["React", "Tailwind"],
    date: "Feb 22, 2026",
    author: "Sophia",
    avatar: avatarImg,
  },
  {
    id: 3,
    image: avatarImg,
    title: "Data Analyst",
    description:
      "Analyze large datasets to provide actionable business insights using SQL and data visualization tools.",
    tags: ["SQL", "Tableau"],
    date: "Feb 23, 2026",
    author: "Marcus",
    avatar: avatarImg,
  },
  {
    id: 4,
    image: avatarImg,
    title: "Backend Engineer",
    description:
      "Design and maintain scalable server-side APIs and microservices using Node.js and cloud infrastructure.",
    tags: ["Node.js", "AWS"],
    date: "Feb 24, 2026",
    author: "Lena",
    avatar: avatarImg,
  },
];

function FreelancerCard({ image, title, description, tags, date, author, avatar }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0"
      style={{ width: 285, height: 487 }}
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ height: 253 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/285x253?text=No+Image"; }}
        />
        <button
          onClick={() => setLiked((prev) => !prev)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow transition-transform hover:scale-110"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? "#3B82F6" : "none"}
            stroke={liked ? "#3B82F6" : "#9ca3af"}
            strokeWidth="1.8"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-blue-500 font-bold text-sm mb-1 truncate">{title}</h2>
        <p
          className="text-gray-500 text-xs leading-relaxed mb-4 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>

        <div className="border-t border-gray-100 mb-3" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={avatar}
              alt={author}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => { e.target.src = "https://placehold.co/32x32?text=?"; }}
            />
            <span className="text-gray-700 text-xs font-medium">{author}</span>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200">
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CardFreelancerPostComponent({ isDark = false }) {
  return (
    <section className="w-full px-4 py-8">
      <div
        className="
          grid gap-x-[50px] gap-y-[px] justify-items-center
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          max-w-[1240px] mx-auto
        "
      >
        {CARDS_DATA.map((card) => (
          <FreelancerCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
}