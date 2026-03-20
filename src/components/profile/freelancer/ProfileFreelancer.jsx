// src/components/profile/freelancer/ProfileFreelancer.jsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import FreelancerCard from "../../freelancer/FreelancerCard";
import BookmarkedJobCard from "../../bookmark/BookmarkedJobCard";
import OwnServiceCard from "../../card/Ownservicecard";

import {
  selectIsAuthed,
  selectAuthUser,
} from "../../../features/auth/authSlice";
import { supabase } from "../../../lib/supabaseClient";

import {
  useMeQuery,
  useUpdateFreelancerProfileMutation,
} from "../../../services/profileApi";

import {
  useGetMyServicesQuery,
  useGetAllServicesQuery,
  useGetServiceBookmarksQuery,
  useGetJobBookmarksQuery,
} from "../../../services/servicesApi";

import FreelancerProfileUpdate from "../../Auth/modals/Freelancerprofileupdate";
import CreatePostModal from "../../Auth/modals/CreatePostModal";
import { useGetCategoriesQuery } from "../../../services/categoriesApi";
import {
  pickArray,
  normalizeBookmarkItem,
} from "../../../utils/normalizeBookmarks";
import { useGetUserByIdQuery } from "../../../services/userApi";
import {
  EditPortfolioButton,
  ViewPortfolioButton,
} from "../../portfolio/PortfolioButtons";
import ProfileCompletionBar from "../ProfileCompletionBar";
import ShareButton from "../../common/ShareButton";
import cover from "../../../assets/covercall.png"

const FALLBACK_COVER =cover;
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=User";
const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";


