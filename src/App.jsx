import './App.css'
import CardBusinessComponent from './components/business/CardBusinessComponent'
import CardBusinessPostProjectComponent from './components/business/CardBusinessPostProjectComponent'
import CardFreelancerPostComponent from './components/freelancer/CardFreelancerPostComponent'
import ProfileCardComponent from './components/profile/freelancer/ProfileCardComponent'


import FreelancerSearchBarComponent from './components/freelancer/FreelancerSearchBarComponent'
import ChatComponent from './components/message/ChatComponent'

import HeroSectionComponent from './components/freelancer/HeroSectionComponent'



function App() {


  return (
    <>
      <CardFreelancerPostComponent/>
     <FreelancerSearchBarComponent/>
     <CardBusinessComponent/>
     <ChatComponent/>
     <CardBusinessPostProjectComponent/>
   <ProfileCardComponent/>
   <HeroSectionComponent/>
     
      
    </>
  )
}



export default App
