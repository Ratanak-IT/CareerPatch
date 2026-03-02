// src/pages/FreelancerPublicProfile.jsx
import { useParams } from "react-router";
import ProfileFreelancerPage from "./ProfileFreelancer";

export default function FreelancerPublicProfile() {
  const { userId } = useParams();
  return <ProfileFreelancerPage mode="public" publicUserId={userId} />;
}