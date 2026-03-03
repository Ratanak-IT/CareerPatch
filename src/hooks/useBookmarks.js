// src/hooks/useBookmarks.js
import { useCallback, useMemo } from "react";
import {
  useGetServiceBookmarksQuery,
  useAddServiceBookmarkMutation,
  useRemoveServiceBookmarkMutation,
  useGetJobBookmarksQuery,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} from "../services/servicesApi";

function extractArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.data?.content)) return raw.data.content;
  return [];
}

// Try to detect the target id field in a bookmark record
function getTargetId(item) {
  return (
    item?.serviceId ??
    item?.jobId ??
    item?.targetId ??
    item?.service?.id ??
    item?.job?.id ??
    null
  );
}

export function useBookmarks({ id, type = "service" }) {
  const isService = type === "service";

  // Lists
  const serviceQ = useGetServiceBookmarksQuery(undefined, { skip: !isService });
  const jobQ = useGetJobBookmarksQuery(undefined, { skip: isService });

  const items = useMemo(() => {
    const raw = isService ? serviceQ.data : jobQ.data;
    return extractArray(raw);
  }, [isService, serviceQ.data, jobQ.data]);

  // Mutations
  const [addService] = useAddServiceBookmarkMutation();
  const [removeService] = useRemoveServiceBookmarkMutation();
  const [addJob] = useAddJobBookmarkMutation();
  const [removeJob] = useRemoveJobBookmarkMutation();

  // Find bookmark record for this post id (so we can delete by bookmarkId)
  const match = useMemo(() => {
    const strId = String(id);
    return items.find((x) => {
      const t = getTargetId(x);
      return t != null && String(t) === strId;
    });
  }, [items, id]);

  const liked = !!match;

  const toggle = useCallback(async () => {
    if (!id) return;

    // IMPORTANT: DELETE uses bookmarkId = match.id (from your backend style)
    try {
      if (liked) {
        if (!match?.id) throw new Error("Missing bookmark id (match.id)");
        if (isService) await removeService(match.id).unwrap();
        else await removeJob(match.id).unwrap();
      } else {
        if (isService) await addService(id).unwrap();
        else await addJob(id).unwrap();
      }

      // Refresh list so UI updates
      if (isService) serviceQ.refetch();
      else jobQ.refetch();
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      throw err;
    }
  }, [
    id,
    liked,
    match,
    isService,
    addService,
    removeService,
    addJob,
    removeJob,
    serviceQ,
    jobQ,
  ]);

  return { liked, toggle, isLoading: isService ? serviceQ.isLoading : jobQ.isLoading };
}