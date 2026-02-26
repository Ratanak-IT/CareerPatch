import React from 'react';

export default function PeopleLoveWorking() {
  return (
    <section className="w-full bg-[#F3F4F6] py-20 font-['Poppins']">
      {/* Container with 120px horizontal margin for desktop alignment */}
      <div className="mx-auto px-6 lg:px-[120px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Text & Stats */}
        <div className="space-y-12">
          <div className="space-y-4">
            {/* Header: Blue #1E88E5 - Optimized size */}
            <h2 className="text-[#1E88E5] text-3xl md:text-4xl font-bold leading-tight max-w-md">
              People Love Working With Freeio
            </h2>
            {/* Smaller Black/Gray Text for better contrast */}
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">
              Discover a platform built for trust, talent, and results.
            </p>
          </div>

          {/* Stats Grid with improved spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
            {/* Stat Item 1 */}
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900">4.9/5</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed max-w-[180px]">
                Discover a platform built for trust, talent, and results.
              </p>
            </div>

            {/* Stat Item 2 */}
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900">Award Winner</h3>
              <ul className="text-gray-400 text-[11px] leading-relaxed list-disc list-inside">
                <li>Recognized with leading software excellence awards</li>
              </ul>
            </div>

            {/* Stat Item 3 - Staggered position for visual interest */}
            <div className="md:col-start-2 space-y-2">
              <h3 className="text-3xl font-bold text-gray-900">90%</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed max-w-[180px]">
                Customers report complete satisfaction with their freelancers.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Testimonial Card */}
        <div className="flex justify-center lg:justify-end lg:mt-10">
          <div className="bg-white rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] max-w-sm border border-gray-50">
            {/* Quote Header in specific Purple-Blue */}
            <p className="text-[#6366F1] font-bold text-sm mb-4">“Great job!”</p>
            {/* Smaller testimonial body text */}
            <p className="text-gray-500 text-xs md:text-[13px] leading-6 mb-8 italic">
              "Freeio made it simple to connect with the right professional. The process was smooth, and the results exceeded expectations."
            </p>
            
            {/* User Profile Info */}
            <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
                alt="Sarika" 
                className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
              <div className="flex flex-col">
                <h4 className="font-bold text-gray-900 text-sm">Sarika</h4>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">
                  Nursing Assistant
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}