// src/pages/BusinessPublicProfile.jsx
import { useParams } from "react-router";
import ProfileBusinessPage from "./ProfileBusiness";

export default function BusinessPublicProfile() {
  const { userId } = useParams();
  return <ProfileBusinessPage mode="public" publicUserId={userId} />;
}