import React from "react";
import imgMain from "../../assets/modelforfindfreelancer.png";
import FreelancerSearchBarComponent from "./FreelancerSearchBarComponent";

export default function HeroSectionComponent({
  category,
  searchText,
  onChangeCategory,
  onChangeSearch,
  onSubmitSearch,
}) {
  return (
    <div className="relative pb-[30px] sm:pb-[40px] md:pb-[50px]">
      <section
        className="
          w-full
          flex flex-col
          overflow-visible
          bg-gradient-to-br from-[#F3F4F6] to-[#1E88E5]/25
          rounded-2xl
        "
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div
          className="
            w-full px-6 lg:px-[80px]
            flex flex-col lg:flex-row
            items-center justify-between
            pt-8 pb-14
            sm:pb-16
            lg:pt-0 lg:pb-16 lg:h-[396px]
          "
        >
          <div className="w-full lg:w-[48%] text-center lg:text-left">
            <h1
              className="
                font-bold leading-[1.2]
                text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px]
                m-0
              "
            >
              Discover <span className="text-blue-600">our freelancers</span> and <br />
              work with <span className="text-blue-600">the best talent on </span>
              <br />
              CarrerPatch
            </h1>
          </div>

          <div className="w-full lg:w-[52%] relative flex items-center justify-center mt-6 lg:mt-0">
            <img
              src={imgMain}
              alt="Professional with Laptop"
              className="
                relative z-10
                w-[200px] h-auto
                sm:w-[270px]
                md:w-[320px]
                lg:w-[363px] lg:h-[394px]
                object-contain
              "
              style={{ filter: "drop-shadow(0 20px 40px rgba(30,136,229,0.15))" }}
            />
            <div className="absolute -z-0 rounded-full pointer-events-none w-[250px] h-[250px] bg-[#1E88E5]/10 blur-3xl" />
          </div>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <FreelancerSearchBarComponent
          category={category}
          searchText={searchText}
          onChangeCategory={onChangeCategory}
          onChangeSearch={onChangeSearch}
          onSubmitSearch={onSubmitSearch}
        />
      </div>
    </div>
  );
}