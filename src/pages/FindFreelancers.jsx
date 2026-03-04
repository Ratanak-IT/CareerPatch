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
    (Array.isArray(service?.imageUrls) && service.imageUrls[0]) ||
    FALLBACK_IMAGE;

  const tags = categoryName && categoryName !== "—" ? [categoryName] : [];

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#07111f]">

      {/* ── Hero — NO wrapper, goes full width flush with navbar ── */}
      <HeroSectionComponent
        category={category}
        searchText={searchText}
        onChangeCategory={setCategory}
        onChangeSearch={setSearchText}
        onSubmitSearch={() => {}}
      />

      {/* ── Cards grid — centered container ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] pt-8 pb-16">

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="text-red-500 dark:text-red-400 text-center py-8">
            Failed to load services.
          </p>
        )}

        {/* Grid */}
        {!isLoading && !isError && (
          <>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

            {/* Empty state */}
            {services.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-14 h-14 mb-4 text-gray-200 dark:text-slate-700"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0Z"/>
                </svg>
                <p className="font-semibold text-gray-500 dark:text-slate-400">No services found</p>
                <p className="text-xs mt-1 text-gray-400 dark:text-slate-500">
                  Try adjusting your search or category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}