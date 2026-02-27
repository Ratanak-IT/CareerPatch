import HeroSectionComponent from "../components/freelancer/HeroSectionComponent"



import FooterComponent from "../components/footer/FooterComponent";
import CardFreelancerPostComponent from "../components/freelancer/CardFreelancerPostComponent";



export default function FindFreelancers() {
  return (
    <> 
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Hero (SearchBar is embedded inside) */}
        <div className="mt-6">
          <HeroSectionComponent />
        </div>

        {/* Cards — mt accounts for the overlapping search bar */}
        <div className="mt-16 sm:mt-16 md:mt-20 pb-12">
          <CardFreelancerPostComponent/>
           
        </div>
      </div>
    </div>

   
    
    <FooterComponent/>
    </>
    
  )
}
