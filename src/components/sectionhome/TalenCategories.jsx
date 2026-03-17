// src/components/sectionhome/TalenCategories.jsx
//
// npm install react-fast-marquee

import React from "react";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router";
import { useGetCategoriesQuery } from "../../services/categoriesApi";

// Fallback images mapped by common category name keywords
const CATEGORY_IMAGES = {
  "development":  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
  "it":           "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
  "design":       "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  "creative":     "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  "photo":        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  "marketing":    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "video":        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  "writing":      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "business":     "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  "music":        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  "audio":        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  "data":         "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&w=600&q=80",
  "science":      "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&w=600&q=80",
  "security":     "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "cyber":        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "network":      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "mobile":       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  "web":          "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
  "app":          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  "default":      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
};

function getImageForCategory(name = "") {
  const lower = name.toLowerCase();
  for (const [keyword, url] of Object.entries(CATEGORY_IMAGES)) {
    if (keyword === "default") continue;
    if (lower.includes(keyword)) return url;
  }
  return CATEGORY_IMAGES.default;
}

// Detect dark mode for correct marquee gradient color
function useDarkMode() {
  const [dark, setDark] = React.useState(
    () => document.documentElement.classList.contains("dark")
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

function CategoryCard({ name, count, image, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative group overflow-hidden rounded-[2.5rem] cursor-pointer shadow-xl mx-2.5 flex-shrink-0
                 hover:-translate-y-1 transition-transform duration-300"
      style={{ width: 280, height: 200 }}
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-start text-white"
           style={{ fontFamily: "'Poppins', sans-serif" }}>
        {count != null && (
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-90">
            {count} Services
          </span>
        )}
        <h3 className="text-lg font-bold mt-1 leading-tight">{name}</h3>
      </div>
    </div>
  );
}

// Skeleton card shown while loading
function SkeletonCard() {
  return (
    <div
      className="rounded-[2.5rem] mx-2.5 flex-shrink-0 bg-gray-200 dark:bg-slate-700 animate-pulse"
      style={{ width: 280, height: 200 }}
    />
  );
}

export default function TalenCategories() {
  const navigate = useNavigate();
  const isDark   = useDarkMode();

  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  // react-fast-marquee: gradientColor must be [R, G, B]
  const gradientColor = isDark ? [13, 27, 46] : [255, 255, 255];

  const handleClick = (categoryName) => {
    // Navigate to /findfreelan with ?category=CategoryName
    // FindFreelancers page will read this param on mount
    navigate(`/findfreelan?category=${encodeURIComponent(categoryName)}`);
  };

  // Build display list — real API data
  const displayItems = isLoading
    ? Array.from({ length: 8 }).map((_, i) => ({ id: `sk-${i}`, skeleton: true }))
    : categories.map((cat) => ({
        id:    cat.id,
        name:  cat.name,
        count: cat.serviceCount ?? cat.count ?? null,
        image: getImageForCategory(cat.name),
      }));

  return (
    <section
      className="w-full py-16 overflow-hidden
                 bg-white
                 dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Heading */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E88E5]">
          Browse talent by categories
        </h2>
        <p className="mt-2 text-sm text-gray-400 dark:text-slate-400">
          Browse top categories and find the right talent for your project.
        </p>
      </div>

      {/* Marquee */}
      <Marquee
        speed={50}
        pauseOnHover
        gradient
        gradientColor={gradientColor}
        gradientWidth={96}
      >
        {displayItems.map((item, i) =>
          item.skeleton ? (
            <SkeletonCard key={item.id} />
          ) : (
            <CategoryCard
              key={item.id}
              name={item.name}
              count={item.count}
              image={item.image}
              onClick={() => handleClick(item.name)}
            />
          )
        )}
      </Marquee>
    </section>
  );
}