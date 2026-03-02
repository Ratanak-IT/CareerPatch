export function pickArray(v) {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.content)) return v.content;
  if (Array.isArray(v?.data?.content)) return v.data.content;
  return [];
}

export function normalizeBookmarkItem(item, type /* "service" | "job" */) {
  if (!item) return { bookmarkId: null, targetId: null, target: null };

  // bookmarkId is usually row.id OR bookmarkId
  const bookmarkId = item.bookmarkId ?? item.id ?? null;

  // nested post object
  const nested =
    item[type] ?? // item.service or item.job
    item.post ??
    item.target ??
    null;

  const target = nested || item;

  // id of the post (serviceId/jobId)
  const targetId =
    (type === "service"
      ? item.serviceId ?? item.service_id
      : item.jobId ?? item.job_id) ??
    target?.id ??
    null;

  return { bookmarkId, targetId, target };
}