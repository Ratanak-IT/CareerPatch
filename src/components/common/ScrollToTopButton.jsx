import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const hideRoutes = ["/login", "/register", "/signin"];
  const shouldHide = hideRoutes.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 👇 condition only affects rendering, NOT hooks
  if (shouldHide) return null;

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6
            bg-blue-500 hover:bg-blue-600
            text-white
            w-12 h-12
            rounded-full
            shadow-xl
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110
            z-50
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </>
  );
}