import React, { useState, useEffect } from "react";
import MenuBar from "./MenuBar";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

import { MdSpaceDashboard } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi";
import { RiContactsFill } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";

function Header({ links }) {
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  let navigateURL;

  let navigate = useNavigate();

  if (isLoggedIn()) {
    navigateURL = "/dashboard";
  } else {
    navigateURL = "/auth";
  }

  // useEffect(() => {
  //   function handleScroll() {
  //     const currentScrollPos =
  //       window.pageYOffset || document.documentElement.scrollTop;
  //     if (prevScrollPos <= 800) {
  //       setIsHidden(false);
  //     } else {
  //       if (prevScrollPos < currentScrollPos) {
  //         setIsHidden(true);
  //         if (open) {
  //           setOpen(false);
  //         }
  //       }
  //     }

  //     setPrevScrollPos(currentScrollPos);
  //   }

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [prevScrollPos]);

  return (
    <div
      className={`shadow sticky top-0 left-0 bg-white mx-auto duration-300 ${
        isHidden ? "-translate-y-full duration-200" : "translate-y-0"
      } z-10`}
    >
      <div className="flex items-center justify-between py-[0.4rem] px-4 ">
        <div className="font-bold text-3xl cursor-pointer flex items-center text-indigo-600 z-20 space-x-2 md:space-x-3">
          <span className="text-3xl text-indigo-600">
            <a href="/">
              <img
                src={`/garshs.png`}
                alt="GARSHS Logo"
                className="w-11 h-11"
                // md:h-[3.2rem] md:w-[3.2rem]
              />
            </a>
          </span>
          <span className="tracking-wide md:tracking-widest">
            <a
              href="/"
              className="font-bold md:font-extrabold text-transparent bg-clip-text bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-sky-400 flex flex-col"
            >
              <span className="text-xl h-[1.47rem]">GARSHS</span>
              <span className="text-xs  h-4 tracking-[0.45rem] md:tracking-[0.6rem] pl-[0.13rem]">
                PORTAL
              </span>
            </a>
          </span>
        </div>
        <nav>
          <ul
            className={`flex items-center space-x-4 sm:space-x-6 md:space-x-7 md:pb-0 pt-[0.17rem] md:z-auto z-[-1] w-full md:w-auto md:pl-0 pl-9 transition-all duration-300 ease-in`}
          >
            {links.map((link, i) => (
              <li key={i} className="md:ml-7 text-[1.3rem] ">
                <a
                  href={link.link}
                  className={`hover:text-indigo-400 duration-300 opacity-100 duration-150"
                  } md:opacity-100 font-semibold`}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <Button
              className={`duration-200 px-[1rem] py-[0.59rem] text-[0.97rem] tracking-[0.1rem]`}
              variant="cta"
              pill={true}
              onClick={() => {
                navigate(navigateURL);
                setOpen(false);
              }}
            >
              {!isLoggedIn() ? (
                <span className="flex space-x-[0.57rem] items-center">
                  <FiLogIn size={17} />
                  <span className="hidden sm:block">SIGN IN</span>
                </span>
              ) : (
                <span className="flex space-x-1 items-center">
                  <MdSpaceDashboard size={17} />
                  <span className="hidden sm:block">DASHBOARD</span>
                </span>
              )}
            </Button>
          </ul>
        </nav>
      </div>
    </div>
  );
}

Header.defaultProps = {
  links: [
    {
      name: (
        <span className="flex space-x-2 items-center">
          <span className="w-[1.95rem] h-[1.95rem] md:w-[1.5rem] md:h-[1.5rem] flex items-center justify-center">
            <HiInformationCircle size={40} />
          </span>
          <span className="hidden md:block text-[1.15rem]">ABOUT</span>
        </span>
      ),
      link: "/about",
    },
    {
      name: (
        <span className="flex space-x-2 items-center">
          <span className="w-7 h-7 md:w-[1.4rem] md:h-[1.4rem] flex items-center justify-center">
            <RiContactsFill size={40} />
          </span>
          <span className="hidden md:block text-[1.15rem]">CONTACT</span>
        </span>
      ),
      link: "/contact",
    },
  ],
};

export default Header;
