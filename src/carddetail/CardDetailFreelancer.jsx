// src/carddetail/CardDetailFreelancer.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonComponent from "../components/button/ButtonComponent";
import { useDarkMode } from "../components/navbar/NavbarComponent";
import {
  useGetServicesQuery,
  useGetServiceByIdQuery,
} from "../services/freelancerPostApi";
import { useGetUserByIdQuery } from "../services/userApi";

const FALLBACK_COVER = "https://placehold.co/1100x420?text=No+Image";
const FALLBACK_THUMB = "https://placehold.co/80x56?text=No";
const FALLBACK_AVATAR = "https://placehold.co/32x32?text=?";

function formatDateDDMMYYYY(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear());
  return `${day}/${month}/${year}`;
}

// Handles string[] OR object[] skills safely
function getFirstSkill(service) {
  const s0 = service?.skills?.[0];
  if (!s0) return null;
  if (typeof s0 === "string") return s0;
  if (typeof s0 === "object") return s0?.name || s0?.title || null;
  return null;
}

export default function CardDetailFreelancer() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [comment, setComment] = useState("");

  // Theme vars (same style as your page)
  const bg = darkMode
    ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)"
    : "#f0f4f8";
  const cardBg = darkMode ? "#0f2240" : "#ffffff";
  const cardBorder = darkMode ? "#1e3a5f" : "#e8f0fe";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-slate-400" : "text-gray-500";
  const divider = darkMode ? "#1e3a5f" : "#e8f0fe";

  // 1) Preferred: GET detail by serviceId (if backend supports)
  const {
    data: byIdResp,
    isLoading: byIdLoading,
    isError: byIdError,
    error: byIdErrObj,
  } = useGetServiceByIdQuery(serviceId, { skip: !serviceId });

  // 2) Fallback: GET list and find by id locally (prevents blocking if GET-by-id not available)
  const {
    data: listResp,
    isLoading: listLoading,
    isError: listError,
    error: listErrObj,
  } = useGetServicesQuery(undefined, { skip: !serviceId });

  const service = useMemo(() => {
    const byId = byIdResp?.data ?? byIdResp;
    if (byId && typeof byId === "object" && !Array.isArray(byId)) return byId;

    const list = listResp?.data ?? listResp;
    const items = Array.isArray(list)
      ? list
      : list?.content ?? list?.items ?? list?.results ?? list?.data ?? [];

    return items.find(
      (x) => String(x?.id ?? x?.serviceId ?? x?._id ?? x?.uuid) === String(serviceId)
    );
  }, [byIdResp, listResp, serviceId]);

  // Fetch freelancer/account info
  const userId = service?.userId;
  const { data: userRes } = useGetUserByIdQuery(userId, { skip: !userId });
  const user = userRes?.data ?? userRes;

  const freelancerName =
    user?.fullName || user?.username || service?.username || "Freelancer";
  const freelancerAvatar =
    user?.profileImageUrl || service?.profileImageUrl || FALLBACK_AVATAR;

  // Loading & error
  const loading = byIdLoading && listLoading;

  if (!serviceId) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{ background: bg }}
      >
        <div
          className="p-6 rounded-2xl"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <p className={`text-sm ${textPrimary}`}>Missing service id in URL.</p>
          <button
            className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: "#1E88E5" }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{ background: bg }}
      >
        <div
          className="p-6 rounded-2xl"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <p className={`text-sm ${textPrimary}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    const errMsg =
      (byIdError && byIdErrObj && JSON.stringify(byIdErrObj)) ||
      (listError && listErrObj && JSON.stringify(listErrObj)) ||
      "Service not found";

    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{ background: bg }}
      >
        <div
          className="w-full max-w-[560px] p-6 rounded-2xl"
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
          }}
        >
          <p className={`text-[15px] font-bold ${textPrimary}`}>
            Could not load service
          </p>
          <p
            className={`mt-2 text-[13px] ${textSecondary}`}
            style={{ wordBreak: "break-word" }}
          >
            {errMsg}
          </p>

          <div className="mt-5 flex gap-2">
            <button
              className="px-4 py-2 rounded-xl text-white text-[13px] font-semibold"
              style={{ background: "#1E88E5" }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>

            <button
              className="px-4 py-2 rounded-xl text-[13px] font-semibold"
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "#f8fafc",
                border: `1px solid ${cardBorder}`,
                color: darkMode ? "#fff" : "#111827",
              }}
              onClick={() => navigate("/findfreelan")}
            >
              Back to list
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Service fields
  const title = service?.title ?? "Untitled";
  const description = service?.description ?? "-";
  const status = service?.status ?? "—";
  const posted = formatDateDDMMYYYY(service?.createdAt);
  const firstSkill = getFirstSkill(service);

  // Images
  const images =
    Array.isArray(service?.jobImages)
      ? service.jobImages
      : Array.isArray(service?.imageUrls)
        ? service.imageUrls
        : typeof service?.jobImages === "string"
          ? [service.jobImages]
          : [];

  const coverImage = images?.[0] || FALLBACK_COVER;

  // Optional arrays
  const skills = Array.isArray(service?.skills) ? service.skills : [];
  const tools = Array.isArray(service?.tools) ? service.tools : [];

  return (
    <div
      className="min-h-screen w-full py-10 px-4 md:px-8 lg:px-16 transition-colors duration-300"
      style={{ fontFamily: "'Poppins', sans-serif", background: bg }}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* ── LEFT COLUMN ── */}
        <div className="w-full lg:w-[60%] flex flex-col gap-5">
          {/* Header card (Freelancer name + skill[0] + dd/mm/yyyy) */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
            }}
          >
            <div className="flex items-start gap-4">
              {/* Skill badge */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[#e8f0fe]">
  <img
    src={freelancerAvatar}
    alt={freelancerName}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.src = "https://placehold.co/64x64?text=?";
    }}
  />
</div>

              <div>
                {/* Freelancer name */}
                <p className={`text-[14px] font-semibold ${textPrimary}`}>
                  {freelancerName}
                </p>

                {/* Service Title */}
                <h1 className="text-[#1E88E5] text-[24px] font-bold leading-tight mt-1">
                  {title}
                </h1>

                {/* Meta */}
                <div
                  className={`flex flex-wrap items-center gap-4 mt-2 text-[13px] ${textSecondary}`}
                >
                  <span className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Posted {posted}
                  </span>

                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          status === "ACTIVE" ? "#22c55e" : "#f59e0b",
                      }}
                    />
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Message button */}
            <div className="flex-shrink-0">
              <ButtonComponent
                text={
                  <span className="flex items-center gap-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Message
                  </span>
                }
                onClick={() => console.log("Message clicked")}
              />
            </div>
          </div>

          {/* Cover image */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
            }}
          >
            <div className="relative w-full" style={{ height: 260 }}>
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK_COVER)}
              />
            </div>

            {images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {images.slice(0, 6).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`thumb-${i}`}
                    className="w-20 h-14 rounded-xl object-cover border"
                    style={{ borderColor: cardBorder }}
                    onError={(e) => (e.currentTarget.src = FALLBACK_THUMB)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
            }}
          >
            <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>
              Description
            </h2>
            <div className={`text-[13px] leading-6 ${textSecondary}`}>
              {description}
            </div>
          </div>

          {/* Tools & Skills */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Tools */}
              <div className="flex-1">
                <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>
                  Tools & Technologies
                </h2>
                {tools.length === 0 ? (
                  <p className={`text-[13px] ${textSecondary}`}>—</p>
                ) : (
                  <ul
                    className={`text-[13px] leading-7 ${textSecondary} space-y-1`}
                  >
                    {tools.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1E88E5] flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Skills */}
              <div className="flex-1">
                <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>
                  Skills
                </h2>
                {skills.length === 0 ? (
                  <p className={`text-[13px] ${textSecondary}`}>—</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => {
                      const label =
                        typeof s === "string" ? s : s?.name || s?.title || "—";
                      return (
                        <span
                          key={i}
                          className="text-[12px] px-3 py-1 rounded-full font-medium"
                          style={{
                            background: darkMode
                              ? "rgba(30,136,229,0.12)"
                              : "#e8f0fe",
                            color: darkMode ? "#90caf9" : "#1E88E5",
                            border: `1px solid ${
                              darkMode ? "#1e3a5f" : "#bfdbfe"
                            }`,
                          }}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-full lg:w-[40%] flex flex-col gap-5">
          {/* Quotation card (placeholder if not provided by API) */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className={`text-[28px] font-extrabold ${textPrimary}`}>
                  {service?.budget ?? service?.price ?? "—"}
                </span>
                <span className={`text-[13px] ${textSecondary}`}>Quotation</span>
              </div>

              <button
                className={`${textSecondary} hover:text-[#1E88E5] transition-colors duration-200`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            {/* Freelancer preview */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: darkMode ? "rgba(30,136,229,0.08)" : "#f0f7ff",
                border: `1px solid ${darkMode ? "#1e3a5f" : "#bfdbfe"}`,
              }}
            >
              <img
                src={freelancerAvatar}
                alt={freelancerName}
                className="w-9 h-9 rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
              />
              <div>
                <p className={`text-[11px] ${textSecondary}`}>Freelancer</p>
                <p className={`text-[13px] font-semibold ${textPrimary}`}>
                  {freelancerName}
                </p>
              </div>
            </div>

            <button
              className="mt-4 w-full px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors duration-200"
              style={{ background: "#1E88E5" }}
              onClick={() => navigate(-1)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1E88E5")}
            >
              Back
            </button>
          </div>

          {/* Comments card (UI only) */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 8px 32px rgba(30,136,229,0.07)",
            }}
          >
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={freelancerAvatar}
                    alt={freelancerName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
                  />
                  <span className={`text-[13px] font-semibold ${textPrimary}`}>
                    {freelancerName}
                  </span>
                </div>
                <span className={`text-[11px] ${textSecondary}`}>2 hours ago</span>
              </div>

              <p
                className="text-[13px] font-medium px-3 py-1.5 rounded-lg w-fit"
                style={{
                  background: darkMode ? "rgba(30,136,229,0.12)" : "#e8f0fe",
                  color: "#1E88E5",
                }}
              >
                So amazing
              </p>
            </div>

            <div className="w-full h-px mb-4" style={{ background: divider }} />

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className={`flex-1 text-[13px] px-4 py-2.5 rounded-xl outline-none transition-all duration-200 ${textPrimary}`}
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
                  border: `1px solid ${darkMode ? "#1e3a5f" : "#e8f0fe"}`,
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
              <button
                className="px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors duration-200"
                style={{ background: "#1E88E5" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563EB")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1E88E5")}
                onClick={() => setComment("")}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}