// src/components/bookmarks/BookmarkedServiceCard.jsx
import FreelancerCard from "../freelancer/FreelancerCard";
import { useGetUserByIdQuery } from "../../services/userApi";

const BASE = import.meta.env.VITE_API_URL;

function resolveUrl(u) {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u; // already full url
  return `${BASE}${u.startsWith("/") ? "" : "/"}${u}`;
}

function pickImage(s) {
  const raw =
    (Array.isArray(s?.imageUrls) && s.imageUrls[0]) ||
    (Array.isArray(s?.jobImages) && s.jobImages[0]) ||
    (Array.isArray(s?.images) && s.images[0]) ||
    s?.imageUrl ||
    s?.thumbnail ||
    s?.coverImageUrl ||
    null;

  return resolveUrl(raw);
}

function formatDateDMY(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function BookmarkedServiceCard({ bm }) {
  const s = bm?.service;

  // ✅ compute authorId safely even when s is undefined
  const authorId = s?.userId ?? s?.user?.id ?? null;

  // ✅ hook is ALWAYS called (but request is skipped if no authorId)
  const { data: userRes } = useGetUserByIdQuery(authorId, { skip: !authorId });
  const author = userRes?.data || userRes;

  // ✅ now safe to early return AFTER hooks
  if (!s?.id) return null;

  return (
    <FreelancerCard
      id={s.id}
      postType="service"
      image={pickImage(s)}
      title={s?.title || "Untitled"}
      description={s?.description || ""}
      tags={[s?.category?.name || s?.categoryName].filter(Boolean)}
      date={formatDateDMY(s?.createdAt)}
      author={author?.fullName || author?.companyName || s?.authorName || "Unknown"}
      avatar={author?.profileImageUrl || s?.authorAvatar || undefined}
      authorId={authorId}
    />
  );
}