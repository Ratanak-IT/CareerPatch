// src/pages/OurTeam.jsx
import Team1 from "../../assets/member.png";
import Team2 from "../../assets/khim.png";
import Team3 from "../../assets/member.png";
import Team4 from "../../assets/kormva.png";
import Team5 from "../../assets/seanghour.png";
import Team6 from "../../assets/member.png";
import Team7 from "../../assets/member.png";
import ReactImg    from "../../assets/react.png";
import TailwindImg from "../../assets/tailwind.png";
import HtmlImg     from "../../assets/html.png";
import JsImg       from "../../assets/javascript.png";
import CssImg      from "../../assets/css.png";
import GithubImg   from "../../assets/github.png";

import TeamCard, { TeamCardSkeleton } from "./Teamcard";
import TechCard, { TechCardSkeleton } from "./TechCard";

const technologies = [
  { name: "React",       icon: ReactImg    },
  { name: "TailwindCSS", icon: TailwindImg },
  { name: "HTML",        icon: HtmlImg     },
  { name: "JavaScript",  icon: JsImg       },
  { name: "CSS",         icon: CssImg      },
  { name: "Github",      icon: GithubImg   },
];

const team = [
  { img: Team1, name: "Thai Ratanak",       role: "Web & UI/UX & Java",      badge: "Leader", socials: { github: "#", facebook: "#", telegram: "#" } },
  { img: Team2, name: "Khorn Sokhim",       role: "Developer / UI Designer",  badge: "Member", socials: { github: "#", facebook: "#", telegram: "#" } },
  { img: Team3, name: "Tollah Hamadabidin", role: "Developer / UI Designer",  badge: "Member", socials: { github: "#", facebook: "#", telegram: "#" } },
  { img: Team4, name: "Vong Kornva",        role: "Developer / UI Designer",  badge: "Member", socials: { github: "#", facebook: "#", telegram: "#" } },
  { img: Team5, name: "Eng Seanghour",      role: "Developer / UI Designer",  badge: "Member", socials: { github: "#", facebook: "#", telegram: "#" } },
  { img: Team6, name: "Ourn Chhorpong",     role: "Developer / UI Designer",  badge: "Member", socials: { github: "#", facebook: "#", telegram: "#" } },
  { img: Team7, name: "Sam Karona",         role: "Developer / UI Designer",  badge: "Member", socials: { github: "#", facebook: "#", telegram: "#" } },
];

export default function OurTeam({ isLoading = false }) {
  return (
    <div className="px-4 sm:px-6 pb-10 transition-colors bg-transparent dark:bg-[#0f172a]">

      {/* ── Our Team ── */}
      <div className="mx-auto w-full max-w-7xl rounded-3xl border
                      bg-white border-slate-200
                      dark:bg-[#1e293b] dark:border-slate-700
                      p-5 sm:p-6 md:p-8 shadow-sm transition-colors">
        <h2 className="text-2xl font-semibold text-center text-slate-900 dark:text-white">
          Our Team
        </h2>

        {/* Desktop: 3 + 4 layout */}
        <div className="hidden lg:block">
          <div className="mt-6 flex justify-center gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-full max-w-[290px]"><TeamCardSkeleton /></div>
                ))
              : team.slice(0, 3).map((m, i) => (
                  <div key={i} className="w-full max-w-[290px]"><TeamCard {...m} /></div>
                ))
            }
          </div>
          <div className="mt-6 flex justify-center gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full max-w-[290px]"><TeamCardSkeleton /></div>
                ))
              : team.slice(3, 7).map((m, i) => (
                  <div key={i} className="w-full max-w-[290px]"><TeamCard {...m} /></div>
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
                <div key={i} className="w-full max-w-[290px]"><TeamCard {...m} /></div>
              ))
          }
        </div>
      </div>

      {/* ── Technologies ── */}
      <div className="mx-auto mt-6 w-full max-w-7xl rounded-3xl border
                      bg-white border-slate-200
                      dark:bg-[#1e293b] dark:border-slate-700
                      p-5 sm:p-6 md:p-8 shadow-sm transition-colors">
        <h2 className="text-xl font-semibold mb-6 tracking-tight text-left text-slate-900 dark:text-white">
          Technologies Used
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <TechCardSkeleton key={i} />)
            : technologies.map((tech) => <TechCard key={tech.name} tech={tech} />)
          }
        </div>
      </div>

    </div>
  );
}