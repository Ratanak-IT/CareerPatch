import { signInWithPopup, signOut } from "firebase/auth";
import { firebaseAuth, googleProvider } from "./firebaseClient";

export async function signInWithGooglePopup() {
  const cred = await signInWithPopup(firebaseAuth, googleProvider);
  const u = cred.user;

  return {
    uid: u.uid,
    email: u.email || "",
    fullName: u.displayName || "",
    photoURL: u.photoURL || "",
    provider: "google",
  };
}

export async function firebaseLogout() {
  await signOut(firebaseAuth);
}