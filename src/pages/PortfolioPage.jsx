
import { useParams, Link } from "react-router";
import { usePortfolio } from "../hooks/usePortfolio";
import PortfolioRenderer from "../components/portfolio/PortfolioTemplates";

export default function PortfolioPage() {
  const { userId } = useParams();
  const { portfolio, template, loading } = usePortfolio(userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading portfolio…</p>
        </div>
      </div>
    );
  }

  if (!portfolio?.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
        <p className="text-3xl font-black text-white mb-2">No portfolio yet</p>
        <p className="text-white/40 mb-8">This freelancer hasn't created their portfolio.</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity">
          ← Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link to={`/freelancers/${userId}`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                     bg-black/40 backdrop-blur-sm border border-white/10 text-white/80
                     hover:bg-black/60 hover:text-white transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to profile
        </Link>
      </div>

      <PortfolioRenderer data={portfolio} template={template} />
    </div>
  );
}