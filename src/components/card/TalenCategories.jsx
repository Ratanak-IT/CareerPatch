import React, { useEffect, useState } from "react";

// Individual Card Component
const CategoryCard = ({ image, title, servicesCount }) => {
  return (
    /* 1. rounded-[2.5rem] provides that extra-large radius shown in your images.
       2. shadow-xl is used to match the depth in your screenshots.
       3. mx-1 ensures the side shadows aren't clipped by the container.
    */
    <div className="relative group overflow-hidden rounded-[2.5rem] h-[200px] w-full cursor-pointer shadow-xl transition-all duration-500 mx-1 bg-white">
      {/* Background Image */}
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
      
      {/* Content Positioning */}
      <div className="absolute inset-0 p-6 flex flex-col justify-start font-poppins text-white">
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] opacity-90">
          {servicesCount} Services
        </span>
        <h3 className="text-lg sm:text-xl font-bold mt-1 leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default function TalenCategories() {
  const allCategories = [
    { id: 1, title: "Development & IT", services: "9", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b" },
    { id: 2, title: "Design & Creative", services: "12", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
    { id: 3, title: "Photography", services: "5", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32" },
    { id: 4, title: "Digital Marketing", services: "8", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" },
    { id: 5, title: "Video Editing", services: "15", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d" },
    { id: 6, title: "Writing", services: "7", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a" },
    { id: 7, title: "Business Strategy", services: "4", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf" },
    { id: 8, title: "Music & Audio", services: "6", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" },
    { id: 9, title: "Data Science", services: "11", img: "https://images.unsplash.com/photo-1551288049-bbbda5366391" },
    { id: 10, title: "Cyber Security", services: "3", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide to the right every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= allCategories.length - 4 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [allCategories.length]);

  return (
    /* px-[120px] matches your "Layout Guide Style" Margin exactly.
       overflow-hidden on this section acts as the master mask.
    */
    <section className="w-full bg-white py-12 px-6 sm:px-10 lg:px-[120px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        {/* 'overflow-visible' is critical here. It prevents the 
            rounded corners of the cards from being clipped while moving.
        */}
        <div className="overflow-visible relative">
          <div 
            className="flex transition-transform duration-1000 ease-in-out gap-5"
            style={{ 
              /* Moves by 25% of the width since we show 4 cards */
              transform: `translateX(-${currentIndex * (100 / (
                window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1
              ))}%)` 
            }}
          >
            {allCategories.map((cat) => (
              /* lg:w-[calc(25%-15px)] ensures 4 cards fit with 
                 the 20px Gutter from your layout guide.
              */
              <div 
                key={cat.id} 
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] flex-shrink-0"
              >
                <CategoryCard 
                  title={cat.title}
                  servicesCount={cat.services}
                  image={cat.img}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom blue line indicator based on image_13b71a */}
        <div className="flex justify-center mt-12 gap-3">
          {Array.from({ length: allCategories.length - 3 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentIndex === i ? "w-12 bg-blue-500" : "w-3 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}