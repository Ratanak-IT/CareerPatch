import { useState, useRef, useEffect } from "react";

// ─── Static Data ─────────────────────────────────────────────────────────────
const CONTACTS = [
  { id: 1, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
  { id: 2, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
  { id: 3, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
  { id: 4, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
  { id: 5, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
  { id: 6, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
  { id: 7, name: "Dyson", preview: "How do you like my idea?", time: "12:09", avatar: "https://i.pravatar.cc/48?img=47" },
];

const INITIAL_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Yes, i'm  available.", time: "12:09" },
    { id: 2, from: "me",   text: "Hi, are you available for a web project?", time: "12:09" },
    { id: 3, from: "me",   text: "I need a company website.", time: "12:10" },
    { id: 4, from: "them", text: "Sure, i can do it.", time: "12:11" },
  ],
};

// ─── Messenger Icon ───────────────────────────────────────────────────────────
function MessengerIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#3B82F6" />
      <path
        d="M24 10C16.268 10 10 15.82 10 23c0 3.866 1.703 7.348 4.456 9.865V37l4.353-2.392A14.9 14.9 0 0024 35c7.732 0 14-5.82 14-13S31.732 10 24 10zm1.39 17.523l-3.565-3.8-6.957 3.8 7.652-8.123 3.652 3.8 6.87-3.8-7.652 8.123z"
        fill="white"
      />
    </svg>
  );
}

// ─── Contact Row ──────────────────────────────────────────────────────────────
function ContactRow({ contact, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 text-left
        ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
    >
      <img
        src={contact.avatar}
        alt={contact.name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800 text-sm">{contact.name}</span>
          <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{contact.time}</span>
        </div>
        <p className="text-gray-400 text-xs truncate mt-0.5">{contact.preview}</p>
      </div>
    </button>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
function ChatBubble({ message, contact }) {
  const isMe = message.from === "me";
  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {!isMe && (
        <img
          src={contact.avatar}
          alt={contact.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 mb-1"
        />
      )}
      <div
        className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isMe
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
          }`}
      >
        {message.text}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatComponent() {
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false); // mobile: toggle panels
  const messagesEndRef = useRef(null);

  const activeContact = CONTACTS.find((c) => c.id === activeId);
  const currentMessages = messages[activeId] || [];

  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = { id: Date.now(), from: "me", text, time: "Now" };
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectContact = (id) => {
    setActiveId(id);
    setShowChat(true); // mobile: go to chat panel
  };

  return (
    // Outer: center the card on all screen sizes
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      {/*
        Card wrapper:
        - Desktop (≥1024px): fixed 1200px wide, side-by-side
        - Tablet  (≥640px) : full width, side-by-side
        - Mobile  (<640px) : full width, toggle between panels
      */}
      <div
        className="bg-gray-100 rounded-3xl flex overflow-hidden shadow-none w-full"
        style={{ maxWidth: 1200 }}
      >

        {/* ── LEFT PANEL (Contact List) ── */}
        {/*
          Mobile : hidden when chat is open (showChat)
          Tablet+: always visible as a column
          Fixed width on large screens: 518px
        */}
        <div
          className={`
            bg-white rounded-3xl shadow-sm flex flex-col
            ${showChat ? "hidden" : "flex"} sm:flex
            w-full sm:w-[518px] flex-shrink-0
          `}
          style={{ minHeight: 620 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <MessengerIcon />
              <span className="text-2xl font-bold text-gray-800">Chat</span>
            </div>
            <button className="flex items-center gap-1 text-gray-500 text-sm hover:text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Search */}
          <div className="px-5 mb-4">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 rounded-full px-5 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {filteredContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                isActive={activeId === contact.id}
                onClick={() => handleSelectContact(contact.id)}
              />
            ))}
          </div>
        </div>

        {/* Gap between panels (visible on sm+) */}
        <div className="hidden sm:block w-4 flex-shrink-0" />

        {/* ── RIGHT PANEL (Chat Window) ── */}
        {/*
          Mobile : visible only when showChat
          Tablet+: always visible
          Fixed width on large screens: 634px
        */}
        <div
          className={`
            bg-white rounded-3xl shadow-sm flex flex-col
            ${showChat ? "flex" : "hidden"} sm:flex
            w-full sm:w-[634px] flex-shrink-0
          `}
          style={{ minHeight: 620 }}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <button
                className="sm:hidden text-gray-500 mr-1"
                onClick={() => setShowChat(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <img
                src={activeContact?.avatar}
                alt={activeContact?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold text-gray-800">{activeContact?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            {currentMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} contact={activeContact} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-4 py-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type something to send"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}