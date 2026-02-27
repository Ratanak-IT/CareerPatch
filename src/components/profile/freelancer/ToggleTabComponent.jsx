import { useState } from "react";

export default function ToggleTabComponent({ active, setActive }) {
  // fallback to internal state if no props passed
  const [internalActive, setInternalActive] = useState("information");
  const currentActive = active ?? internalActive;
  const handleSet = setActive ?? setInternalActive;

  return (
    <div
      style={{
        width: "402px",
        height: "47px",
        borderRadius: "12px",
        border: "1.5px solid #D8C8EE",
        display: "flex",
        alignItems: "center",
        padding: "4px",
        boxSizing: "border-box",
        fontFamily: "'Poppins', 'Inter', sans-serif",
      }}
    >
      {/* Information Tab */}
      <button
        onClick={() => handleSet("information")}
        style={{
          flex: 1,
          height: "100%",
          borderRadius: "9px",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          transition: "all 0.25s ease",
          background: currentActive === "information"
            ? "linear-gradient(135deg, #7C3AED, #8B5CF6)"
            : "transparent",
          color: currentActive === "information" ? "#fff" : "#7C3AED",
          boxShadow: currentActive === "information"
            ? "0 2px 10px rgba(124,58,237,0.35)"
            : "none",
          letterSpacing: "0.01em",
        }}
      >
        Information
      </button>

      {/* Favorites Tab */}
      <button
        onClick={() => handleSet("favorites")}
        style={{
          flex: 1,
          height: "100%",
          borderRadius: "9px",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          transition: "all 0.25s ease",
          background: currentActive === "favorites"
            ? "linear-gradient(135deg, #7C3AED, #8B5CF6)"
            : "transparent",
          color: currentActive === "favorites" ? "#fff" : "#7C3AED",
          boxShadow: currentActive === "favorites"
            ? "0 2px 10px rgba(124,58,237,0.35)"
            : "none",
          letterSpacing: "0.01em",
        }}
      >
        Favorites
      </button>
    </div>
  );
}