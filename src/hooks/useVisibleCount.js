import { useEffect, useState } from "react";
 
export function useVisibleCount() {
  const [count, setCount] = useState(4);
 
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(4);
      else if (w >= 768) setCount(6);
      else setCount(4); 
    };
 
    update(); // run once on mount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
 
  return count;
}