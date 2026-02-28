import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import OwnServiceCard from "../components/card/Ownservicecard";

import { selectFavoriteIds } from "../features/favorites/favoritesSlice";

import {
  useMeQuery,
  useUpdateFreelancerProfileMutation,
  useUploadProfileImageMutation,
} from "../services/profileApi";

import {
  useGetMyServicesQuery,
  useGetAllServicesQuery,
} from "../services/servicesApi";

import FreelancerProfileUpdate from "../components/freelancerupdate/Freelancerprofileupdate";
import CreatePostModal from "../components/Auth/postcomponent/CreatePostModal";
import { useGetCategoriesQuery } from "../services/categoriesApi";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=User";
const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";

  let v = value;

  // numeric string -> number
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);

  // seconds -> ms
  if (typeof v === "number" && v < 1e12) v = v * 1000;

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function ProfileFreelancerPage() {
  // ── API data ───────────────────────────────────────────────────────────────
  const { data: meRes } = useMeQuery();
  const user = meRes?.data;

  // Own services (NO createdAt returned by backend)
  const {
    data: rawMyServices,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useGetMyServicesQuery();

  // All services (HAS createdAt)
  const { data: allServicesRaw = [] } = useGetAllServicesQuery();

  // normalizeList in servicesApi already returns a flat array —
  // keep fallback normalization here just in case
  const myServices = useMemo(() => {
    if (Array.isArray(rawMyServices)) return rawMyServices;
    if (Array.isArray(rawMyServices?.content)) return rawMyServices.content;
    if (Array.isArray(rawMyServices?.data?.content)) return rawMyServices.data.content;
    if (Array.isArray(rawMyServices?.data)) return rawMyServices.data;
    return [];
  }, [rawMyServices]);

  const allServices = useMemo(() => {
    if (Array.isArray(allServicesRaw)) return allServicesRaw;
    if (Array.isArray(allServicesRaw?.content)) return allServicesRaw.content;
    if (Array.isArray(allServicesRaw?.data?.content)) return allServicesRaw.data.content;
    if (Array.isArray(allServicesRaw?.data)) return allServicesRaw.data;
    return [];
  }, [allServicesRaw]);

  const [updateProfile, { isLoading: saving }] =
    useUpdateFreelancerProfileMutation();
  const [uploadImage, { isLoading: uploading }] =
    useUploadProfileImageMutation();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [tab, setTab] = useState("information");
  const [editOpen, setEditOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const favoriteIds = useSelector(selectFavoriteIds);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
    experienceYears: 0,
  });
  const [skills, setSkills] = useState([]);
  const [skillText, setSkillText] = useState("");

  // ── Sync form when user loads ──────────────────────────────────────────────
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

  const onSaveProfile = async () => {
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
      }).unwrap();
      setEditOpen(false);
    } catch (e) {
      console.error("update profile error:", e);
    }
  };

  const onPickProfileImage = async (file) => {
    if (!file) return;
    try {
      await uploadImage(file).unwrap();
    } catch (e) {
      console.error("upload image error:", e);
    }
  };

  // ── Categories ─────────────────────────────────────────────────────────────
  const { data: categories = [] } = useGetCategoriesQuery();

  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(String(c.id), c.name);
    return m;
  }, [categories]);

  // ── Merge createdAt from /services into /own-service by matching id ────────
  const createdAtMap = useMemo(() => {
    const m = new Map();
    for (const s of allServices) m.set(String(s?.id), s?.createdAt ?? null);
    return m;
  }, [allServices]);

  const myServicesMerged = useMemo(() => {
    return (myServices || []).map((s) => ({
      ...s,
      createdAt: s?.createdAt ?? createdAtMap.get(String(s?.id)) ?? null,
    }));
  }, [myServices, createdAtMap]);

  // ── Add categoryName/category object for card UI ───────────────────────────
  const servicesForCards = useMemo(() => {
    return (myServicesMerged || []).map((s) => {
      const categoryName =
        categoryMap.get(String(s?.categoryId)) ||
        s?.category?.name ||
        s?.categoryName ||
        null;

      return {
        ...s,
        categoryName,
        category:
          s?.category ??
          (categoryName ? { id: s?.categoryId, name: categoryName } : undefined),
      };
    });
  }, [myServicesMerged, categoryMap]);

  // ── Favorites (use merged list so date works too) ──────────────────────────
  const favoriteServices = useMemo(() => {
    const set = new Set(favoriteIds.map(String));
    return servicesForCards.filter((s) => set.has(String(s?.id)));
  }, [servicesForCards, favoriteIds]);

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const coverUrl = user?.coverImageUrl || FALLBACK_COVER;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* ── Cover + Profile header ─────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-[180px] sm:h-[220px]">
            <img
              src={coverUrl}
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-[96px] h-[96px] rounded-xl overflow-hidden bg-white shadow-md ring-4 ring-white">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-gray-900 leading-tight">
                  {user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  {user?.userType || "FREELANCER"} • {user?.address || "—"}
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onPickProfileImage(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              Message
            </button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
            {["information", "favorites"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-8 py-2 text-sm font-semibold capitalize ${
                  tab === t ? "bg-purple-600 text-white" : "text-purple-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Information tab ────────────────────────────────────────────── */}
        {tab === "information" && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    About Me
                  </p>
                  <p className="text-xs text-gray-500 mt-2 leading-5">
                    {user?.bio || "—"}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Contact Info
                  </p>
                  <div className="text-xs text-gray-600 mt-2 space-y-2">
                    <div>{user?.email || "—"}</div>
                    <div>{user?.phone || "—"}</div>
                    <div>{user?.address || "—"}</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Languages
                  </p>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <div>Khmer</div>
                    <div>English</div>
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">
                  Work experience
                </p>
                <div className="text-sm text-gray-600 mt-3 leading-6">
                  <div>Web developer — Sep 2020 - Nov 2023</div>
                  <div>Java developer — Dec 2023 - Jan 2025</div>
                </div>
              </div>

              {/* Right */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Skill</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(user?.skills) ? user.skills : []).length ===
                    0 && <p className="text-sm text-gray-400">—</p>}
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

            {/* ── All Posts ─────────────────────────────────────────────── */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-blue-500 font-bold text-xl">All posts</p>
              <button
                onClick={() => setPostModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M12 4v16m8-8H4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                <p className="text-red-500 text-center py-8">
                  Failed to load services.
                </p>
              )}
              {!servicesLoading && !servicesError && servicesForCards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg
                    className="w-12 h-12 mb-3 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                  <p className="text-sm font-medium">No posts yet</p>
                  <p className="text-xs mt-1">
                    Click the Post button to create your first service
                  </p>
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

        {/* ── Favorites tab ─────────────────────────────────────────────── */}
        {tab === "favorites" && (
          <div className="mt-8">
            <p className="text-blue-500 font-bold text-xl mb-4">Favorites</p>
            {favoriteServices.length === 0 && (
              <p className="text-gray-400 text-center py-12">
                No favorites yet.
              </p>
            )}
            {favoriteServices.length > 0 && (
              <div className="grid gap-x-[50px] gap-y-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1240px] mx-auto">
                {favoriteServices.map((s) => {
                  const image =
                    Array.isArray(s?.imageUrls) && s.imageUrls.length > 0
                      ? s.imageUrls[0]
                      : FALLBACK_IMAGE;

                  return (
                    <FreelancerCard
                      key={s?.id}
                      id={s?.id}
                      image={image}
                      title={s?.title || "Untitled"}
                      description={s?.description || "No description"}
                      tags={[s?.category?.name || s?.categoryName].filter(Boolean)}
                      date={formatDate(s?.createdAt)}
                      author={user?.fullName || "Freelancer"}
                      avatar={avatarUrl}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Edit Profile Modal ────────────────────────────────────────── */}
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

        {/* Create Post Modal */}
        {postModalOpen && (
          <CreatePostModal onClose={() => setPostModalOpen(false)} />
        )}
      </div>
    </div>
  );
}