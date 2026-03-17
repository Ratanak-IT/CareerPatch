import { z } from "zod";

/* ─── Reusable field rules ──────────────────────────────────────────────── */
const name   = z.string().min(1, "Required").max(50, "Too long");
const email  = z.string().min(1, "Required").email("Invalid email address");
const phone  = z
  .string()
  .min(1, "Required")
  .regex(/^(\+?\d{7,15}|0\d{8,9})$/, "Enter a valid phone number");
const password = z
  .string()
  .min(8,  "At least 8 characters")
  .max(72,  "Too long")
  .regex(/[A-Z]/,        "Must contain an uppercase letter")
  .regex(/[a-z]/,        "Must contain a lowercase letter")
  .regex(/[0-9]/,        "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

/* ─── Login ─────────────────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

/* ─── Forgot / Reset password ────────────────────────────────────────────── */
export const forgotPasswordSchema = z
  .object({
    email,
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword:     password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path:    ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from current password",
    path:    ["newPassword"],
  });

/* ─── Freelancer registration ────────────────────────────────────────────── */
export const freelancerSchema = z
  .object({
    firstName: name,
    lastName:  name,
    username: z
      .string()
      .min(3,  "At least 3 characters")
      .max(30,  "Too long")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores"),
    gender:   z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Select a gender" }) }),
    email,
    phone,
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ─── Business owner registration ───────────────────────────────────────── */
export const businessSchema = z
  .object({
    firstName:      name,
    lastName:       name,
    gender:         z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Select a gender" }) }),
    companyName:    z.string().min(1, "Company name is required").max(100, "Too long"),
    companyWebsite: z.string().url("Enter a valid URL (https://…)").or(z.literal("")),
    industry: z.enum(
      ["Technology","Finance","Healthcare","Education","Retail",
       "Manufacturing","Media & Entertainment","Real Estate","Transportation","Other"],
      { errorMap: () => ({ message: "Select an industry" }) }
    ),
    email,
    phone,
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });