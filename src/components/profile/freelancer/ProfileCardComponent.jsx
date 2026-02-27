import { useState } from "react";


export default function ProfileCardComponent() {
  const [imgError, setImgError] = useState(false);

  return (
    <div >
      {/* Card Container: max 1200px wide, min 317px tall */}
      <div
        className="relative bg-white rounded-xl overflow-hidden shadow-lg w-full"
        style={{ maxWidth: "1200px", minHeight: "317px" }}
      >
        {/* Cover Photo: full width x 197px */}
        <div className="relative w-full overflow-hidden" style={{ height: "197px" }}>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=197&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Optional dark overlay for readability */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Info Row */}
        <div
          className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between px-4 sm:px-6 lg:px-8 pb-4"
          style={{ minHeight: "120px" }}
        >
          {/* Left: Avatar + Name/Meta */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
            {/* Avatar: 141x137, lifted over the cover */}
            <div
              className="relative flex-shrink-0 rounded-lg border-4 border-white overflow-hidden shadow-md"
              style={{
                width: "141px",
                height: "137px",
                marginTop: "-68px",
                background: "#e0e7ef",
              }}
            >
              {!imgError ? (
                <img
                  src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                  alt="Thai Ratanak"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name & Meta Info */}
            <div className="pb-1 sm:mb-1">
              <h2 className="font-bold text-gray-900 leading-tight" style={{ fontSize: "18px" }}>
                Thai Ratanak
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 mt-1">
                <span className="text-gray-500" style={{ fontSize: "13px" }}>
                  IT &amp; Software
                </span>
                <span className="text-gray-400" style={{ fontSize: "13px" }}>•</span>
                <span className="text-gray-500" style={{ fontSize: "13px" }}>
                  Phnom Penh–Cambodia
                </span>
              </div>
              {/* Edit Profile Button */}
              <button
                className="mt-2 px-4 py-1 rounded border text-sm font-medium transition-colors"
                style={{ borderColor: "#3b82f6", color: "#3b82f6", background: "white", fontSize: "13px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right: Message Button */}
          <div className="flex items-end pb-1 sm:mb-1 mt-3 sm:mt-0">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ background: "#2563eb", fontSize: "14px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.205V22l3.37-1.85c.9.248 1.853.38 2.942.38 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.44l-2.548-2.717-4.972 2.717 5.473-5.81 2.613 2.717 4.907-2.717-5.473 5.81z" />
              </svg>
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}