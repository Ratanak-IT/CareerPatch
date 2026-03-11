import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { selectAuthUser } from "../../features/auth/authSlice";
import { useConversations, useMessages, getOrCreateConversation } from "../../hooks/useChat";

// ─── helpers ────────────────────────────────────────────────────────────────
function timeAgo(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60)     return "just now";
  if (sec < 3600)   return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400)  return `${Math.floor(sec / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name = "") {
  return name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function Avatar({ src, name, size = 10 }) {
  const [err, setErr] = useState(false);
  const cls = `w-${size} h-${size} rounded-full object-cover flex-shrink-0`;
  if (src && !err) {
    return <img src={src} alt={name} className={cls} onError={() => setErr(true)} />;
  }
  return (
    <div className={`${cls} bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs`}>
      {initials(name)}
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
  </svg>
);
const IconSend = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconBack = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
  </svg>
);
const IconChat = () => (
  <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
  </svg>
);

// ─── ConversationItem ────────────────────────────────────────────────────────
function ConversationItem({ conv, myId, isActive, onClick }) {
  const isA    = String(conv.user_a_id) === String(myId);
  const name   = isA ? conv.user_b_name  : conv.user_a_name;
  const avatar = isA ? conv.user_b_avatar : conv.user_a_avatar;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
        ${isActive
          ? "bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-800/50"
          : "hover:bg-gray-50 border border-transparent dark:hover:bg-gray-800/50"
        }`}
    >
      <Avatar src={avatar} name={name} size={11} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-semibold text-sm truncate ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-100"}`}>
            {name}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-[10px] flex-shrink-0 ml-2">
            {timeAgo(conv.last_message_at)}
          </span>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-xs truncate">
          {conv.last_message || "No messages yet"}
        </p>
      </div>
    </button>
  );
}

