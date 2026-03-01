// src/pages/ProfileBusiness.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSlice";
import { useMeQuery, useUpdateBusinessProfileMutation, useUploadProfileImageMutation } from "../services/profileApi";
import { useGetMyJobsQuery, useGetServiceBookmarksQuery, useGetJobBookmarksQuery, useGetCategoriesQuery } from "../services/servicesApi";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import OwnJobCard from "../components/card/OwnJobCard";
import CreateJobModal from "../components/Auth/postcomponent/CreateJobModal";

const FALLBACK_COVER  = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/96x96?text=Co";
const FALLBACK_IMAGE  = "https://placehold.co/285x200?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
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

// ─── Edit Business Profile Modal ──────────────────────────────────────────────
function EditBusinessModal({ user, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    fullName:        user?.fullName        || "",
    phone:           user?.phone           || "",
    address:         user?.address         || "",
    companyName:     user?.companyName     || "",
    companyWebsite:  user?.companyWebsite  || "",
    industry:        user?.industry        || "",
    gender:          user?.gender          || "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Edit Business Profile</h2>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold">✕</button>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name",       key: "fullName",       placeholder: "Your name" },
            { label: "Phone",           key: "phone",          placeholder: "+855..." },
            { label: "Address",         key: "address",        placeholder: "City, Country" },
            { label: "Company Name",    key: "companyName",    placeholder: "Tech Co." },
            { label: "Company Website", key: "companyWebsite", placeholder: "https://..." },
            { label: "Industry",        key: "industry",       placeholder: "IT & Software" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                className="bg-slate-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-gray-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="px-8 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Left sidebar: About / Why / Contact ─────────────────────────────────────
function InfoSidebar({ user }) {
  const perks = ["Remote Friendly", "Flexible Schedule", "Long-Term Projects", "Competitive Payment"];
  return (
    <div className="flex flex-col gap-4 w-full lg:w-60 lg:shrink-0">

      {/* About Company */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-2">About Company</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {user?.bio || "Delivering reliable technology services, software development, and smart business solutions."}
        </p>
      </div>

      {/* Why Work With Us */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-3">Why Work With Us</p>
        <ul className="flex flex-col gap-2">
          {perks.map(p => (
            <li key={p} className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-xs text-gray-600">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-3">Contact Info</p>
        <div className="flex flex-col gap-3">
          {[
            { icon: <EmailIcon />, val: user?.email || "—" },
            { icon: <PhoneIcon />, val: user?.phone || "—" },
            { icon: <GlobeIcon />, val: user?.companyWebsite || "—" },
            { icon: <LocationIcon />, val: user?.address || "—" },
          ].map(({ icon, val }) => (
            <div key={val} className="flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">{icon}</span>
              <span className="text-xs text-gray-600 break-all leading-snug">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function Empty({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ─── View Apply tab (applicants who applied to jobs) ─────────────────────────
function ViewApplyTab({ jobs }) {
  // Show a list of jobs with "applied" count — in a real app you'd fetch applications per job
  if (!jobs.length) return <Empty label="No job posts yet" />;
  return (
    <div className="space-y-3">
      {jobs.map(job => (
        <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={(Array.isArray(job?.jobImages) && job.jobImages[0]) || FALLBACK_IMAGE}
              alt={job.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{job.title || "Untitled"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(job.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
              {job?.category?.name || job?.categoryName || "—"}
            </span>
            <span className="text-xs text-gray-400">
              {job?.budget ? `$${job.budget.toLocaleString()}` : "Budget N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfileBusinessPage() {
  const isAuthed = useSelector(selectIsAuthed);

  const { data: meRes } = useMeQuery(undefined, { skip: !isAuthed });
  const user = meRes?.data;

  const { data: rawMyJobs, isLoading: jobsLoading } = useGetMyJobsQuery(undefined, { skip: !isAuthed });
  const { data: serviceBookmarks = [] } = useGetServiceBookmarksQuery(undefined, { skip: !isAuthed });
  const { data: jobBookmarks      = [] } = useGetJobBookmarksQuery(undefined,      { skip: !isAuthed });
  const { data: categories = [] }        = useGetCategoriesQuery();

  const [updateBusinessProfile, { isLoading: saving }] = useUpdateBusinessProfileMutation();
  const [uploadImage, { isLoading: uploading }]        = useUploadProfileImageMutation();

  const [tab,          setTab]          = useState("information");
  const [editOpen,     setEditOpen]     = useState(false);
  const [postModalOpen,setPostModalOpen]= useState(false);

  const myJobs = useMemo(() => {
    if (Array.isArray(rawMyJobs))                return rawMyJobs;
    if (Array.isArray(rawMyJobs?.content))       return rawMyJobs.content;
    if (Array.isArray(rawMyJobs?.data?.content)) return rawMyJobs.data.content;
    if (Array.isArray(rawMyJobs?.data))          return rawMyJobs.data;
    return [];
  }, [rawMyJobs]);

  // Enrich job categoryName from categories map
  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(String(c.id), c.name);
    return m;
  }, [categories]);

  const jobsForCards = useMemo(() =>
    myJobs.map(j => ({
      ...j,
      categoryName: categoryMap.get(String(j?.categoryId)) || j?.category?.name || j?.categoryName || null,
      category: j?.category ?? (categoryMap.get(String(j?.categoryId)) ? { id: j?.categoryId, name: categoryMap.get(String(j?.categoryId)) } : undefined),
    })),
    [myJobs, categoryMap]
  );

  const totalFavorites = serviceBookmarks.length + jobBookmarks.length;

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const coverUrl  = user?.coverImageUrl   || FALLBACK_COVER;

  const onSaveProfile = async (form) => {
    try {
      await updateBusinessProfile(form).unwrap();
      setEditOpen(false);
    } catch (e) { console.error("update business profile error:", e); }
  };

  const onPickProfileImage = async (file) => {
    if (!file) return;
    try { await uploadImage(file).unwrap(); }
    catch (e) { console.error("upload image error:", e); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 py-6">

        {/* ── Cover + header ──────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-45 sm:h-55">
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/20" />
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Company logo / avatar */}
              <div className="-mt-12 sm:-mt-14 w-24 h-24 z-10 rounded-xl overflow-hidden bg-white shadow-md ring-4 ring-white shrink-0">
                <img src={avatarUrl} alt="logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-gray-900 leading-tight">
                  {user?.companyName || user?.fullName || "Company Name"}
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  {user?.industry || "Industry"} • {user?.address || "Location"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                  <label className="cursor-pointer text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                    {uploading ? "Uploading..." : "Change Photo"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => onPickProfileImage(e.target.files?.[0])} />
                  </label>
                </div>
              </div>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.205V22l3.37-1.85c.9.248 1.853.38 2.942.38 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.44l-2.548-2.717-4.972 2.717 5.473-5.81 2.613 2.717 4.907-2.717-5.473 5.81z" /></svg>
              Message
            </button>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-xl border border-purple-200 overflow-hidden flex">
            {[
              { key: "information", label: "Information" },
              { key: "favorites",   label: "Favorites",   badge: totalFavorites },
              { key: "viewapply",   label: "View Apply" },
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-6 sm:px-8 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  tab === key
                    ? "bg-purple-600 text-white"
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                {label}
                {badge > 0 && (
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${
                    tab === key ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Information tab ──────────────────────────────────────── */}
        {tab === "information" && (
          <div className="mt-6 flex flex-col lg:flex-row gap-5">

            {/* Left sidebar */}
            <InfoSidebar user={user} />

            {/* Right: job announcements */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 font-bold text-xl">Job Announcement</p>
                <button
                  onClick={() => setPostModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Post
                </button>
              </div>

              {jobsLoading && (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!jobsLoading && jobsForCards.length === 0 && (
                <Empty label="No job posts yet — click Post to create one" />
              )}

              {!jobsLoading && jobsForCards.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {jobsForCards.map(j => (
                    <OwnJobCard
                      key={j.id}
                      job={j}
                      author={user?.companyName || user?.fullName || "Business"}
                      avatar={avatarUrl}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Favorites tab ────────────────────────────────────────── */}
        {tab === "favorites" && (
          <div className="mt-8 space-y-10">

            {/* Bookmarked Service posts */}
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Freelancer Services
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                  {serviceBookmarks.length}
                </span>
              </p>
              {serviceBookmarks.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-gray-400">
                  <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                  </svg>
                  <p className="text-sm">No bookmarked services yet</p>
                </div>
              ) : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {serviceBookmarks.map(s => (
                    <FreelancerCard
                      key={s?.id}
                      id={s?.id}
                      image={(Array.isArray(s?.imageUrls) && s.imageUrls[0]) || FALLBACK_IMAGE}
                      title={s?.title || "Untitled"}
                      description={s?.description || "No description"}
                      tags={[s?.category?.name || s?.categoryName].filter(Boolean)}
                      date={formatDate(s?.createdAt)}
                      author={s?.authorName || "Freelancer"}
                      avatar={s?.authorAvatar || "https://placehold.co/32x32?text=?"}
                      postType="service"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Job posts */}
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Job Posts
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                  {jobBookmarks.length}
                </span>
              </p>
              {jobBookmarks.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-gray-400">
                  <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                  </svg>
                  <p className="text-sm">No bookmarked jobs yet</p>
                </div>
              ) : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {jobBookmarks.map(j => (
                    <FreelancerCard
                      key={j?.id}
                      id={j?.id}
                      image={(Array.isArray(j?.imageUrls) && j.imageUrls[0]) || FALLBACK_IMAGE}
                      title={j?.title || "Untitled"}
                      description={j?.description || "No description"}
                      tags={[j?.category?.name || j?.categoryName].filter(Boolean)}
                      date={formatDate(j?.createdAt)}
                      author={j?.authorName || "Business"}
                      avatar={j?.authorAvatar || "https://placehold.co/32x32?text=?"}
                      postType="job"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── View Apply tab ───────────────────────────────────────── */}
        {tab === "viewapply" && (
          <div className="mt-8">
            <p className="text-blue-500 font-bold text-lg mb-4">Applications on Your Jobs</p>
            <ViewApplyTab jobs={jobsForCards} />
          </div>
        )}

      </div>

      {/* ── Edit modal ──────────────────────────────────────────────── */}
      {editOpen && (
        <EditBusinessModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={onSaveProfile}
          saving={saving}
        />
      )}

      {/* ── Post job modal ───────────────────────────────────────────── */}
      {postModalOpen && <CreateJobModal onClose={() => setPostModalOpen(false)} />}
    </div>
  );
}
