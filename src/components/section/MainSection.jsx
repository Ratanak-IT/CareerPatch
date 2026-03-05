import React from "react";
import imgMain from "../../assets/imgmainsection.png";
import avatar1 from "../../assets/chhor pong.png";
import avatar2 from "../../assets/khim.png";
import avatar3 from "../../assets/ratanalkkh.png";

export default function MainSection() {
  return (
    <section
      className="w-full overflow-hidden bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/20 dark:from-[#0d1b2e] dark:via-[#0f2240] dark:to-[#0d1520]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Changed items-stretch to items-center 
         Reduced pt (padding-top) to bring text closer to the top navbar
      */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] 
                      flex flex-col lg:flex-row items-center justify-start lg:justify-between 
                      min-h-fit lg:min-h-[calc(100vh-89px)] pt-12 lg:pt-0">

        {/* ── LEFT CONTENT ── */}
        {/* mb-6 reduces the gap between the text block and the image below it */}
        <div className="w-full lg:w-[55%] flex flex-col text-center lg:text-left items-center lg:items-start gap-4 lg:gap-7 z-10 mb-6 lg:mb-0">
          
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/25">
            <div className="flex items-center rounded-full px-0.5 bg-[#1E88E5] w-[28px] h-[16px]">
              <div className="rounded-full bg-white ml-auto w-[12px] h-[12px]" />
            </div>
            <span className="text-[#1E88E5] text-[11px] font-semibold uppercase tracking-wide">
              Find Your Dream Job
            </span>
          </div>

          {/* Heading - Reduced bottom margin/gap */}
          <h1 className="font-bold leading-[1.1] m-0 text-[32px] sm:text-[42px] lg:text-[56px] xl:text-[68px]">
            <span className="text-[#1E88E5]">Freelance Jobs</span><br />
            <span className="text-gray-900 dark:text-white">and Talents at</span><br />
            <span className="text-gray-900 dark:text-white">Your </span>
            <span className="text-[#1E88E5]">Fingertips</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base leading-relaxed max-w-[480px] text-gray-500 dark:text-slate-400 m-0">
            Connect with top freelancers and clients on our platform.
            Find your perfect match for your next project.
          </p>

          {/* Avatars - Closer to description */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[avatar1, avatar2, avatar3].map((src, i) => (
                <img key={i} src={src} alt="freelancer"
                  className="w-9 h-9 lg:w-11 lg:h-11 rounded-full object-cover border-2 border-white dark:border-[#0f172a]" />
              ))}
            </div>
            <p className="text-[12px] sm:text-sm font-medium text-gray-500 dark:text-slate-400">
              Over <span className="text-[#1E88E5] font-bold">12,800+</span> freelancers
            </p>
          </div>
        </div>

        {/* ── RIGHT IMAGE ── */}
        <div className="w-full lg:w-[45%] relative flex justify-center items-end self-end">
          <img
            src={imgMain}
            alt="Professional with Laptop"
            // negative margin-top (-mt-4) pulls the image up to overlap slightly with the text area
            className="relative z-10 object-contain w-[90%] sm:w-[75%] lg:w-full h-auto -mt-4 lg:mt-0"
            style={{ 
              filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.2))",
              maxHeight: "65vh" 
            }}
          />

          {/* Floating Stats Card - Positioned better for mobile */}
          <div
            className="absolute z-20 flex flex-col gap-0.5 rounded-xl p-3 sm:p-5
                       bg-white/95 backdrop-blur-sm shadow-xl dark:bg-slate-800/95 top-[15%] right-[8%] sm:right-[15%] lg:right-0"
            style={{ animation: "floatCard 3s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-slate-100">30K+</span>
              <span className="text-lg sm:text-xl">💼</span>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-slate-400">
              People got hired
            </span>
          </div>

          <div className="absolute -z-0 rounded-full bottom-0 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-0 w-[90%] aspect-square bg-[#1E88E5]/10 blur-[80px]" />
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}