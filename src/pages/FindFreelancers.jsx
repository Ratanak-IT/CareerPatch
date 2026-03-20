
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import HeroSectionComponent from "../components/freelancer/HeroSectionComponent";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import { useGetServicesQuery } from "../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../services/userApi";
import { FreelancerCardSkeleton } from "../components/loading/FreelancerCardSkeleton";

const FALLBACK_IMAGE  = "https://placehold.co/285x253?text=No+Image";
const FALLBACK_AVATAR = "https://placehold.co/32x32?text=?";
const PAGE_SIZE = 8;

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

function ServiceCardWithAuthor({ service }) {
  const { data: userRes } = useGetUserByIdQuery(service?.userId, {
    skip: !service?.userId,
  });
  const user = userRes?.data || userRes;

  const serviceId   = getServiceId(service);
  const title       = service?.title        || "Untitled";
  const description = service?.description  || "No description";
  const categoryName = service?.category?.name || service?.categoryName || "—";
  const date        = formatDate(service?.createdAt);
  const authorName  = user?.fullName        || "Freelancer";
  const authorAvatar = user?.profileImageUrl || FALLBACK_AVATAR;

  const image =
    (Array.isArray(service?.jobImages) && service.jobImages[0]) ||
    (typeof service?.jobImages === "string" ? service.jobImages : null) ||
    (Array.isArray(service?.imageUrls)  && service.imageUrls[0])  ||
    FALLBACK_IMAGE;

  const tags = categoryName && categoryName !== "—" ? [categoryName] : [];

  if (!serviceId) return null;

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

  const [category,       setCategory]       = useState("All");
  const [searchText,     setSearchText]     = useState("");
  const [appliedSearch,  setAppliedSearch]  = useState("");
  const [visibleCount,   setVisibleCount]   = useState(PAGE_SIZE);

  const loadMoreRef = useRef(null);

  // ── Read ?category=... from URL (set by TalenCategories click) ──────────
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(decodeURIComponent(cat));
  }, [searchParams]);

  const services = useMemo(() => {
    if (Array.isArray(data?.content))       return data.content;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    if (Array.isArray(data?.data))          return data.data;
    if (Array.isArray(data))                return data;
    return [];
  }, [data]);

  const filteredServices = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    return services.filter((service) => {
      const title        = String(service?.title || "").toLowerCase();
      const categoryName = String(service?.category?.name || service?.categoryName || "").toLowerCase();
      const matchSearch   = !q || title.includes(q) || categoryName.includes(q);
      const matchCategory = category === "All" || categoryName.includes(String(category).toLowerCase());
      return matchSearch && matchCategory && getServiceId(service);
    });
  }, [services, appliedSearch, category]);

  const visibleServices = filteredServices.slice(0, visibleCount);
  const hasMore         = visibleCount < filteredServices.length;

  // Reset pagination when filter changes
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [category, appliedSearch]);

  // Infinite scroll — load more when sentinel is visible
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredServices.length));
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); observer.disconnect(); };
  }, [hasMore, filteredServices.length]);

  const handleSubmitSearch = () => {
    setAppliedSearch(searchText);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07111f]">
      <HeroSectionComponent
        category={category}
        searchText={searchText}
        onChangeCategory={setCategory}
        onChangeSearch={setSearchText}
        onSubmitSearch={handleSubmitSearch}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] pt-8 pb-16">

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <FreelancerCardSkeleton key={i} />
            ))}
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
              {visibleServices.map((service) => {
                const id = getServiceId(service);
                return (
                  <ServiceCardWithAuthor
                    key={id || service?.userId || service?.title}
                    service={service}
                  />
                );
              })}
            </div>

            {/* Empty state */}
            {filteredServices.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-14 h-14 mb-4 text-gray-200 dark:text-slate-700"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                       M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                       m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0Z" />
                </svg>
                <p className="font-semibold text-gray-500 dark:text-slate-400">
                  No services found
                </p>
                <p className="text-xs mt-1 text-gray-400 dark:text-slate-500">
                  Try adjusting your search or category
                </p>
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center items-center py-10">
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] animate-bounce" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] animate-bounce"
                        style={{ animationDelay: "0.15s" }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E88E5] animate-bounce"
                        style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


