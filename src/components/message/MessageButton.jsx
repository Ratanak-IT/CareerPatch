import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import { getOrCreateConversation } from "../../hooks/useChat";

/**
 * MessageButton — drop-in button for any profile or card detail page
 *
 * Usage:
 *   <MessageButton otherUser={{ id: "xxx", fullName: "John", profileImageUrl: "..." }} />
 *
 * otherUser must have at least: id (or userId), fullName (or username)
 */
export default function MessageButton({ otherUser, className = "", label = "Message" }) {
  const navigate  = useNavigate();
  const authUser  = useSelector(selectAuthUser);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    const myId    = authUser.id    || authUser.userId;
    const otherId = otherUser?.id  || otherUser?.userId;

    if (!otherId || String(myId) === String(otherId)) return;

    setLoading(true);
    const convId = await getOrCreateConversation(authUser, otherUser);
    setLoading(false);

    if (convId) {
      // Navigate to /chat with the conversation pre-selected via state
      navigate("/chat", { state: { openConvId: convId } });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                  text-white bg-blue-500 hover:bg-blue-600 active:scale-95
                  disabled:opacity-60 transition-all 
                  ${className}`}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      )}
      {label}
    </button>
  );
}