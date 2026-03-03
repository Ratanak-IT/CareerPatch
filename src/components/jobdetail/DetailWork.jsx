import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetAllJobsQuery, useGetJobByIdQuery } from "../../services/detailworkApi";

/* ─── helpers ───────────────────────────────────────────────────────────── */
function getJobId(job) {
  return job?.id ?? job?.jobId ?? job?._id ?? null;
}

function normalizeList(resp) {
  const raw = resp?.data ?? resp;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
}

function normalizeOne(resp) {
  const raw = resp?.data ?? resp;
  if (!raw) return null;

  // backend sometimes returns array even for single id
  if (Array.isArray(raw)) return raw[0] ?? null;
  if (Array.isArray(raw?.content)) return raw.content[0] ?? null;
  if (Array.isArray(raw?.items)) return raw.items[0] ?? null;
  if (Array.isArray(raw?.results)) return raw.results[0] ?? null;

  if (typeof raw === "object") return raw;
  return null;
}

function timeAgo(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

/* ─── UI atoms ──────────────────────────────────────────────────────────── */
function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]",
        "dark:bg-[#1A1D27] dark:border-[#2A2D3A] dark:shadow-[0_8px_30px_rgba(0,0,0,0.28)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function JobListCard({ job, active, onClick }) {
  const title = job?.title || "Untitled";
  const companyName = job?.company?.name || job?.companyName || "Company";
  const location = job?.location || "—";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border p-4 transition-all",
        "bg-white border-gray-100 hover:shadow-md hover:-translate-y-[1px]",
        "dark:bg-[#1A1D27] dark:border-[#2A2D3A] dark:hover:border-[#3A3F52]",
        active ? "ring-2 ring-blue-500/60 dark:ring-blue-400/60" : "ring-0",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 truncate">{title}</div>
        <div className="mt-0.5 text-xs text-gray-500 dark:text-[#A8B0C8] truncate">{companyName}</div>
        <div className="mt-1 text-xs text-gray-400 dark:text-[#636B82] truncate">{location}</div>
      </div>
    </button>
  );
}

function JobDetail({ job }) {
  const companyName = job?.company?.name || job?.companyName || "Company";
  const logoText = (job?.company?.logo || companyName.slice(0, 2)).toUpperCase();
  const logoColor = job?.company?.logoColor || "#2B5F75";

  const title = job?.title || "Untitled";
  const location = job?.location || "—";
  const postedAgo = job?.postedAgo || timeAgo(job?.createdAt);
  const description = job?.description || "No description available.";

  const responsibilities = Array.isArray(job?.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job?.requirements) ? job.requirements : [];
  const skills = Array.isArray(job?.skills) ? job.skills : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shrink-0"
              style={{ background: logoColor }}
            >
              {logoText}
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-slate-900 dark:text-[#F0F2FA] truncate">
                {companyName}
              </div>
              <h1 className="mt-1 text-xl font-extrabold text-blue-600 dark:text-blue-400 leading-snug">
                {title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-[#636B82]">
                <span>{location}</span>
                <span>Posted {postedAgo}</span>
              </div>
            </div>
          </div>

          <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition">
            Message
          </button>
        </div>

        <div className="mt-4 border-t border-slate-100 dark:border-[#252836]" />
      </Card>

      {/* Description */}
      <Card className="p-6">
        <h2 className="text-[15px] font-extrabold text-slate-900 dark:text-[#F0F2FA]">Job Description</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-[#A8B0C8]">{description}</p>
      </Card>

      {/* Responsibilities */}
      {responsibilities.length > 0 && (
        <Card className="p-6">
          <h2 className="text-[15px] font-extrabold text-slate-900 dark:text-[#F0F2FA]">Responsibilities:</h2>
          <ul className="mt-3 space-y-2">
            {responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-[#A8B0C8]">
                <span className="mt-2 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Requirements + Skills */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 dark:text-[#F0F2FA]">Requirements:</h2>
            <ul className="mt-3 space-y-2">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-[#A8B0C8]">
                  <span className="mt-2 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 dark:text-[#F0F2FA]">Skills needed</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="
                    text-sm font-medium px-3.5 py-1 rounded-full border
                    bg-blue-50 text-blue-700 border-blue-100
                    dark:bg-[#1A243A] dark:text-[#7EB3FF] dark:border-[#2A3D6A]
                  "
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────────── */
export default function DetailsWorks() {
  const navigate = useNavigate();
  const { jobId } = useParams(); // ✅ dynamic param from URL

  // left list
  const { data: jobsRes, isLoading: listLoading, isError: listError } = useGetAllJobsQuery();
  const jobs = useMemo(() => normalizeList(jobsRes), [jobsRes]);

  // choose effective jobId: from route OR fallback to first job id
  const firstJobId = useMemo(() => (jobs.length ? getJobId(jobs[0]) : null), [jobs]);
  const effectiveJobId = jobId ?? firstJobId;

  // detail fetch (✅ dynamic)
  const { data: detailRes, isLoading: detailLoading, isError: detailError } = useGetJobByIdQuery(effectiveJobId, {
    skip: !effectiveJobId,
  });

  const selectedJobFromApi = useMemo(() => normalizeOne(detailRes), [detailRes]);
  const selectedJobFromList = useMemo(() => {
    if (!effectiveJobId) return null;
    return jobs.find((j) => String(getJobId(j)) === String(effectiveJobId)) ?? null;
  }, [jobs, effectiveJobId]);

  const selectedJob = selectedJobFromApi || selectedJobFromList;

  // click a job card -> update URL -> auto fetch detail
  const openJob = (id) => {
    if (!id) return;
    navigate(`/jobs/${id}`); // ✅ make sure matches your route
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] dark:bg-[#0F1117] transition-colors">
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
          {/* LEFT: Job list */}
          <div>
            <div className="mb-3 text-sm font-extrabold text-slate-900 dark:text-[#F0F2FA]">Jobs</div>

            {listLoading ? (
              <Card className="p-5">
                <div className="text-sm text-slate-500 dark:text-[#A8B0C8]">Loading jobs...</div>
              </Card>
            ) : listError ? (
              <Card className="p-5">
                <div className="text-sm text-red-600 dark:text-red-400">Failed to load jobs.</div>
              </Card>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => {
                  const id = getJobId(job);
                  if (!id) return null;
                  return (
                    <JobListCard
                      key={id}
                      job={job}
                      active={String(id) === String(effectiveJobId)}
                      onClick={() => openJob(id)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Job detail */}
          <div className="min-w-0">
            {detailLoading ? (
              <Card className="p-6">
                <div className="text-sm text-slate-500 dark:text-[#A8B0C8]">Loading job detail...</div>
              </Card>
            ) : detailError ? (
              <Card className="p-6">
                <div className="text-sm text-red-600 dark:text-red-400">Failed to load job detail.</div>
              </Card>
            ) : !selectedJob ? (
              <Card className="p-6">
                <div className="text-sm text-slate-500 dark:text-[#A8B0C8]">No job selected.</div>
              </Card>
            ) : (
              <JobDetail job={selectedJob} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}