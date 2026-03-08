

export function getJobId(job) {
  return job?.id ?? job?.jobId ?? job?._id ?? null;
}

export function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

export const FALLBACK_IMAGE  = "https://placehold.co/400x220?text=No+Image";
export const FALLBACK_AVATAR = "https://placehold.co/40x40?text=?";