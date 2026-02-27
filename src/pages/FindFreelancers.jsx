import { useMemo, useState } from "react";
import HeroSectionComponent from "../components/freelancer/HeroSectionComponent";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import { useGetServicesQuery } from "../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../services/userApi";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  // createdAt might be timestamp number
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function ServiceCardWithAuthor({ service, searchText, category }) {
  const userId = service?.userId;

  const { data: userRes } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  // user api might return { success, data: {...} } or just {...}
  const user = userRes?.data || userRes;

  const authorName = user?.fullName || "Freelancer";
  const authorAvatar = user?.profileImageUrl || FALLBACK_IMAGE;

  // service fields
  const title = service?.title || "Untitled";
  const description = service?.description || "No description";
  const categoryName = service?.category?.name || "—";
  const date = formatDate(service?.createdAt);

  const image =
    (Array.isArray(service?.jobImages) && service.jobImages[0]) ||
    service?.jobImages ||
    FALLBACK_IMAGE;

  // tags: use category name as tag (or you can also show category.type)
  const tags = categoryName && categoryName !== "—" ? [categoryName] : [];

  // ===== filtering (title/category/author) =====
  const q = searchText.trim().toLowerCase();

  const matchSearch =
    !q ||
    title.toLowerCase().includes(q) ||
    categoryName.toLowerCase().includes(q) ||
    authorName.toLowerCase().includes(q);

  const matchCategory =
    category === "All" ||
    categoryName.toLowerCase().includes(String(category).toLowerCase());

  if (!matchSearch || !matchCategory) return null;

  return (
    <FreelancerCard
      image={image}
      title={title}
      description={description}
      tags={tags}
      date={date}
      author={authorName}
      avatar={authorAvatar}
    />
  );
}

export default function FindFreelancers() {
  const { data, isLoading, isError } = useGetServicesQuery();

  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  // ✅ normalize services list
  const services = useMemo(() => {
    // your response example: { content: [...] }
    if (Array.isArray(data?.content)) return data.content;

    // sometimes backend wraps: { data: { content: [...] } }
    if (Array.isArray(data?.data?.content)) return data.data.content;

    // sometimes: { data: [...] }
    if (Array.isArray(data?.data)) return data.data;

    return [];
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mt-6">
          <HeroSectionComponent
            category={category}
            searchText={searchText}
            onChangeCategory={setCategory}
            onChangeSearch={setSearchText}
            onSubmitSearch={() => {
              // keep button (same UI) but filtering is live
            }}
          />
        </div>

        <div className="mt-16 sm:mt-16 md:mt-20 pb-12">
          {isLoading && (
            <p className="text-gray-500 text-center">Loading services...</p>
          )}

          {isError && (
            <p className="text-red-500 text-center">Failed to load services.</p>
          )}

          {!isLoading && !isError && (
            <section className="w-full px-4 py-8">
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
                {services.map((service) => (
                  <ServiceCardWithAuthor
                    key={service?.id || crypto.randomUUID()}
                    service={service}
                    searchText={searchText}
                    category={category}
                  />
                ))}
              </div>

              {services.length === 0 && (
                <p className="text-gray-500 text-center mt-6">
                  No services found.
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}