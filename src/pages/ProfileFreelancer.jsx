// src/pages/ProfileFreelancer.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import FreelancerCard from "../components/freelancer/FreelancerCard";
import OwnServiceCard from "../components/card/Ownservicecard";

import { selectIsAuthed } from "../features/auth/authSlice";

import {
  useMeQuery,
  useUpdateFreelancerProfileMutation,
  useUploadProfileImageMutation,
} from "../services/profileApi";

import {
  useGetMyServicesQuery,
  useGetAllServicesQuery,
  useGetServiceBookmarksQuery,
  useGetJobBookmarksQuery,
} from "../services/servicesApi";

import FreelancerProfileUpdate from "../components/freelancerupdate/Freelancerprofileupdate";
import CreatePostModal from "../components/Auth/postcomponent/CreatePostModal";
import { useGetCategoriesQuery } from "../services/categoriesApi";
import { pickArray, normalizeBookmarkItem } from "../utils/normalizeBookmarks";

// ✅ NEW: for public profile user
import { useGetUserByIdQuery } from "../services/userApi";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=User";
const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * mode:
 *  - "owner"  => editable profile + post + favorites + OwnServiceCard
 *  - "public" => same UI but hide owner-only actions + show normal FreelancerCard
 *
 * publicUserId:
 *  - required when mode="public"
 */
