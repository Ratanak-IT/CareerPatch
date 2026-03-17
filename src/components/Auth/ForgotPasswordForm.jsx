
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import LoginImage from "../../assets/logo.png";
import { FormField } from "./FormControls";
import { useZodForm } from "../../hooks/useZodForm";
import { forgotPasswordSchema } from "../../validations/authSchemas";

const BASE_URL = import.meta.env.VITE_API_URL;

/* ─── Password strength hints ────────────────────────────────────────────── */
const STRENGTH_RULES = [
  { label: "8+ chars",  test: (v) => v.length >= 8 },
  { label: "Uppercase", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v) => /[a-z]/.test(v) },
  { label: "Number",    test: (v) => /[0-9]/.test(v) },
  { label: "Special",   test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function StrengthHints({ value }) {
  if (!value) return null;
  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
      {STRENGTH_RULES.map(({ label, test }) => {
        const ok = test(value);
        return (
          <li key={label}
            className={`flex items-center gap-1.5 text-[10px] transition-colors
              ${ok ? "text-green-500" : "text-gray-400 dark:text-slate-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors
              ${ok ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"}`} />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const { field, validate, values } = useZodForm(forgotPasswordSchema, {
    email:           "",
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });

  const [serverErr, setServerErr] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr("");

    // Zod validation — same pattern as LoginForm
    const result = validate();
    if (!result.success) return;

    const { email, currentPassword, newPassword } = result.data;

    setLoading(true);
    try {
      /* ── Step 1: login to verify identity and get access token ── */
      const loginRes  = await fetch(`${BASE_URL}/api/users/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password: currentPassword }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        const msg =
          loginData?.message ||
          loginData?.error   ||
          "Incorrect email or current password.";
        setServerErr(msg);
        return;
      }

      const accessToken =
        loginData?.accessToken       ||
        loginData?.data?.accessToken ||
        null;

      if (!accessToken) {
        setServerErr("Authentication failed. Please try again.");
        return;
      }

      /* ── Step 2: change password ── */
      const changeRes  = await fetch(`${BASE_URL}/api/users/change-password`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const changeData = await changeRes.json();

      if (!changeRes.ok) {
        const msg =
          changeData?.message ||
          changeData?.error   ||
          "Failed to change password. Please try again.";
        setServerErr(msg);
        return;
      }

      toast.success("Password changed successfully!");
      setDone(true);

    } catch {
      setServerErr("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    px-4 py-8 sm:px-6 sm:py-10
                    bg-gray-100 dark:bg-[#0f172a] transition-colors duration-300">

      <div className="flex w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl
                      overflow-hidden rounded-2xl shadow-xl">

        {/* ── Left panel (matches LoginForm style) ── */}
        <div className="hidden md:flex flex-col items-center justify-center relative
                        bg-[#b0c8e8] dark:bg-[#162032] shrink-0"
             style={{ flex: "0 0 44%" }}>
          <Link to="/login" aria-label="Go back"
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/70 dark:bg-slate-700 text-gray-600 dark:text-slate-300
                       hover:bg-white dark:hover:bg-slate-600 transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <FiArrowLeft size={15} />
          </Link>
          <img src={LoginImage} alt="CareerPatch"
            className="w-[70%] max-w-[200px] object-contain" />
          <p className="mt-4 text-[13px] text-center text-[#1e4a6e] dark:text-slate-400 px-6 leading-relaxed">
            Verify your identity and set a new password
          </p>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center
                        bg-white dark:bg-[#1e293b] md:rounded-bl-[60px]
                        py-8 px-5 sm:px-8 md:py-10 md:px-10 relative">

          {/* Mobile back */}
          <Link to="/login" aria-label="Go back"
            className="md:hidden absolute top-4 left-4 w-8 h-8 flex items-center justify-center
                       rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <FiArrowLeft size={15} />
          </Link>

          <div className="w-full max-w-[340px]">

            {/* ══ SUCCESS ══ */}
            {done ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/30
                                flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle size={28} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#043133] dark:text-white mb-2">
                  Password Updated!
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                  Your password has been changed. Please log in with your new password.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login", { replace: true })}
                  className="w-full h-11 rounded-lg text-sm font-semibold text-white
                             bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                  Back to Login
                </button>
              </div>
            ) : (

            /* ══ FORM ══ */
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1
                             text-[#043133] dark:text-white">
                Reset Password
              </h1>
              <p className="text-xs text-center text-gray-500 dark:text-slate-400 mb-6 sm:mb-8">
                Enter your email and current password to set a new one
              </p>

              {/* Server error */}
              {serverErr && (
                <div role="alert"
                  className="mb-4 px-3 py-2 rounded-lg text-xs border
                             border-red-200 dark:border-red-800
                             bg-red-50 dark:bg-red-900/20
                             text-red-600 dark:text-red-400">
                  {serverErr}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-5">

                  {/* Email */}
                  <FormField
                    label="Email"
                    type="email"
                    height="h-11"
                    autoComplete="email"
                    {...field("email")}
                  />

                  {/* Divider */}
                  <div className="flex items-center gap-2 -my-1">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
                    <span className="text-[10px] uppercase tracking-wider px-1
                                     text-gray-400 dark:text-slate-500 shrink-0">
                      Verify identity
                    </span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
                  </div>

                  {/* Current password */}
                  <FormField
                    label="Current Password"
                    type="password"
                    height="h-11"
                    autoComplete="current-password"
                    {...field("currentPassword")}
                  />

                  {/* Divider */}
                  <div className="flex items-center gap-2 -my-1">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
                    <span className="text-[10px] uppercase tracking-wider px-1
                                     text-gray-400 dark:text-slate-500 shrink-0">
                      New password
                    </span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
                  </div>

                  {/* New password + strength hints */}
                  <div>
                    <FormField
                      label="New Password"
                      type="password"
                      height="h-11"
                      autoComplete="new-password"
                      {...field("newPassword")}
                    />
                    <StrengthHints value={values.newPassword} />
                  </div>

                  {/* Confirm password */}
                  <FormField
                    label="Confirm New Password"
                    type="password"
                    height="h-11"
                    autoComplete="new-password"
                    {...field("confirmPassword")}
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full h-11 rounded-lg text-sm font-semibold text-white transition
                             bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                             disabled:opacity-50 disabled:cursor-not-allowed
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
                  {loading
                    ? <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent
                                         rounded-full animate-spin" />
                        Updating…
                      </span>
                    : "Change Password"
                  }
                </button>

                <p className="text-center text-xs mt-3 text-gray-500 dark:text-slate-400">
                  Remember your password?{" "}
                  <Link to="/login"
                    className="text-blue-500 hover:text-blue-600 font-semibold
                               focus:outline-none focus-visible:underline">
                    Log in
                  </Link>
                </p>
              </form>
            </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}