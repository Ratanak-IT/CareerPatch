import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ButtonComponent from "../button/ButtonComponent";
import { Link } from "react-router";

const FEATURES = [
  "The best for every budget",
  "Quality work done quickly",
  "Protected payments, every time",
  "24/7 support",
];

export default function SectionSolutionForEveryNeed() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <section
      className={[
        "w-full mt-10 transition-colors duration-300",
        "bg-white",
        "dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]",
        "py-10 sm:py-12 md:py-16 lg:py-20",
        "overflow-hidden",
      ].join(" ")}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div
        className="
          max-w-[1440px] mx-auto
          px-4 sm:px-6 md:px-8 lg:px-[120px]
          flex flex-col lg:flex-row
          items-center
          gap-10 md:gap-12 lg:gap-20
        "
      >
        {/* LEFT: Text */}
        <div className="w-full lg:w-1/2 space-y-5 sm:space-y-6 text-center lg:text-left">

          <p
            data-aos="fade-down"
            data-aos-delay="0"
            className="text-sm font-medium text-gray-400 dark:text-slate-400"
          >
            For Clients
          </p>

          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-bold leading-[1.15] text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px]"
          >
            <span className="text-[#1E88E5]">Find Talent Your Way – </span>
            <br className="hidden sm:block" />
            <span className="text-[#1E88E5]">Freelance </span>
            <span className="text-gray-900 dark:text-white">
              Solutions for Every Need
            </span>
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto lg:mx-0 text-gray-500 dark:text-slate-400"
          >
            Client-focused ad with clear benefits: affordable, fast, secure, and
            supported.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="pt-2 flex justify-center lg:justify-start"
          >
            <Link to="/contact">
              <ButtonComponent
                text={
                  <span className="flex items-center gap-2">
                    Contact
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                }
                onClick={() => console.log("Contact clicked")}
              />
            </Link>
          </div>
        </div>

        {/* RIGHT: Image + feature cards */}
        <div
          data-aos="fade-left"
          data-aos-delay="150"
          data-aos-duration="800"
          className="w-full lg:w-1/2 relative"
        >
          <div
            className="
              relative rounded-3xl overflow-hidden
              h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px]
            "
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Clients working together"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

            {/* Desktop / tablet floating pills */}
            <div className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-10 max-w-[85%]">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  data-aos="fade-right"
                  data-aos-delay={300 + i * 100}
                  className="
                    flex items-center gap-3
                    px-4 py-2.5
                    rounded-full
                    bg-white/10 backdrop-blur-lg border border-white/20
                    w-fit max-w-full
                  "
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1E88E5"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-white text-[12px] md:text-[13px] font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile floating pills */}
          <div className="absolute z-20 top-30 left-3 sm:hidden grid gap-1">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                data-aos="fade-right"
                data-aos-delay={300 + i * 80}
                className="
                  flex items-center gap-1
                  px-2 py-1
                  rounded-full
                  bg-white/10 backdrop-blur-lg border border-white/20
                "
              >
                <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <svg
                    width="6"
                    height="6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1E88E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white text-[8px] font-medium leading-none truncate">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute -z-10 -bottom-6 -right-6 w-2/3 h-2/3 rounded-full bg-[#1E88E5]/10 blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}