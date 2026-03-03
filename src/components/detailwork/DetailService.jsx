



import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getServiceById, getUserById } from "../../services/detailworkApi";
import JobDetailComponent from "./JobDetailComponent";
import CommentSectionComponent from "./CommentSectionComponent";
// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(value) {
  if (!value) return "";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const diff = Math.floor((Date.now() - new Date(v).getTime()) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Map API data → component shapes ──────────────────────────────────────────
function mapService(service, user) {
  return {
    company: {
      name:      user?.fullName || user?.username || "Freelancer",
      logo:      (user?.fullName || user?.username || "FR").slice(0, 3).toUpperCase(),
      logoColor: "#2B5F75",
    },
    title:            service?.title       || "Untitled Service",
    location:         user?.location       || service?.location || "Phnom Penh",
    postedAgo:        timeAgo(service?.createdAt),
    description:      service?.description || "No description provided.",
    responsibilities: Array.isArray(service?.includes) && service.includes.length
      ? service.includes
      : Array.isArray(service?.deliverables) && service.deliverables.length
      ? service.deliverables
      : ["High quality deliverables", "On-time delivery"],
    requirements: Array.isArray(service?.requirements) && service.requirements.length
      ? service.requirements
      : ["Please provide project details"],
    skills: Array.isArray(service?.skills) ? service.skills : [],
  };
}

function mapPanel(service) {
  const price = service?.price ?? service?.budget ?? 0;
  return {
    projectCost: price ? `$${Number(price).toLocaleString()}` : "Negotiable",
    experience:  service?.level || service?.experienceLevel || "Expert",
    duration:    service?.deliveryTime || service?.duration || "1–2 months",
    deadline:    formatDate(service?.deadline || service?.createdAt),
    comments:    Array.isArray(service?.reviews) ? service.reviews.map((r, i) => ({
      id:       r.id || i,
      author:   r.author || r.reviewerName || "Anonymous",
      avatarUrl:r.avatarUrl || null,
      text:     r.text || r.comment || "",
      timeAgo:  timeAgo(r.createdAt) || "",
    })) : [],
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DetailService() {
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    setError(false);

    getServiceById(serviceId)
      .then(async (serviceData) => {
        setService(serviceData);
        if (serviceData?.userId) {
          const userData = await getUserById(serviceData.userId).catch(() => null);
          setUser(userData);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full" style={{ background: "#F3F6FA", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="hidden lg:flex gap-5">
            <div style={{ width: 716 }}><Skeleton /></div>
            <div style={{ width: 420 }}><Skeleton /></div>
          </div>
          <div className="flex lg:hidden flex-col gap-4"><Skeleton /></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#F3F6FA" }}>
        <div className="text-center">
          <p className="text-red-500 font-semibold text-lg mb-2">Failed to load service details.</p>
          <p className="text-gray-400 text-sm">The service may not exist or an error occurred.</p>
        </div>
      </div>
    );
  }

  const serviceDetail = mapService(service, user);
  const panel         = mapPanel(service);

  return (
    <div className="min-h-screen w-full" style={{ background: "#F3F6FA", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Desktop */}
        <div className="hidden lg:flex gap-5 items-start">
          <div style={{ width: 716 }}>
            <JobDetailComponent job={serviceDetail} />
          </div>
          <div style={{ width: 420 }}>
            <CommentSectionComponent data={panel} />
          </div>
        </div>

        {/* Mobile & Tablet */}
        <div className="flex lg:hidden flex-col gap-4">
          <CommentSectionComponent data={panel} />
          <JobDetailComponent job={serviceDetail} />
        </div>

      </div>
    </div>
  );
}