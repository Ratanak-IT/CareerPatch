import React from "react";
import AboutImg from "../../assets/about.avif";
import MentorCard from "./Mentor";
import MentorImg1 from "../../assets/mentor1.png";
import MentorImg2 from "../../assets/mentor2.jpg";
import TargetImg from "../../assets/target.png";
import Vision from "../../assets/vision.png";
import Briefcase from "../../assets/briefcase.png";
import OurTeam from "./OurTeam";

const Icon = {
  User: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 21a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  Github: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.8-.25.8-.56v-2c-3.26.7-3.95-1.57-3.95-1.57-.54-1.37-1.3-1.73-1.3-1.73-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.76 1.28 3.43.98.1-.77.41-1.28.74-1.57-2.6-.3-5.33-1.3-5.33-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.52.12-3.16 0 0 .98-.31 3.2 1.2a11 11 0 0 1 5.83 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.64.24 2.86.12 3.16.75.82 1.2 1.87 1.2 3.15 0 4.5-2.74 5.5-5.35 5.8.42.36.8 1.07.8 2.16v3.2c0 .31.22.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  ),
  Facebook: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.6 1.6-4.6 4.7V11H7v3h2.9v8h3.6Z" />
    </svg>
  ),
  Link: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10 13a5 5 0 0 0 7.07 0l1.42-1.42a5 5 0 0 0-7.07-7.07L10.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L5.5 12.42a5 5 0 0 0 7.07 7.07L13.5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

function Bullet({ children }) {
  return (
    <li className="flex gap-2 text-sm text-slate-600">
      <span className="mt-[7px] h-2 w-2 rounded-full bg-[#2B6DFF]" />
      <span>{children}</span>
    </li>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-6 py-8 sm:py-10">
        {/* TOP SECTION (FIXED TABLET) */}
        <div className="mt-6 grid gap-8 md:gap-10 md:grid-cols-2 items-center">
          {/* TEXT */}
          <div className="max-w-xl lg:max-w-none">
            <h1 className="text-left text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1E293B]">
              About <span className="text-[#1A73E8]">CareerPatch</span>
            </h1>

            <p className="mt-4 text-left text-base sm:text-lg leading-7 text-slate-500">
              CareerPatch is a modern freelance marketplace designed to connect
              businesses with skilled freelancers. Our platform helps companies
              find the right talent while giving freelancers opportunities to
              grow and work on real projects.
            </p>

            <p className="mt-6 text-left text-base sm:text-lg leading-7 text-slate-500">
              We are to make hiring simple, communication easy, and
              collaboration effective through a secure and user-friendly system.
            </p>
          </div>

          {/* IMAGE */}
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={AboutImg}
                alt="Team discussion"
                className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* MISSION / VISION */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 sm:px-10 py-7 sm:py-9 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center">
                <img
                  src={TargetImg}
                  alt="Mission"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1E88E5]">
                Our Mission
              </h3>
            </div>
            <p className="mt-4 sm:mt-5 max-w-[520px] text-left text-sm sm:text-base leading-7 sm:leading-8 text-slate-500">
              To create a trusted digital platform where freelancers and
              businesses can connect, collaborate, and succeed together.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-6 sm:px-10 py-7 sm:py-9 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center">
                <img
                  src={Vision}
                  alt="Vision"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1E88E5]">
                Our Vision
              </h3>
            </div>
            <p className="mt-4 sm:mt-5 max-w-[520px] text-left text-sm sm:text-base leading-7 sm:leading-8 text-slate-500">
              To become a leading freelance platform that supports remote work,
              innovation, and professional growth for people everywhere.
            </p>
          </div>
        </div>

        {/* OFFER + FREELANCERS */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 text-left">
              What We Offer
            </h3>

            <div className="mt-4 rounded-xl bg-[#CFE3FF]/70 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80">
                  <img
                    src={Briefcase}
                    alt="Business"
                    className="w-6 h-6 object-contain"
                  />
                </span>
                <h3 className="text-base font-semibold text-slate-900 text-left">
                  For Businesses
                </h3>
              </div>

              <ul className="mt-4 space-y-3">
                <Bullet>Find and hire skilled freelancers</Bullet>
                <Bullet>Post and manage projects</Bullet>
                <Bullet>Communicate directly with talent</Bullet>
              </ul>
            </div>

            <div className="mt-6 border-t border-slate-300 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 text-center">
                <div className="py-3">
                  <div className="text-xl font-semibold text-[#1A73E8]">
                    200+
                  </div>
                  <div className="text-xs text-[#64748B]">Users</div>
                </div>

                <div className="py-3 sm:border-l sm:border-r border-slate-300">
                  <div className="text-xl font-semibold text-[#1A73E8]">
                    60+
                  </div>
                  <div className="text-xs text-[#64748B]">Projects Posted</div>
                </div>

                <div className="py-3">
                  <div className="text-xl font-semibold text-[#1A73E8]">
                    120+
                  </div>
                  <div className="text-xs text-[#64748B]">Freelancers</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm text-left">
            <h3 className="text-base font-semibold text-slate-900">
              For Freelancers
            </h3>

            <div className="mt-4 rounded-xl bg-[#CFE3FF]/70 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80">
                  <img
                    src={Briefcase}
                    alt="Freelancer"
                    className="w-6 h-6 object-contain"
                  />
                </span>
                <div className="font-semibold text-[#64748B]">
                  For Freelancers
                </div>
              </div>

              <ul className="mt-4 space-y-3">
                <Bullet>Discover job opportunities</Bullet>
                <Bullet>Showcase skills and portfolios</Bullet>
                <Bullet>Build professional experience</Bullet>
              </ul>
            </div>

            <div className="mt-6 border-t border-slate-300 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 text-center">
                <div className="py-3">
                  <div className="text-xl font-semibold text-[#1A73E8]">
                    120+
                  </div>
                  <div className="text-xs text-[#64748B]">Freelancers</div>
                </div>

                <div className="py-3 sm:border-l sm:border-r border-slate-300">
                  <div className="text-xl font-semibold text-[#F59E0B]">
                    4.8/5
                  </div>
                  <div className="text-xs text-[#64748B]">Rating</div>
                </div>

                <div className="py-3">
                  <div className="text-xl font-semibold text-[#1A73E8]">
                    4.8%
                  </div>
                  <div className="text-xs text-[#64748B]">Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* MENTORS */}
        <div className="mt-12">
          {/* Mobile Only Title */}
          <h2 className="md:hidden text-2xl font-bold text-slate-900 mb-8 text-center">
            Mentor / Supervisors
          </h2>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <MentorCard
              name="Chhaya Chan"
              role="Lecturer · Web Development"
              spec="Web Development"
              img={MentorImg1}
              socials={{ github: "#", facebook: "#", telegram: "#" }}
            />

            <MentorCard
              name="Tara Kit"
              role="Lecturer · Web Development"
              spec="Web Development"
              img={MentorImg2}
              socials={{ github: "#", facebook: "#", telegram: "#" }}
            />
          </div>
        </div>
      </div>

      <OurTeam />
    </div>
  );
}
