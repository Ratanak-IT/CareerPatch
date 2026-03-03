// src/pages/FindFreelancers.jsx
import { useMemo, useState } from "react";
import HeroSectionComponent from "../components/freelancer/HeroSectionComponent";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import { useGetServicesQuery } from "../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../services/userApi";

const FALLBACK_IMAGE  = "https://placehold.co/285x253?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/32x32?text=?";

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function getServiceId(service) {
  return service?.id ?? service?.serviceId ?? service?._id ?? service?.uuid ?? null;
}

// ─── Single card — bookmark state lives inside FreelancerCard via useBookmarks
function ServiceCardWithAuthor({ service, searchText, category }) {
  const { data: userRes } = useGetUserByIdQuery(service?.userId, { skip: !service?.userId });
  const user = userRes?.data || userRes;

  const serviceId    = getServiceId(service);
  const title        = service?.title       || "Untitled";
  const description  = service?.description || "No description";
  const categoryName = service?.category?.name || service?.categoryName || "—";
  const date         = formatDate(service?.createdAt);
  const authorName   = user?.fullName        || "Freelancer";
  const authorAvatar = user?.profileImageUrl || FALLBACK_AVATAR;

  const image =
    (Array.isArray(service?.jobImages) && service.jobImages[0]) ||
    (typeof service?.jobImages === "string" ? service.jobImages : null) ||
    (Array.isArray(service?.imageUrls)  && service.imageUrls[0]) ||
    FALLBACK_IMAGE;

  const tags = categoryName && categoryName !== "—" ? [categoryName] : [];

  // Filtering
  const q = searchText.trim().toLowerCase();
  const matchSearch =
    !q ||
    title.toLowerCase().includes(q)        ||
    categoryName.toLowerCase().includes(q) ||
    authorName.toLowerCase().includes(q);
  const matchCategory =
    category === "All" ||
    categoryName.toLowerCase().includes(String(category).toLowerCase());

  if (!matchSearch || !matchCategory || !serviceId) return null;

  return (
    <FreelancerCard
    id={serviceId}
    image={image}
    title={title}
    description={description}
    tags={tags}
    date={date}
    author={authorName}
    avatar={authorAvatar}
    postType="service"
    authorId={service?.userId}
  />
  );
}

export default function FindFreelancers() {
  const { data, isLoading, isError } = useGetServicesQuery();
  const [category,   setCategory]   = useState("All");
  const [searchText, setSearchText] = useState("");

  const services = useMemo(() => {
    if (Array.isArray(data?.content))       return data.content;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    if (Array.isArray(data?.data))          return data.data;
    if (Array.isArray(data))                return data;
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
            onSubmitSearch={() => {}}
          />
        </div>

        <div className="sm:mt-5 md:mt-10 pb-12">
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {isError && (
            <p className="text-red-500 text-center py-8">Failed to load services.</p>
          )}

          {!isLoading && !isError && (
            <section className="w-full px-4">
              <div className="grid justify-items-center gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[1240px] mx-auto">
                {services.map((service) => {
                  const id = getServiceId(service);
                  return (
                    <ServiceCardWithAuthor
                      key={id || service?.userId || service?.title}
                      service={service}
                      searchText={searchText}
                      category={category}
                    />
                  );
                })}
              </div>
              {services.length === 0 && (
                <p className="text-gray-500 text-center mt-6">No services found.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}