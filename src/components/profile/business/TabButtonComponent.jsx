import React, { useState } from "react";

export default function TabButtonComponent() {
  // ✅ Dynamic Data
  const tabs = [
    { id: 1, label: "Information" },
    { id: 2, label: "Favorites" },
    { id: 3, label: "View Apply" },
  ];

  const [activeTab, setActiveTab] = useState(3);

  return (
    <div className="w-full flex justify-center px-4">
      <div
        className="
          flex 
          w-full 
          max-w-3xl 
          bg-white 
          rounded-xl 
          border 
          border-purple-400 
          overflow-hidden
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1
              py-2 md:py-3
              text-sm md:text-base
              font-medium
              transition-all
              duration-300
              ${
                activeTab === tab.id
                  ? " rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  : "text-purple-600 bg-white hover:bg-purple-50 rounded-xl"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}