"use client";

import { useEffect, useState } from "react";

export const useHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
};

export const HeaderGradient = ({ children }: { children: React.ReactNode }) => {
  const isScrolled = useHeaderScroll();

  return (
    <div
      className={`transition-all duration-300 w-full ${
        isScrolled
          ? "bg-white/98 dark:bg-black/98 shadow-lg backdrop-blur-xl"
          : "bg-white/95 dark:bg-black/95 shadow-sm backdrop-blur-md"
      }`}
    >
      {children}
    </div>
  );
};
