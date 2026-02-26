import React from 'react';
import NavbarComponent from './components/navbar/NavbarComponent';
import MainSection from './components/section/MainSection';
import FindTheBest from './components/section/FindTheBest';
import SectionSalutionForEveryDay from './components/section/SectionSalutionForEveryDay';
import TalenCategories from './components/card/TalenCategories';
import TalentByFreelancer from './components/card/TalentByFreelancer';
import PeopleLoveWorking from './components/section/PeopleLoveWorking';
import FooterComponent from './components/footer/FooterComponent';
import ratanak from './assets/ratanak.png';
import khim from './assets/khim.png';
import seanghour from './assets/seanghour.png';
import profile from './assets/profile.png';

const FREELANCERS = [
  {
    name: "Thai Ratanak",
    category: "Design & creative",
    categoryIcon: "🎨",
    experience: "5+ years experience",
    tag: "UX/UI",
    location: "Phnom Penh",
    avatar: ratanak,
  },
  {
    name: "Sok Khim",
    category: "Web Development",
    categoryIcon: "💻",
    experience: "3+ years experience",
    tag: "React",
    location: "Siem Reap",
    avatar: khim,
  },
  {
    name: "Ly Seanghour",
    category: "Marketing",
    categoryIcon: "📣",
    experience: "4+ years experience",
    tag: "SEO",
    location: "Phnom Penh",
    avatar: seanghour,
  },
  {
    name: "Chan Dara",
    category: "Video & Animation",
    categoryIcon: "🎬",
    experience: "2+ years experience",
    tag: "Motion",
    location: "Battambang",
    avatar: profile,
  },
];

export default function App() {
  return (
    <div className="flex flex-col">
      {/* <NavbarComponent /> */}
      <MainSection />
      <FindTheBest />
      <SectionSalutionForEveryDay />
      <TalenCategories />

      {/* Talent By Freelancer — 4 cards grid */}
      <section className="w-full py-16 lg:py-24" style={{ background: "inherit" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FREELANCERS.map((f, i) => (
              <TalentByFreelancer key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      <PeopleLoveWorking />
      {/* <FooterComponent /> */}
    </div>
  );
}