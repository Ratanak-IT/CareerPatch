import React from 'react'
import imgMain from "../../assets/modelforfindfreelancer.png";

export default function HeroSectionComponent() {
  return (
    <section
  className="max-w-[1200px] h-[396px] w-full mx-auto 
             flex items-center justify-center
             overflow-hidden bg-gradient-to-br 
             from-[#F3F4F6] to-[#1E88E5]/25"
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
  <div className="w-full px-6 lg:px-[80px] 
                  flex flex-col lg:flex-row 
                  items-center justify-between">

    {/* LEFT */}
    <div className="w-full lg:w-[48%] text-center lg:text-left">
      <h1 className="font-bold leading-[1.1] 
                     text-[22px] 
                     sm:text-[26px] 
                     md:text-[32px] 
                     lg:text-[40px] 
                     m-0">
        Discover <span className="text-blue-600">our freelancers</span> and <br />
        work with <span className="text-blue-600">the best talent on </span><br />
        CarrerPatch
      </h1>
    </div>

    {/* RIGHT */}
    <div className="w-full lg:w-[52%] 
                    relative 
                    flex items-center justify-center">

      <img
        src={imgMain}
        alt="Professional with Laptop"
        className="relative z-10 
                   w-[363px] h-[394px] 
                   object-contain"
        style={{
          filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.15))",
        }}
      />

      

      {/* Glow */}
      <div className="absolute -z-0 
                      rounded-full 
                      pointer-events-none 
                      w-[250px] h-[250px] 
                      bg-[#1E88E5]/10 
                      blur-3xl" />
    </div>
  </div>
</section>
    
  )
}