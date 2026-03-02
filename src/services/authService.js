import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";

// Google Login
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

// GitHub Login
export async function loginWithGithub() {
  const result = await signInWithPopup(auth, githubProvider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

// Logout
export async function logout() {
  await signOut(auth);
}