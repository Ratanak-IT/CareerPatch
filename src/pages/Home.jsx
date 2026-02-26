import React from 'react'
import MainSection from '../components/section/MainSection'
import FindTheBest from '../components/section/FindTheBest'
import SectionSolutionForEveryNeed from '../components/section/SectionSalutionForEveryDay'
import HowIsWork from '../components/card/HowIsWork'
import TalentByFreelancer from '../components/card/TalentByFreelancer'
import ratanak from '../assets/ratanak.png';
import khim from '../assets/khim.png';
import seanghour from '../assets/seanghour.png';
import profile from '../assets/profile.png';
import TalenCategories from '../components/card/TalenCategories'
import PeopleLoveWorking from '../components/section/PeopleLoveWorking'

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
export default function Home() {
  return (
    <div>
        <MainSection/>
        <HowIsWork/>
        <FindTheBest/>
        {/* feature company service */}
        <SectionSolutionForEveryNeed/>
        <TalenCategories/>
        <section className="w-full mt-8" style={{ background: "inherit" }}>
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#1E88E5]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Browse talent by Freelancer
        </h2>
        <p
          className={`mt-2 text-sm`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Browse top categories and find the right talent for your project.
        </p>
      </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FREELANCERS.map((f, i) => (
              <TalentByFreelancer key={i} {...f} />
            ))}
          </div>
        </div>
      </section>
        <PeopleLoveWorking/>
        
    </div>
  )
}
