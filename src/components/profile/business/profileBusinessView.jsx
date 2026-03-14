// src/components/profile/business/profileBusinessView.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../../features/auth/authSlice";
import { supabase } from "../../../lib/supabaseClient";

import OwnJobCard from "../../card/OwnJobCard";
import BookmarkedServiceCard from "../../bookmark/BookmarkedServiceCard";
import BookmarkedJobCard from "../../bookmark/BookmarkedJobCard";

// ─── Fallbacks ────────────────────────────────────────────────────────────────
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=B";
const FALLBACK_IMAGE  = "https://placehold.co/400x220?text=No+Image";

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

function timeAgo(value) {
  if (!value) return "";
  const d   = new Date(value);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60)    return "just now";
  if (sec < 3600)  return `${Math.floor(sec / 60)} minute${Math.floor(sec / 60) > 1 ? "s" : ""} ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function getJobId(job) {
  return job?.id ?? job?.jobId ?? job?._id ?? job?.uuid ?? null;
}

function isPdf(url) {
  if (!url) return false;
  return url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("application/pdf");
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Empty ────────────────────────────────────────────────────────────────────
function Empty({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
      <svg className="w-10 h-10 mb-2 text-gray-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ─── BookmarkEmpty ────────────────────────────────────────────────────────────
function BookmarkEmpty({ label }) {
  return (
    <div className="flex flex-col items-center py-10 text-gray-400 dark:text-gray-500">
      <svg className="w-10 h-10 mb-2 text-gray-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = "w-10 h-10", textSize = "text-sm" }) {
  const [imgErr, setImgErr] = useState(false);
  const initial = name?.slice(0, 1)?.toUpperCase() || "?";
  if (src && !imgErr) {
    return (
      <img src={src} alt={name || "avatar"}
        className={`${size} rounded-full object-cover shrink-0`}
        onError={() => setImgErr(true)} />
    );
  }
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
                     flex items-center justify-center text-white font-bold ${textSize} shrink-0`}>
      {initial}
    </div>
  );
}