export default function ProfileFreelancerPage({ mode = "owner", publicUserId }) {
  const navigate = useNavigate();
  const isOwner = mode === "owner";

  const isAuthed = useSelector(selectIsAuthed);

  // =======================
  // Profile data
  // =======================
  const { data: meRes } = useMeQuery(undefined, { skip: !isAuthed });
  const me = meRes?.data;

  // For public profile, load user by id
  const { data: publicUserRes, isLoading: publicUserLoading } = useGetUserByIdQuery(
    publicUserId,
    { skip: isOwner || !publicUserId }
  );
  const publicUser = publicUserRes?.data ?? publicUserRes;

  // pick current user based on mode
  const user = isOwner ? me : publicUser;

  // Redirect if user opens own public page
  React.useEffect(() => {
    if (!isOwner && me?.id && publicUserId && String(me.id) === String(publicUserId)) {
      navigate("/profile", { replace: true });
    }
  }, [isOwner, me?.id, publicUserId, navigate]);

  // =======================
  // Services
  // =======================
  const {
    data: rawMyServices,
    isLoading: servicesLoadingOwner,
    isError: servicesErrorOwner,
  } = useGetMyServicesQuery(undefined, { skip: !isAuthed || !isOwner });

  const { data: allServicesRaw = [], isLoading: allServicesLoading } = useGetAllServicesQuery();

  // Normalize all services
  const allServices = useMemo(() => {
    if (Array.isArray(allServicesRaw)) return allServicesRaw;
    if (Array.isArray(allServicesRaw?.content)) return allServicesRaw.content;
    if (Array.isArray(allServicesRaw?.data?.content)) return allServicesRaw.data.content;
    if (Array.isArray(allServicesRaw?.data)) return allServicesRaw.data;
    return [];
  }, [allServicesRaw]);

  // Owner services (from API)
  const myServicesOwner = useMemo(() => {
    if (Array.isArray(rawMyServices)) return rawMyServices;
    if (Array.isArray(rawMyServices?.content)) return rawMyServices.content;
    if (Array.isArray(rawMyServices?.data?.content)) return rawMyServices.data.content;
    if (Array.isArray(rawMyServices?.data)) return rawMyServices.data;
    return [];
  }, [rawMyServices]);

  // Public services = filter from allServices
  const servicesPublic = useMemo(() => {
    const uid = String(publicUserId ?? "");
    return allServices.filter((s) => String(s?.userId ?? "") === uid);
  }, [allServices, publicUserId]);

  // Choose correct list
  const baseServices = isOwner ? myServicesOwner : servicesPublic;

  // Loading/Error for service list based on mode
  const servicesLoading = isOwner ? servicesLoadingOwner : allServicesLoading;
  const servicesError = isOwner ? servicesErrorOwner : false;

  // =======================
  // Bookmarks (OWNER ONLY)
  // =======================
  const { data: serviceBookmarksRaw } = useGetServiceBookmarksQuery(undefined, {
    skip: !isAuthed || !isOwner,
  });
  const { data: jobBookmarksRaw } = useGetJobBookmarksQuery(undefined, {
    skip: !isAuthed || !isOwner,
  });

  const serviceBookmarks = useMemo(() => pickArray(serviceBookmarksRaw), [serviceBookmarksRaw]);
  const jobBookmarks = useMemo(() => pickArray(jobBookmarksRaw), [jobBookmarksRaw]);
  const totalFavorites = serviceBookmarks.length + jobBookmarks.length;

  // =======================
  // Mutations (OWNER ONLY)
  // =======================
  const [updateProfile, { isLoading: saving }] = useUpdateFreelancerProfileMutation();

  // =======================
  // UI state
  // =======================
  const [tab, setTab] = useState("information");
  const [editOpen, setEditOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
    experienceYears: 0,
  });
  const [skills, setSkills] = useState([]);
  const [skillText, setSkillText] = useState("");

  React.useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      experienceYears: user.experienceYears || 0,
    });
    setSkills(Array.isArray(user.skills) ? user.skills : []);
  }, [user]);

  const onAddSkill = () => {
    const v = skillText.trim();
    if (!v) return;
    setSkills((p) => (p.includes(v) ? p : [...p, v]));
    setSkillText("");
  };

  const onRemoveSkill = (val) => setSkills((p) => p.filter((x) => x !== val));

  const onSaveProfile = async (profileImageUrl) => {
  if (!isOwner) return;
  try {
    await updateProfile({
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      bio: form.bio,
      experienceYears: form.experienceYears,
      gender: user?.gender || "",
      portfolioUrl: user?.portfolioUrl || "",
      skills,
      ...(profileImageUrl ? { profileImageUrl } : {}),
    }).unwrap();

    setEditOpen(false);
  } catch (e) {
    console.error("update profile error:", e);
  }
};

  // Categories
  const { data: categories = [] } = useGetCategoriesQuery();

  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(String(c.id), c.name);
    return m;
  }, [categories]);

  // Merge createdAt into services (from all services if missing)
  const createdAtMap = useMemo(() => {
    const m = new Map();
    for (const s of allServices) m.set(String(s?.id), s?.createdAt ?? null);
    return m;
  }, [allServices]);

  const servicesForCards = useMemo(() => {
    return (baseServices || []).map((s) => {
      const createdAt = s?.createdAt ?? createdAtMap.get(String(s?.id)) ?? null;
      const categoryName =
        categoryMap.get(String(s?.categoryId)) || s?.category?.name || s?.categoryName || null;

      return {
        ...s,
        createdAt,
        categoryName,
        category: s?.category ?? (categoryName ? { id: s?.categoryId, name: categoryName } : undefined),
      };
    });
  }, [baseServices, createdAtMap, categoryMap]);

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const coverUrl = user?.coverImageUrl || FALLBACK_COVER;

  // Loading for public user
  if (!isOwner && publicUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Cover + Profile header */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-[180px] sm:h-[220px]">
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover z-0" />
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-[96px] h-[96px] rounded-xl overflow-hidden bg-white shadow-md ring-4 ring-white z-10">
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover z-10" />
              </div>

              <div>
                <p className="text-[16px] font-semibold text-gray-900 leading-tight">
                  {user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  {user?.userType || "FREELANCER"} • {user?.address || "—"}
                </p>

                {/* ✅ Owner-only actions */}
                {isOwner && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setEditOpen(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              Message
            </button>
          </div>
        </div>

        {/* Tabs (OWNER ONLY) */}
        {isOwner && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
              {["information", "favorites"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-8 py-2 text-sm font-semibold capitalize flex items-center gap-1.5 ${
                    tab === t ? "bg-purple-600 text-white" : "text-purple-600"
                  }`}
                >
                  {t}
                  {t === "favorites" && totalFavorites > 0 && (
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                        tab === t ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {totalFavorites}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PUBLIC MODE: only show information content (same UI) */}
        {!isOwner && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">About Me</p>
                  <p className="text-xs text-gray-500 mt-2 leading-5">{user?.bio || "—"}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Contact Info</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-2">
                    {/* ✅ hide email/phone if you want privacy, or show only address */}
                    <div>{user?.address || "—"}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Languages</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <div>Khmer</div>
                    <div>English</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Work experience</p>
                <div className="text-sm text-gray-600 mt-3 leading-6">
                  <div>Web developer — Sep 2020 - Nov 2023</div>
                  <div>Java developer — Dec 2023 - Jan 2025</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Skill</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(user?.skills) ? user.skills : []).length === 0 && (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                  {(Array.isArray(user?.skills) ? user.skills : []).map((s) => (
                    <span
                      key={s}
                      className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* All Posts (PUBLIC) - same section but no Post button */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-blue-500 font-bold text-xl">All posts</p>
            </div>

            <div className="mt-4">
              {servicesLoading && (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {servicesError && (
                <p className="text-red-500 text-center py-8">Failed to load services.</p>
              )}

              {!servicesLoading && !servicesError && servicesForCards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <p className="text-sm font-medium">No posts yet</p>
                </div>
              )}

              {!servicesLoading && !servicesError && servicesForCards.length > 0 && (
                <div className="grid gap-x-[50px] gap-y-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1240px] mx-auto">
                  {servicesForCards.map((s) => (
                    <FreelancerCard
                      key={s?.id}
                      id={s?.id}
                      image={(Array.isArray(s?.jobImages) && s.jobImages[0]) || FALLBACK_IMAGE}
                      title={s?.title || "Untitled"}
                      description={s?.description || "No description"}
                      tags={[s?.category?.name || s?.categoryName].filter(Boolean)}
                      date={formatDate(s?.createdAt)}
                      author={user?.fullName || "Freelancer"}
                      avatar={avatarUrl}
                      postType="service"
                      authorId={s?.userId}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* OWNER MODE (original behavior) */}
        {isOwner && tab === "information" && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">About Me</p>
                  <p className="text-xs text-gray-500 mt-2 leading-5">{user?.bio || "—"}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Contact Info</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-2">
                    <div>{user?.email || "—"}</div>
                    <div>{user?.phone || "—"}</div>
                    <div>{user?.address || "—"}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Languages</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <div>Khmer</div>
                    <div>English</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Work experience</p>
                <div className="text-sm text-gray-600 mt-3 leading-6">
                  <div>Web developer — Sep 2020 - Nov 2023</div>
                  <div>Java developer — Dec 2023 - Jan 2025</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Skill</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(user?.skills) ? user.skills : []).length === 0 && (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                  {(Array.isArray(user?.skills) ? user.skills : []).map((s) => (
                    <span
                      key={s}
                      className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* All Posts */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-blue-500 font-bold text-xl">All posts</p>
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

            <div className="mt-4">
              {servicesLoading && (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {servicesError && (
                <p className="text-red-500 text-center py-8">Failed to load services.</p>
              )}

              {!servicesLoading && !servicesError && servicesForCards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <p className="text-sm font-medium">No posts yet</p>
                </div>
              )}

              {!servicesLoading && !servicesError && servicesForCards.length > 0 && (
                <div className="grid gap-x-[50px] gap-y-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1240px] mx-auto">
                  {servicesForCards.map((s) => (
                    <OwnServiceCard
                      key={s?.id}
                      service={s}
                      author={user?.fullName || "Freelancer"}
                      avatar={avatarUrl}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Favorites tab (OWNER ONLY) */}
        {isOwner && tab === "favorites" && (
          <div className="mt-8 space-y-10">
            {/* Bookmarked Freelancer Services */}
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Freelancer Services
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                  {serviceBookmarks.length}
                </span>
              </p>

              {serviceBookmarks.length === 0 ? (
                <EmptyFavorites label="No bookmarked services yet" />
              ) : (
                <div className="grid gap-5 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1240px] mx-auto">
                  {serviceBookmarks.map((row) => {
                    const { target, targetId } = normalizeBookmarkItem(row, "service");
                    return (
                      <FreelancerCard
                        key={targetId ?? row?.id}
                        id={targetId}
                        image={(Array.isArray(target?.imageUrls) && target.imageUrls[0]) || FALLBACK_IMAGE}
                        title={target?.title || "Untitled"}
                        description={target?.description || "No description"}
                        tags={[target?.category?.name || target?.categoryName].filter(Boolean)}
                        date={formatDate(target?.createdAt)}
                        author={target?.authorName || "Freelancer"}
                        avatar={target?.authorAvatar || FALLBACK_AVATAR}
                        postType="service"
                        authorId={target?.userId}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bookmarked Business Job Posts */}
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Job Posts
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                  {jobBookmarks.length}
                </span>
              </p>

              {jobBookmarks.length === 0 ? (
                <EmptyFavorites label="No bookmarked jobs yet" />
              ) : (
                <div className="grid gap-5 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1240px] mx-auto">
                  {jobBookmarks.map((row) => {
                    const { target, targetId } = normalizeBookmarkItem(row, "job");
                    return (
                      <FreelancerCard
                        key={targetId ?? row?.id}
                        id={targetId}
                        image={(Array.isArray(target?.imageUrls) && target.imageUrls[0]) || FALLBACK_IMAGE}
                        title={target?.title || "Untitled"}
                        description={target?.description || "No description"}
                        tags={[target?.category?.name || target?.categoryName].filter(Boolean)}
                        date={formatDate(target?.createdAt)}
                        author={target?.authorName || "Business"}
                        avatar={target?.authorAvatar || FALLBACK_AVATAR}
                        postType="job"
                        authorId={target?.userId}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals (OWNER ONLY) */}
        {isOwner && (
          <>
            <FreelancerProfileUpdate
              editOpen={editOpen}
              setEditOpen={setEditOpen}
              form={form}
              setForm={setForm}
              skills={skills}
              setSkills={setSkills}
              skillText={skillText}
              setSkillText={setSkillText}
              onAddSkill={onAddSkill}
              onRemoveSkill={onRemoveSkill}
              onSaveProfile={onSaveProfile}
              saving={saving}
            />

            {postModalOpen && <CreatePostModal onClose={() => setPostModalOpen(false)} />}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyFavorites({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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