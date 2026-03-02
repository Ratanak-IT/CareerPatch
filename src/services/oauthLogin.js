// src/services/oauthLogin.js

import {
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";

/* ---------- START LOGIN ---------- */

export async function startGoogleLogin() {
  await signInWithRedirect(auth, googleProvider);
}

export async function startGithubLogin() {
  await signInWithRedirect(auth, githubProvider);
}

/* ---------- HANDLE AFTER REDIRECT ---------- */

export async function handleOAuthRedirect() {
  const result = await getRedirectResult(auth);

  if (!result) return null;

  const idToken = await result.user.getIdToken();

  return {
    user: result.user,
    idToken,
  };
}