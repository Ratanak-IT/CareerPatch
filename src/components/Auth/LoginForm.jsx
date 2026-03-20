import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import LoginImage from "../../assets/login/loginimg.png";
import { useLazyMeQuery, useLoginMutation } from "../../services/authApi";
import { setUser } from "../../features/auth/authSlice";
import { useOAuthLogin } from "../../hooks/useOAuthLogin";
import { useZodForm } from "../../hooks/useZodForm";
import { getUserStatusById } from "../../hooks/useUserStatus";
import { loginSchema } from "../../validations/authSchemas";
import { FormField } from "./FormControls";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function friendlyError(err) {
  const raw = (
    err?.data?.message ||
    err?.data?.error ||
    err?.error ||
    ""
  ).toLowerCase();
  if (
    raw.includes("invalid credentials") ||
    raw.includes("unauthorized") ||
    err?.status === 401
  )
    return "Incorrect email or password. Please try again.";
  if (raw.includes("not found") || raw.includes("no user"))
    return "No account found with that email.";
  if (raw.includes("too many") || raw.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  const display = err?.data?.message || err?.data?.error || err?.error;
  return display || "Something went wrong. Please try again.";
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [login, { isLoading }] = useLoginMutation();
  const [triggerMe] = useLazyMeQuery();
  const {
    loginWithGoogle,
    loginWithGithub,
    loading: oauthLoading,
  } = useOAuthLogin({ redirectTo });
  const reduxDispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [serverError, setServerError] = useState("");
  const { field, validate } = useZodForm(loginSchema, {
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const result = validate();
    if (!result.success) return;
    try {
      await login(result.data).unwrap();
      const meData = await triggerMe().unwrap();
      const userData = meData.data;
      const userId = String(userData?.id ?? userData?.userId ?? "");
      if (userId) {
        const accountStatus = await getUserStatusById(userId);
        if (accountStatus === "BANNED") {
          setServerError(
            "Your account has been permanently banned. Contact support for help.",
          );
          return;
        }
        if (accountStatus === "SUSPENDED") {
          setServerError(
            "Your account has been temporarily suspended. Please contact support.",
          );
          return;
        }
      }
      reduxDispatch(setUser(userData));
      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = friendlyError(err);
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10
                    bg-gray-100 dark:bg-[#1a2744]
                    transition-colors duration-300"
    >
      <div
        className="flex w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl
                      overflow-hidden rounded-2xl shadow-xl
                      dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]"
      >
        {/* Left panel — desktop only */}
        <div
          className="hidden md:flex flex-col items-center justify-center relative
                        bg-[#b0c8e8] dark:bg-[#1e3f6e]
                        shrink-0 rounded-l-2xl"
          style={{ flex: "0 0 44%" }}
        >

          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Go back"
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/70 dark:bg-white/10 dark:backdrop-blur-sm
                       text-gray-600 dark:text-slate-300
                       hover:bg-white dark:hover:bg-white/20 transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                       dark:border dark:border-white/10"
          >
            <FiArrowLeft size={15} />
          </button>
          <img
            src={LoginImage}
            alt="Login illustration"
            className="w-[70%] max-w-[200px] object-contain relative z-10"
          />
        </div>

        {/* Right form */}
        <div
          className="flex-1 flex items-center justify-center
                        bg-white dark:bg-[#1a2744]
                        rounded-tr-2xl rounded-bl-2xl rounded-br-2xl md:-ml-8 z-10 shadow-2xl
                        py-8 px-5 sm:px-8 md:py-10 md:px-10
                        "
        >
          <form onSubmit={onSubmit} noValidate className="w-full max-w-[340px]">
            {/* Mobile: back button + logo */}
            <div className="flex flex-col items-center mb-5 md:hidden">
              <button
                type="button"
                onClick={() => window.history.back()}
                aria-label="Go back"
                className="self-start mb-3 w-8 h-8 flex items-center justify-center
                           rounded-full bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm
                           text-gray-600 dark:text-slate-300
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <FiArrowLeft size={15} />
              </button>
              <img
                src={LoginImage}
                alt="Logo"
                className="w-28 h-28 object-contain"
              />
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8
                           text-[#043133] dark:text-white"
            >
              Login
            </h1>

            {redirectTo !== "/" && (
              <p className="text-center text-xs text-blue-500 dark:text-blue-400 mb-3">
                Please log in to continue.
              </p>
            )}

            {serverError && (
              <div
                role="alert"
                className="mb-4 px-3 py-2 rounded-lg text-xs border
                         border-red-200 dark:border-red-500/30
                         bg-red-50 dark:bg-red-500/10
                         text-red-600 dark:text-red-400"
              >
                {serverError}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <FormField
                label="Email"
                type="email"
                height="h-11"
                autoComplete="email"
                {...field("email")}
              />
              <FormField
                label="Password"
                type="password"
                height="h-11"
                autoComplete="current-password"
                {...field("password")}
              />
            </div>

            <div className="flex items-center justify-between mt-4 mb-5 gap-2 flex-wrap">
              <label
                className="flex items-center gap-2 cursor-pointer select-none
                                text-sm text-gray-600 dark:text-slate-400 min-w-0"
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-500 shrink-0"
                />
                <span className="truncate">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400
                           dark:hover:text-blue-300 font-medium whitespace-nowrap
                           focus:outline-none focus-visible:underline"
              >
                Change Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg text-sm font-semibold text-white transition
                         bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                         dark:bg-blue-600 dark:hover:bg-blue-500
                         dark:shadow-[0_0_20px_rgba(59,130,246,0.3)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                         dark:focus-visible:ring-offset-[#1e293b]"
            >
              {isLoading ? "Logging in…" : "Login"}
            </button>

            <p className="text-center text-xs mt-3 text-gray-500 dark:text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300
                           font-semibold focus:outline-none focus-visible:underline"
              >
                Sign up
              </Link>
            </p>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-400 dark:text-slate-500">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={oauthLoading}
                className="flex items-center justify-center gap-2 h-11 rounded-lg text-xs font-medium
                           border border-gray-300 dark:border-white/10
                           bg-white dark:bg-white/5
                           text-gray-700 dark:text-slate-300
                           hover:bg-gray-50 dark:hover:bg-white/10
                           disabled:opacity-50 transition
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                onClick={loginWithGithub}
                disabled={oauthLoading}
                className="flex items-center justify-center gap-2 h-11 rounded-lg text-xs font-medium
                           border border-gray-300 dark:border-white/10
                           bg-white dark:bg-white/5
                           text-gray-700 dark:text-slate-300
                           hover:bg-gray-50 dark:hover:bg-white/10
                           disabled:opacity-50 transition
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <GithubIcon /> GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
