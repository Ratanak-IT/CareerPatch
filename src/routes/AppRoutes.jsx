// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router";
import { useSelector } from "react-redux";
import RootLayout from "../layouts/RootLayout.jsx";
import About from "../pages/About.jsx";
import Register from "../pages/Register.jsx";
import LoginPage from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import FindFreelancers from "../pages/FindFreelancers.jsx";
import CardDetailFreelancer from "../components/carddetail/CardDetailFreelancer.jsx";
import ProfileFreelancer from "../pages/ProfileFreelancer.jsx";
import ProfileBusiness from "../pages/ProfileBusiness.jsx";
import FindWork from "../pages/FindWork.jsx";

import { selectIsAuthed, selectAuthUser } from "../features/auth/authSlice.js";
import { useMeQuery } from "../services/authApi.js"; // ← MUST use authApi, not profileApi
import FreelancerPublicProfile from "../pages/FreelancerPublicProfile.jsx";
import CardDetailBusiness from "../components/carddetail/CarddetailBusiness.jsx";
import DetailWorkPage from "../pages/DetailWork.jsx";
import ContactPage from "../pages/ContactPage.jsx";

function ProfileRouter() {
  const isAuthed  = useSelector(selectIsAuthed);
  const authUser  = useSelector(selectAuthUser); 

  const { data: meRes, isLoading } = useMeQuery(undefined, { skip: !isAuthed });

  if (!isAuthed) return <LoginPage />;
  const userFromMe = meRes?.data ?? meRes;
  const user       = authUser || userFromMe;

  // If we have no user data at all yet, wait for the query
  if (!user && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userType = user?.userType || "";

  if (userType === "BUSINESS_OWNER") {
    return <ProfileBusiness />;
  }

  return <ProfileFreelancer />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/findwork"    element={<FindWork />} />
        <Route path="/findfreelan" element={<FindFreelancers />} />
        <Route path="/about"       element={<About />} />

        {/* Dynamic profile — reads userType from Redux + authApi cache */}

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfileRouter />} />
<Route path="/freelancers/:userId" element={<FreelancerPublicProfile />} />
<Route path="/jobs/:jobId" element={<DetailWorkPage />} />

        <Route path="/services/:serviceId" element={<CardDetailFreelancer />} />
        <Route path="/jobs/:jobId" element={<CardDetailBusiness />} />

        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}