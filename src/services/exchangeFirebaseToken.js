// src/services/exchangeFirebaseToken.js
export async function exchangeFirebaseToken(idToken) {
  const BASE_URL = import.meta.env.VITE_API_URL || "";

  const res = await fetch(`${BASE_URL}/api/users/oauth/firebase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // ✅ add this
    },
    credentials: "include",
    body: JSON.stringify({ idToken }), // ✅ keep this too
  });

  const text = await res.text(); // ✅ no JSON parse crash

  if (!res.ok) {
    throw new Error(text || `OAuth login failed (${res.status})`);
  }

  // backend might return empty body
  if (!text) return true;

  try {
    return JSON.parse(text);
  } catch {
    return true;
  }
}