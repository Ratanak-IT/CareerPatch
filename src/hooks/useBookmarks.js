import { useMemo, useCallback } from "react";
import {
  useGetServiceBookmarksQuery,
  useGetJobBookmarksQuery,
  useAddServiceBookmarkMutation,
  useRemoveServiceBookmarkMutation,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} from "../services/servicesApi";
import { pickArray, normalizeBookmarkItem } from "../utils/normalizeBookmarks";

export function useBookmarks({ id, type /* "service" | "job" */ }) {
  const { data: serviceRaw } = useGetServiceBookmarksQuery();
  const { data: jobRaw } = useGetJobBookmarksQuery();

  const serviceArr = useMemo(() => pickArray(serviceRaw), [serviceRaw]);
  const jobArr = useMemo(() => pickArray(jobRaw), [jobRaw]);

  const serviceMap = useMemo(() => {
    const m = {};
    for (const it of serviceArr) {
      const n = normalizeBookmarkItem(it, "service");
      if (n.targetId) m[String(n.targetId)] = n.bookmarkId ? String(n.bookmarkId) : null;
    }
    return m;
  }, [serviceArr]);

  const jobMap = useMemo(() => {
    const m = {};
    for (const it of jobArr) {
      const n = normalizeBookmarkItem(it, "job");
      if (n.targetId) m[String(n.targetId)] = n.bookmarkId ? String(n.bookmarkId) : null;
    }
    return m;
  }, [jobArr]);

  const [addService] = useAddServiceBookmarkMutation();
  const [removeService] = useRemoveServiceBookmarkMutation();
  const [addJob] = useAddJobBookmarkMutation();
  const [removeJob] = useRemoveJobBookmarkMutation();

  const { liked, bookmarkId } = useMemo(() => {
    const map = type === "job" ? jobMap : serviceMap;
    const bid = map?.[String(id)] ?? null;
    return { liked: Boolean(bid), bookmarkId: bid };
  }, [id, type, jobMap, serviceMap]);

  const toggle = useCallback(async () => {
    if (!id) return;

    try {
      if (liked) {
        if (!bookmarkId) return;
        if (type === "job") await removeJob(bookmarkId).unwrap();
        else await removeService(bookmarkId).unwrap();
        return;
      }

      if (type === "job") await addJob(id).unwrap();
      else await addService(id).unwrap();
    } catch (err) {
      console.error("Bookmark API error:", err);
    }
  }, [id, type, liked, bookmarkId, addJob, addService, removeJob, removeService]);

  return { liked, toggle };
}