// ─── MessageBubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, myId }) {
  const isMe = String(msg.sender_id) === String(myId);
  return (
    <div className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {!isMe && <Avatar src={msg.sender_avatar} name={msg.sender_name} size={8} />}
      <div className="flex flex-col gap-0.5" style={{ maxWidth: "65%" }}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
          ${isMe
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md dark:bg-gray-700 dark:text-gray-100"
          }`}>
          {msg.content}
        </div>
        <span className={`text-[10px] text-gray-400 dark:text-gray-500 ${isMe ? "text-right" : "text-left"}`}>
          {timeAgo(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

// ─── ChatWindow ──────────────────────────────────────────────────────────────
function ChatWindow({ conv, myId, myUser, onBack }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { messages, loading, sending, sendMessage } = useMessages(conv?.id);

  const isA    = conv ? String(conv.user_a_id) === String(myId) : false;
  const name   = conv ? (isA ? conv.user_b_name  : conv.user_a_name)  : "";
  const avatar = conv ? (isA ? conv.user_b_avatar : conv.user_a_avatar) : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conv?.id]);

  const handleSend = async () => {
    const txt = input.trim();
    if (!txt || sending) return;
    setInput("");
    await sendMessage(txt, myUser);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!conv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-3">
        <IconChat />
        <p className="text-sm font-medium">Select a conversation</p>
        <p className="text-xs opacity-60">Choose from the list on the left</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex-shrink-0">
        <button onClick={onBack} className="sm:hidden text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 mr-1">
          <IconBack />
        </button>
        <Avatar src={avatar} name={name} size={10} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{name}</p>
          <p className="text-[11px] text-green-500 dark:text-green-400 font-medium">Active</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 dark:text-gray-500 py-16">
            <IconChat />
            <p className="text-xs">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} myId={myId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message…"
            disabled={sending}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3
                       text-sm text-gray-700 placeholder-gray-400 outline-none
                       focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition
                       disabled:opacity-60
                       dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                       dark:placeholder-gray-500 dark:focus:ring-blue-800/50
                       dark:focus:border-blue-700"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-40
                       text-white p-3 rounded-2xl transition-all flex items-center justify-center flex-shrink-0
                       dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {sending
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <IconSend />
            }
          </button>
        </div>
      </div>
    </>
  );
}


export default function ChatComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector(selectAuthUser);
  const myId     = authUser?.id || authUser?.userId || null;

  const initConvId      = location.state?.openConvId    ?? null;
  const initRecipient   = location.state?.recipientId   ?? null;
  const initRecipName   = location.state?.recipientName   ?? null;
  const initRecipAvatar = location.state?.recipientAvatar ?? null;

  const [activeConvId, setActiveConvId] = useState(initConvId);
  const [search,       setSearch]       = useState("");
  const [showChat,     setShowChat]     = useState(!!initConvId);

  const pendingConvId = useRef(null);

  const { conversations, loading: convsLoading } = useConversations(myId);

  useEffect(() => {
    if (!initRecipient || !myId || !authUser) return;
    window.history.replaceState({}, "");

    async function openOrCreate() {
      const convId = await getOrCreateConversation(
        {
          id:              myId,
          fullName:        authUser.fullName || authUser.username || "User",
          profileImageUrl: authUser.profileImageUrl || null,
        },
        {
          id:              String(initRecipient),
          userId:          String(initRecipient),
          fullName:        initRecipName  || "User",
          profileImageUrl: initRecipAvatar || null,
        }
      );
      if (convId) {
        pendingConvId.current = convId;
        setActiveConvId(convId);
        setShowChat(true);
      }
    }
    openOrCreate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  useEffect(() => {
    if (!pendingConvId.current) return;
    const found = conversations.find((c) => c.id === pendingConvId.current);
    if (found) {
      setActiveConvId(found.id);
      setShowChat(true);
      pendingConvId.current = null;
    }
  }, [conversations]);

  const filtered = conversations.filter((c) => {
    const isA = String(c.user_a_id) === String(myId);
    const name = isA ? c.user_b_name : c.user_a_name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  // Not logged in
  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Log in to use messages</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">You need an account to send and receive messages.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-100 dark:bg-gray-950 rounded-3xl flex overflow-hidden w-full" style={{ maxWidth: 1200, minHeight: 640 }}>

        {/* ── LEFT: Conversations list ── */}
        <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-sm flex flex-col flex-shrink-0
          ${showChat ? "hidden" : "flex"} sm:flex w-full sm:w-[360px] lg:w-[420px]`}
          style={{ minHeight: 640 }}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Messages</h1>
            <Avatar src={authUser?.profileImageUrl} name={authUser?.fullName || "Me"} size={8} />
          </div>

          <div className="px-5 mb-3">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2.5">
              <span className="text-gray-400 dark:text-gray-500"><IconSearch /></span>
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {convsLoading ? (
              <div className="space-y-2 px-1 pt-2">
                {[1,2,3].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3 animate-pulse">
                    <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-2">
                <IconChat />
                <p className="text-sm">
                  {search ? "No conversations found" : "No conversations yet"}
                </p>
                {!search && (
                  <p className="text-xs opacity-60 text-center px-4">
                    Click "Message" on any freelancer or job post to start a conversation
                  </p>
                )}
              </div>
            ) : (
              filtered.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  myId={myId}
                  isActive={activeConvId === conv.id}
                  onClick={() => { setActiveConvId(conv.id); setShowChat(true); }}
                />
              ))
            )}
          </div>
        </div>

        {/* Gap */}
        <div className="hidden sm:block w-4 flex-shrink-0" />

        {/* ── RIGHT: Chat window ── */}
        <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-sm flex flex-col
          ${showChat ? "flex" : "hidden"} sm:flex flex-1`}
          style={{ minHeight: 640 }}
        >
          <ChatWindow
            conv={activeConv}
            myId={myId}
            myUser={authUser}
            onBack={() => setShowChat(false)}
          />
        </div>

      </div>
    </div>
  );
}