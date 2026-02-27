// src/pages/FindFreelancers.jsx
import { useMemo, useState } from "react";
import HeroSectionComponent from "../components/freelancer/HeroSectionComponent";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import { useGetServicesQuery } from "../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../services/userApi";

const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/32x32?text=?";

function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

/**
 * IMPORTANT:
 * - service id might be `id` OR `serviceId` OR `_id`.
 * - We normalize it here so the card link never becomes /services/undefined
 */
function getServiceId(service) {
  return (
    service?.id ??
    service?.serviceId ??
    service?._id ??
    service?.uuid ??
    null
  );
}

function ServiceCardWithAuthor({ service, searchText, category }) {
  const userId = service?.userId;

  const { data: userRes } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const user = userRes?.data || userRes;

  const authorName = user?.fullName || "Freelancer";
  const authorAvatar = user?.profileImageUrl || FALLBACK_AVATAR;

  const serviceId = getServiceId(service);

  // service fields
  const title = service?.title || "Untitled";
  const description = service?.description || "No description";
  const categoryName = service?.category?.name || service?.categoryName || "—";
  const date = formatDate(service?.createdAt);

  const image =
    (Array.isArray(service?.jobImages) && service.jobImages[0]) ||
    (typeof service?.jobImages === "string" ? service.jobImages : null) ||
    FALLBACK_IMAGE;

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

  // If no match or missing id => do not render card (prevents /undefined)
  if (!matchSearch || !matchCategory || !serviceId) return null;

  return (
    <FreelancerCard
      id={serviceId} // ✅ always a real id now
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
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
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
              // filtering is live; keep button for UI
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
                  grid gap-x-[50px] justify-items-center gap-y-6
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                  max-w-[1240px] mx-auto
                "
              >
                {services.map((service) => (
                  <ServiceCardWithAuthor
                    key={getServiceId(service) || service?.userId || service?.title}
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