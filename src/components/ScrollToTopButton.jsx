import React, { useEffect, useState } from "react";
import { TbArrowBigUpLine } from "react-icons/tb";

const ScrollToTopButton = ({ ...props }) => {
  const [isVisible, setIsVisible] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div
      className={`scroll-to-top bg-white p-2 rounded-full shadow-md transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${props.className} z-20`}
      onClick={scrollToTop}
    >
      <TbArrowBigUpLine
        size={27}
        className="bg-white fill-gray-400 stroke-gray-400"
      />
    </div>
  );
};

export default ScrollToTopButton;
