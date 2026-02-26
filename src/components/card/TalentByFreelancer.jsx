import React, { useState } from "react";
import ButtonComponent from "../button/ButtonComponent";
import ratanakImg from "../../assets/ratanak.png"; 

export default function TalentByFreelancer() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    /* Responsive width: full on mobile, fixed max-width for consistency */
    <div className="w-full max-w-[320px] xs:max-w-[340px] bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 relative flex flex-col gap-5 font-poppins transition-all hover:shadow-md">
      
      {/* Top Right Heart Icon */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="transition-transform active:scale-125 p-1"
          aria-label="Like freelancer"
        >
          {isLiked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" className="w-6 h-6 sm:w-7 sm:h-7">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400 hover:text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Profile Section: Responsive Layout */}
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        {/* Avatar: Scaled for mobile/desktop */}
        <div className="flex-shrink-0">
          <img
            src={ratanakImg}
            alt="Thai Ratanak"
            className="w-[65px] h-[65px] sm:w-[80px] sm:h-[80px] rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>

        {/* Info Column */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-[16px] sm:text-[18px] font-bold text-gray-900 truncate">
            Thai Ratanak
          </h3>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-blue-500">📅</span>
            <p className="text-[13px] sm:text-[14px] text-gray-500 truncate">Design & creative</p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-green-500 text-xs sm:text-sm">●</span>
            <p className="text-[13px] sm:text-[14px] text-gray-600 font-medium">5+ years experience</p>
          </div>

          <div className="mt-2">
            <span className="bg-gray-100 text-gray-500 text-[11px] sm:text-[12px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              UX/UI
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Stacks on very small screens, row on others */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 pt-2">
        <p className="text-[12px] sm:text-[13px] text-gray-400">
          Location: <span className="text-gray-500 font-medium">Phnom Penh</span>
        </p>

        <div className="w-full xs:w-auto">
          <ButtonComponent
            text="View Profile"
            className="w-full xs:w-auto text-xs sm:text-sm px-4 py-2"
            onClick={() => console.log("Profile clicked")}  
          />
        </div>
      </div>
    </div>
  );
}