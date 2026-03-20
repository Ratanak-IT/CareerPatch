import { useState, useEffect, useRef } from "react";
import { useComments } from "../../hooks/useComments";

function timeAgo(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name = "") {
  return name.trim().slice(0, 1).toUpperCase() || "?";
}

export default function CommentsSection({
  postType,
  postId,
  authUser,
}) {
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  const {
    comments,
    loading,
    posting,
    error,
    postComment,
    deleteComment,
  } = useComments(postType, postId, authUser);

  // Auto-scroll to bottom when new comment added
  useEffect(() => {
    if (!listRef.current || loading) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [comments.length, loading]);

  const currentUserId =
    authUser?.id || authUser?.userId || authUser?.sub || null;

  const handlePost = async () => {
    if (!input.trim()) return;
    await postComment(input);
    setInput("");
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <h2 className="text-[14px] font-bold mb-4 text-slate-900 dark:text-white">
        Comments
        {comments.length > 0 && (
          <span className="ml-2 text-[11px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Error */}
      {error && (
        <div className="mb-3 text-[11px] text-red-500 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Comment list */}
      <div ref={listRef} className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-start gap-2.5 animate-pulse">
                <div className="w-8 h-8 rounded-full shrink-0 bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-8 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <svg
              className="w-8 h-8 mb-2 text-slate-500 dark:text-slate-400 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 opacity-60">
              No comments yet. Be the first!
            </p>
          </div>
        ) : (
          comments.map((c) => {
            const isOwn = currentUserId && String(c.user_id) === String(currentUserId);

            return (
              <div key={c.id} className="flex items-start gap-2.5 group">
                {/* Avatar */}
                {c.user_avatar ? (
                  <img
                    src={c.user_avatar}
                    alt={c.user_name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white dark:ring-slate-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {initials(c.user_name)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-slate-900 dark:text-white">
                        {c.user_name}
                      </span>
                      {isOwn && (
                        <span className="text-[9px] font-bold text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] shrink-0 text-slate-500 dark:text-slate-400">
                        {timeAgo(c.created_at)}
                      </span>

                      {isOwn && (
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                          aria-label="Delete comment"
                          title="Delete"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[12px] px-3 py-1.5 rounded-xl inline-block max-w-full break-words bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-gray-100 dark:border-indigo-900/40">
                    {c.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-[#334155] mb-4" />

      {/* Input row */}
      {authUser ? (
        <div className="flex items-center gap-2">
          {authUser?.profileImageUrl ? (
            <img
              src={authUser.profileImageUrl}
              alt=""
              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white dark:ring-slate-700"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {initials(authUser?.fullName || authUser?.username || "U")}
            </div>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !posting) handlePost();
            }}
            placeholder="Write a comment…"
            disabled={posting}
            className="flex-1 text-[12px] px-4 py-2.5 rounded-xl outline-none transition-all bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 disabled:opacity-60"
          />

          <button
            onClick={handlePost}
            disabled={!input.trim() || posting}
            className="px-4 py-2.5 rounded-xl text-white text-[12px] font-semibold whitespace-nowrap bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            {posting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
            Post
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Log in to leave a comment
        </div>
      )}
    </div>
  );
}