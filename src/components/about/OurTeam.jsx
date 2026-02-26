import Team1 from "../../assets/member.png";
import Team2 from "../../assets/member.png";
import Team3 from "../../assets/member.png";
import Team4 from "../../assets/member.png";
import Team5 from "../../assets/member.png";
import Team6 from "../../assets/member.png";
import Team7 from "../../assets/member.png";
import ReactImg from "../../assets/react.png"
import TailwindImg from "../../assets/tailwind.png"
import HtmlImg from "../../assets/html.png"
import JsImg from "../../assets/javascript.png"
import CssImg from "../../assets/css.png"
import GithubImg from "../../assets/github.png"

/* ===== Custom SVG Icons (use FULL paths) ===== */
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

/* ===== Team Card ===== */
const TeamCard = ({ img, name, role, badge, socials }) => (
  <div className="h-full rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center ">
    <img
      src={img}
      alt={name}
      className="mx-auto h-32 w-32 rounded-full object-cover ring-2 ring-slate-100"
    />

    <div className="mt-5 text-sm font-semibold text-slate-900">{name}</div>
    <div className="mt-1 text-xs text-slate-500">{role}</div>

    {/* Social icons */}
    <div className="mt-4 flex items-center justify-center gap-2">
      {socials?.github && (
        <a
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          className="text-slate-700 hover:text-black transition-colors"
          aria-label="GitHub"
        >
          <GithubIcon />
        </a>
      )}

      {socials?.facebook && (
        <a
          href={socials.facebook}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-700 transition-colors"
          aria-label="Facebook"
        >
          <FacebookIcon />
        </a>
      )}

      {socials?.telegram && (
        <a
          href={socials.telegram}
          target="_blank"
          rel="noreferrer"
          className="text-sky-500 hover:text-sky-600 transition-colors"
          aria-label="Telegram"
        >
          <TelegramIcon />
        </a>
      )}
    </div>

    <div className="mx-auto mt-4 h-px w-4/5 bg-slate-200" />

    <div className="mt-3 text-xs text-slate-500">
      <span className="text-[#2563EB]">•</span> {badge}
    </div>
  </div>
);

// ==================== Technology use =============

const technologies = [
  { name: "React", color: "#61DAFB", bg: "#e8f9fd", icon: ReactImg },
  { name: "TailwindCSS", color: "#38BDF8", bg: "#e8f5fd", icon: TailwindImg },
  { name: "HTML", color: "#E34F26", bg: "#fdf0ec", icon: HtmlImg },
  { name: "JavaScript", color: "#F7DF1E", bg: "#fdfbe8", icon: JsImg },
  { name: "CSS", color: "#264DE4", bg: "#eceffe", icon: CssImg },
  { name: "Github", color: "#24292E", bg: "#f0f0f0", icon: GithubImg },
];

// Tech Card — fully responsive with stacked icon+text on mobile, row on wider screens
const TechCard = ({ tech }) => {
  return (
    <div
      className="
        flex flex-col sm:flex-row items-center justify-center
        gap-2 sm:gap-3
        p-3 sm:p-4
        rounded-xl
        border border-slate-200
        bg-white
        w-full
      "
    >
      {/* Image icon */}
      <div className="flex items-center justify-center shrink-0">
        <img
          src={tech.icon}
          alt={tech.name}
          className="h-8 w-8 object-contain"
          draggable="false"
        />
      </div>

      {/* Text */}
      <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap text-center sm:text-left">
        {tech.name}
      </span>
    </div>
  );
};

export default function OurTeam() {
  const team = [
    {
      img: Team1,
      name: "Thai Ratanak",
      role: "Web & UI/UX & Java",
      badge: "Leader",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
    {
      img: Team2,
      name: "Khorn Sokhim",
      role: "Developer / UI Designer",
      badge: "Member",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
    {
      img: Team3,
      name: "Tollah Hamadabidin",
      role: "Developer / UI Designer",
      badge: "Member",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
    {
      img: Team4,
      name: "Vong Kornva",
      role: "Developer / UI Designer",
      badge: "Member",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
    {
      img: Team5,
      name: "Eng Seanghour",
      role: "Developer / UI Designer",
      badge: "Member",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
    {
      img: Team6,
      name: "Ourn Chhorpong",
      role: "Developer / UI Designer",
      badge: "Member",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
    {
      img: Team7,
      name: "Sam Karona",
      role: "Developer / UI Designer",
      badge: "Member",
      socials: { github: "#", facebook: "#", telegram: "#" },
    },
  ];

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 text-left">
          Our Team
        </h2>

        {/* Desktop (lg+): 3 top / 4 bottom */}
        <div className="hidden lg:block">
          <div className="mt-6 flex justify-center gap-6">
            {team.slice(0, 3).map((m, idx) => (
              <div key={`top-${idx}`} className="w-full max-w-[290px]">
                <TeamCard {...m} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-6">
            {team.slice(3, 7).map((m, idx) => (
              <div key={`bot-${idx}`} className="w-full max-w-[290px]">
                <TeamCard {...m} />
              </div>
            ))}
          </div>
        </div>

        {/* Tablet & Phone */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center lg:hidden">
          {team.map((m, idx) => (
            <div key={idx} className="w-full max-w-[290px]">
              <TeamCard {...m} />
            </div>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div className="mx-auto mt-6 w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1E293B] mb-6 tracking-tight text-left">
          Technologies Used
        </h2>

        {/*
          Responsive grid:
          - Mobile (xs):  2 columns — icon stacked above label, compact cards
          - sm (640px+):  3 columns — icon + label side by side
          - md (768px+):  3 columns, slightly larger
          - lg (1024px+): 6 columns — all 6 in one row
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {technologies.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}