// ─── InfoSidebar ──────────────────────────────────────────────────────────────
function InfoSidebar({ user }) {
  const workTags = Array.isArray(user?.workWithUs) ? user.workWithUs : [];
  const contactRows = [
    { label: "Email",   val: user?.email },
    { label: "Phone",   val: user?.phone },
    { label: "Website", val: user?.companyWebsite },
    { label: "Address", val: user?.address },
  ].filter((r) => r.val);

  return (
    <div className="flex flex-col gap-4 w-full lg:w-60 lg:shrink-0">
      {workTags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Work With Us</p>
          <ul className="flex flex-col gap-2">
            {workTags.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {contactRows.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">Contact Info</p>
          <div className="flex flex-col gap-3">
            {contactRows.map(({ label, val }) => (
              <div key={label} className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 break-all text-right leading-snug">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FileRow ──────────────────────────────────────────────────────────────────
function FileRow({ url, label }) {
  const pdf = isPdf(url);
  const ext = url.split(".").pop().split("?")[0].toUpperCase().slice(0, 4);

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                      flex flex-col items-center justify-center shrink-0">
        {pdf ? (
          <>
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5
                   a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625
                   c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75
                   c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="text-[8px] font-bold text-red-400 leading-none">PDF</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5
                   l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0
                   001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0
                   001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75
                   0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-[8px] font-bold text-blue-400 leading-none">{ext || "IMG"}</span>
          </>
        )}
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 flex-1 truncate">
        {label}.{url.split(".").pop().split("?")[0].toLowerCase()}
      </span>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shrink-0 transition-colors">
        view
      </a>
    </div>
  );
}

// ─── ApplicantDetail ──────────────────────────────────────────────────────────
function ApplicantDetail({ app, onBack, onViewProfile }) {
  if (!app) {
    return (
      <div className="flex items-center justify-center py-20
                      bg-white dark:bg-gray-800 rounded-2xl
                      border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                     M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                     m0 0a5.002 5.002 0 019.288 0"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
          </svg>
          <p className="text-sm text-gray-400 dark:text-gray-500">Select an applicant to view details</p>
        </div>
      </div>
    );
  }

  const hasCv       = !!app.cv_url;
  const hasOverview = !!app.overview_url;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

      {/* Mobile back */}
      {onBack && (
        <div className="xl:hidden px-5 pt-4 pb-2">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-blue-500 font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to applicants
          </button>
        </div>
      )}

      {/* Profile header */}
      <button onClick={onViewProfile}
        className="w-full flex items-center gap-3 px-6 pt-5 pb-4
                   border-b border-gray-100 dark:border-gray-700
                   hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-left">
        <Avatar src={app.applicant_avatar} name={app.full_name} size="w-12 h-12" textSize="text-base" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white
                        group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
            {app.full_name}
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">View profile →</p>
        </div>
        <svg className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-blue-400 transition-colors shrink-0"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Info table */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <table className="w-full">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              { label: "Full Name",    val: app.full_name },
              { label: "Phone Number", val: app.phone || "—" },
              { label: "Email",        val: app.email },
              { label: "Job Title",    val: app.job_title_apply || app.job_title || "—" },
            ].map(({ label, val }) => (
              <tr key={label}>
                <td className="py-3.5 pr-6 w-40">
                  <span className="text-sm font-bold text-blue-500">{label} :</span>
                </td>
                <td className="py-3.5">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{val}</span>
                  <div className="border-b border-gray-100 dark:border-gray-700 mt-3" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Description */}
      {app.description && (
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{app.description}</p>
        </div>
      )}

      {/* Files */}
      <div className="px-6 py-5 space-y-3">
        {hasCv       && <FileRow url={app.cv_url}       label={`${app.full_name?.split(" ")[0] || "applicant"}_CV`} />}
        {hasOverview && <FileRow url={app.overview_url} label={`${app.full_name?.split(" ")[0] || "applicant"}_Overview`} />}
        {!hasCv && !hasOverview && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">No files uploaded.</p>
        )}
      </div>
    </div>
  );
}

// ─── ViewApplyTab ─────────────────────────────────────────────────────────────
function ViewApplyTab({ jobs, loadingJobs }) {
  const navigate = useNavigate();

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications,  setApplications]  = useState([]);
  const [loadingApps,   setLoadingApps]   = useState(false);
  const [selectedApp,   setSelectedApp]   = useState(null);
  const [showDetail,    setShowDetail]    = useState(false);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(String(getJobId(jobs[0])));
    }
  }, [jobs, selectedJobId]);

  const loadApplications = useCallback(async (jobId) => {
    if (!jobId) return;
    setLoadingApps(true);
    setSelectedApp(null);
    setShowDetail(false);
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("job_id", String(jobId))
      .order("created_at", { ascending: false });
    setLoadingApps(false);
    if (error) { console.error("load apps error:", error); return; }
    setApplications(data || []);
    if (data?.length > 0) { setSelectedApp(data[0]); setShowDetail(true); }
  }, []);

  useEffect(() => {
    if (selectedJobId) loadApplications(selectedJobId);
  }, [selectedJobId, loadApplications]);

  if (loadingJobs) return <Spinner />;
  if (!jobs.length) return <Empty label="No job posts yet" />;

  return (
    <div className="flex flex-col xl:flex-row gap-5 items-start">

      {/* LEFT */}
      <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-3">

        {/* Job selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Select Job</p>
          <div className="flex flex-col gap-1.5">
            {jobs.map((job) => {
              const jid   = String(getJobId(job));
              const thumb = Array.isArray(job?.jobImages) && job.jobImages[0];
              const active = selectedJobId === jid;
              return (
                <button key={jid} onClick={() => setSelectedJobId(jid)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                    ${active ? "bg-blue-500 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                  {thumb ? (
                    <img src={thumb} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                      ${active ? "bg-blue-400" : "bg-gray-100 dark:bg-gray-700"}`}>
                      <svg className={`w-5 h-5 ${active ? "text-white" : "text-gray-300 dark:text-gray-500"}`}
                           fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2
                                 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0
                                 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${active ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                      {job.title || "Untitled"}
                    </p>
                    <p className={`text-xs mt-0.5 ${active ? "text-blue-100" : "text-gray-400 dark:text-gray-500"}`}>
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Applicant list */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Applicants</p>
            {!loadingApps && (
              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full">
                {applications.length}
              </span>
            )}
          </div>
          {loadingApps ? (
            <div className="py-6"><Spinner /></div>
          ) : applications.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">No applications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
              {applications.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <button key={app.id} onClick={() => { setSelectedApp(app); setShowDetail(true); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all
                      ${isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-l-transparent"}`}>
                    <Avatar src={app.applicant_avatar} name={app.full_name} size="w-10 h-10" textSize="text-sm" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate
                        ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}`}>
                        {app.full_name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(app.created_at)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0
                      ${app.status === "accepted" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                        app.status === "rejected" ? "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"        :
                        app.status === "reviewed" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400"    :
                        "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                      {app.status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className={`w-full flex-1 min-w-0 ${!showDetail && !selectedApp ? "xl:block hidden" : "block"}`}>
        <ApplicantDetail
          app={selectedApp}
          onBack={() => { setShowDetail(false); setSelectedApp(null); }}
          onViewProfile={() => selectedApp?.applicant_id && navigate(`/freelancers/${selectedApp.applicant_id}`)}
        />
      </div>
    </div>
  );
}

// ─── PublicJobCard ────────────────────────────────────────────────────────────
function PublicJobCard({ job }) {
  const jobId = getJobId(job);
  if (!jobId) return null;

  const title        = job?.title || "Untitled";
  const description  = job?.description || "No description available.";
  const categoryName = job?.category?.name || job?.categoryName || null;
  const status       = job?.status || "UNKNOWN";
  const date         = formatDate(job?.createdAt);
  const image =
    (Array.isArray(job?.jobImages) && job.jobImages[0]) ||
    (Array.isArray(job?.imageUrls) && job.imageUrls[0]) ||
    FALLBACK_IMAGE;
  const tags = [];
  if (categoryName)    tags.push(categoryName);
  if (job?.skills?.[0]) tags.push(job.skills[0]);

  return (
    <Link to={`/jobs/${jobId}`}
      className="group flex flex-col w-full rounded-2xl overflow-hidden
                 bg-white dark:bg-slate-800
                 border border-gray-100 dark:border-slate-700
                 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60
                 hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "clamp(230px, 25vw, 176px)" }}>
        <img src={image} alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} />
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-[#1E88E5] dark:text-blue-100 font-bold text-md mb-1 line-clamp-1 truncate">
          {title}
        </h3>

        <p className="text-gray-400 text-xs dark:text-gray-300 leading-relaxed mb-3 overflow-hidden line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between mb-3 text-xs text-gray-400 dark:text-gray-300 font-bold">
          <span>Date: {date}</span>
          <span className={`font-semibold ${
            status === "OPEN" ? "text-green-500"
            : status === "DRAFT" ? "text-yellow-500"
            : "text-gray-500"
          }`}>{status}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((t) => (
            <span key={t}
              className="bg-[#1E88E5]/10 dark:bg-blue-500/20 text-[#1E88E5] dark:text-blue-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 mb-3" />
        <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">View details →</div>
      </div>
    </Link>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProfileBusinessView({
  user,
  jobs = [],
  isOwner = false,
  loadingUser = false,
  loadingJobs = false,
  jobsError   = false,
  serviceBookmarks = [],
  jobBookmarks     = [],
  loadingServiceBookmarks = false,
  loadingJobBookmarks     = false,
  onOpenEdit,
  onOpenPost,
  onCoverSaved,
  liveCoverUrl = null,   // ← set instantly by parent after save (no reload needed)
}) {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);
  const [tab, setTab] = useState("information");

  // ── Cover loaded from Supabase (backend has no coverImageUrl endpoint) ──────
  const [supabaseCoverUrl, setSupabaseCoverUrl] = useState(FALLBACK_COVER);

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

  // liveCoverUrl is set instantly by parent after EditBusinessModal saves — no page reload needed
  const coverUrl = liveCoverUrl || supabaseCoverUrl;

  // Called by EditBusinessModal right after cover is saved — no page reload needed
  const handleCoverSaved = useCallback((newUrl) => {
    setSupabaseCoverUrl(newUrl);
    onCoverSaved?.(newUrl);
  }, [onCoverSaved]);

  const handleMessage = useCallback(() => {
    if (!authUser) { navigate("/login"); return; }
    navigate("/chat", {
      state: {
        recipientId:    String(user?.id ?? user?.userId ?? ""),
        recipientName:  user?.companyName || user?.fullName || "Business",
        recipientAvatar: user?.profileImageUrl || null,
      },
    });
  }, [navigate, authUser, user]);

  const totalFavorites = (serviceBookmarks?.length || 0) + (jobBookmarks?.length || 0);
  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const jobsNoDraft = useMemo(
    () => (jobs || []).filter((j) => String(j?.status || "OPEN") !== "DRAFT"),
    [jobs]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 py-6">

        {/* ── Cover + header ──────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="relative h-45 sm:h-55 bg-gray-200 dark:bg-gray-700">
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover"
              onError={() => setCoverUrl(FALLBACK_COVER)} />
            <div className="absolute inset-0 bg-blue-900/20" />
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-24 h-24 z-10 rounded-xl overflow-hidden
                              bg-gray-100 dark:bg-gray-700 shadow-md ring-4 ring-white dark:ring-gray-800 shrink-0">
                <img src={avatarUrl} alt="logo" className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }} />
              </div>
              <div>
                <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">
                  {loadingUser ? "Loading…" : user?.companyName || user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {[user?.industry, user?.address].filter(Boolean).join(" • ") || "—"}
                </p>
              </div>
            </div>

            {/* Right side — Edit Profile (owner) or Message (visitor) */}
            {isOwner ? (
              <button onClick={onOpenEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
                           px-4 py-2 rounded-lg shrink-0 transition-colors">
                Edit Profile
              </button>
            ) : (
              <button onClick={handleMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
                           px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.205V22l3.37-1.85
                           c.9.248 1.853.38 2.942.38 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.44
                           l-2.548-2.717-4.972 2.717 5.473-5.81 2.613 2.717 4.907-2.717-5.473 5.81z" />
                </svg>
                Message
              </button>
            )}
          </div>
        </div>

        {/* ── Tabs (OWNER ONLY) ───────────────────────────────────────────── */}
        {isOwner && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden flex">
              {[
                { key: "information", label: "Information" },
                { key: "favorites",   label: "Favorites",  badge: totalFavorites },
                { key: "viewapply",   label: "View Apply" },
              ].map(({ key, label, badge }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`px-6 sm:px-8 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all
                    ${tab === key
                      ? "bg-purple-600 text-white"
                      : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}>
                  {label}
                  {badge > 0 && (
                    <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold
                      ${tab === key
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"}`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PUBLIC: information only ────────────────────────────────────── */}
        {!isOwner && (
          <div className="mt-6 flex flex-col lg:flex-row gap-5">
            <InfoSidebar user={user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 dark:text-white font-bold text-xl">Job Announcement</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{jobsNoDraft.length} posts</span>
              </div>
              {loadingJobs && <Spinner />}
              {!loadingJobs && jobsError  && <p className="text-red-500 text-center py-8">Failed to load jobs.</p>}
              {!loadingJobs && !jobsError && jobsNoDraft.length === 0 && <Empty label="No job posts yet" />}
              {!loadingJobs && !jobsError && jobsNoDraft.length > 0 && (
                <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {jobsNoDraft.map((j) => <PublicJobCard key={getJobId(j) || j?.title} job={j} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── OWNER: Information tab ──────────────────────────────────────── */}
        {isOwner && tab === "information" && (
          <div className="mt-6 flex flex-col lg:flex-row gap-5">
            <InfoSidebar user={user} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 dark:text-white font-bold text-xl">Job Announcement</p>
                <button onClick={onOpenPost}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
                             px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Post
                </button>
              </div>
              {loadingJobs && <Spinner />}
              {!loadingJobs && jobsError  && <p className="text-red-500 text-center py-8">Failed to load jobs.</p>}
              {!loadingJobs && !jobsError && jobs.length === 0 && <Empty label="No job posts yet — click Post to create one" />}
              {!loadingJobs && !jobsError && jobs.length > 0 && (
                <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {jobs.map((j) => (
                    <OwnJobCard key={getJobId(j) || j?.title} job={j}
                      author={user?.companyName || user?.fullName || ""}
                      avatar={user?.profileImageUrl ?? null} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── OWNER: Favorites tab ────────────────────────────────────────── */}
        {isOwner && tab === "favorites" && (
          <div className="mt-8 space-y-10">
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Freelancer Services
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-2 py-0.5 font-semibold">
                  {serviceBookmarks.length}
                </span>
              </p>
              {loadingServiceBookmarks ? <Spinner /> : serviceBookmarks.length === 0
                ? <BookmarkEmpty label="No bookmarked services yet" />
                : (
                  <div className="grid gap-3 sm:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {serviceBookmarks.map((bm) => <BookmarkedServiceCard key={bm?.id || bm?.service?.id} bm={bm} />)}
                  </div>
                )}
            </div>
            <div>
              <p className="text-blue-500 font-bold text-lg mb-4 flex items-center gap-2">
                Job Posts
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-2 py-0.5 font-semibold">
                  {jobBookmarks.length}
                </span>
              </p>
              {loadingJobBookmarks ? <Spinner /> : jobBookmarks.length === 0
                ? <BookmarkEmpty label="No bookmarked jobs yet" />
                : (
                  <div className="grid gap-3 sm:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {jobBookmarks.map((bm) => <BookmarkedJobCard key={bm?.id || bm?.job?.id} bm={bm} />)}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* ── OWNER: View Apply tab ───────────────────────────────────────── */}
        {isOwner && tab === "viewapply" && (
          <div className="mt-8">
            <p className="text-blue-500 font-bold text-lg mb-5">Applications</p>
            <ViewApplyTab jobs={jobs} loadingJobs={loadingJobs} />
          </div>
        )}

      </div>
    </div>
  );
}