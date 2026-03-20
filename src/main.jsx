
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { setupListeners } from "@reduxjs/toolkit/query";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DarkModeProvider } from "./components/navbar/NavbarComponent.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

import RootLayout from "./layouts/RootLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import FindFreelancers from "./pages/FindFreelancers.jsx";
import FindWork from "./pages/FindWork.jsx";
import LoginPage from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DetailWorkPage from "./pages/DetailWork.jsx";

import ProfileRouter from "./routes/ProfileRouter.jsx";
import FreelancerPublicProfile from "./components/profile/freelancer/FreelancerPublicProfile.jsx";
import BusinessPublicProfile from "./components/profile/business/businessPublicProfile.jsx";
import ProfileBusinessPage from "./components/profile/business/ProfileBusiness.jsx";
import CardDetailFreelancer from "./components/carddetail/CardDetailFreelancer.jsx";
import ChatComponent from "./components/message/ChatComponent.jsx";
import NotFound from "./components/notfound/NotfoundComponent.js";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import { hydrateAuth, setTokens, setUser } from "./features/auth/authSlice.js";

setupListeners(store.dispatch);


store.dispatch(hydrateAuth());

(() => {
  const oldAt   = localStorage.getItem("accessToken");
  const oldRt   = localStorage.getItem("refreshToken");
  const oldUser = localStorage.getItem("authUser");

  if (oldAt || oldRt || oldUser) {
    if (oldAt || oldRt) {
      store.dispatch(setTokens({ accessToken: oldAt, refreshToken: oldRt }));
    }
    if (oldUser) {
      try { store.dispatch(setUser(JSON.parse(oldUser))); } catch {}
    }
    // Remove the old plaintext keys
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <DarkModeProvider>
          <Routes>
            {/* Pages with Navbar + Footer */}
            <Route element={<RootLayout />}>
              <Route path="/"               element={<Home />} />
              <Route path="/about"          element={<About />} />
              <Route path="/findfreelan"    element={<FindFreelancers />} />
              <Route path="/findwork"       element={<FindWork />} />
              <Route path="/chat"           element={<ChatComponent />} />
              <Route path="/contact"        element={<ContactPage />} />
              <Route path="/jobs/:jobId"    element={<DetailWorkPage />} />

              <Route path="/profile"        element={<ProfileRouter />} />
              <Route path="/freelancers/:userId" element={<FreelancerPublicProfile />} />
              <Route path="/businesses/:userId"  element={<BusinessPublicProfile />} />

              <Route path="/profile-business"    element={<ProfileBusinessPage />} />
              <Route path="/services/:serviceId" element={<CardDetailFreelancer />} />
            </Route>

            {/* Pages without Navbar + Footer */}
            <Route element={<AuthLayout />}>
              <Route path="/login"              element={<LoginPage />} />
              <Route path="/register"           element={<Register />} />
              <Route path="/forgot-password"    element={<ForgotPassword />} />
              <Route path="/portfolio/:userId"  element={<PortfolioPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </DarkModeProvider>

        <ToastContainer position="top-right" autoClose={800} />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);