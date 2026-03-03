import { useState } from "react";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

import SignUpImage from "../../assets/logo.png";
import {
  useRegisterFreelancerMutation,
  useRegisterBusinessOwnerMutation,
} from "../../services/authApi";

/* ================= Icons ================= */

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
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

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* ================= Floating Input ================= */

const FloatingInput = ({ label, name, type = "text", value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative mb-6">
      <label className="absolute left-6 -top-3 bg-white px-2 text-[#676666] text-sm z-10">
        {label}
      </label>

      <input
        name={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        className="w-full h-[50px] px-5 pr-12 text-base bg-white rounded-md
        border border-gray-400 outline-none
        focus:border-gray-600 transition-colors duration-200"
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
        </button>
      )}
    </div>
  );
};

/* ================= Floating Select ================= */

const FloatingSelect = ({ label, name, value, onChange, options }) => {
  return (
    <div className="relative mb-6">
      <label className="absolute left-6 -top-3 bg-white px-2 text-[#676666] text-sm z-10">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-[50px] px-5 pr-10 text-base bg-white rounded-md
        border border-gray-400 outline-none
        focus:border-gray-600 transition-colors duration-200"
      >
        <option className="text-gray-300" value="" disabled>
          Select gender
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

/* ================= Signup Page ================= */

export default function SignUpPage() {
  const navigate = useNavigate();

  const [registerFreelancer, { isLoading: loadingFreelancer }] =
    useRegisterFreelancerMutation();
  const [registerBusinessOwner, { isLoading: loadingBusiness }] =
    useRegisterBusinessOwnerMutation();

  const isLoading = loadingFreelancer || loadingBusiness;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer",
  });

  // ✅ clear username when switching to business
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "role" && value === "business") {
        return { ...prev, role: value, username: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleBack = () => window.history.back();

  const onSubmit = async (e) => {
  e.preventDefault();

  const isBusiness = form.role === "business";
  const userType = isBusiness ? "BUSINESS_OWNER" : "FREELANCER";

  // normalize email
  const email = form.email.trim().toLowerCase();

  // basic validation
  if (
    !email ||
    !form.password ||
    !form.firstName ||
    !form.lastName ||
    !form.gender ||
    (!isBusiness && !form.username)
  ) {
    toast.error("Please fill in all fields.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  // ✅ Build base body (NO username yet)
  const body = {
    fullName: `${form.firstName} ${form.lastName}`.trim(),
    gender: form.gender,
    email,
    password: form.password,
    userType,
  };

  // ✅ ADD THIS RIGHT HERE
  if (!isBusiness) {
    const base = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
    const uniqueSuffix = Math.random().toString(36).slice(2, 6);
    body.username = form.username?.trim() || `${base}_${uniqueSuffix}`;
  }

  try {
    if (userType === "BUSINESS_OWNER") {
      await registerBusinessOwner(body).unwrap();
    } else {
      await registerFreelancer(body).unwrap();
    }

    toast.success("Register successful! Please login.");
    navigate("/login", { replace: true });
  } catch (err) {
    console.log("REGISTER ERROR raw:", err);

    const msg =
      err?.data?.message ||
      err?.data?.error ||
      `Register failed (${err?.status || "unknown"})`;

    toast.error(msg);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[1440px] px-4 sm:px-8 lg:px-0 py-8">
        <div className="w-full min-h-[700px] lg:min-h-[800px] flex bg-[#A0C1E9]/80 shadow-sm rounded-2xl overflow-hidden">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex w-1/2 items-center justify-center p-10 relative">
            <button
              type="button"
              onClick={handleBack}
              className="absolute top-6 left-6 w-[36px] h-[37px] flex items-center justify-center bg-[#DDDDDD] shadow-md rounded-full transition"
            >
              <FiArrowLeft
                size={20}
                className="text-[#1E88E5] hover:text-[#2563EB]"
              />
            </button>

            <img
              src={SignUpImage}
              alt="Signup Illustration"
              className="w-[85%] max-w-xl max-h-[85vh] object-contain"
            />
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-1/2 bg-white lg:rounded-bl-[90px] flex items-center justify-center">
            <form
              onSubmit={onSubmit}
              className="w-full max-w-md sm:max-w-lg lg:max-w-md px-6 sm:px-10 lg:px-12 py-12 sm:py-16"
            >
              <h1 className="text-4xl sm:text-5xl font-semibold text-center text-[#043133] mb-10">
                Sign up
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <FloatingInput
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              <FloatingSelect
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
              />

              {/* ✅ Hide username when Business */}
              {form.role !== "business" && (
                <FloatingInput
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              )}

              <FloatingInput
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <FloatingInput
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <FloatingInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              {/* ROLE TOGGLE */}
              <div className="flex items-center gap-10 mb-6">
                {/* Business Owner */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="role"
                    value="business"
                    checked={form.role === "business"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span
                    className={`grid place-items-center w-[18px] h-[18px] rounded-full border-5 transition
                      ${
                        form.role === "business"
                          ? "border-[#4A72C4] shadow-[0_0_0_3px_rgba(74,114,196,0.20)]"
                          : "border-[#C7D2E5]"
                      }`}
                  >
                    <span
                      className={`${
                        form.role === "business"
                          ? "bg-[#4A72C4]"
                          : "bg-transparent"
                      } rounded-full transition`}
                    />
                  </span>
                  <span className="text-lg text-slate-700">Business Owner</span>
                </label>

                {/* Freelancer */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="role"
                    value="freelancer"
                    checked={form.role === "freelancer"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span
                    className={`grid place-items-center w-[18px] h-[18px] rounded-full border-4 transition
                      ${
                        form.role === "freelancer"
                          ? "border-[#4A72C4] shadow-[0_0_0_3px_rgba(74,114,196,0.20)]"
                          : "border-[#C7D2E5]"
                      }`}
                  >
                    <span
                      className={`${
                        form.role === "freelancer"
                          ? "bg-[#4A72C4]"
                          : "bg-transparent"
                      } rounded-full transition`}
                    />
                  </span>
                  <span className="text-lg text-slate-700">Freelancer</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#1E88E5] hover:bg-[#2563EB] disabled:opacity-60 text-white font-semibold rounded-md transition"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6 mb-6">
                Already have an account?{" "}
                <Link to="/login" className="text-[#1E88E5] font-medium">
                  Login
                </Link>
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-md text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => toast.info("Google sign up not implemented yet")}
                >
                  <GoogleIcon />
                  Google
                </button>

                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-md text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => toast.info("Facebook sign up not implemented yet")}
                >
                  <FacebookIcon />
                  Facebook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}