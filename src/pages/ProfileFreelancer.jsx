import React, { useState } from 'react'
import ProfileCardComponent from '../components/profile/freelancer/ProfileCardComponent'
import CardInformationFreelancerComponent from '../components/profile/freelancer/CardInformationFreelancerComponent'
import ToggleTabComponent from '../components/profile/freelancer/ToggleTabComponent'
import ButtonPostComponent from '../components/profile/freelancer/ButtonPostComponent'
import CardFreelancerPostComponent from '../components/freelancer/CardFreelancerPostComponent'

// ─── Icons ────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
)
const HeartIcon = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? "#3B82F6" : "none"} stroke={filled ? "#3B82F6" : "#9ca3af"} strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

// ─── Sample Data ──────────────────────────────────────────────────────────────
let coverImg = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=253&fit=crop"

const FREELANCER_DATA = [
  { id: 1, image: coverImg, title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", author: "Nita", avatar: "" },
  { id: 2, image: coverImg, title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", author: "Hazel", avatar: "" },
  { id: 3, image: coverImg, title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", author: "Jiker", avatar: "" },
  { id: 4, image: coverImg, title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", author: "Spider", avatar: "" },
]

const JOB_DATA = [
  { id: 1, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=253&fit=crop", title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", level: "Expert", author: "Hazel", avatar: "" },
  { id: 2, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=253&fit=crop", title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", level: "Expert", author: "Jungkook", avatar: "" },
  { id: 3, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=253&fit=crop", title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", level: "Expert", author: "Jimin", avatar: "" },
  { id: 4, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=253&fit=crop", title: "UX/UI Designer", description: "Creative design solutions for web and mobile interfaces, focusing on user experience and modern aesthetics.", tags: ["Figma", "Design"], date: "February 21, 2026", level: "Expert", author: "Kelis", avatar: "" },
]

// ─── Freelancer Favorite Card ─────────────────────────────────────────────────
function FreelancerFavCard({ image, title, description, tags, date, author, avatar, isDark }) {
  const [liked, setLiked] = useState(true)
  return (
    <div className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col `}
      style={{ width: 285, height: 487 }}>
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ height: 253 }}>
        <img src={image} alt={title} className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/285x253?text=No+Image" }} />
        <button onClick={() => setLiked(p => !p)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow transition-transform hover:scale-110">
          <HeartIcon filled={liked} />
        </button>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-blue-500 font-bold text-sm mb-1 truncate">{title}</h2>
        <p className={`text-xs leading-relaxed mb-4 overflow-hidden `}
          style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
          {description}
        </p>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span key={tag} className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Date: {date}</span>
        </div>
        <div className={`border-t mb-3 ${isDark ? 'border-[#2e3347]' : 'border-gray-100'}`} />
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 `}>
              {author[0]}
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{author}</span>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200">
            Message
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Job Announcement Card ────────────────────────────────────────────────────
function JobFavCard({ image, title, description, tags, date, level, author, avatar, isDark }) {
  const [liked, setLiked] = useState(true)
  return (
    <div className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col `}
      style={{ width: 285, height: 500 }}>
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ height: 200 }}>
        <img src={image} alt={title} className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/285x200?text=No+Image" }} />
        <button onClick={() => setLiked(p => !p)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow transition-transform hover:scale-110">
          <HeartIcon filled={liked} />
        </button>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-blue-500 font-bold text-sm mb-1 truncate">{title}</h2>
        <p className={`text-xs leading-relaxed mb-3 overflow-hidden `}
          style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
          {description}
        </p>
        {/* Tags + Date */}
        <div className="flex items-center justify-between mb-1 flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span key={tag} className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        {/* Date + Level */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs `}>Date: {date}</span>
          <span className="text-xs font-semibold text-blue-500">Level: {level}</span>
        </div>
        <div className={`border-t mb-3 `} />
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 `}>
              {author[0]}
            </div>
            <span className={`text-xs font-medium `}>{author}</span>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Favorites Tab Content ────────────────────────────────────────────────────
function FavoritesContent({ isDark }) {
  const sectionTitle = `text-lg font-bold mb-4 `
  const grid = "grid gap-x-[30px] gap-y-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

  return (
    <div className="w-full max-w-[1200px] flex flex-col gap-10">
      {/* Freelancer Section */}
      <div>
        <h3 className={sectionTitle}>Freelancer</h3>
        <div className={grid}>
          {FREELANCER_DATA.map(card => (
            <FreelancerFavCard key={card.id} {...card} isDark={isDark} />
          ))}
        </div>
      </div>

      {/* Job Announcement Section */}
      <div>
        <h3 className={sectionTitle}>Job Announcement</h3>
        <div className={grid}>
          {JOB_DATA.map(card => (
            <JobFavCard key={card.id} {...card} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfileFreelancer() {
  const [activeTab, setActiveTab] = useState("information")
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={`min-h-screen py-6 px-4 flex flex-col items-center gap-5 transition-colors duration-300 ${isDark ? 'bg-[#0f1117]' : 'bg-gray-50'}`}>

      

      {/* 1. Profile Header */}
      <div className="w-full max-w-[1200px]">
        <ProfileCardComponent isDark={isDark} />
      </div>

      {/* 2. Toggle Tab + Post Button */}
      <div className="w-full max-w-[1200px] flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <ToggleTabComponent active={activeTab} setActive={setActiveTab} isDark={isDark} />
        </div>
        <ButtonPostComponent isDark={isDark} onClick={() => console.log("Post clicked")} />
      </div>

      {/* 3. Information Tab */}
      {activeTab === "information" && (
        <>
          <div className="w-full max-w-[1200px]">
            <CardInformationFreelancerComponent isDark={isDark} />
          </div>
          <div className="w-full max-w-[1200px]">
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>All posts</h3>
            <CardFreelancerPostComponent isDark={isDark} />
          </div>
        </>
      )}

      {/* 4. Favorites Tab */}
      {activeTab === "favorites" && (
        <FavoritesContent isDark={isDark} />
      )}

    </div>
  )
}