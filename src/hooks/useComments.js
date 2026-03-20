import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export function useComments(postType, postId, authUser) {
  const [comments, setComments]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [posting,  setPosting]    = useState(false);
  const [error,    setError]      = useState("");
  const channelRef                = useRef(null);

  // ── fetch ─────────────────────────────────────────────────────────────────
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

  // ── realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!postId) return;
    fetchComments();

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
              // Skip if already exists (optimistic or duplicate)
              if (prev.some((c) => c.id === payload.new.id)) return prev;
              // Replace temp item if same content + user
              const tempIdx = prev.findIndex(
                (c) =>
                  String(c.id).startsWith("temp-") &&
                  c.content === payload.new.content &&
                  String(c.user_id) === String(payload.new.user_id)
              );
              if (tempIdx !== -1) {
                const next = [...prev];
                next[tempIdx] = payload.new;
                return next;
              }
              return [...prev, payload.new];
            });
          }
          if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
          if (payload.eventType === "UPDATE") {
            setComments((prev) =>
              prev.map((c) => (c.id === payload.new.id ? payload.new : c))
            );
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [postId, postType, fetchComments]);

  // ── post ──────────────────────────────────────────────────────────────────
  const postComment = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    if (!authUser) { setError("You must be logged in to comment."); return; }

    setPosting(true);
    setError("");

    const userId   = authUser?.id   || authUser?.userId || authUser?.sub || "anon";
    const userName = authUser?.fullName || authUser?.username || authUser?.name || "User";
    const userAvatar = authUser?.profileImageUrl || authUser?.avatar || null;

    const payload = {
      post_type:   postType,
      post_id:     postId,
      user_id:     userId,
      user_name:   userName,
      user_avatar: userAvatar,
      content:     trimmed,
    };

    // ── Optimistic: show comment instantly ────────────────────────────────
    const tempId = `temp-${Date.now()}`;
    setComments((prev) => [
      ...prev,
      { ...payload, id: tempId, created_at: new Date().toISOString() },
    ]);

    // ── Insert to Supabase ─────────────────────────────────────────────────
    const { data: inserted, error: err } = await supabase
      .from("comments")
      .insert(payload)
      .select()
      .single();

    if (err) {
      console.error("[useComments] insert error:", err);
      setError("Failed to post comment.");
      // Rollback optimistic item
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    } else if (inserted) {
      // Swap temp with real row
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? inserted : c))
      );
    } else {
      // inserted is null (RLS may block .select()) — just refetch
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      await fetchComments();
    }

    setPosting(false);
  }, [postType, postId, authUser, fetchComments]);

  // ── delete ────────────────────────────────────────────────────────────────
  const deleteComment = useCallback(async (commentId) => {
    // Optimistic remove
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const { error: err } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", authUser?.id || authUser?.userId || authUser?.sub || "");

    if (err) {
      console.error("[useComments] delete error:", err);
      setError("Failed to delete comment.");
      // Refetch to restore on error
      fetchComments();
    }
  }, [authUser, fetchComments]);

  return { comments, loading, posting, error, postComment, deleteComment, refetch: fetchComments };
}