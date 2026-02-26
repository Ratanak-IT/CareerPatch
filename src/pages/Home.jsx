import React from "react";
import MainSection from "../components/section/MainSection";
import FindTheBest from "../components/section/FindTheBest";
import SectionSolutionForEveryNeed from "../components/section/SectionSalutionForEveryDay";
import HowIsWork from "../components/card/HowIsWork";
import TalentByFreelancer from "../components/card/TalentByFreelancer";
import TalenCategories from "../components/card/TalenCategories";
import PeopleLoveWorking from "../components/section/PeopleLoveWorking";
import { useGetFreelancersQuery } from "../services/freelancerApi";
import ButtonComponent from "../components/button/ButtonComponent";


// ✅ API hook (from src/services/freelancer.js)


export default function Home() {
  const { data, isLoading, isError } = useGetFreelancersQuery();

  // your API usually returns { success, message, data: [...] }
  const freelancers = data?.data?.content || [];

  return (
    <div>
      <MainSection />
      <HowIsWork />
      <FindTheBest />
      <SectionSolutionForEveryNeed />
      <TalenCategories />

      <section className="w-full mt-8" style={{ background: "inherit" }}>
        <div className="flex items-center justify-between max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] mb-10">
          <div>
          <h2
            className="text-3xl md:text-4xl  font-bold text-[#1E88E5]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Browse talent by Freelancer
          </h2>
          <p className="mt-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Browse top categories and find the right talent for your project.
          </p>
        </div>
        <div>
          <ButtonComponent text="All freelancer"/>
        </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px]">
          {/* Loading / Error */}
          {isLoading && (
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-gray-500">
              Loading freelancers...
            </p>
          )}

          {isError && (
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-red-500">
              Failed to load freelancers.
            </p>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freelancers.slice(0, 4).map((item) => (
                <TalentByFreelancer
                  key={item.id}
                  name={item.fullName}
                  skills={item.skills}
                  experienceYears={item.experienceYears}
                  location={item.address}
                  avatar={item.profileImageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <PeopleLoveWorking />
    </div>
  );
}