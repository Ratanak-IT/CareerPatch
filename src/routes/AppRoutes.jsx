import { Routes, Route, Navigate } from "react-router";

import RootLayout from "../layouts/RootLayout.jsx";

import About from "../pages/About.jsx";



import Register from "../pages/Register.jsx";
import LoginPage from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import FindFreelancers from "../pages/FindFreelancers.jsx";

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

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}