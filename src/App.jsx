import './App.css'
import BusinessProfileCardComponent from './components/profile/business/BusinessProfileCardComponent';
import CardViewApplyComponent from './components/profile/business/CardViewApplyComponent';
import CardInformationFreelancerComponent from './components/profile/freelancer/CardInformationFreelancerComponent';
import ToggleTabComponent from './components/profile/freelancer/ToggleTabComponent';



function App() {


  return (
    <>
    <CardInformationFreelancerComponent />
    <ToggleTabComponent/>
    <BusinessProfileCardComponent/>
    <CardViewApplyComponent/>
      
     
      
    </>
  )
}



export default App
