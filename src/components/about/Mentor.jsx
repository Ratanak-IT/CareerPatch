import { useDarkMode } from "../navbar/NavbarComponent";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57v-2.235c-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22v3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073C24 5.373 18.627 0 12 0S0 5.373 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export default function MentorCard({ name, role, spec, img, socials = {} }) {
  const { darkMode: dm } = useDarkMode();

  const cardBg  = dm ? "bg-[#1e293b] border-slate-700"  : "bg-white border-slate-200";
  const t1      = dm ? "text-white"     : "text-slate-900";
  const t2      = dm ? "text-slate-400" : "text-slate-500";
  const divider = dm ? "bg-slate-700"   : "bg-slate-200";
  const bullet  = dm ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`rounded-2xl border ${cardBg} px-6 sm:px-8 py-7 shadow-sm transition-colors`}>
      <h3 className={`hidden md:block text-xl font-semibold text-left ${t1}`}>
        Mentor / Supervisors
      </h3>

      <div className="mt-6 flex flex-col items-center text-center min-[428px]:flex-row min-[428px]:items-center min-[428px]:text-left min-[428px]:gap-8">
        <div className={`shrink-0 overflow-hidden rounded-xl w-[170px] h-[150px] min-[428px]:w-[143px] min-[428px]:h-[133px] ${dm ? "bg-slate-700" : "bg-white"}`}>
          <img src={img} alt={name} className="h-full w-full object-contain" />
        </div>

        <div className="mt-6 min-[428px]:mt-0 min-w-0 flex-1">
          <div className={`text-[36px] min-[428px]:text-[26px] font-bold leading-tight ${t1}`}>{name}</div>
          <div className={`mt-2 text-base min-[428px]:text-sm ${t2}`}>{role}</div>

          <div className="mt-5 min-[428px]:mt-3 flex flex-wrap justify-center min-[428px]:justify-start gap-x-3 gap-y-1">
            <span className={`text-sm min-[428px]:text-xs ${t2}`}>Specializations</span>
            <span className={`text-sm min-[428px]:text-xs font-semibold ${t1}`}>{spec}</span>
          </div>

          <div className="mt-5 min-[428px]:mt-4 flex items-center justify-center min-[428px]:justify-start gap-5">
            {socials.github && (
              <a href={socials.github} className={`${dm ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-black"} transition-colors`}>
                <GithubIcon />
              </a>
            )}
            {socials.facebook && (
              <a href={socials.facebook} className="text-blue-500 hover:text-blue-400 transition-colors">
                <FacebookIcon />
              </a>
            )}
            {socials.telegram && (
              <a href={socials.telegram} className="text-sky-500 hover:text-sky-400 transition-colors">
                <TelegramIcon />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={`mt-7 h-px w-full ${divider}`} />

      <div className={`mt-5 flex items-start gap-3 text-sm text-left ${bullet}`}>
        <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#2B6DFF]" />
        <span>Guided and reviewed the project.</span>
      </div>
    </div>
  );
}