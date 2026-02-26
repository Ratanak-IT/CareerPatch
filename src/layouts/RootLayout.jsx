import React from 'react'
import { Outlet } from 'react-router'
import NavbarComponent from '../components/navbar/NavbarComponent'
import FooterComponent from '../components/footer/FooterComponent'
import NavbarAfterLogin from '../components/navbar/NavbarAfterLogin'
import ButtonComponent from '../components/button/ButtonComponent'
import TalentByFreelancer from '../components/card/TalentByFreelancer'
import TalenCategories from '../components/card/TalenCategories'
import HowIsWork from '../components/card/HowIsWork'
import MainSection from '../components/section/MainSection'
import PeopleLoveWorking from '../components/section/PeopleLoveWorking'



export default function RootLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarComponent />
      <main className='flex-1'>
        <Outlet />
      </main>
      {/* <MainSection/>
      <NavbarAfterLogin/>
      <ButtonComponent/>
      <TalentByFreelancer/>
      <TalenCategories/>
      <HowIsWork/>
      
      <PeopleLoveWorking/>
      <FooterComponent /> */}
    </div>
  )
}
