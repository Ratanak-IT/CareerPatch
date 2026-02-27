import { useMemo, useState } from "react";
import { useGetAllServicesQuery } from "../../services/serviceApi";

// fallback image
const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  if (typeof value === "number") return new Date(value).toLocaleDateString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
}

function getFirstImage(jobImages) {
  if (Array.isArray(jobImages) && jobImages.length > 0) return jobImages[0];
  if (typeof jobImages === "string") return jobImages;
  return FALLBACK_IMAGE;
}

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
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
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
            {(tags || []).slice(0, 2).map((tag) => (
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
    </div>
  );
}

// ✅ This component receives filters from SearchBar via props
export default function CardFreelancerPostComponent({ category = "Freelancer", searchText = "" }) {
  const { data, isLoading, isError } = useGetAllServicesQuery();

  // ✅ normalize: API returns { content: [...] }
  const services = useMemo(() => {
    const raw = data?.content ?? data?.data?.content ?? data?.data ?? data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  // ✅ filter: title + description + category.name
  const filtered = useMemo(() => {
    const q = String(searchText || "").trim().toLowerCase();
    const cat = String(category || "").trim().toLowerCase();

    return services.filter((s) => {
      const title = String(s?.title || "").toLowerCase();
      const desc = String(s?.description || "").toLowerCase();
      const catName = String(s?.category?.name || "").toLowerCase();

      const matchSearch = !q || title.includes(q) || desc.includes(q) || catName.includes(q);

      // "Freelancer" means All
      const matchCategory = !cat || cat === "freelancer" || cat === "all" || catName.includes(cat);

      return matchSearch && matchCategory;
    });
  }, [services, searchText, category]);

  // ✅ map API -> Card data
  const cards = useMemo(() => {
    return filtered.map((s) => {
      const image = getFirstImage(s?.jobImages);
      const title = s?.title || "Untitled";
      const description = s?.description || "No description";
      const tags = [
        s?.category?.name || "Service",
        s?.status || "ACTIVE",
      ].filter(Boolean);
      const date = formatDate(s?.createdAt);

      // You don't have author profile in this endpoint.
      // If you later join user data, replace these.
      const author = "Freelancer";
      const avatar = "https://placehold.co/32x32?text=F";

      return {
        id: s?.id,
        image,
        title,
        description,
        tags,
        date,
        author,
        avatar,
      };
    });
  }, [filtered]);

  return (
    <section className="w-full px-4 py-8">
      {isLoading && <p className="text-gray-500 text-center">Loading posts...</p>}
      {isError && <p className="text-red-500 text-center">Failed to load posts.</p>}

      {!isLoading && !isError && (
        <>
          <div
            className="
              grid gap-x-[50px] justify-items-center
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              max-w-[1240px] mx-auto
            "
          >
            {cards.map((card) => (
              <FreelancerCard key={card.id} {...card} />
            ))}
          </div>

          {cards.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No services found.</p>
          )}
        </>
      )}
    </section>
  );
}