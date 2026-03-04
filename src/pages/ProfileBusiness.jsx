// src/pages/ProfileBusiness.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { selectIsAuthed } from "../features/auth/authSlice";
import { useMeQuery } from "../services/profileApi";
import { useGetUserByIdQuery } from "../services/userApi";

import {
  useGetMyJobsQuery,
  useGetServiceBookmarksQuery,
  useGetJobBookmarksQuery,
  useGetCategoriesQuery,

  // ✅ IMPORTANT:
  // You need an endpoint to fetch ALL jobs for public profile filtering.
  // If your hook name is different, replace this import.
  useGetAllJobsQuery,
} from "../services/servicesApi";

import EditBusinessModal from "../components/Auth/EditBusinessModal";
import CreateJobModal from "../components/Auth/postcomponent/CreateJobModal";

import ProfileBusinessView from "./profileBusinessView";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.data?.content)) return raw.data.content;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function ProfileBusinessPage({ mode = "owner", publicUserId }) {
  const navigate = useNavigate();
  const isOwner = mode === "owner";
  const isAuthed = useSelector(selectIsAuthed);

  // ── Owner user ───────────────────────────────────────────────
  const { data: meRes, isLoading: meLoading, refetch: refetchMe } = useMeQuery(undefined, {
    skip: !isAuthed,
  });
  const me = meRes?.data ?? meRes ?? null;

  // ── Public user ──────────────────────────────────────────────
  const { data: publicUserRes, isLoading: publicUserLoading } = useGetUserByIdQuery(publicUserId, {
    skip: isOwner || !publicUserId,
  });
  const publicUser = publicUserRes?.data ?? publicUserRes ?? null;

  const user = isOwner ? me : publicUser;

  // Redirect if owner opens their own public page
  React.useEffect(() => {
    if (!isOwner && me?.id && publicUserId && String(me.id) === String(publicUserId)) {
      navigate("/profile-business", { replace: true });
    }
  }, [isOwner, me?.id, publicUserId, navigate]);

  // ── Jobs ─────────────────────────────────────────────────────
  const {
    data: rawMyJobs,
    isLoading: myJobsLoading,
    isError: myJobsError,
  } = useGetMyJobsQuery(undefined, { skip: !isAuthed || !isOwner });

  const {
    data: allJobsRaw,
    isLoading: allJobsLoading,
    isError: allJobsError,
  } = useGetAllJobsQuery(undefined, { skip: isOwner }); // public mode uses this

  const myJobsOwner = useMemo(() => extractArray(rawMyJobs), [rawMyJobs]);

  const allJobs = useMemo(() => extractArray(allJobsRaw), [allJobsRaw]);

  const jobsPublic = useMemo(() => {
    const uid = String(publicUserId ?? "");
    return allJobs.filter((j) => String(j?.userId ?? "") === uid);
  }, [allJobs, publicUserId]);

  const baseJobs = isOwner ? myJobsOwner : jobsPublic;

  const loadingJobs = isOwner ? myJobsLoading : allJobsLoading;
  const jobsError = isOwner ? myJobsError : allJobsError;

  // ── Categories ───────────────────────────────────────────────
  const { data: rawCategories } = useGetCategoriesQuery();
  const categories = useMemo(() => extractArray(rawCategories), [rawCategories]);

  const categoryMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(String(c.id), c.name);
    return m;
  }, [categories]);

  const jobsForCards = useMemo(() => {
    return (baseJobs || []).map((j) => ({
      ...j,
      categoryName:
        categoryMap.get(String(j?.categoryId)) ??
        j?.category?.name ??
        j?.categoryName ??
        null,
      category:
        j?.category ??
        (categoryMap.has(String(j?.categoryId))
          ? { id: j.categoryId, name: categoryMap.get(String(j.categoryId)) }
          : undefined),
    }));
  }, [baseJobs, categoryMap]);

  // ── Bookmarks (OWNER ONLY) ────────────────────────────────────
  const { data: rawServiceBookmarks, isLoading: serviceBookmarksLoading } = useGetServiceBookmarksQuery(
    undefined,
    { skip: !isAuthed || !isOwner }
  );

  const { data: rawJobBookmarks, isLoading: jobBookmarksLoading } = useGetJobBookmarksQuery(
    undefined,
    { skip: !isAuthed || !isOwner }
  );

  const serviceBookmarks = useMemo(() => extractArray(rawServiceBookmarks), [rawServiceBookmarks]);
  const jobBookmarks = useMemo(() => extractArray(rawJobBookmarks), [rawJobBookmarks]);

  // ── Modals (OWNER ONLY) ───────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  // Loading gate
  const loadingUser = isOwner ? meLoading : publicUserLoading;
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ProfileBusinessView
        user={user}
        jobs={jobsForCards}
        isOwner={isOwner}
        loadingUser={loadingUser}
        loadingJobs={loadingJobs}
        jobsError={jobsError}
        serviceBookmarks={serviceBookmarks}
        jobBookmarks={jobBookmarks}
        loadingServiceBookmarks={serviceBookmarksLoading}
        loadingJobBookmarks={jobBookmarksLoading}
        onOpenEdit={() => setEditOpen(true)}
        onOpenPost={() => setPostModalOpen(true)}
      />

      {/* OWNER ONLY modals */}
      {isOwner && editOpen && (
        <EditBusinessModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={() => refetchMe()}
        />
      )}

      {isOwner && postModalOpen && <CreateJobModal onClose={() => setPostModalOpen(false)} />}
    </>
  );
}