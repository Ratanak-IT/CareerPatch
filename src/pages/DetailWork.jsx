

import { useParams } from "react-router";
import JobDetailComponent from "../components/detailwork/JobDetailComponent";
import CommentSectionComponent from "../components/detailwork/CommentSectionComponent";
import { useGetJobByIdQuery } from "../services/detailworkApi";
import { useGetUserByIdQuery } from "../services/userApi";



// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(value) {
  if (!value) return "";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const diff = Math.floor((Date.now() - new Date(v).getTime()) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function mapJob(job, user) {
  return {
    company: {
      name:      user?.companyName || user?.fullName || "Company",
      logo:      (user?.companyName || user?.fullName || "CO").slice(0, 3).toUpperCase(),
      logoColor: "#2B5F75",
    },
    title:            job?.title       || "Untitled",
    location:         job?.location    || user?.location || "Phnom Penh",
    postedAgo:        timeAgo(job?.createdAt),
    description:      job?.description || "No description provided.",
    responsibilities: Array.isArray(job?.responsibilities) && job.responsibilities.length
      ? job.responsibilities
      : ["Collaborate with the team", "Deliver quality work on time"],
    requirements: Array.isArray(job?.requirements) && job.requirements.length
      ? job.requirements
      : ["Relevant experience required"],
    skills: Array.isArray(job?.skills) ? job.skills : [],
  };
}

function mapPanel(job) {
  return {
    projectCost: job?.budget ? `$${Number(job.budget).toLocaleString()}` : "Negotiable",
    experience:  job?.level || job?.experienceLevel || "Expert",
    duration:    job?.duration || "1–2 months",
    deadline:    formatDate(job?.deadline || job?.createdAt),
    comments:    Array.isArray(job?.comments) ? job.comments : [],
  };
}

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

export default function DetailWork() {
  const { jobId } = useParams();

  const { data: job, isLoading, isError } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const { data: userRes } = useGetUserByIdQuery(job?.userId, { skip: !job?.userId });
  const user = userRes?.data || userRes;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full" style={{ background: "#F3F6FA", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="hidden lg:flex gap-5">
            <div style={{ width: 716 }}><Skeleton /></div>
            <div style={{ width: 420 }}><Skeleton /></div>
          </div>
          <div className="flex lg:hidden flex-col gap-4"><Skeleton /></div>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#F3F6FA" }}>
        <div className="text-center">
          <p className="text-red-500 font-semibold text-lg mb-2">Failed to load job details.</p>
          <p className="text-gray-400 text-sm">The job may not exist or an error occurred.</p>
        </div>
      </div>
    );
  }

  const jobDetail = mapJob(job, user);
  const panel     = mapPanel(job);

  return (
    <div className="min-h-screen w-full" style={{ background: "#F3F6FA", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="hidden lg:flex gap-5 items-start">
          <div style={{ width: 716 }}><JobDetailComponent job={jobDetail} /></div>
          <div style={{ width: 420 }}><CommentSectionComponent data={panel} /></div>
        </div>
        <div className="flex lg:hidden flex-col gap-4">
          <CommentSectionComponent data={panel} />
          <JobDetailComponent job={jobDetail} />
        </div>
      </div>
    </div>
  );
}