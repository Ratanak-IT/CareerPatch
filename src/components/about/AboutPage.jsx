
import { useEffect, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import AboutImg   from "../../assets/about.avif";
import MentorImg1 from "../../assets/mentor1.png";
import MentorImg2 from "../../assets/mentor2.jpg";
import TargetImg  from "../../assets/target.png";
import Vision     from "../../assets/vision.png";
import Briefcase  from "../../assets/briefcase.png";
import OurTeam    from "./OurTeam";
import MentorCard, { MentorCardSkeleton } from "./Mentor";
import {
  useGetFreelancersQuery,
  useGetBusinessesQuery,
  useGetJobsQuery,
} from "../../services/freelancerApi";


function Bullet({ children }) {
  return (
    <li className="flex gap-2 text-sm sm:text-base">
      <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#2B6DFF]" />
      <span className="text-slate-600 text-lg dark:text-gray-300">{children}</span>
    </li>
  );
}


function Stat({ value, label, color = "text-[#1A73E8]" }) {
  return (
    <div className="py-3 text-center">
      <div className={`text-xl dark:text-gray-300 font-bold ${color}`}>{value}</div>
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}


function GlassCard({ children, className = "", ...rest }) {
  return (
    <div
      {...rest}
      className={`
        rounded-2xl border shadow-sm transition-colors
        bg-white/80 dark:bg-[#1e293b]/80
        backdrop-blur-md
        border-slate-200 dark:border-slate-700/60
        ${className}
      `}
    >
      {children}
    </div>
  );
}


export default function AboutPage({ isLoading = false }) {


  const { data: freelancersRaw } = useGetFreelancersQuery();
  const { data: businessesRaw  } = useGetBusinessesQuery();
  const { data: jobsRaw        } = useGetJobsQuery();

  const freelancerCount = useMemo(() => {
    if (!freelancersRaw) return null;

    if (freelancersRaw.total != null) return freelancersRaw.total;
    const arr = Array.isArray(freelancersRaw) ? freelancersRaw
      : Array.isArray(freelancersRaw?.data)    ? freelancersRaw.data
      : Array.isArray(freelancersRaw?.content) ? freelancersRaw.content : [];
    return arr.length || null;
  }, [freelancersRaw]);

  const businessCount = useMemo(() => {
    if (!businessesRaw) return null;
    if (businessesRaw.total != null) return businessesRaw.total;
    const arr = Array.isArray(businessesRaw) ? businessesRaw
      : Array.isArray(businessesRaw?.data)    ? businessesRaw.data
      : Array.isArray(businessesRaw?.content) ? businessesRaw.content : [];
    return arr.length || null;
  }, [businessesRaw]);

  const jobCount = useMemo(() => {
    if (!jobsRaw) return null;
    if (jobsRaw.total != null) return jobsRaw.total;
    const arr = Array.isArray(jobsRaw) ? jobsRaw
      : Array.isArray(jobsRaw?.data)    ? jobsRaw.data
      : Array.isArray(jobsRaw?.content) ? jobsRaw.content
      : Array.isArray(jobsRaw?.data?.content) ? jobsRaw.data.content : [];
    return arr.length || null;
  }, [jobsRaw]);

  useEffect(() => {

    const timer = setTimeout(() => {
      AOS.init({
        once:     true,
        duration: 750,
        easing:   "ease-out-quart",
        offset:   80,
        delay:    0,
      });
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => AOS.refresh(), 200);
    }
  }, [isLoading]);

  return (
    <div className="relative bg-transparent transition-colors duration-300">

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">

            {/* Left */}
            <div className="max-w-2xl"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <span className="inline-flex items-center gap-2 rounded-full
                               bg-blue-50 dark:bg-blue-900/30
                               border border-blue-200 dark:border-blue-700
                               px-4 py-1.5 text-xs font-semibold
                               text-[#1A73E8] dark:text-blue-400 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
                Freelance Marketplace
              </span>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl
                             text-[#1E293B] dark:text-white leading-tight">
                About <span className="text-[#1A73E8]">CareerPatch</span>
              </h1>

              <p className="mt-5 text-sm leading-7 sm:text-base sm:leading-8 lg:text-lg
                            text-slate-500 dark:text-slate-400">
                CareerPatch is a modern freelance marketplace designed to connect
                businesses with skilled freelancers. Our platform helps companies
                find the right talent while giving freelancers opportunities to
                grow and work on real projects.
              </p>

              {/* Stats — real API data */}
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { val: freelancerCount, fallback: "120+", lbl: "Freelancers", delay: 200 },
                  { val: businessCount,   fallback: "80+",  lbl: "Businesses",  delay: 300 },
                  { val: jobCount,        fallback: "60+",  lbl: "Jobs Posted",  delay: 400 },
                ].map(({ val, fallback, lbl, delay }) => (
                  <div key={lbl}
                    data-aos="zoom-in"
                    data-aos-delay={String(delay)}
                    data-aos-duration="600"
                    className="flex flex-col"
                  >
                    <span className="text-2xl font-extrabold text-[#1A73E8]">
                      {val !== null ? `${val}+` : fallback}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="w-full"
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="150"
            >
              <GlassCard className="overflow-hidden p-0">
                <img
                  src={AboutImg}
                  alt="Team discussion"
                  className="h-[220px] w-full object-cover sm:h-[260px] md:h-[300px] lg:h-[360px]"
                />
              </GlassCard>
            </div>
          </div>

          {/* ══ MISSION / VISION ══════════════════════════════════════ */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <GlassCard
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-900/30 dark:to-blue-800/10 px-6 py-7 sm:px-8 sm:py-8"
              data-aos="fade-right"
              data-aos-duration="750"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center
                                rounded-xl bg-white/80 dark:bg-gray-300 ">
                  <img src={TargetImg} alt="Mission" className="h-7 w-7 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#1E88E5] sm:text-xl dark:text-gray-300 lg:text-2xl">Our Mission</h3>
              </div>
              <p className="text-sm leading-7 sm:text-base sm:leading-8 text-slate-600 dark:text-gray-300">
                To create a trusted digital platform where freelancers and businesses can connect,
                collaborate, and succeed together.
              </p>
            </GlassCard>

            <GlassCard
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-900/30 dark:to-blue-800/10 px-6 py-7 sm:px-8 sm:py-8"
              data-aos="fade-right"
              data-aos-duration="750"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center
                                rounded-xl bg-white/80 dark:bg-gray-300 ">
                  <img src={Vision} alt="Vision" className="h-7 w-7 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#1E88E5] dark:text-gray-300 sm:text-xl lg:text-2xl">Our Vision</h3>
              </div>
              <p className="text-sm leading-7 sm:text-base sm:leading-8 text-slate-600 dark:text-gray-300 ">
                To become a leading freelance platform that supports remote work, innovation,
                and professional growth for people everywhere.
              </p>
            </GlassCard>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">

            <GlassCard
              className="p-5 sm:p-6"
              data-aos="fade-up"
              data-aos-duration="750"
            >
              <h3 className="text-base font-bold sm:text-lg text-slate-900 dark:text-slate-100 mb-4">
                What We Offer
              </h3>
              <div className="rounded-xl bg-blue-50/80 dark:bg-[#1e3a5f]/80 backdrop-blur-sm p-4 sm:p-5
                              border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center gap-3 mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl
                                   bg-white/90 dark:bg-gray-300 shadow-sm">
                    <img src={Briefcase} alt="Business" className="h-6 w-6 object-contain" />
                  </span>
                  <h3 className="text-base font-bold sm:text-lg text-slate-900 dark:text-slate-200">
                    For Businesses
                  </h3>
                </div>
                <ul className="space-y-3">
                  <Bullet>Find and hire skilled freelancers</Bullet>
                  <Bullet>Post and manage projects</Bullet>
                  <Bullet>Communicate directly with talent</Bullet>
                </ul>
              </div>
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5">
                <div className="grid grid-cols-3 divide-x divide-slate-200 ">
                  <Stat value={freelancerCount !== null ? `${freelancerCount}+` : "120+"} label="Freelancers" />
                  <Stat value={jobCount        !== null ? `${jobCount}+`        : "60+"}  label="Jobs" />
                  <Stat value={businessCount   !== null ? `${businessCount}+`   : "80+"}  label="Businesses" />
                </div>
              </div>
            </GlassCard>

            <GlassCard
              className="p-5 sm:p-6"
              data-aos="fade-up"
              data-aos-duration="750"
              data-aos-delay="150"
            >
              <h3 className="text-base font-bold sm:text-lg text-slate-900 dark:text-slate-100 mb-4">
                For Freelancers
              </h3>
              <div className="rounded-xl bg-blue-50/80 dark:bg-[#1e3a5f]/80 backdrop-blur-sm p-4 sm:p-5
                              border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center gap-3 mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl
                                   bg-white/90 dark:bg-gray-300 shadow-sm">
                    <img src={Briefcase} alt="Freelancer" className="h-6 w-6 object-contain" />
                  </span>
                  <h3 className="text-base font-bold sm:text-lg text-slate-900 dark:text-slate-200">
                    For Freelancers
                  </h3>
                </div>
                <ul className="space-y-3">
                  <Bullet>Discover job opportunities</Bullet>
                  <Bullet>Showcase skills and portfolios</Bullet>
                  <Bullet>Build professional experience</Bullet>
                </ul>
              </div>
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5">
                <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700">
                  <Stat value={freelancerCount !== null ? `${freelancerCount}+` : "120+"} label="Freelancers" />
                  <Stat value="4.8/5" label="Rating" color="text-[#F59E0B]" />
                  <Stat value={jobCount !== null ? `${jobCount}+` : "60+"} label="Jobs" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ══ MENTORS ═══════════════════════════════════════════════ */}
          <div className="mt-16">
            <h2
              data-aos="fade-up"
              data-aos-duration="700"
              className="mb-8 text-center text-2xl font-bold sm:text-3xl text-[#1E293B] dark:text-white"
            >
              Mentor / Supervisors
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {isLoading ? (
                <>
                  <MentorCardSkeleton />
                  <MentorCardSkeleton />
                </>
              ) : (
                <>
                  <div data-aos="fade-right" data-aos-duration="750">
                    <MentorCard
                      name="Chan Chhaya"
                      role="Lecturer · Backend"
                      spec="Spring Microservice"
                      img={MentorImg1}
                      socials={{ github: "https://github.com/it-chhaya", facebook: "https://www.facebook.com/chhayadevkh", telegram: "https://t.me/chhayadevkh" }}
                    />
                  </div>
                  <div data-aos="fade-left" data-aos-duration="750" data-aos-delay="100">
                    <MentorCard
                      name="Kit Tara"
                      role="Lecturer · Data Base"
                      spec="Ai Agent"
                      img={MentorImg2}
                      socials={{ github: "https://github.com/tarakit", facebook: "https://www.facebook.com/drksearcherz", telegram: "https://t.me/tarakit" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* OurTeam */}
        <div data-aos="fade-up" data-aos-duration="800" data-aos-offset="60">
          <OurTeam isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
}