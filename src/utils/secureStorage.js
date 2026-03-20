
const APP_SECRET = import.meta.env.VITE_STORAGE_SECRET || "cp-secure-2026-default";

async function deriveKey(salt) {
  const enc     = new TextEncoder();
  const keyMat  = await crypto.subtle.importKey(
    "raw", enc.encode(APP_SECRET), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100_000, hash: "SHA-256" },
    keyMat,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}


function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}
function hexToBuf(hex) {
  const arr = [];
  for (let i = 0; i < hex.length; i += 2) arr.push(parseInt(hex.slice(i,i+2),16));
  return new Uint8Array(arr);
}

function getOrCreateSalt() {
  const k = "cp_s";
  let s = sessionStorage.getItem(k);
  if (!s) {
    s = bufToHex(crypto.getRandomValues(new Uint8Array(16)));
    sessionStorage.setItem(k, s);
  }
  return s;
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function secureSet(key, value) {
  try {
    const salt      = getOrCreateSalt();
    const cryptoKey = await deriveKey(salt);
    const iv        = crypto.getRandomValues(new Uint8Array(12));
    const encoded   = new TextEncoder().encode(JSON.stringify(value));
    const cipher    = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, encoded);

    // Store: salt:iv:ciphertext (all hex)
    const packed = `${salt}:${bufToHex(iv)}:${bufToHex(cipher)}`;
    localStorage.setItem(key, packed);
  } catch (e) {
    // Fallback — still store but plain (graceful degradation)
    console.warn("secureSet fallback:", e.message);
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function secureGet(key) {
  try {
    const packed = localStorage.getItem(key);
    if (!packed) return null;

    const parts = packed.split(":");
    // Old format (plain JSON) — parse directly
    if (parts.length < 3) {
      try { return JSON.parse(packed); } catch { return null; }
    }

    const [salt, ivHex, cipherHex] = parts;
    const cryptoKey  = await deriveKey(salt);
    const iv         = hexToBuf(ivHex);
    const ciphertext = hexToBuf(cipherHex);
    const plain      = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, ciphertext);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch (e) {
    console.warn("secureGet failed:", e.message);
    return null;
  }
}

export function secureRemove(key) {
  localStorage.removeItem(key);
}

export function secureCacheSet(key, value) {
  try {
    sessionStorage.setItem(`_cache_${key}`, JSON.stringify(value));
  } catch(err) {
    console.log("error: ", err)
  }
}
export function secureCacheGet(key) {
  try {
    const v = sessionStorage.getItem(`_cache_${key}`);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}
export function secureCacheRemove(key) {
  sessionStorage.removeItem(`_cache_${key}`);
}