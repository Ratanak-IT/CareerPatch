// src/components/about/OurTeam.jsx
import Team1 from "../../assets/member.png";
import Team2 from "../../assets/khim.png";
import Team3 from "../../assets/member.png";
import Team4 from "../../assets/kormva.png";
import Team5 from "../../assets/seanghour.png";
import Team6 from "../../assets/member.png";
import Team7 from "../../assets/member.png";
import TeamCard, { TeamCardSkeleton } from "./Teamcard";
import TechCard, { TechCardSkeleton } from "./TechCard";
import LogoLoop from "../looplogo/LogoLoop";
import reactLogo from "../../assets/react.png";
import viteLogo from "../../assets/logos/vite.png";
import tailwindLogo from "../../assets/logos/tailwind.png";
import cssLogo from "../../assets/logos/css.png";
import firebaseLogo from "../../assets/logos/firebase.png";
import supabaseLogo from "../../assets/logos/supabase.png";
import cloudinaryLogo from "../../assets/logos/cloudinary.png";
import htmlLogo from "../../assets/logos/html.png";
import javascriptLogo from "../../assets/logos/javascript.png";

const technologies= [
  { name: "React", src: reactLogo, href: "https://react.dev" },
  { name: "Vite", src: viteLogo, href: "https://vite.dev" },
  { name: "Tailwind CSS", src: tailwindLogo, href: "https://tailwindcss.com" },
  { name: "HTML", src: cssLogo, href: "https://nodejs.org" },
  { name: "CSS", src: htmlLogo, href: "https://nodejs.org" },
  { name: "javascript", src: javascriptLogo, href: "https://nodejs.org" },
  { name: "Firebase", src: firebaseLogo, href: "https://firebase.google.com" },
  { name: "Supabase", src: supabaseLogo, href: "https://firebase.google.com" },
  { name: "Cloudinary", src: cloudinaryLogo, href: "https://firebase.google.com" },
];

const team = [
  { img: Team1, name: "Thai Ratanak",       role: "Web & UI/UX & Java",     badge: "Leader", socials: { github: "https://github.com/Ratanak-IT", facebook: "#", telegram: "https://t.me/Ratanak_Thai" } },
  { img: Team2, name: "Khorn Sokhim",       role: "Developer / UI Designer", badge: "Member", socials: { github: "https://github.com/Khim123-hub", facebook: "#", telegram: "https://t.me/Sokkhimkhorn" } },
  { img: Team3, name: "Tollah Hamadabidin", role: "Developer / UI Designer", badge: "Member", socials: { github: "https://github.com/Tollahhamadabidin", facebook: "#", telegram: "https://t.me/Ratanak_Thai" } },
  { img: Team4, name: "Vong Kormva",        role: "Developer / UI Designer", badge: "Member", socials: { github: "https://github.com/Kormvaa", facebook: "#", telegram: "https://t.me/Ratanak_Thai" } },
  { img: Team5, name: "Eng Seanghour",      role: "Developer / UI Designer", badge: "Member", socials: { github: "https://github.com/HOUR231441", facebook: "#", telegram: "https://t.me/HOUR9123" } },
  { img: Team6, name: "Ourn Chhorpong",     role: "Developer / UI Designer", badge: "Member", socials: { github: "https://github.com/Pong-CH", facebook: "#", telegram: "https://t.me/sivter24" } },
  { img: Team7, name: "Sam Karona",         role: "Developer / UI Designer", badge: "Member", socials: { github: "https://github.com/karonasam", facebook: "#", telegram: "https://t.me/Ratanak_Thai" } },
];

export default function OurTeam({ isLoading = false }) {
  return (
    <div className="px-4 sm:px-6 pb-10 transition-colors bg-transparent dark:bg-transparent">

      {/* ── Our Team ── */}
      <div
        data-aos="fade-up"
        data-aos-duration="700"
        className="mx-auto w-full max-w-7xl rounded-3xl border
                   bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md
                   border-slate-200 dark:border-slate-700
                   p-5 sm:p-6 md:p-8 shadow-sm transition-colors"
      >
        <h2
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-2xl font-semibold text-center text-slate-900 dark:text-white"
        >
          Our Team
        </h2>

        <div className="hidden lg:block">
          <div className="mt-6 flex justify-center gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-full max-w-[290px]"><TeamCardSkeleton /></div>
                ))
              : team.slice(0, 3).map((m, i) => (
                  <div
                    key={i}
                    className="w-full max-w-[290px]"
                    data-aos="fade-up"
                    data-aos-duration="650"
                    data-aos-delay={String(i * 100)}
                  >
                    <TeamCard {...m} />
                  </div>
                ))
            }
          </div>
          <div className="mt-6 flex justify-center gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full max-w-[290px]"><TeamCardSkeleton /></div>
                ))
              : team.slice(3, 7).map((m, i) => (
                  <div
                    key={i}
                    className="w-full max-w-[290px]"
                    data-aos="fade-up"
                    data-aos-duration="650"
                    data-aos-delay={String(i * 100)}
                  >
                    <TeamCard {...m} />
                  </div>
                ))
            }
          </div>
        </div>

        {/* Mobile / Tablet */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center lg:hidden">
          {isLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-full max-w-[290px]"><TeamCardSkeleton /></div>
              ))
            : team.map((m, i) => (
                <div
                  key={i}
                  className="w-full max-w-[290px]"
                  data-aos="fade-up"
                  data-aos-duration="650"
                  data-aos-delay={String((i % 3) * 100)}
                >
                  <TeamCard {...m} />
                </div>
              ))
          }
        </div>
      </div>

      {/* ── Technologies ── */}
      <div
  data-aos="fade-up"
  data-aos-duration="700"
  data-aos-delay="100"
  className="mx-auto mt-6 w-full max-w-7xl rounded-3xl border
             bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md
             border-slate-200 dark:border-slate-700
             p-5 sm:p-6 md:p-8 shadow-sm transition-colors"
>
  <h2
    data-aos="fade-up"
    data-aos-duration="600"
    className="text-xl font-semibold mb-6 tracking-tight text-left text-slate-900 dark:text-white"
  >
    Technologies Used
  </h2>

  {isLoading ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <TechCardSkeleton key={i} />
      ))}
    </div>
  ) : (
    <LogoLoop
      logos={technologies.map((tech) => ({
        name: tech.name,
        src: tech.src,
        href: tech.href,
      }))}
      speedSeconds={18}
      logoHeight={40}
      pauseOnHover
      fadeOut
    />
  )}
</div>

    </div>
  );
}