import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FreelancerCard from "../components/freelancer/FreelancerCard";
import { selectFavoriteIds } from "../features/favorites/favoritesSlice";

import {
  useMeQuery,
  useUpdateFreelancerProfileMutation,
  useUploadProfileImageMutation,
} from "../services/profileApi";
import { useGetMyServicesQuery } from "../services/servicesApi";



const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=User";
const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  // your API sometimes returns timestamp like 1771952158274
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function ProfileFreelancerPage() {
  // data
  const { data: meRes } = useMeQuery();
  const user = meRes?.data;

  const { data: servicesRes, isLoading: servicesLoading, isError: servicesError } =
    useGetMyServicesQuery();

  const [updateProfile, { isLoading: saving }] = useUpdateFreelancerProfileMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProfileImageMutation();

  // UI state
  const [tab, setTab] = useState("information"); // "information" | "favorites"
  const favoriteIds = useSelector(selectFavoriteIds);

  // editable fields (simple example)
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    experienceYears: user?.experienceYears || 0,
  });

  // skill input: type -> Enter -> add
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills : []);
  const [skillText, setSkillText] = useState("");

  // normalize services list
  const services = useMemo(() => {
    const raw = servicesRes?.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.content)) return raw.content;
    if (Array.isArray(servicesRes?.content)) return servicesRes.content;
    return [];
  }, [servicesRes]);

  // favorites list from services
  const favoriteServices = useMemo(() => {
    const set = new Set(favoriteIds.map(String));
    return services.filter((s) => set.has(String(s?.id)));
  }, [services, favoriteIds]);

  // keep form synced when user loaded
  React.useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
      experienceYears: user?.experienceYears || 0,
    });
    setSkills(Array.isArray(user?.skills) ? user.skills : []);
  }, [user?.id]); // only when user changes

  const onAddSkill = () => {
    const v = skillText.trim();
    if (!v) return;
    setSkills((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setSkillText("");
  };

  const onRemoveSkill = (value) => {
    setSkills((prev) => prev.filter((x) => x !== value));
  };

  const onSaveProfile = async () => {
    try {
      await updateProfile({
        ...form,
        skills,
      }).unwrap();
      setEditOpen(false);
    } catch (e) {
      console.log("update profile error:", e);
    }
  };

  const onPickProfileImage = async (file) => {
    if (!file) return;
    try {
      await uploadImage(file).unwrap();
      // me query invalidates -> refresh automatically if your backend returns new url
    } catch (e) {
      console.log("upload image error:", e);
    }
  };

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const coverUrl = user?.coverImageUrl || FALLBACK_COVER;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Top cover */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-[180px] sm:h-[220px]">
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
          </div>

          {/* Profile header row */}
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-[96px] h-[96px] rounded-xl overflow-hidden bg-white shadow-md ring-4 ring-white">
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>

              <div>
                <p className="text-[16px] font-semibold text-gray-900 leading-tight">
                  {user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  {user?.userType || "FREELANCER"} • {user?.address || "—"}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>

                  <label className="cursor-pointer text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                    {uploading ? "Uploading..." : "Change Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onPickProfileImage(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              Message
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
            <button
              onClick={() => setTab("information")}
              className={`px-8 py-2 text-sm font-semibold ${
                tab === "information" ? "bg-purple-600 text-white" : "text-purple-600"
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setTab("favorites")}
              className={`px-8 py-2 text-sm font-semibold ${
                tab === "favorites" ? "bg-purple-600 text-white" : "text-purple-600"
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {/* Main content */}
        {tab === "information" && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">About Me</p>
                  <p className="text-xs text-gray-500 mt-2 leading-5">
                    {user?.bio || "—"}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Contact Info</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-2">
                    <div>{user?.email || "—"}</div>
                    <div>{user?.phone || "—"}</div>
                    <div>{user?.address || "—"}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Languages</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <div>Khmer</div>
                    <div>English</div>
                  </div>
                </div>
              </div>

              {/* Middle column */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Work experience</p>
                <div className="text-sm text-gray-600 mt-3 leading-6">
                  {/* replace later with real API if you have it */}
                  <div>Web developer — Sep 2020 - Nov 2023</div>
                  <div>Java developer — Dec 2023 - Jan 2025</div>
                </div>
              </div>

              {/* Right column */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[260px]">
                <p className="text-sm font-semibold text-gray-900">Skill</p>
                <div className="text-sm text-gray-700 mt-3 space-y-2">
                  {(Array.isArray(user?.skills) ? user.skills : []).map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-blue-500 font-bold text-xl">All posts</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
                Post
              </button>
            </div>

            <div className="mt-4">
              {servicesLoading && (
                <p className="text-gray-500 text-center">Loading services...</p>
              )}
              {servicesError && (
                <p className="text-red-500 text-center">Failed to load services.</p>
              )}

              {!servicesLoading && !servicesError && (
                <div
                  className="
                    grid gap-x-[50px] justify-items-center
                    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                    max-w-[1240px] mx-auto
                  "
                >
                  {services.map((s) => {
                    const image =
                      Array.isArray(s?.jobImages) && s.jobImages.length > 0
                        ? s.jobImages[0]
                        : FALLBACK_IMAGE;

                    return (
                      <FreelancerCard
                        key={s?.id}
                        id={s?.id}
                        image={image}
                        title={s?.title || "Untitled"}
                        description={s?.description || "No description"}
                        tags={[s?.category?.name].filter(Boolean)}
                        date={formatDate(s?.createdAt)}
                        author={user?.fullName || "Freelancer"}
                        avatar={avatarUrl}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "favorites" && (
          <div className="mt-8">
            <p className="text-blue-500 font-bold text-xl mb-4">Favorites</p>

            {favoriteServices.length === 0 && (
              <p className="text-gray-500 text-center">No favorites yet.</p>
            )}

            {favoriteServices.length > 0 && (
              <div
                className="
                  grid gap-x-[50px] justify-items-center
                  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                  max-w-[1240px] mx-auto
                "
              >
                {favoriteServices.map((s) => {
                  const image =
                    Array.isArray(s?.jobImages) && s.jobImages.length > 0
                      ? s.jobImages[0]
                      : FALLBACK_IMAGE;

                  return (
                    <FreelancerCard
                      key={s?.id}
                      id={s?.id}
                      image={image}
                      title={s?.title || "Untitled"}
                      description={s?.description || "No description"}
                      tags={[s?.category?.name].filter(Boolean)}
                      date={formatDate(s?.createdAt)}
                      author={user?.fullName || "Freelancer"}
                      avatar={avatarUrl}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Edit modal (simple) */}
        {editOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl w-full max-w-[520px] p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-900">Edit Profile</p>
                <button onClick={() => setEditOpen(false)} className="text-gray-500">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                />
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                />
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Bio"
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                />

                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Experience years"
                  value={form.experienceYears}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, experienceYears: Number(e.target.value || 0) }))
                  }
                />

                {/* Skills editor: Enter to add */}
                <div className="border rounded-xl p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Skills</p>

                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      placeholder="Type skill then press Enter"
                      value={skillText}
                      onChange={(e) => setSkillText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddSkill();
                        }
                      }}
                    />
                    <button
                      onClick={onAddSkill}
                      className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold"
                    >
                      Add skill
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <button
                        key={s}
                        onClick={() => onRemoveSkill(s)}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                        title="Click to remove"
                      >
                        {s} ✕
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={onSaveProfile}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}