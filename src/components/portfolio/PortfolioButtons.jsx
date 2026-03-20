
import { useState } from "react";
import { Link } from "react-router";
import PortfolioEditor from "./PortfolioEditor";
import { usePortfolio } from "../../hooks/usePortfolio";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";

export function EditPortfolioButton() {
  const authUser = useSelector(selectAuthUser);
  const userId   = String(authUser?.id ?? authUser?.userId ?? "");

  const { portfolio, setPortfolio, template, setTemplate, saving, save } = usePortfolio(userId);
  const [open, setOpen] = useState(false);

  const handleSave = async (newPortfolio, newTemplate) => {
    const ok = await save(newPortfolio, newTemplate);
    if (ok) setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold
                   bg-purple-500
                   hover:from-purple-600 hover:to-blue-600
                   text-white shadow-sm transition-all duration-200 hover:shadow-md">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
        Portfolio
      </button>

      {open && portfolio && (
        <PortfolioEditor
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          template={template}
          setTemplate={setTemplate}
          saving={saving}
          onSave={handleSave}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export function ViewPortfolioButton({ userId }) {
  if (!userId) return null;
  return (
    <Link to={`/portfolio/${userId}`} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold
                bg-blue-500
                 hover:from-purple-600 hover:to-blue-600
                 text-white shadow-sm transition-all duration-200 hover:shadow-md">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      View Portfolio
    </Link>
  );
}