
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function BannedScreen({ status = "BANNED" }) {
  const dispatch = useDispatch();

  const isBanned    = status === "BANNED";
  const isSuspended = status === "SUSPENDED";

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
          ${isBanned
            ? "bg-red-100 dark:bg-red-900/30"
            : "bg-orange-100 dark:bg-orange-900/30"
          }`}>
          {isBanned ? (
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9"/>
              <path strokeLinecap="round" d="M4.93 4.93l14.14 14.14"/>
            </svg>
          ) : (
            <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-black mb-2
          ${isBanned ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
          {isBanned ? "Account Banned" : "Account Suspended"}
        </h1>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-2">
          {isBanned
            ? "Your account has been permanently banned from CareerPatch due to a violation of our terms of service."
            : "Your account has been temporarily suspended. Access has been restricted by an administrator."
          }
        </p>

        {isSuspended && (
          <p className="text-slate-500 dark:text-slate-500 text-xs mb-6">
            Your account may be reactivated by an admin. Please contact support for more information.
          </p>
        )}

        {isBanned && (
          <p className="text-slate-500 dark:text-slate-500 text-xs mb-6">
            If you believe this is a mistake, please contact our support team.
          </p>
        )}

        {/* Contact support */}
        <div className={`rounded-2xl p-4 mb-6 text-left
          ${isBanned
            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
          }`}>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            What you can do:
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📧</span>
              <span>Email us at <span className="font-semibold">support@careerpatch.com</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📋</span>
              <span>Include your email address and account ID in the message</span>
            </li>
            {isSuspended && (
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⏰</span>
                <span>Check back later — suspension may be lifted automatically</span>
              </li>
            )}
          </ul>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600
                     text-white font-semibold text-sm transition-colors"
        >
          Log out
        </button>

        <p className="mt-4 text-xs text-slate-400 dark:text-slate-600">
          CareerPatch • Account restricted
        </p>
      </div>
    </div>
  );
}