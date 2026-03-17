// src/pages/About.jsx
import React from "react";
import AboutPage from "../components/about/AboutPage";
import ContactPage from "./ContactPage";
import StarsBackground from "../components/startBackground/StarsBackground";


export default function About() {
  return (

    <div className="relative bg-white dark:bg-[#0f172a] transition-colors duration-300">

      <StarsBackground starCount={460} />

      <div className="relative z-10">
        <AboutPage />
      </div>

      <div id="contact" className="relative z-10">
        <ContactPage />
      </div>

    </div>
  );
}