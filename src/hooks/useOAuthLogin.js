
import { useState } from "react";
import {
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { auth, googleProvider, githubProvider } from "../firebase/firebase";
import { setTokens, setUser } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "";

function makePassword(uid) {
  return `oauth${uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}cp`;
}

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json = null;

  try {
    json = JSON.parse(text);
  } catch {
    // ignore non-JSON response
  }

  return { ok: res.ok, status: res.status, json, text };
}

async function fetchMe(accessToken) {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const json = await res.json();
  return json?.data ?? null;
}

async function loginWithCredentials(email, password) {
  const { ok, json } = await apiPost("/api/users/login", { email, password });
  if (!ok) return null;
  return json;
}

async function registerAndLogin(email, password, fullName, photoURL) {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);

  const body = {
    fullName: fullName || base,
    gender: "Male",
    address: "",
    profileImageUrl: photoURL || "",
    email,
    phone: "+85500000000",
    userType: "FREELANCER",
    password,
    username: `${base}_${suffix}`,
    skills: [],
    portfolioUrl: "",
    experienceYears: 0,
    bio: "",
  };

  const { ok, status, text } = await apiPost("/api/users/register-freelancer", body);
  console.log("Register response:", status, text);

  if (status === 409) {
    throw new Error(
      "This email is already registered. Please log in with your email and password instead."
    );
  }

  if (!ok) {
    throw new Error(`Registration failed: ${text}`);
  }

  return await loginWithCredentials(email, password);
}

async function fetchGithubPrimaryEmail(accessToken) {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("GitHub /user/emails failed:", res.status, text);
    return null;
  }

  const emails = await res.json();

  if (!Array.isArray(emails)) return null;

  const primaryVerified =
    emails.find((item) => item.primary && item.verified) ||
    emails.find((item) => item.primary) ||
    emails.find((item) => item.verified) ||
    emails[0];

  return primaryVerified?.email || null;
}

async function extractOAuthEmail(result, provider) {
  const fbUser = result?.user;

  const directEmail =
    fbUser?.email ||
    fbUser?.providerData?.find((p) => p?.email)?.email ||
    null;

  if (directEmail) return directEmail;

  if (provider?.providerId === "github.com") {
    const credential = GithubAuthProvider.credentialFromResult(result);
    const githubAccessToken = credential?.accessToken || null;

    if (githubAccessToken) {
      const githubEmail = await fetchGithubPrimaryEmail(githubAccessToken);
      if (githubEmail) return githubEmail;
    }
  }

  if (provider?.providerId === "google.com") {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log("Google credential:", credential);
  }

  return null;
}

export function useOAuthLogin({ redirectTo = "/" } = {}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleOAuth(provider) {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      console.log("OAuth result:", result);
      console.log("Firebase user:", fbUser);
      console.log("result.user.email:", result?.user?.email);
      console.log("providerData:", fbUser?.providerData);

      const email = await extractOAuthEmail(result, provider);
      const fullName = fbUser.displayName || email?.split("@")[0] || "User";
      const photoURL = fbUser.photoURL || "";
      const password = makePassword(fbUser.uid);

      if (!email) {
        throw new Error("No email from provider. Try a different account.");
      }

      let tokens = await loginWithCredentials(email, password);

      if (!tokens) {
        tokens = await registerAndLogin(email, password, fullName, photoURL);
      }

      if (!tokens?.accessToken) {
        throw new Error("Login failed. Please try again.");
      }

      dispatch(
        setTokens({
          accessToken: tokens.accessToken || null,
          refreshToken: tokens.refreshToken || null,
        })
      );

      const user = await fetchMe(tokens.accessToken);
      if (user) dispatch(setUser(user));

      toast.success("Login successful!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("OAuth error:", err);
      toast.error(err?.message || "OAuth login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    loginWithGoogle: () => handleOAuth(googleProvider),
    loginWithGithub: () => handleOAuth(githubProvider),
  };
}