import { useMemo } from "react";
import { useNavigate } from "react-router";
import FreelancerCard from "../components/freelancer/FreelancerCard";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://placehold.co/80x80?text=User";
const FALLBACK_IMAGE = "https://placehold.co/285x253?text=No+Image";

function formatDate(value) {
  if (!value) return "—";
  let v = value;
  if (typeof v === "string" && /^\d+$/.test(v)) v = Number(v);
  if (typeof v === "number" && v < 1e12) v = v * 1000;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function getServiceId(service) {
  return service?.id ?? service?.serviceId ?? service?._id ?? service?.uuid ?? null;
}

/**
 * Reusable UI view for freelancer profile:
 * - isOwner=true => show edit/change/post/manage buttons
 * - isOwner=false => hide all owner-only actions, keep UI same
 */
export default function ProfileFreelancerView({
  user,
  services = [],
  isOwner = false,
  loadingUser = false,
  loadingServices = false,
  servicesError = false,

  // optional handlers for owner actions
  onEditProfile,
  onChangePhoto,
  onCreatePost,
}) {
  const navigate = useNavigate();

  const avatarUrl = user?.profileImageUrl || FALLBACK_AVATAR;
  const coverUrl = user?.coverImageUrl || FALLBACK_COVER;

  // keep same filtering logic if needed (here assume caller already filtered)
  const myServices = useMemo(() => services, [services]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Cover Header */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-[180px] sm:h-[220px]">
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />

            {/* ✅ owner-only change cover/photo */}
            {isOwner && (
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  type="button"
                  onClick={onChangePhoto}
                  className="bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg shadow"
                >
                  Change Photo
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="-mt-12 sm:-mt-14 w-[96px] h-[96px] rounded-xl overflow-hidden bg-white shadow-md ring-4 ring-white">
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>

              <div>
                <p className="text-[16px] font-semibold text-gray-900 leading-tight">
                  {loadingUser ? "Loading..." : user?.fullName || "—"}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  {user?.userType || "FREELANCER"} • {user?.address || "—"}
                </p>
              </div>
            </div>

            {/* ✅ owner-only edit + post, public-only message */}
            {isOwner ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={onCreatePost}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Post
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {}}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Message
              </button>
            )}
          </div>
        </div>

        {/* Body same layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900">About</p>
              <p className="text-xs text-gray-500 mt-2 leading-5">{user?.bio || "—"}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Array.isArray(user?.skills) ? user.skills : []).length === 0 && (
                  <p className="text-sm text-gray-400">—</p>
                )}
                {(Array.isArray(user?.skills) ? user.skills : []).map((s) => (
                  <span
                    key={s}
                    className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-blue-500 font-bold text-xl">Services</p>
              <span className="text-xs text-gray-500">{myServices.length} posts</span>
            </div>

            <div className="mt-4">
              {loadingServices && (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {servicesError && (
                <p className="text-red-500 text-center py-8">Failed to load services.</p>
              )}

              {!loadingServices && !servicesError && myServices.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <p className="text-sm font-medium">No posts yet</p>
                </div>
              )}

              {!loadingServices && !servicesError && myServices.length > 0 && (
                <div className="grid gap-5 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {myServices.map((service) => {
                    const serviceId = getServiceId(service);
                    if (!serviceId) return null;

                    const image =
                      (Array.isArray(service?.jobImages) && service.jobImages[0]) ||
                      (typeof service?.jobImages === "string" ? service.jobImages : null) ||
                      (Array.isArray(service?.imageUrls) && service.imageUrls[0]) ||
                      FALLBACK_IMAGE;

                    const categoryName =
                      service?.category?.name || service?.categoryName || "—";
                    const tags = categoryName && categoryName !== "—" ? [categoryName] : [];

                    return (
                      <FreelancerCard
                        key={serviceId}
                        id={serviceId}
                        image={image}
                        title={service?.title || "Untitled"}
                        description={service?.description || "No description"}
                        tags={tags}
                        date={formatDate(service?.createdAt)}
                        author={user?.fullName || "Freelancer"}
                        avatar={avatarUrl}
                        postType="service"
                        authorId={service?.userId}
                      />
                    );
                  })}
                </div>
              )}

              {/* Example: owner-only "view all" etc */}
              {isOwner && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-blue-500 text-xs font-semibold"
                    onClick={() => navigate("/profile")}
                  >
                    Manage my posts
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}