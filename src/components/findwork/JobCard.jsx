import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../../services/userApi";
import { useBookmarks } from "../../hooks/useBookmarks";
import { selectIsAuthed, selectAuthUser } from "../../features/auth/authSlice";
import ApplyJobModal from "../apply/ApplyJobModal";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  getJobId,
  formatDate,
  FALLBACK_IMAGE,
  FALLBACK_AVATAR,
} from "../../utils/jobUtils";
import { toast } from "react-toastify";

export default function JobCard({ job, categoryMap = {} }) {
  const navigate = useNavigate();
  const isAuthed = useSelector(selectIsAuthed);
  const authUser = useSelector(selectAuthUser);

  const { data: userRes } = useGetUserByIdQuery(job?.userId, {
    skip: !job?.userId,
  });

  const jobId = getJobId(job);
  const { liked, toggle } = useBookmarks({ id: jobId, type: "job" });

  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-quad",
      once: true,
      offset: 60,
    });
  }, []);

  if (!jobId) return null;

  const user = userRes?.data ?? userRes ?? null;
  const title = job?.title || "Untitled";
  const description = job?.description || "No description available.";
  const categoryName = categoryMap[job?.categoryId] || null;
  const date = formatDate(job?.createdAt);
  const status = job?.status || "UNKNOWN";
  const authorName = user?.companyName || user?.fullName || "Business";
  const authorAvatar = user?.profileImageUrl || FALLBACK_AVATAR;
  const image =
    (Array.isArray(job?.jobImages) && job.jobImages[0]) ||
    (Array.isArray(job?.imageUrls) && job.imageUrls[0]) ||
    FALLBACK_IMAGE;

  const tags = [];
  if (categoryName) tags.push(categoryName);
  if (job?.skills?.[0]) tags.push(job.skills[0]);

  const viewerType = (authUser?.userType ?? authUser?.role ?? "")
    .toString()
    .toUpperCase();

  const isOwner =
    isAuthed &&
    job?.userId &&
    String(authUser?.id ?? authUser?.userId) === String(job?.userId);

  const canApply = isAuthed && !isOwner && viewerType === "FREELANCER";

  const requireAuth = (e, destination) => {
    if (!isAuthed) {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/login?redirect=${encodeURIComponent(destination)}`);
    }
  };

  const goBusinessProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/businesses/${job.userId}`)}`,
      );
      return;
    }
    if (job?.userId) navigate(`/businesses/${job.userId}`);
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      navigate(`/login?redirect=${encodeURIComponent(`/jobs/${jobId}`)}`);
      return;
    }
    const wasLiked = liked; // capture before toggle flips it
    try {
      await toggle();
      if (wasLiked) {
        toast.info("Bookmark removed", {
          icon: "🔖",
          autoClose: 1500,
        });
      } else {
        toast.success("Bookmark saved!", {
          icon: "❤️",
          autoClose: 1500,
        });
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      navigate(`/login?redirect=${encodeURIComponent(`/jobs/${jobId}`)}`);
      return;
    }
    if (!canApply) {
      navigate(`/jobs/${jobId}`);
      return;
    }
    setShowApply(true);
  };

  return (
    <>
      {showApply && (
        <ApplyJobModal
          job={{ id: jobId, title: job?.title }}
          onClose={() => setShowApply(false)}
        />
      )}

      <div data-aos="fade-up" data-aos-delay="0" data-aos-duration="650">
        <Link
          to={`/jobs/${jobId}`}
          onClick={(e) => requireAuth(e, `/jobs/${jobId}`)}
          className="group flex flex-col w-full rounded-2xl overflow-hidden
                     bg-white dark:bg-slate-800
                     border border-gray-100 dark:border-slate-700
                     shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60
                     hover:-translate-y-1 transition-all duration-300"
        >
          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{ height: "clamp(230px, 25vw, 176px)" }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full
                         backdrop-blur-sm flex items-center justify-center
                         shadow-md transition-all duration-200 hover:scale-110 active:scale-95
                         ${
                           liked && isAuthed
                             ? "bg-[#2563EB]/10 dark:bg-[#2563EB]/20"
                             : "bg-white/90 dark:bg-slate-800/90"
                         }`}
              aria-label={
                isAuthed
                  ? liked
                    ? "Remove bookmark"
                    : "Bookmark"
                  : "Login to bookmark"
              }
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill={liked && isAuthed ? "#2563EB" : "none"}
                stroke={liked && isAuthed ? "#2563EB" : "#9ca3af"}
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

            {!isAuthed && (
              <div
                className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors duration-200
                              flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 pointer-events-none"
              >
                <span className="bg-black/60 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                  Login to view details
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <h3 className="text-[#1E88E5] dark:text-blue-100 font-bold text-lg mb-1 line-clamp-1 truncate">
              {title}
            </h3>

            <p className="text-gray-400 text-md dark:text-gray-300 leading-relaxed mb-3 overflow-hidden line-clamp-3 min-h-[3.75rem]">
              {description}
            </p>

            <div className="flex items-center justify-between mb-3 text-xs text-gray-400 dark:text-gray-300 font-bold">
              <span>Date: {date}</span>
              <span
                className={`font-semibold ${
                  status === "OPEN"
                    ? "text-green-500"
                    : status === "DRAFT"
                      ? "text-yellow-500"
                      : "text-gray-500"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="bg-[#1E88E5]/10 dark:bg-blue-500/20 text-[#1E88E5] dark:text-blue-400
                             text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 mb-3" />

            <div className="flex items-center justify-between mt-auto">
              {/* Author */}
              <button
                type="button"
                onClick={goBusinessProfile}
                className="flex items-center gap-2 text-left"
                aria-label="View business profile"
              >
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_AVATAR;
                  }}
                />
                <span className="text-gray-700 dark:text-gray-300 text-xs font-medium truncate max-w-[110px] w-[13ch]">
                  {authorName}
                </span>
              </button>

              {/* Apply button */}
              <button
                onClick={handleApplyClick}
                className="bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-semibold
                           px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                type="button"
              >
                Apply
              </button>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
