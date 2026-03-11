// src/components/Auth/RegisterForm.jsx
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

import SignUpImage from "../../assets/logo.png";
import { useRegisterFreelancerMutation, useRegisterBusinessOwnerMutation } from "../../services/authApi";
import { useOAuthLogin } from "../../hooks/useOAuthLogin";
import { useZodForm } from "../../hooks/useZodForm";
import { freelancerSchema, businessSchema } from "../../validations/authSchemas";
import { FormField, FormSelect, FormRadio } from "./FormControls";

/* ─── OAuth icons ─────────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

/* ─── Initial form values ─────────────────────────────────────────────────── */
const FREELANCER_INIT = {
  firstName: "", lastName: "", username: "", gender: "",
  email: "", phone: "", password: "", confirmPassword: "",
};
const BUSINESS_INIT = {
  firstName: "", lastName: "", companyName: "", companyWebsite: "",
  industry: "", gender: "", email: "", phone: "",
  password: "", confirmPassword: "",
};

const GENDER_OPTIONS = [
  { value: "Male",   label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other",  label: "Other" },
];
const INDUSTRY_OPTIONS = [
  "Technology","Finance","Healthcare","Education","Retail",
  "Manufacturing","Media & Entertainment","Real Estate","Transportation","Other",
];

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function SignUpPage() {
  const navigate = useNavigate();

  const [registerFreelancer,    { isLoading: lF }] = useRegisterFreelancerMutation();
  const [registerBusinessOwner, { isLoading: lB }] = useRegisterBusinessOwnerMutation();
  const isLoading = lF || lB;

  const { loginWithGoogle, loginWithGithub, loading: oauthLoading } = useOAuthLogin({ redirectTo: "/" });

  // Track role separately so we can swap schemas + forms
  const [role, setRole] = useState("freelancer");
  const isBusiness = role === "business";

  const freelancerForm = useZodForm(freelancerSchema, FREELANCER_INIT);
  const businessForm   = useZodForm(businessSchema,   BUSINESS_INIT);
  const { field, validate, setValues } = isBusiness ? businessForm : freelancerForm;

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = validate();
    if (!result.success) return;

    const d = result.data;
    const rawPhone = d.phone.trim();
    const resolvedPhone = rawPhone.startsWith("0") ? "+855" + rawPhone.slice(1) : rawPhone;
    const fullName = `${d.firstName.trim()} ${d.lastName.trim()}`;

    try {
      if (isBusiness) {
        await registerBusinessOwner({
          fullName,
          gender: d.gender,
          profileImageUrl: "",
          email: d.email,
          phone: resolvedPhone,
          userType: "BUSINESS_OWNER",
          companyName: d.companyName?.trim() ?? "",
          companyWebsite: d.companyWebsite?.trim() ?? "",
          industry: d.industry?.trim() ?? "",
          password: d.password,
        }).unwrap();
      } else {
        await registerFreelancer({
          fullName,
          gender: d.gender,
          address: "",
          email: d.email,
          username: d.username?.trim() ?? "",
          profileImageUrl: "",
          phone: resolvedPhone,
          userType: "FREELANCER",
          skills: [],
          portfolioUrl: "",
          experienceYears: 0,
          bio: "",
          password: d.password,
        }).unwrap();
      }
      toast.success("Register successful! Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || err?.data?.error || `Register failed (${err?.status || "unknown"})`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    px-4 py-8 sm:px-6 sm:py-10
                    bg-gray-100 dark:bg-[#0f172a] transition-colors duration-300">

      <div className="flex w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl
                      overflow-hidden rounded-2xl shadow-xl">

        {/* Left panel */}
        <div className="hidden md:flex flex-col items-center justify-center relative
                        bg-[#b0c8e8] dark:bg-[#162032] shrink-0"
             style={{ flex: "0 0 40%" }}>
          <button type="button" onClick={() => window.history.back()} aria-label="Go back"
            className="absolute top-4 left-4 w-7 h-7 flex items-center justify-center
                       rounded-full bg-white/70 dark:bg-slate-700 text-gray-600 dark:text-slate-300
                       hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <FiArrowLeft size={14}/>
          </button>
          <img src={SignUpImage} alt="Sign up illustration" className="w-[70%] max-w-[200px] object-contain"/>
        </div>

        {/* Right form */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto
                        bg-white dark:bg-[#1e293b] md:rounded-bl-[50px]
                        py-8 px-5 sm:px-8 md:py-10 md:px-10">

          <button type="button" onClick={() => window.history.back()} aria-label="Go back"
            className="md:hidden absolute top-3 left-3 w-7 h-7 flex items-center justify-center
                       rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <FiArrowLeft size={14}/>
          </button>

          <form onSubmit={onSubmit} noValidate className="w-full max-w-[340px]">

            <h1 className="text-2xl font-bold text-center mb-3 text-[#043133] dark:text-white">
              Sign up
            </h1>

            {/* Role toggle */}
            <div className="flex items-center justify-center gap-5 mb-4 py-1.5 px-3
                            rounded-lg bg-gray-50 dark:bg-[#0f172a]
                            border border-gray-100 dark:border-slate-700">
              <FormRadio name="role" value="freelancer" checked={!isBusiness} onChange={handleRoleChange} label="Freelancer"/>
              <div className="h-3 w-px bg-gray-200 dark:bg-slate-700"/>
              <FormRadio name="role" value="business"   checked={isBusiness}  onChange={handleRoleChange} label="Business Owner"/>
            </div>

            <div className="flex flex-col gap-3">

              <div className="grid grid-cols-2 gap-2">
                <FormField label="First Name" {...field("firstName")}/>
                <FormField label="Last Name"  {...field("lastName")}/>
              </div>

              <FormSelect
                label="Gender"
                placeholder="Select gender"
                options={GENDER_OPTIONS}
                {...field("gender")}
              />

              {!isBusiness
                ? <FormField label="Username"     autoComplete="username" {...field("username")}/>
                : <FormField label="Company Name" autoComplete="organization" {...field("companyName")}/>
              }

              <FormField label="Email" type="email" autoComplete="email" {...field("email")}/>
              <FormField label="Phone" type="tel"   autoComplete="tel"   {...field("phone")}/>

              {isBusiness && (
                <div className="grid grid-cols-2 gap-2">
                  <FormSelect label="Industry" placeholder="Select" options={INDUSTRY_OPTIONS} {...field("industry")}/>
                  <FormField  label="Website"  type="url" autoComplete="url" {...field("companyWebsite")}/>
                </div>
              )}

              <FormField label="Password"         type="password" autoComplete="new-password" {...field("password")}/>
              <FormField label="Confirm Password" type="password" autoComplete="new-password" {...field("confirmPassword")}/>
            </div>

            <button type="submit" disabled={isLoading}
              className="mt-4 w-full h-9 rounded-lg text-sm font-semibold text-white transition
                         bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
              {isLoading ? "Creating…" : "Create Account"}
            </button>

            <p className="text-center text-xs mt-2 text-gray-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login"
                className="text-blue-500 hover:text-blue-600 font-semibold focus:outline-none focus-visible:underline">
                Login
              </Link>
            </p>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"/>
              <span className="text-xs text-gray-400 dark:text-slate-500">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"/>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={loginWithGoogle} disabled={oauthLoading}
                className="flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium
                           border border-gray-300 dark:border-slate-600
                           bg-white dark:bg-[#0f172a] text-gray-700 dark:text-slate-300
                           hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                <GoogleIcon/> Google
              </button>
              <button type="button" onClick={loginWithGithub} disabled={oauthLoading}
                className="flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium
                           border border-gray-300 dark:border-slate-600
                           bg-white dark:bg-[#0f172a] text-gray-700 dark:text-slate-300
                           hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                <GithubIcon/> GitHub
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}