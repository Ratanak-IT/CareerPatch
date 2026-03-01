// src/pages/CarddetailBusiness.jsx (or wherever you put it)
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonComponent from "../button/ButtonComponent";
import { useDarkMode } from "../navbar/NavbarComponent";

import { useGetUserByIdQuery } from "../../services/userApi";
import { useGetAllServicesQuery, useGetServiceByIdQuery } from "../../services/servicesApi";

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

export default function CardDetailBusiness() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  const bg = darkMode
    ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)"
    : "#f0f4f8";
  const cardBg = darkMode ? "#0f2240" : "#ffffff";
  const cardBorder = darkMode ? "#1e3a5f" : "#e8f0fe";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-slate-400" : "text-gray-500";
  const divider = darkMode ? "#1e3a5f" : "#e8f0fe";

  // 1) Prefer by-id endpoint
  const {
    data: byIdResp,
    isLoading: byIdLoading,
    isError: byIdError,
    error: byIdErrObj,
  } = useGetServiceByIdQuery(jobId, { skip: !jobId });

  // 2) Fallback: list + find by id (useful if backend sometimes fails on by-id)
  const {
    data: listResp,
    isLoading: listLoading,
    isError: listError,
    error: listErrObj,
  } = useGetAllServicesQuery(undefined, { skip: !jobId });

  const job = useMemo(() => {
    const byId = byIdResp?.data ?? byIdResp;
    if (byId && typeof byId === "object" && !Array.isArray(byId)) return byId;

    const list = listResp?.data ?? listResp;
    const items = Array.isArray(list)
      ? list
      : list?.content ?? list?.items ?? list?.results ?? [];

    return items.find((x) => String(x?.id) === String(jobId));
  }, [byIdResp, listResp, jobId]);

  // Creator user
  const userId = job?.userId;
  const { data: userRes } = useGetUserByIdQuery(userId, { skip: !userId });
  const creator = userRes?.data ?? userRes;

  const creatorName = creator?.fullName || creator?.username || "Business Owner";
  const creatorAvatar = creator?.profileImageUrl || FALLBACK_AVATAR;

  const loading = byIdLoading && listLoading;

  if (!jobId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: bg }}>
        <div className="p-6 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <p className={`text-sm ${textPrimary}`}>Missing job id in URL.</p>
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
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: bg }}>
        <div className="p-6 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <p className={`text-sm ${textPrimary}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    const errMsg =
      (byIdError && byIdErrObj && JSON.stringify(byIdErrObj)) ||
      (listError && listErrObj && JSON.stringify(listErrObj)) ||
      "Job not found";

    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: bg }}>
        <div
          className="w-full max-w-[560px] p-6 rounded-2xl"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 8px 32px rgba(30,136,229,0.07)" }}
        >
          <p className={`text-[15px] font-bold ${textPrimary}`}>Could not load job</p>
          <p className={`mt-2 text-[13px] ${textSecondary}`} style={{ wordBreak: "break-word" }}>
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
              onClick={() => navigate("/findwork")}
            >
              Back to list
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = job?.title ?? "Untitled";
  const description = job?.description ?? "-";
  const status = job?.status ?? "—";
  const budget = job?.budget ?? "—";
  const posted = formatDateDDMMYYYY(job?.createdAt);

  const images = Array.isArray(job?.jobImages) ? job.jobImages : [];
  const coverImage = images?.[0] || FALLBACK_COVER;

  // Right-side info rows (dynamic)
  const infoRows = [
    { label: "Status", value: status },
    { label: "Posted", value: posted },
    { label: "Budget", value: typeof budget === "number" ? `$${budget}` : String(budget) },
  ];

  return (
    <div className="min-h-screen w-full py-10 px-4 md:px-8 lg:px-16 transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif", background: bg }}>
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT */}
        <div className="w-full lg:w-[60%] flex flex-col gap-5">
          {/* Header */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 8px 32px rgba(30,136,229,0.07)" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[#e8f0fe]">
                <img
                  src={creatorAvatar}
                  alt={creatorName}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/56x56?text=?")}
                />
              </div>

              <div>
                <p className={`text-[13px] font-semibold ${textPrimary}`}>{creatorName}</p>
                <h1 className="text-[#1E88E5] text-[20px] md:text-[24px] font-bold leading-tight mt-1">{title}</h1>

                <div className={`flex flex-wrap items-center gap-3 mt-2 text-[12px] ${textSecondary}`}>
                  <span className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Posted {posted}
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: status === "OPEN" ? "#22c55e" : "#f59e0b" }} />
                    {status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <ButtonComponent
                text={
                  <span className="flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Cover */}
          <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 8px 32px rgba(30,136,229,0.07)" }}>
            <div className="relative w-full" style={{ height: 260 }}>
              <img src={coverImage} alt={title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK_COVER)} />
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
          <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 8px 32px rgba(30,136,229,0.07)" }}>
            <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>Description</h2>
            <div className={`text-[13px] leading-6 ${textSecondary}`}>{description}</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[40%] flex flex-col gap-5">
          {/* Cost / Info */}
          <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 8px 32px rgba(30,136,229,0.07)" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-2">
                <span className={`text-[28px] font-extrabold ${textPrimary}`}>
                  {typeof budget === "number" ? `$${budget}` : "$xxx"}
                </span>
                <span className={`text-[13px] ${textSecondary}`}>Project cost</span>
              </div>

              <button
                onClick={() => setLiked((p) => !p)}
                className="transition-colors duration-200"
                style={{ color: liked ? "#1E88E5" : darkMode ? "#475569" : "#d1d5db" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "#1E88E5" : "none"} stroke={liked ? "#1E88E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {infoRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: darkMode ? "rgba(30,136,229,0.08)" : "#f0f7ff",
                    border: `1px solid ${darkMode ? "#1e3a5f" : "#dbeafe"}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: darkMode ? "rgba(30,136,229,0.15)" : "#dbeafe" }}>
                    <span className="text-[#1E88E5] font-bold text-[12px]">i</span>
                  </div>
                  <div>
                    <p className={`text-[11px] ${textSecondary}`}>{row.label}</p>
                    <p className="text-[13px] font-semibold text-[#1E88E5]">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full py-3 rounded-xl text-white text-[14px] font-semibold transition-colors duration-200"
              style={{ background: "#1E88E5" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1E88E5")}
            >
              Apply Now
            </button>

            <button
              className="mt-3 w-full py-3 rounded-xl text-[14px] font-semibold transition-colors duration-200"
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "#f8fafc",
                border: `1px solid ${cardBorder}`,
                color: darkMode ? "#fff" : "#111827",
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>

          {/* Comments */}
          <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 8px 32px rgba(30,136,229,0.07)" }}>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={creatorAvatar}
                    alt={creatorName}
                    className="w-9 h-9 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
                  />
                  <span className={`text-[13px] font-semibold ${textPrimary}`}>{creatorName}</span>
                </div>
                <span className={`text-[11px] ${textSecondary}`}>2 hours ago</span>
              </div>

              <span
                className="inline-block text-[13px] font-medium px-4 py-1.5 rounded-full"
                style={{
                  background: darkMode ? "rgba(30,136,229,0.12)" : "#e8f0fe",
                  color: darkMode ? "#90caf9" : "#1E88E5",
                }}
              >
                So amazing
              </span>
            </div>

            <div className="w-full h-px mb-4" style={{ background: divider }} />

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className={`flex-1 text-[13px] px-4 py-2.5 rounded-xl outline-none ${textPrimary}`}
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
                  border: `1px solid ${darkMode ? "#1e3a5f" : "#e8f0fe"}`,
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
              <button
                className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors duration-200"
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