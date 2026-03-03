import { useState } from "react";
import { useGetJobsQuery } from "../../services/freelancerApi";
import avatarImg from "../../assets/freelancerproject.jpg";

function FreelancerCard({ image, title, description, tags, date, author, avatar }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0"
      style={{ width: 285, height: 487 }}
    >
      {/* ── Image ─────────────────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ height: 253 }}>
        <img
          src={image || avatarImg}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = avatarImg; }}
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

      {/* ── Body ──────────────────────────────────────── */}
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
              src={avatar || avatarImg}
              alt={author}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => { e.target.src = avatarImg; }}
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

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CardBusinessPost() {
  const { data, isLoading, isError } = useGetJobsQuery();

  // Handles common response shapes: { data: { content: [] } } or { data: [] } or { content: [] }
  const jobs = data?.data?.content ?? data?.data ?? data?.content ?? [];

  if (isLoading) {
    return (
      <section className="w-full px-4 py-8">
        <p className="text-center text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Loading jobs...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-4 py-8">
        <p className="text-center text-red-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Failed to load jobs.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-8">
      <div
        className="
          grid gap-5 justify-items-center
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          max-w-[1240px] mx-auto
        "
      >
        {jobs.slice(0, 4).map((job) => (
          <FreelancerCard
            key={job.id}
            image={job.imageUrl ?? job.companyLogoUrl ?? null}
            title={job.title}
            description={job.description}
            tags={job.skills ?? job.tags ?? job.requirements ?? []}
            date={formatDate(job.createdAt ?? job.postedAt ?? job.date)}
            author={job.businessOwnerName ?? job.ownerName ?? job.companyName ?? "Business Owner"}
            avatar={job.ownerProfileImageUrl ?? job.avatarUrl ?? null}
          />
        ))}
      </div>
    </section>
  );
}