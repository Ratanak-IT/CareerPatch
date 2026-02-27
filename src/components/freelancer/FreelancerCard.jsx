import { useState } from "react";
import { Link } from "react-router";

export default function FreelancerCard({
  id,
  image,
  title,
  description,
  tags = [],
  date,
  author,
  avatar,
}) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      to={`/services/${id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0"
      style={{ width: 285, height: 487, textDecoration: "none" }}
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ height: 253 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/285x253?text=No+Image";
          }}
        />
        <button
         onClick={(e) => {
  e.stopPropagation();
  setLiked((prev) => !prev);
}}
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
            {(Array.isArray(tags) ? tags : [])
              .filter(Boolean)
              .slice(0, 2)
              .map((t) => (
                <span
                  key={t}
                  className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {t}
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
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/32x32?text=?";
              }}
            />
            <span className="text-gray-700 text-xs font-medium">{author}</span>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200">
            Message
          </button>
        </div>
      </div>
    </Link>
  );
}