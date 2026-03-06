// src/hooks/useBookmarks.js
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetServiceBookmarksQuery,
  useAddServiceBookmarkMutation,
  useRemoveServiceBookmarkMutation,
  useGetJobBookmarksQuery,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} from "../services/servicesApi";
import { selectIsAuthed } from "../features/auth/authSlice";

function extractArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.data?.content)) return raw.data.content;
  return [];
}

function getTargetId(item) {
  return (
    item?.serviceId ??
    item?.jobId     ??
    item?.targetId  ??
    item?.service?.id ??
    item?.job?.id   ??
    null
  );
}

export function useBookmarks({ id, type = "service" }) {
  const isService = type === "service";
  const isAuthed  = useSelector(selectIsAuthed);

  // Skip ALL network calls when the user is not logged in.
  // Both bookmark endpoints require authentication — firing them as a guest
  // produces a 401 on every single card render.
  const serviceQ = useGetServiceBookmarksQuery(undefined, {
    skip: !isAuthed || !isService,
  });
  const jobQ = useGetJobBookmarksQuery(undefined, {
    skip: !isAuthed || isService,
  });

  const items = useMemo(() => {
    if (!isAuthed) return [];
    const raw = isService ? serviceQ.data : jobQ.data;
    return extractArray(raw);
  }, [isAuthed, isService, serviceQ.data, jobQ.data]);

  const [addService]    = useAddServiceBookmarkMutation();
  const [removeService] = useRemoveServiceBookmarkMutation();
  const [addJob]        = useAddJobBookmarkMutation();
  const [removeJob]     = useRemoveJobBookmarkMutation();

  const match = useMemo(() => {
    if (!id || !isAuthed) return undefined;
    const strId = String(id);
    return items.find((x) => {
      const t = getTargetId(x);
      return t != null && String(t) === strId;
    });
  }, [items, id, isAuthed]);

  const liked = !!match;

  const toggle = useCallback(async () => {
    if (!id || !isAuthed) return;

    try {
      if (liked) {
        if (!match?.id) throw new Error("Missing bookmark id (match.id)");
        if (isService) await removeService(match.id).unwrap();
        else           await removeJob(match.id).unwrap();
      } else {
        if (isService) await addService(id).unwrap();
        else           await addJob(id).unwrap();
      }

      if (isService) serviceQ.refetch();
      else           jobQ.refetch();
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      throw err;
    }
  }, [id, isAuthed, liked, match, isService, addService, removeService, addJob, removeJob, serviceQ, jobQ]);

  return {
    liked,
    toggle,
    isLoading: isAuthed ? (isService ? serviceQ.isLoading : jobQ.isLoading) : false,
  };
}