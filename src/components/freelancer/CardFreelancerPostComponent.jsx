import { useMemo } from "react";
import { useGetAllServicesQuery } from "../../services/serviceApi";
import FreelancerCard from "./FreelancerCard";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

// ✅ dd/mm/yyyy — createdAt is a timestamp number from API
function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ✅ API returns jobImages array
function getFirstImage(s) {
  if (Array.isArray(s?.jobImages) && s.jobImages.length > 0) return s.jobImages[0];
  if (Array.isArray(s?.imageUrls) && s.imageUrls.length > 0) return s.imageUrls[0];
  return FALLBACK_IMAGE;
}

export default function CardFreelancerPostComponent({ category = "Freelancer", searchText = "" }) {
  // ✅ transformResponse in serviceApi already returns a clean normalized array
  const { data: services = [], isLoading, isError } = useGetAllServicesQuery();

  // ✅ filter by search text and category
  const filtered = useMemo(() => {
    const q = String(searchText || "").trim().toLowerCase();
    const cat = String(category || "").trim().toLowerCase();

    return services.filter((s) => {
      const title = String(s?.title || "").toLowerCase();
      const desc = String(s?.description || "").toLowerCase();
      // ✅ category.name from real API response
      const catName = String(s?.category?.name || "").toLowerCase();

      const matchSearch = !q || title.includes(q) || desc.includes(q) || catName.includes(q);
      const matchCategory = !cat || cat === "freelancer" || cat === "all" || catName.includes(cat);

      return matchSearch && matchCategory;
    });
  }, [services, searchText, category]);

  // ✅ map real API fields → FreelancerCard props
  const cards = useMemo(() => {
    return filtered.map((s) => ({
      id: s?.id,
      image: getFirstImage(s),                    // ✅ jobImages
      title: s?.title || "Untitled",
      description: s?.description || "No description",
      tags: [s?.category?.name].filter(Boolean),  // ✅ category.name only
      date: formatDate(s?.createdAt),              // ✅ dd/mm/yyyy from timestamp
      author: s?.author?.fullName || "Freelancer",
      avatar: s?.author?.profileImageUrl || "https://placehold.co/32x32?text=F",
    }));
  }, [filtered]);

  return (
    <section className="w-full px-4 py-8">
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <p className="text-red-500 text-center py-8">Failed to load posts.</p>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid gap-x-[50px] gap-y-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1240px] mx-auto">
            {cards.map((card) => (
              <FreelancerCard key={card.id} {...card} />
            ))}
          </div>

          {cards.length === 0 && (
            <p className="text-gray-400 text-center mt-6">No services found.</p>
          )}
        </>
      )}
    </section>
  );
}