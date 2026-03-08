// src/pages/AboutPage.jsx
import AboutImg   from "../../assets/about.avif";
import MentorImg1 from "../../assets/mentor1.png";
import MentorImg2 from "../../assets/mentor2.jpg";
import TargetImg  from "../../assets/target.png";
import Vision     from "../../assets/vision.png";
import Briefcase  from "../../assets/briefcase.png";
import OurTeam    from "./OurTeam";
import MentorCard, { MentorCardSkeleton } from "./Mentor";

function Bullet({ children }) {
  return (
    <li className="flex gap-2 text-sm sm:text-base">
      <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#2B6DFF]" />
      <span className="text-slate-600 dark:text-slate-400">{children}</span>
    </li>
  );
}

export default function AboutPage({ isLoading = false }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* ── Hero ── */}
        <div className="mt-4 grid items-center gap-8 md:mt-6 md:grid-cols-2 md:gap-10 lg:gap-14">
          <div className="max-w-2xl">
            <h1 className="text-left text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl
                           text-[#1E293B] dark:text-white">
              About <span className="text-[#1A73E8]">CareerPatch</span>
            </h1>
            <p className="mt-4 text-left text-sm leading-7 sm:text-base sm:leading-8 lg:text-lg
                          text-slate-500 dark:text-slate-400">
              CareerPatch is a modern freelance marketplace designed to connect businesses with skilled
              freelancers. Our platform helps companies find the right talent while giving freelancers
              opportunities to grow and work on real projects.
            </p>
          </div>

          <div className="w-full">
            <div className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              <img
                src={AboutImg}
                alt="Team discussion"
                className="h-[220px] w-full object-cover sm:h-[260px] md:h-[300px] lg:h-[340px]"
              />
            </div>
          </div>
        </div>

        {/* ── Mission / Vision ── */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              img: TargetImg, alt: "Mission", label: "Our Mission",
              text: "To create a trusted digital platform where freelancers and businesses can connect, collaborate, and succeed together.",
            },
            {
              img: Vision, alt: "Vision", label: "Our Vision",
              text: "To become a leading freelance platform that supports remote work, innovation, and professional growth for people everywhere.",
            },
          ].map(({ img, alt, label, text }) => (
            <div key={label}
              className="rounded-2xl border bg-white border-slate-200
                         dark:bg-[#1e293b] dark:border-slate-700
                         px-5 py-6 shadow-sm transition-colors sm:px-8 sm:py-8 lg:px-10 lg:py-9">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11">
                  <img src={img} alt={alt} className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E88E5] sm:text-xl lg:text-2xl">{label}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 sm:mt-5 sm:text-base sm:leading-8
                            text-slate-500 dark:text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* ── What We Offer ── */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          {/* For Businesses */}
          <div className="rounded-2xl border bg-white border-slate-200
                          dark:bg-[#1e293b] dark:border-slate-700
                          p-5 shadow-sm transition-colors sm:p-6">
            <h3 className="text-base font-semibold sm:text-lg text-slate-900 dark:text-slate-300">
              What We Offer
            </h3>
            <div className="mt-4 rounded-xl bg-[#CFE3FF]/70 dark:bg-[#1e3a5f] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 dark:bg-slate-700">
                  <img src={Briefcase} alt="Business" className="h-6 w-6 object-contain" />
                </span>
                <h3 className="text-base font-semibold sm:text-lg text-slate-900 dark:text-slate-300">
                  For Businesses
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                <Bullet>Find and hire skilled freelancers</Bullet>
                <Bullet>Post and manage projects</Bullet>
                <Bullet>Communicate directly with talent</Bullet>
              </ul>
            </div>

            <div className="mt-6 border-t border-slate-300 dark:border-slate-600 pt-6">
              <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-y-0">
                <div className="py-3 text-center">
                  <div className="text-xl font-semibold text-[#1A73E8]">200+</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Users</div>
                </div>
                <div className="py-3 text-center sm:border-x border-slate-300 dark:border-slate-600">
                  <div className="text-xl font-semibold text-[#1A73E8]">60+</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Projects Posted</div>
                </div>
                <div className="py-3 text-center">
                  <div className="text-xl font-semibold text-[#1A73E8]">120+</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Freelancers</div>
                </div>
              </div>
            </div>
          </div>

          {/* For Freelancers */}
          <div className="rounded-2xl border bg-white border-slate-200
                          dark:bg-[#1e293b] dark:border-slate-700
                          p-5 shadow-sm transition-colors sm:p-6">
            <h3 className="text-base font-semibold sm:text-lg text-slate-900 dark:text-slate-300">
              For Freelancers
            </h3>
            <div className="mt-4 rounded-xl bg-[#CFE3FF]/70 dark:bg-[#1e3a5f] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 dark:bg-slate-700">
                  <img src={Briefcase} alt="Freelancer" className="h-6 w-6 object-contain" />
                </span>
                <div className="text-base font-semibold sm:text-lg text-slate-900 dark:text-slate-300">
                  For Freelancers
                </div>
              </div>
              <ul className="mt-4 space-y-3">
                <Bullet>Discover job opportunities</Bullet>
                <Bullet>Showcase skills and portfolios</Bullet>
                <Bullet>Build professional experience</Bullet>
              </ul>
            </div>

            <div className="mt-6 border-t border-slate-300 dark:border-slate-600 pt-6">
              <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-y-0">
                <div className="py-3 text-center">
                  <div className="text-xl font-semibold text-[#1A73E8]">120+</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Freelancers</div>
                </div>
                <div className="py-3 text-center sm:border-x border-slate-300 dark:border-slate-600">
                  <div className="text-xl font-semibold text-[#F59E0B]">4.8/5</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Rating</div>
                </div>
                <div className="py-3 text-center">
                  <div className="text-xl font-semibold text-[#1A73E8]">4.8%</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mentors ── */}
        <div className="mt-12 sm:mt-14">
          <h2 className="mb-8 text-2xl font-bold text-center text-[#1E293B] dark:text-white">
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
                <MentorCard
                  name="Chan Chhaya"
                  role="Lecturer · Web Development"
                  spec="Web Development"
                  img={MentorImg1}
                  socials={{ github: "#", facebook: "#", telegram: "#" }}
                />
                <MentorCard
                  name="Kit Tara"
                  role="Lecturer · Web Development"
                  spec="Web Development"
                  img={MentorImg2}
                  socials={{ github: "#", facebook: "#", telegram: "#" }}
                />
              </>
            )}
          </div>
        </div>

      </div>

      <OurTeam isLoading={isLoading} />
    </div>
  );
}