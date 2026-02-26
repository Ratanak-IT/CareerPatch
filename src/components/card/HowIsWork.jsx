import React from 'react';

export default function HowIsWork() {
  const steps = [
    {
      id: 1,
      title: "Create Account",
      desc: "First you have to create a account here",
      iconPath: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    },
    {
      id: 2,
      title: "Search work",
      desc: "Search the best freelance work here",
      iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
    },
    {
      id: 3,
      title: "Save and apply",
      desc: "Apply or save and start your work",
      iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }
  ];

  return (
    <section className="w-full bg-white py-16">
      {/* Container with 120px margin on desktop as per layout guide */}
      <div className="mx-auto px-4 lg:px-[120px]">
        
        {/* Title with specific color 1E88E5 */}
        <h2 className="text-center text-[#1E88E5] text-4xl font-bold">
          How is works
        </h2>

        {/* Card Container with 30px spacing from title */}
        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-3 gap-[20px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 p-12">
          
          {steps.map((step) => (
            <div key={step.id} className="group flex flex-col items-center text-center cursor-default">
              
              {/* Icon Circle with color F3F4F6 */}
              <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-6 transition-all duration-300">
                {/* Icon with color 1E88E5 and hover color 2563EB */}
                <svg 
                  className="w-10 h-10 text-[#1E88E5] group-hover:text-[#2563EB] transition-colors duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={step.iconPath} />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}