export default function ProfileFreelancerPage({ mode = "owner", publicUserId }) {
  const navigate = useNavigate();
  const isOwner = mode === "owner";

  const isAuthed = useSelector(selectIsAuthed);
  const authUser = useSelector(selectAuthUser);

  /* ── Profile data ─────────────────────────────────────────────── */
  const { data: meRes } = useMeQuery(undefined, { skip: !isAuthed });
  const me = meRes?.data;

  const { data: publicUserRes, isLoading: publicUserLoading } =
    useGetUserByIdQuery(publicUserId, { skip: isOwner || !publicUserId });
  const publicUser = publicUserRes?.data ?? publicUserRes;

  const user = isOwner ? me : publicUser;
  const myId = authUser?.id ?? authUser?.userId ?? me?.id ?? null;
  const isSelf =
    !isOwner && myId && publicUserId && String(myId) === String(publicUserId);

  React.useEffect(() => {
    if (!isOwner && myId && publicUserId && String(myId) === String(publicUserId)) {
      navigate("/profile", { replace: true });
    }
  }, [isOwner, myId, publicUserId, navigate]);

  /* ── Cover — Supabase ─────────────────────────────────────────── */
  const [supabaseCoverUrl, setSupabaseCoverUrl] = useState(FALLBACK_COVER);
  const [liveCoverUrl, setLiveCoverUrl] = useState(null);

  useEffect(() => {
    const userId = String(user?.id ?? user?.userId ?? "");
    if (!userId) return;
    supabase
      .from("user_covers")
      .select("cover_url")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.cover_url) setSupabaseCoverUrl(data.cover_url);
        else setSupabaseCoverUrl(FALLBACK_COVER);
      });
  }, [user?.id, user?.userId]);

  const coverUrl = liveCoverUrl || supabaseCoverUrl;

  /* ── Portfolio existence check (for completion bar) ──────────── */
  const [hasPortfolio, setHasPortfolio] = useState(false);
  useEffect(() => {
    const userId = String(user?.id ?? user?.userId ?? "");
    if (!userId || !isOwner) return;
    supabase
      .from("portfolios")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setHasPortfolio(!!data));
  }, [user?.id, user?.userId, isOwner]);

  const hasCover = supabaseCoverUrl !== FALLBACK_COVER || !!liveCoverUrl;

  /* ── Services ─────────────────────────────────────────────────── */
  const {
    data: rawMyServices,
    isLoading: servicesLoadingOwner,
    isError: servicesErrorOwner,
  } = useGetMyServicesQuery(undefined, { skip: !isAuthed || !isOwner });

  const { data: allServicesRaw = [], isLoading: allServicesLoading } =
    useGetAllServicesQuery();

  const allServices = useMemo(() => {
    if (Array.isArray(allServicesRaw)) return allServicesRaw;
    if (Array.isArray(allServicesRaw?.content)) return allServicesRaw.content;
    if (Array.isArray(allServicesRaw?.data?.content))
      return allServicesRaw.data.content;
    if (Array.isArray(allServicesRaw?.data)) return allServicesRaw.data;
    return [];
  }, [allServicesRaw]);

  const myServicesOwner = useMemo(() => {
    if (Array.isArray(rawMyServices)) return rawMyServices;
    if (Array.isArray(rawMyServices?.content)) return rawMyServices.content;
    if (Array.isArray(rawMyServices?.data?.content))
      return rawMyServices.data.content;
    if (Array.isArray(rawMyServices?.data)) return rawMyServices.data;
    return [];
  }, [rawMyServices]);

  const servicesPublic = useMemo(() => {
    const uid = String(publicUserId ?? "");
    return allServices.filter((s) => String(s?.userId ?? "") === uid);
  }, [allServices, publicUserId]);

  const baseServices = isOwner ? myServicesOwner : servicesPublic;
  const servicesLoading = isOwner ? servicesLoadingOwner : allServicesLoading;
  const servicesError = isOwner ? servicesErrorOwner : false;

  /* ── Bookmarks (OWNER ONLY) ───────────────────────────────────── */
  const { data: serviceBookmarksRaw } = useGetServiceBookmarksQuery(undefined, {
    skip: !isAuthed || !isOwner,
  });
  const { data: jobBookmarksRaw } = useGetJobBookmarksQuery(undefined, {
    skip: !isAuthed || !isOwner,
  });

  const serviceBookmarks = useMemo(
    () => pickArray(serviceBookmarksRaw),
    [serviceBookmarksRaw],
  );
  const jobBookmarks = useMemo(
    () => pickArray(jobBookmarksRaw),
    [jobBookmarksRaw],
  );
  const totalFavorites = serviceBookmarks.length + jobBookmarks.length;

  /* ── Mutations ────────────────────────────────────────────────── */
  const [updateProfile, { isLoading: saving }] =
    useUpdateFreelancerProfileMutation();

  /* ── UI state ─────────────────────────────────────────────────── */
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

  /* ── Categories ───────────────────────────────────────────────── */
  const { data: categories = [] } = useGetCategoriesQuery();

  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(String(c.id), c.name);
    return m;
  }, [categories]);

  const createdAtMap = useMemo(() => {
    const m = new Map();
    for (const s of allServices) m.set(String(s?.id), s?.createdAt ?? null);
    return m;
  }, [allServices]);

  const servicesForCards = useMemo(() => {
    return (baseServices || []).map((s) => {
      const createdAt = s?.createdAt ?? createdAtMap.get(String(s?.id)) ?? null;
      const categoryName =
        categoryMap.get(String(s?.categoryId)) ||
        s?.category?.name ||
        s?.categoryName ||
        null;
      return {
        ...s,
        createdAt,
        categoryName,
        category:
          s?.category ??
          (categoryName ? { id: s?.categoryId, name: categoryName } : undefined),
      };
    });
  }, [baseServices, createdAtMap, categoryMap]);

  /* ── Message handler ──────────────────────────────────────────── */
  const handleMessage = useCallback(() => {
    if (!authUser) { navigate("/login"); return; }
    navigate("/chat", {
      state: {
        recipientId: String(user?.id ?? user?.userId ?? ""),
        recipientName: user?.fullName || "Freelancer",
        recipientAvatar: user?.profileImageUrl || null,
      },
    });
  }, [navigate, authUser, user]);

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const profileUserId = String(user?.id ?? user?.userId ?? "");

  /* ── Loading gate ─────────────────────────────────────────────── */
  if (!isOwner && publicUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cardGrid =
    "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";

  /* ── Shared info sidebar ──────────────────────────────────────── */
  const InfoSidebar = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">About Me</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-5">
          {user?.bio || "—"}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Contact Info</p>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1.5">
          {isOwner && <div>{user?.email || "—"}</div>}
          {isOwner && <div>{user?.phone || "—"}</div>}
          <div>{user?.address || "—"}</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Languages</p>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
          <div>Khmer</div>
          <div>English</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6">

        {/* ── Cover + header ──────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="relative h-[180px] sm:h-[220px]">
            <img
              src={coverUrl}
              alt="cover"
              className="w-full h-full object-cover"
              onError={() => setSupabaseCoverUrl(FALLBACK_COVER)}
            />
          </div>

          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="-mt-12 sm:-mt-14 w-24 h-24 rounded-xl overflow-hidden
                                bg-white dark:bg-gray-700 shadow-md
                                ring-4 ring-white dark:ring-gray-800 shrink-0 z-10">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                  />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-gray-900 dark:text-white leading-tight">
                    {user?.fullName || "—"}
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                    {user?.userType || "FREELANCER"} • {user?.address || "—"}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row items-center justify-start gap-2 w-full sm:w-auto">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
                                 px-4 py-2 rounded-lg transition-colors text-center whitespace-nowrap"
                    >
                      Edit Profile
                    </button>
                    <EditPortfolioButton />
                    <ShareButton url={`/freelancers/${profileUserId}`} title={`Check out ${user?.fullName || "my profile"} on CareerPatch!`} />
                  </>
                ) : !isSelf ? (
                  <>
                    <button
                      onClick={handleMessage}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
                                 px-4 py-2 rounded-lg transition-colors text-center whitespace-nowrap"
                    >
                      Message
                    </button>
                    <ViewPortfolioButton userId={profileUserId} />
                    <ShareButton url={`/freelancers/${profileUserId}`} title={`Check out ${user?.fullName || "this freelancer"} on CareerPatch!`} />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Completion Bar (OWNER ONLY) ─────────────────── */}
        {isOwner && (
          <div className="mt-4">
            <ProfileCompletionBar
              user={user}
              hasPortfolio={hasPortfolio}
              hasCover={hasCover}
              onEditClick={() => setEditOpen(true)}
            />
          </div>
        )}

        {/* ── Tabs (OWNER ONLY) ────────────────────────────────────── */}
        {isOwner && (
          <div className="mt-4 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex">
              {["information", "favorites"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-8 py-2.5 text-sm font-semibold capitalize flex items-center gap-1.5 transition-all
                    ${tab === t
                      ? "bg-purple-600 text-white"
                      : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }`}
                >
                  {t}
                  {t === "favorites" && totalFavorites > 0 && (
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 font-bold
                        ${tab === t
                          ? "bg-white/20 text-white"
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
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

        {/* ── PUBLIC: information ──────────────────────────────────── */}
        {!isOwner && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              <InfoSidebar />
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Overview</p>
                <div className="mt-3 space-y-3">

                  {/* Experience years */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Experience</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.experienceYears ? `${user.experienceYears} year${user.experienceYears > 1 ? "s" : ""}` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Member since */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Member since</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Total posts */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Total posts</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {servicesForCards.length} post{servicesForCards.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Portfolio link */}
                  <div className="pt-1">
                    <ViewPortfolioButton userId={profileUserId} />
                  </div>

                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Skill</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(user?.skills) ? user.skills : []).length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">—</p>
                  )}
                  {(Array.isArray(user?.skills) ? user.skills : []).map((s) => (
                    <span key={s}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                                 text-xs font-semibold px-3 py-1 rounded-full
                                 border border-blue-100 dark:border-blue-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-blue-500 dark:text-blue-400 font-bold text-xl">All posts</p>
            </div>
            <ServiceGrid
              loading={servicesLoading}
              error={servicesError}
              services={servicesForCards}
              user={user}
              avatarUrl={avatarUrl}
              gridCls={cardGrid}
              isOwner={false}
            />
          </>
        )}

        {/* ── OWNER: information tab ───────────────────────────────── */}
        {isOwner && tab === "information" && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              <InfoSidebar />
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Overview</p>
                <div className="mt-3 space-y-3">

                  {/* Experience years */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Experience</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.experienceYears ? `${user.experienceYears} year${user.experienceYears > 1 ? "s" : ""}` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Member since */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Member since</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Total posts */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Total posts</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {servicesForCards.length} post{servicesForCards.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Portfolio link */}
                  <div className="pt-1">
                    <ViewPortfolioButton userId={profileUserId} />
                  </div>

                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Skill</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(user?.skills) ? user.skills : []).length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">—</p>
                  )}
                  {(Array.isArray(user?.skills) ? user.skills : []).map((s) => (
                    <span key={s}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                                 text-xs font-semibold px-3 py-1 rounded-full
                                 border border-blue-100 dark:border-blue-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-blue-500 dark:text-blue-400 font-bold text-xl">All posts</p>
              <button
                onClick={() => setPostModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
                           px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Post
              </button>
            </div>
            <ServiceGrid
              loading={servicesLoading}
              error={servicesError}
              services={servicesForCards}
              user={user}
              avatarUrl={avatarUrl}
              gridCls={cardGrid}
              isOwner={true}
            />
          </>
        )}

        {/* ── OWNER: Favorites tab ─────────────────────────────────── */}
        {isOwner && tab === "favorites" && (
          <div className="mt-8 space-y-10">
            <div>
              <p className="text-blue-500 dark:text-blue-400 font-bold text-lg mb-4 flex items-center gap-2">
                Saved Job
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-2 py-0.5 font-semibold">
                  {jobBookmarks.length}
                </span>
              </p>
              {jobBookmarks.length === 0 ? (
                <EmptyFavorites label="No bookmarked jobs yet" />
              ) : (
                <div className={cardGrid}>
                  {jobBookmarks.map((row) => {
                    const { target, targetId } = normalizeBookmarkItem(row, "job");
                    return (
                      <BookmarkedJobCard
                        key={targetId ?? row?.id}
                        bm={{ id: row?.id, job: target }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Modals (OWNER ONLY) ───────────────────────────────────── */}
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
              user={user}
              onCoverSaved={(url) => setLiveCoverUrl(url)}
            />
            {postModalOpen && (
              <CreatePostModal onClose={() => setPostModalOpen(false)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── ServiceGrid ─────────────────────────────────────────────────────────── */
const FALLBACK_IMAGE_INNER = "https://placehold.co/285x253?text=No+Image";

function ServiceGrid({ loading, error, services, user, avatarUrl, gridCls, isOwner }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500 text-center py-8">Failed to load services.</p>;
  }
  if (!services.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-sm font-medium">No posts yet</p>
      </div>
    );
  }
  return (
    <div className={`mt-4 ${gridCls}`}>
      {services.map((s) =>
        isOwner ? (
          <OwnServiceCard
            key={s?.id}
            service={s}
            author={user?.fullName || "Freelancer"}
            avatar={avatarUrl}
          />
        ) : (
          <FreelancerCard
            key={s?.id}
            id={s?.id}
            image={(Array.isArray(s?.jobImages) && s.jobImages[0]) || FALLBACK_IMAGE_INNER}
            title={s?.title || "Untitled"}
            description={s?.description || "No description"}
            tags={[s?.category?.name || s?.categoryName].filter(Boolean)}
            date={(() => {
              const v = s?.createdAt;
              if (!v) return "—";
              const d = new Date(typeof v === "number" && v < 1e12 ? v * 1000 : v);
              if (Number.isNaN(d.getTime())) return "—";
              return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
            })()}
            author={user?.fullName || "Freelancer"}
            avatar={avatarUrl}
            postType="service"
            authorId={s?.userId}
          />
        ),
      )}
    </div>
  );
}

/* ─── EmptyFavorites ──────────────────────────────────────────────────────── */
function EmptyFavorites({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
      <svg className="w-10 h-10 mb-2 text-gray-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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