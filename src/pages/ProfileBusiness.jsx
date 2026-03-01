// src/pages/ProfileBusiness.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSlice";
import { useMeQuery } from "../services/profileApi";
import {
  useGetMyJobsQuery,
  useGetServiceBookmarksQuery,
  useGetJobBookmarksQuery,
  useGetCategoriesQuery,
} from "../services/servicesApi";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import OwnJobCard from "../components/card/OwnJobCard";
import CreateJobModal from "../components/Auth/postcomponent/CreateJobModal";
import EditBusinessModal from "../components/Auth/EditBusinessModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function extractArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.data?.content)) return raw.data.content;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 5.17 2 2 0 012.1 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Empty({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function BookmarkEmpty({ label }) {
  return (
    <div className="flex flex-col items-center py-10 text-gray-400">
      <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ─── Left sidebar ─────────────────────────────────────────────────────────────
function InfoSidebar({ user }) {
  const workTags = Array.isArray(user?.workWithUs) ? user.workWithUs : [];
  const contactRows = [
    { icon: <EmailIcon />,    val: user?.email },
    { icon: <PhoneIcon />,    val: user?.phone },
    { icon: <GlobeIcon />,    val: user?.companyWebsite },
    { icon: <LocationIcon />, val: user?.address },
  ].filter((r) => r.val);

  return (
    <div className="flex flex-col gap-4 w-full lg:w-60 lg:shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-2">About Company</p>
        {user?.bio
          ? <p className="text-xs text-gray-500 leading-relaxed">{user.bio}</p>
          : <p className="text-xs text-gray-400 italic">No bio provided.</p>}
      </div>

      {workTags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-900 mb-3">Work With Us</p>
          <ul className="flex flex-col gap-2">
            {workTags.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon />
                <span className="text-xs text-gray-600">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contactRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-900 mb-3">Contact Info</p>
          <div className="flex flex-col gap-3">
            {contactRows.map(({ icon, val }) => (
              <div key={val} className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">{icon}</span>
                <span className="text-xs text-gray-600 break-all leading-snug">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── View Apply tab ───────────────────────────────────────────────────────────
function ViewApplyTab({ jobs, loading }) {
  if (loading) return <Spinner />;
  if (!jobs.length) return <Empty label="No job posts yet" />;
  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const thumb = Array.isArray(job?.jobImages) && job.jobImages[0];
        return (
          <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {thumb ? (
                <img src={thumb} alt={job.title} className="w-12 h-12 rounded-xl object-cover shrink-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                  </svg>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{job.title || "Untitled"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(job.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {(job?.category?.name || job?.categoryName) && (
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {job?.category?.name || job?.categoryName}
                </span>
              )}
              {job?.status && (
                <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {job.status.toLowerCase()}
                </span>
              )}
              {job?.budget != null && (
                <span className="text-xs text-gray-500 font-medium">${Number(job.budget).toLocaleString()}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfileBusinessPage() {
  const isAuthed = useSelector(selectIsAuthed);

  const { data: meRes, isLoading: meLoading, refetch: refetchMe } =
    useMeQuery(undefined, { skip: !isAuthed });
  const user = meRes?.data ?? meRes ?? null;

  const { data: rawMyJobs,           isLoading: jobsLoading }             = useGetMyJobsQuery(undefined,           { skip: !isAuthed });
  const { data: rawServiceBookmarks, isLoading: serviceBookmarksLoading } = useGetServiceBookmarksQuery(undefined, { skip: !isAuthed });
  const { data: rawJobBookmarks,     isLoading: jobBookmarksLoading }     = useGetJobBookmarksQuery(undefined,     { skip: !isAuthed });
  const { data: rawCategories }                                            = useGetCategoriesQuery();

  const [tab,           setTab]           = useState("information");
  const [editOpen,      setEditOpen]      = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const myJobs           = useMemo(() => extractArray(rawMyJobs),           [rawMyJobs]);
  const serviceBookmarks = useMemo(() => extractArray(rawServiceBookmarks), [rawServiceBookmarks]);
  const jobBookmarks     = useMemo(() => extractArray(rawJobBookmarks),     [rawJobBookmarks]);
  const categories       = useMemo(() => extractArray(rawCategories),       [rawCategories]);

  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(String(c.id), c.name);
    return m;
  }, [categories]);

  const jobsForCards = useMemo(
    () => myJobs.map((j) => ({
      ...j,
      categoryName: categoryMap.get(String(j?.categoryId)) ?? j?.category?.name ?? j?.categoryName ?? null,
      category: j?.category ?? (categoryMap.has(String(j?.categoryId))
        ? { id: j.categoryId, name: categoryMap.get(String(j.categoryId)) }
        : undefined),
    })),
    [myJobs, categoryMap]
  );

  const totalFavorites = serviceBookmarks.length + jobBookmarks.length;
  const avatarUrl = user?.profileImageUrl ?? null;
  const coverUrl  = user?.coverImageUrl   ?? null;

  if (meLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 py-6">

        {/* ── Cover + header ─────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-45 sm:h-55 bg-gray-200">
            {coverUrl && (
              <>
                <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-900/20" />
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-24 h-24 z-10 rounded-xl overflow-hidden bg-gray-100 shadow-md ring-4 ring-white shrink-0">
                {avatarUrl
                  ? <img src={avatarUrl} alt="logo" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                      {(user?.companyName || user?.fullName || "?")[0].toUpperCase()}
                    </div>}
              </div>
              <div>
                <p className="text-[16px] font-bold text-gray-900 leading-tight">
                  {user?.companyName || user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  {[user?.industry, user?.address].filter(Boolean).join(" • ") || "—"}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.205V22l3.37-1.85c.9.248 1.853.38 2.942.38 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.44l-2.548-2.717-4.972 2.717 5.473-5.81 2.613 2.717 4.907-2.717-5.473 5.81z" />
              </svg>
              Message
            </button>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-xl border border-purple-200 overflow-hidden flex">
            {[
              { key: "information", label: "Information" },
              { key: "favorites",   label: "Favorites",  badge: totalFavorites },
              { key: "viewapply",   label: "View Apply" },
            ].map(({ key, label, badge }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-6 sm:px-8 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  tab === key ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                {label}
                {badge > 0 && (
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${
                    tab === key ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
                  }`}>{badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Information tab ──────────────────────────────────── */}
        {tab === "information" && (
          <div className="mt-6 flex flex-col lg:flex-row gap-5">
            <InfoSidebar user={user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 font-bold text-xl">Job Announcement</p>
                <button onClick={() => setPostModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Post
                </button>
              </div>
              {jobsLoading && <Spinner />}
              {!jobsLoading && jobsForCards.length === 0 && <Empty label="No job posts yet — click Post to create one" />}
              {!jobsLoading && jobsForCards.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {jobsForCards.map((j) => (
                    <OwnJobCard key={j.id} job={j}
                      author={user?.companyName || user?.fullName || ""} avatar={avatarUrl} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Favorites tab ────────────────────────────────────── */}
        {tab === "favorites" && (
          <div className="mt-8 space-y-10">
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Freelancer Services
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">{serviceBookmarks.length}</span>
              </p>
              {serviceBookmarksLoading ? <Spinner /> : serviceBookmarks.length === 0 ? <BookmarkEmpty label="No bookmarked services yet" /> : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {serviceBookmarks.map((s) => (
                    <FreelancerCard key={s?.id} id={s?.id}
                      image={(Array.isArray(s?.imageUrls) && s.imageUrls[0]) || undefined}
                      title={s?.title || "Untitled"} description={s?.description || ""}
                      tags={[s?.category?.name || s?.categoryName].filter(Boolean)}
                      date={formatDate(s?.createdAt)} author={s?.authorName || s?.ownerName || ""}
                      avatar={s?.authorAvatar || s?.ownerAvatar || undefined} postType="service" />
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Job Posts
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">{jobBookmarks.length}</span>
              </p>
              {jobBookmarksLoading ? <Spinner /> : jobBookmarks.length === 0 ? <BookmarkEmpty label="No bookmarked jobs yet" /> : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {jobBookmarks.map((j) => (
                    <FreelancerCard key={j?.id} id={j?.id}
                      image={(Array.isArray(j?.jobImages) && j.jobImages[0]) || (Array.isArray(j?.imageUrls) && j.imageUrls[0]) || undefined}
                      title={j?.title || "Untitled"} description={j?.description || ""}
                      tags={[j?.category?.name || j?.categoryName].filter(Boolean)}
                      date={formatDate(j?.createdAt)} author={j?.authorName || j?.ownerName || ""}
                      avatar={j?.authorAvatar || j?.ownerAvatar || undefined} postType="job" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── View Apply tab ───────────────────────────────────── */}
        {tab === "viewapply" && (
          <div className="mt-8">
            <p className="text-blue-500 font-bold text-lg mb-4">Your Job Posts</p>
            <ViewApplyTab jobs={jobsForCards} loading={jobsLoading} />
          </div>
        )}
      </div>

      {editOpen && (
        <EditBusinessModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={() => { refetchMe(); }}
        />
      )}

      {postModalOpen && <CreateJobModal onClose={() => setPostModalOpen(false)} />}
    </div>
  );
}