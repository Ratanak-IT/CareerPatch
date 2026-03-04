// src/pages/ProfileBusinessView.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";

import OwnJobCard from "../components/card/OwnJobCard";
import BookmarkedServiceCard from "../components/bookmark/BookmarkedServiceCard";
import BookmarkedJobCard from "../components/bookmark/BookmarkedJobCard";

// ─── Fallbacks ────────────────────────────────────────────────────────────────
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=B";
const FALLBACK_IMAGE = "https://placehold.co/400x220?text=No+Image";

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

function getJobId(job) {
  return job?.id ?? job?.jobId ?? job?._id ?? job?.uuid ?? null;
}

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
        <path
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function BookmarkEmpty({ label }) {
  return (
    <div className="flex flex-col items-center py-10 text-gray-400">
      <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ─── Left sidebar ─────────────────────────────────────────────────────────────
function InfoSidebar({ user }) {
  const workTags = Array.isArray(user?.workWithUs) ? user.workWithUs : [];

  const contactRows = [
    { label: "Email", val: user?.email },
    { label: "Phone", val: user?.phone },
    { label: "Website", val: user?.companyWebsite },
    { label: "Address", val: user?.address },
  ].filter((r) => r.val);

  return (
    <div className="flex flex-col gap-4 w-full lg:w-60 lg:shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-2">About Company</p>
        {user?.bio ? (
          <p className="text-xs text-gray-500 leading-relaxed">{user.bio}</p>
        ) : (
          <p className="text-xs text-gray-400 italic">No bio provided.</p>
        )}
      </div>

      {workTags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-900 mb-3">Work With Us</p>
          <ul className="flex flex-col gap-2">
            {workTags.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
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
            {contactRows.map(({ label, val }) => (
              <div key={label} className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-gray-500 shrink-0">{label}</span>
                <span className="text-xs text-gray-700 break-all text-right leading-snug">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Owner-only View Apply tab list ───────────────────────────────────────────
function ViewApplyTab({ jobs, loading }) {
  if (loading) return <Spinner />;
  if (!jobs.length) return <Empty label="No job posts yet" />;

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const thumb = Array.isArray(job?.jobImages) && job.jobImages[0];
        const jobId = getJobId(job);

        return (
          <div
            key={jobId || job?.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              {thumb ? (
                <img
                  src={thumb}
                  alt={job.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
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
                  {String(job.status).toLowerCase()}
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

// ─── Public job card (NO APPLY) ───────────────────────────────────────────────
function PublicJobCard({ job }) {
  const jobId = getJobId(job);
  if (!jobId) return null;

  const title = job?.title || "Untitled";
  const description = job?.description || "No description available.";
  const categoryName = job?.category?.name || job?.categoryName || null;
  const status = job?.status || "UNKNOWN";
  const date = formatDate(job?.createdAt);

  const image =
    (Array.isArray(job?.jobImages) && job.jobImages[0]) ||
    (Array.isArray(job?.imageUrls) && job.imageUrls[0]) ||
    FALLBACK_IMAGE;

  const tags = [];
  if (categoryName) tags.push(categoryName);
  if (job?.skills?.[0]) tags.push(job.skills[0]);

  return (
    <Link
      to={`/jobs/${jobId}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col w-full border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden" style={{ height: 176 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#1E88E5] font-bold text-sm mb-1 truncate">{title}</h3>

        <p
          className="text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {description}
        </p>

        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <span>Date: {date}</span>
          <span className="font-semibold">
            <span
              className={`font-semibold ${
                status === "OPEN" ? "text-green-500" : status === "DRAFT" ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              {status}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="bg-[#1E88E5] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>

        <div className="border-t border-gray-100 mb-3" />
        <div className="text-xs text-gray-500 font-semibold">View details</div>
      </div>
    </Link>
  );
}

/**
 * Reusable UI:
 * - isOwner=true  => show edit/post/favorites/viewapply
 * - isOwner=false => hide edit/post/favorites/viewapply + NO APPLY in job cards
 */
export default function ProfileBusinessView({
  user,
  jobs = [],
  isOwner = false,

  loadingUser = false,
  loadingJobs = false,
  jobsError = false,

  serviceBookmarks = [],
  jobBookmarks = [],
  loadingServiceBookmarks = false,
  loadingJobBookmarks = false,

  onOpenEdit,
  onOpenPost,
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("information");

  const totalFavorites = (serviceBookmarks?.length || 0) + (jobBookmarks?.length || 0);

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const coverUrl = user?.coverImageUrl || FALLBACK_COVER;

  const jobsNoDraft = useMemo(() => (jobs || []).filter((j) => String(j?.status || "OPEN") !== "DRAFT"), [jobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 py-6">
        {/* ── Cover + header ─────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-45 sm:h-55 bg-gray-200">
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/20" />
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-24 h-24 z-10 rounded-xl overflow-hidden bg-gray-100 shadow-md ring-4 ring-white shrink-0">
                <img
                  src={avatarUrl}
                  alt="logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_AVATAR;
                  }}
                />
              </div>

              <div>
                <p className="text-[16px] font-bold text-gray-900 leading-tight">
                  {loadingUser ? "Loading..." : user?.companyName || user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  {[user?.industry, user?.address].filter(Boolean).join(" • ") || "—"}
                </p>

                {/* Owner-only edit */}
                {isOwner && (
                  <div className="mt-2">
                    <button
                      onClick={onOpenEdit}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Message always visible */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.205V22l3.37-1.85c.9.248 1.853.38 2.942.38 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.44l-2.548-2.717-4.972 2.717 5.473-5.81 2.613 2.717 4.907-2.717-5.473 5.81z" />
              </svg>
              Message
            </button>
          </div>
        </div>

        {/* ── Tabs (OWNER ONLY) ──────────────────────────────────── */}
        {isOwner && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white rounded-xl border border-purple-200 overflow-hidden flex">
              {[
                { key: "information", label: "Information" },
                { key: "favorites", label: "Favorites", badge: totalFavorites },
                { key: "viewapply", label: "View Apply" },
              ].map(({ key, label, badge }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-6 sm:px-8 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    tab === key ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {label}
                  {badge > 0 && (
                    <span
                      className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${
                        tab === key ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PUBLIC MODE: only show information ─────────────────── */}
        {!isOwner && (
          <div className="mt-6 flex flex-col lg:flex-row gap-5">
            <InfoSidebar user={user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 font-bold text-xl">Job Announcement</p>
                <span className="text-xs text-gray-500">{jobsNoDraft.length} posts</span>
              </div>

              {loadingJobs && <Spinner />}
              {!loadingJobs && jobsError && <p className="text-red-500 text-center py-8">Failed to load jobs.</p>}

              {!loadingJobs && !jobsError && jobsNoDraft.length === 0 && (
                <Empty label="No job posts yet" />
              )}

              {!loadingJobs && !jobsError && jobsNoDraft.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {jobsNoDraft.map((j) => (
                    <PublicJobCard key={getJobId(j) || j?.title} job={j} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── OWNER MODE CONTENT ─────────────────────────────────── */}
        {isOwner && tab === "information" && (
          <div className="mt-6 flex flex-col lg:flex-row gap-5">
            <InfoSidebar user={user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 font-bold text-xl">Job Announcement</p>
                <button
                  onClick={onOpenPost}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Post
                </button>
              </div>

              {loadingJobs && <Spinner />}
              {!loadingJobs && jobsError && <p className="text-red-500 text-center py-8">Failed to load jobs.</p>}

              {!loadingJobs && !jobsError && jobs.length === 0 && (
                <Empty label="No job posts yet — click Post to create one" />
              )}

              {!loadingJobs && !jobsError && jobs.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {jobs.map((j) => (
                    <OwnJobCard
                      key={getJobId(j) || j?.title}
                      job={j}
                      author={user?.companyName || user?.fullName || ""}
                      avatar={user?.profileImageUrl ?? null}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Favorites tab (OWNER ONLY) ─────────────────────────── */}
        {isOwner && tab === "favorites" && (
          <div className="mt-8 space-y-10">
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Freelancer Services
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                  {serviceBookmarks.length}
                </span>
              </p>

              {loadingServiceBookmarks ? (
                <Spinner />
              ) : serviceBookmarks.length === 0 ? (
                <BookmarkEmpty label="No bookmarked services yet" />
              ) : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {serviceBookmarks.map((bm) => (
                    <BookmarkedServiceCard key={bm?.id || bm?.service?.id} bm={bm} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Job Posts
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                  {jobBookmarks.length}
                </span>
              </p>

              {loadingJobBookmarks ? (
                <Spinner />
              ) : jobBookmarks.length === 0 ? (
                <BookmarkEmpty label="No bookmarked jobs yet" />
              ) : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {jobBookmarks.map((bm) => (
                    <BookmarkedJobCard key={bm?.id || bm?.job?.id} bm={bm} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── View Apply tab (OWNER ONLY) ────────────────────────── */}
        {isOwner && tab === "viewapply" && (
          <div className="mt-8">
            <p className="text-blue-500 font-bold text-lg mb-4">Your Job Posts</p>
            <ViewApplyTab jobs={jobs} loading={loadingJobs} />
            <div className="mt-4">
              <button
                type="button"
                className="text-blue-500 text-xs font-semibold"
                onClick={() => navigate("/profile-business")}
              >
                Manage my profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}