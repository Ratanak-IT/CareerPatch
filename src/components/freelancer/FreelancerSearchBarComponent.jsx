import React, { useState } from 'react'

export default function FreelancerSearchBarComponent() {
     const [category, setCategory] = useState("Freelancer");
  const [query, setQuery] = useState("");
  return (
    <div className="flex items-center bg-white rounded-xl shadow-md px-4 py-3 w-full max-w-2xl">

      {/* Left: Category Dropdown */}
      <div className="flex items-center gap-2 pr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-gray-700 text-sm font-medium bg-transparent outline-none cursor-pointer pr-1"
        >
          <option>IT & Software</option>
          <option>Design</option>
          <option>Marketing</option>
          <option>Writing</option>
          <option>Video</option>
          <option>Business</option>
          <option>Cybersecurity</option>
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Right: Text Search */}
      <div className="flex items-center gap-2 flex-1 px-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title && skill"
          className="w-full text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>

      {/* Search Button */}
      <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-200 shrink-0">
        Search
      </button>

    </div>
  )
}
