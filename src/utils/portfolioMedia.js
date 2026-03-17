export function normalizeUrl(url = "") {
  const value = String(url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value.replace(/^\/+/g, "")}`;
}

export function getProjectPreview(url = "") {
  const normalized = normalizeUrl(url);
  if (!normalized) return "";
  return `https://image.thum.io/get/width/1400/crop/900/noanimate/${normalized}`;
}

export async function uploadPortfolioImage(file, folder = "portfolio") {
  if (!file) throw new Error("No file selected");
  if (!file.type?.startsWith("image/")) throw new Error("Only image files are allowed");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `Upload failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  return data?.secure_url || data?.url || "";
}