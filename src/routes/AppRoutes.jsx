import { Routes, Route } from "react-router";
import RootLayout from "../layouts/RootLayout.jsx";
import About from "../pages/About.jsx";
import Register from "../pages/Register.jsx";
import LoginPage from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import FindFreelancers from "../pages/FindFreelancers.jsx";
import CardDetailFreelancer from "../components/carddetail/CardDetailFreelancer.jsx";
import ProfileFreelancer from "../pages/ProfileFreelancer.jsx";
import FindWork from "../pages/FindWork.jsx";
import CardDetailBusiness from "../components/carddetail/CarddetailBusiness.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<RootLayout />}>
        {/* Redirect home */}
        <Route path="/" element={<Home />} />

        {/* Pages */}
        <Route path="/findwork" element={<FindWork />} />
        <Route path="/findfreelan" element={<FindFreelancers />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<ProfileFreelancer />} />
 <Route path="/services/:serviceId" element={<CardDetailFreelancer />} />
 <Route path="/jobs/:jobId" element={<CardDetailBusiness />} />
        {/* Auth pages */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}