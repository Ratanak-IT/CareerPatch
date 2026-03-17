// src/pages/PortfolioPage.jsx
import { useParams, Link } from "react-router";
import { usePortfolio } from "../hooks/usePortfolio";
import PortfolioRenderer from "../components/portfolio/PortfolioTemplates";

export default function PortfolioPage() {
  const { userId } = useParams();
  const { portfolio, template, loading } = usePortfolio(userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio || !portfolio.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No portfolio yet</p>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This freelancer hasn't set up their portfolio.</p>
        <Link to="/" className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Thin top bar with back link */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-2
                      bg-black/30 backdrop-blur-sm border-b border-white/10">
        <Link to={`/freelancers/${userId}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to profile
        </Link>
        <span className="ml-auto text-[10px] text-white/40">CareerPatch Portfolio</span>
      </div>

      <PortfolioRenderer data={portfolio} template={template} />
    </div>
  );
}