import React, { useMemo } from "react";
import MainSection from "../components/sectionhome/MainSection";
import FindTheBest from "../components/sectionhome/FindTheBest";
import SectionSolutionForEveryNeed from "../components/sectionhome/SectionSalutionForEveryDay";
import HowIsWork from "../components/sectionhome/HowIsWork";
import TalentByFreelancer from "../components/sectionhome/TalentByFreelancer";
import TalenCategories from "../components/sectionhome/TalenCategories";
import PeopleLoveWorking from "../components/sectionhome/PeopleLoveWorking";
import { useGetFreelancersQuery } from "../services/freelancerApi";
import ButtonComponent from "../components/button/ButtonComponent";
import { Link } from "react-router";
import JobsGrid from "../components/findwork/JobsGrid";
import { useGetAllJobsQuery } from "../services/servicesApi";
import TalentByFreelancerSkeleton from "../components/loading/Talentbyfreelancerskeleton";
import StarsBackground from "../components/startBackground/StarsBackground";


export default function Home() {
  const { data, isLoading, isError } = useGetFreelancersQuery();

  const freelancers = data?.data?.content || [];
  const {
    data: jobData,
    isLoading: jobLoading,
    isError: jobError,
  } = useGetAllJobsQuery();
  const jobs = useMemo(() => {
    if (Array.isArray(jobData)) return jobData;
    if (Array.isArray(jobData?.content)) return jobData.content;
    if (Array.isArray(jobData?.data?.content)) return jobData.data.content;
    if (Array.isArray(jobData?.data)) return jobData.data;
    return [];
  }, [jobData]);

  return (
    <div>
      <StarsBackground starCount={200} />
      <MainSection />
      
      <HowIsWork />
      <FindTheBest />
      <div>
        <h2
          className="text-3xl md:text-4xl text-center my-10 font-bold text-[#1E88E5]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Browse talent by Freelancer
        </h2>
      </div>
      {/* Card nusiness owner show */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mt-6 pb-16">
          <JobsGrid
            filtered={jobs.slice(0, 4)}
            visibleCount={4}
            isLoading={jobLoading}
            isError={jobError}
          />
        </div>
      </div>

      <SectionSolutionForEveryNeed />
      <TalenCategories />

      <section className="w-full mt-8 pb-10" style={{ background: "inherit" }}>
        <div className="flex items-center justify-between max-w-360 mx-auto px-6 sm:px-10 lg:px-30 mb-10">
          <div>
            <h2
              className="text-3xl md:text-4xl  font-bold text-[#1E88E5]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Browse talent by Freelancer
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Browse top categories and find the right talent for your project.
            </p>
          </div>
          <div>
            <Link to="/findfreelan">
              <ButtonComponent text="All freelancer" />
            </Link>
          </div>
        </div>

        <div className="max-w-360 mx-auto px-6 lg:px-30">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <TalentByFreelancerSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freelancers.slice(0, 8).map((item) => (
                <TalentByFreelancer
                  key={item.id}
                  userId={item.id}
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
