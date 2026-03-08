import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * useComments — real-time comment hook backed by Supabase
 *
 * @param {"service" | "job"} postType  — which table column to filter by
 * @param {string}            postId    — the service/job UUID
 * @param {object|null}       authUser  — from Redux selectAuthUser (may be null if not logged in)
 */
export function useComments(postType, postId, authUser) {
  const [comments, setComments]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [posting,  setPosting]    = useState(false);
  const [error,    setError]      = useState("");
  const channelRef                = useRef(null);

  // ── load ──────────────────────────────────────────────────────────────────
  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError("");

    const { data, error: err } = await supabase
      .from("comments")
      .select("*")
      .eq("post_type", postType)
      .eq("post_id",   postId)
      .order("created_at", { ascending: true });

    if (err) {
      console.error("[useComments] fetch error:", err);
      setError("Could not load comments.");
    } else {
      setComments(data ?? []);
    }
    setLoading(false);
  }, [postType, postId]);

  // ── real-time subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!postId) return;

    fetchComments();

    // subscribe to INSERT / DELETE on this post's comments
    const channel = supabase
      .channel(`comments:${postType}:${postId}`)
      .on(
        "postgres_changes",
        {
          event:  "*",
          schema: "public",
          table:  "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => {
              // avoid duplicates
              if (prev.some((c) => c.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
          if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, postType, fetchComments]);

  // ── post ──────────────────────────────────────────────────────────────────
  const postComment = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    if (!authUser) { setError("You must be logged in to comment."); return; }

    setPosting(true);
    setError("");

    const payload = {
      post_type:    postType,
      post_id:      postId,
      user_id:      authUser?.id   || authUser?.userId || authUser?.sub || "anon",
      user_name:    authUser?.fullName || authUser?.username || authUser?.name || "User",
      user_avatar:  authUser?.profileImageUrl || authUser?.avatar || null,
      content:      trimmed,
    };

    const { error: err } = await supabase.from("comments").insert(payload);

    if (err) {
      console.error("[useComments] insert error:", err);
      setError("Failed to post comment.");
    }

    setPosting(false);
  }, [postType, postId, authUser]);

  // ── delete (own comment only) ─────────────────────────────────────────────
  const deleteComment = useCallback(async (commentId) => {
    const { error: err } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", authUser?.id || authUser?.userId || authUser?.sub || "");

    if (err) {
      console.error("[useComments] delete error:", err);
      setError("Failed to delete comment.");
    }
  }, [authUser]);

  return { comments, loading, posting, error, postComment, deleteComment, refetch: fetchComments };
}