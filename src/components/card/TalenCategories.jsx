import React from "react";
import { useDarkMode } from "../navbar/NavbarComponent";

const CATEGORIES = [
  { id: 1,  title: "Development & IT",  services: "9",  img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b" },
  { id: 2,  title: "Design & Creative", services: "12", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
  { id: 3,  title: "Photography",       services: "5",  img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32" },
  { id: 4,  title: "Digital Marketing", services: "8",  img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" },
  { id: 5,  title: "Video Editing",     services: "15", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d" },
  { id: 6,  title: "Writing",           services: "7",  img: "https://images.unsplash.com/photo-1455390582262-044cdead277a" },
  { id: 7,  title: "Business Strategy", services: "4",  img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf" },
  { id: 8,  title: "Music & Audio",     services: "6",  img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" },
  { id: 9,  title: "Data Science",      services: "11", img: "https://images.unsplash.com/photo-1551288049-bbbda5366391" },
  { id: 10, title: "Cyber Security",    services: "3",  img: "https://images.unsplash.com/photo-1563986768609-322da13575f3" },
];

const CategoryCard = ({ image, title, servicesCount }) => (
  <div className="relative group overflow-hidden rounded-[2.5rem] h-[200px] cursor-pointer shadow-xl flex-shrink-0"
       style={{ width: "280px" }}>
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
    <div className="absolute inset-0 p-6 flex flex-col justify-start text-white"
         style={{ fontFamily: "'Poppins', sans-serif" }}>
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-90">
        {servicesCount} Services
      </span>
      <h3 className="text-lg font-bold mt-1 leading-tight">{title}</h3>
    </div>
  </div>
);

export default function TalenCategories() {
  const { darkMode } = useDarkMode();

  // Duplicate cards so the marquee loops seamlessly
  const items = [...CATEGORIES, ...CATEGORIES];
  // Total width = 10 cards × (280px card + 20px gap) = 3000px
  const totalWidth = CATEGORIES.length * (280 + 20);

  return (
    <section
      className="w-full py-16 overflow-hidden"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: darkMode
          ? "linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)"
          : "#ffffff",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#1E88E5]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Talent Categories
        </h2>
        <p
          className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-gray-400"}`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Browse top categories and find the right talent for your project.
        </p>
      </div>

      {/* Marquee track — no padding so cards go edge to edge */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{
            background: darkMode
              ? "linear-gradient(to right, #0d1b2e, transparent)"
              : "linear-gradient(to right, #ffffff, transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{
            background: darkMode
              ? "linear-gradient(to left, #0d1520, transparent)"
              : "linear-gradient(to left, #ffffff, transparent)",
          }}
        />

        {/* Scrolling track */}
        <div
          className="flex gap-5 w-max"
          style={{ animation: `marquee ${CATEGORIES.length * 6}s linear infinite` }}
        >
          {items.map((cat, i) => (
            <CategoryCard
              key={`${cat.id}-${i}`}
              title={cat.title}
              servicesCount={cat.services}
              image={cat.img}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${totalWidth}px); }
        }
      `}</style>
    </section>
  );
}