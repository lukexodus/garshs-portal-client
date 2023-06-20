import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";
import { useData } from "./contexts/DataContext";
import { isLoggedIn } from "../services/auth";

import SidebarIcon from "./SidebarIcon";
import SectionIcon from "./SectionIcon";
import SidebarIconFallback from "./SidebarIconFallback";
import { logout } from "../services/auth";
import useClickOutside from "./hooks/useClickOutside";

import { MdSpaceDashboard, MdInventory } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { FaIdCard, FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import {
  BsFillCalendarCheckFill,
  BsFillCalendarXFill,
  BsFillCalendarFill,
} from "react-icons/bs";
import { TbNumbers } from "react-icons/tb";
import { GoRequestChanges } from "react-icons/go";
import { IconContext } from "react-icons/lib";

import { subjectIconsForSidebar } from "../config/icons";

const fallbackIcons = Array(15).fill(null);

const adminLinks = [
  {
    name: "LRNs",
    link: "/dashboard/admin/lrn",
    component: (
      <TbNumbers
        size={34}
        className="text-indigo-600 hover:text-indigo-400 mx-[3px]"
      />
    ),
  },
  {
    link: "/dashboard/admin/requests",
    name: "Requests",
    component: (
      <GoRequestChanges
        size={34}
        className="text-indigo-600 hover:text-indigo-400 mx-[3px]"
      />
    ),
  },
];

const bottomLinks = [
  {
    name: "Sections",
    link: "/dashboard/sections",
    component: (
      <SiGoogleclassroom
        size={33}
        className="text-indigo-600 hover:text-indigo-400"
      />
    ),
  },
  {
    link: "/dashboard/inventory",
    name: "Inventory",
    component: (
      <MdInventory
        size={39}
        className="text-indigo-600 hover:text-indigo-400"
      />
    ),
  },
  {
    link: "/dashboard/attendance",
    name: "Attendance",
    component: (
      <BsFillCalendarCheckFill
        size={32}
        className="text-indigo-600 hover:text-indigo-400"
      />
    ),
  },
];

let reportCardLinkAdded = false;
let attendanceLinkAdded = false;

function Sidebar({ open, toggleSidebar }) {
  const { data } = useData();

  const navigate = useNavigate();

  const [isSidebarIconsReady, setIsSidebarIconsReady] = useState(false);
  const [iconsLinks, setIconsLinks] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  let sidebarNode = useClickOutside(() => {
    toggleSidebar(false);
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      logout();
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (data.user.hasProfilePic) {
        setProfilePic(`/user/${data.user._id}.${data.user.ext}`);
      }
      if (data.user.role === "student" || data.user.role === "parent") {
        if (!reportCardLinkAdded) {
          bottomLinks.push({
            link: `/dashboard/report-card/${data.user.section}/${data.user._id}`,
            name: "Report Card",
            component: (
              <FaIdCard
                className="text-indigo-600 hover:text-indigo-400"
                size={33}
              />
            ),
          });
          reportCardLinkAdded = true;
        }
      }

      // if (
      //   (data.user.role === "admin" && !data.user.nonTeaching) ||
      //   data.user.role === "student" || data.user.role === 'superadmin'
      // ) {
      //   if (!attendanceLinkAdded) {
      //     bottomLinks.push();
      //     attendanceLinkAdded = true;
      //   }
      // }

      let subjectClassesLinksObjects = [];

      if (data.user.role === "admin" && !data.user.nonTeaching) {
        const sections = Object.keys(data.user.subjectClasses);
        for (let section of sections) {
          const subject = data.user.subjectClasses[section][0];
          const subjectClassLink = {};
          subjectClassLink.name = data.map.sections.find(
            (obj) => obj.value === section
          ).name;
          subjectClassLink.component = (
            <SidebarIcon
              component={
                <SectionIcon
                  alpha2={
                    data.map.sections.find((obj) => obj.value === section)
                      .alpha2
                  }
                />
              }
              isComponentReady={true}
            />
          );
          subjectClassLink.link = `/dashboard/${section}/${subject}`;
          subjectClassesLinksObjects.push(subjectClassLink);
        }
        setIconsLinks(subjectClassesLinksObjects);
        setIsSidebarIconsReady(true);
      } else if (data.user.role === "admin" && data.user.nonTeaching) {
        setIconsLinks([]);
        setIsSidebarIconsReady(true);
      } else if (data.user.role === "superadmin") {
        setIconsLinks(adminLinks);
        setIsSidebarIconsReady(true);
      } else if (data.user.role === "student") {
        let studentIcons = [];
        for (const subjectObj of data.subjects) {
          studentIcons.push({
            link: `/dashboard/${data.user.section}/${subjectObj.subject}`,
            name: data.map.subjects.find(
              (subjectItem) => subjectItem.value === subjectObj.subject
            ).name,
            component: subjectIconsForSidebar[subjectObj.subject],
          });
        }
        setIconsLinks(studentIcons);
        setIsSidebarIconsReady(true);
      }
    }
  }, [data]);

  return (
    <div
      className={`fixed flex flex-col flex-none h-full bg-gray-100 md:w-72 ${
        open ? " w-72" : "w-14"
      } transition-all duration-300 overflow-x-hidden text-indigo-600 shadow-sm z-10 overflow-y-hidden rounded-tr-2xl`}
      ref={sidebarNode}
    >
      <MenuBar
        className="w-12 h-12 z-10 absolute right-[0.28rem] top-3 rounded-full md:hidden transition-all duration-300"
        toggleMenu={() => toggleSidebar((prev) => !prev)}
        open={open}
      />

      {isSidebarIconsReady ? (
        <>
          <a href="/" className="flex flex-col flex-none">
            <span
              className={`flex flex-row items-center p-2 mt-20 md:mt-12 self-start md:self-center ${
                open ? "self-center" : ""
              } opacity-100  transition-all duration-300`}
            >
              {/* md:p-3 */}
              <img
                src={`/garshs.png`}
                alt=""
                className={`w-10 h-10 md:w-16 md:h-16 ${
                  open ? "w-14 h-14" : ""
                } transition-all duration-300`}
              />
              {/* md:h-12 md:w-12 */}
              <span className="font-extrabold text-3xl pl-3 tracking-wider text-transparent bg-clip-text bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-sky-400">
                GARSHS
              </span>
            </span>
          </a>

          <div
            className={`px-3 md:px-6 py-2 md:py-3 ${
              open ? "py-3 px-[1.5rem]" : ""
            } flex-none`}
          >
            <hr className="border-t-2 rounded-full border-gray-200 shadow-lg" />
          </div>

          <div className="h-max flex flex-col flex-auto justify-between overflow-y-auto overflow-x-hidden">
            <div className="flex-auto overflow-y-auto overflow-x-hidden max-h-[505px]">
              <div className="mb-3">
                <a href="/dashboard">
                  <span
                    className={`flex items-center justify-center space-x-4 overflow-x-hidden w-max md:ml-5 px-2 ${
                      open ? "ml-5" : ""
                    } transition-all duration-300`}
                  >
                    <span className="w-10 flex items-center justify-center">
                      <MdSpaceDashboard
                        size={41}
                        className="text-indigo-600 hover:text-indigo-400"
                      />
                    </span>
                    <span className={`text-xl`}>Dashboard</span>
                  </span>
                </a>
              </div>

              {/* <SidebarIcon component={<SectionIcon alpha2="Et"/>} fallback={<SidebarIconFallback/>} isComponentReady={isSidebarIconsReady} /> */}

              {/* py-2 md:py-3 ${open ? 'py-3' : ''} */}

              <div className={`flex-none`}>
                {data.user.role === "student" ? (
                  <IconContext.Provider
                    value={{
                      className:
                        "w-10 h-10 text-indigo-600 hover:text-indigo-400",
                    }}
                  >
                    <ul
                      className={`flex flex-col items-start justify-between md:ml-5 px-2 space-y-3 ${
                        open ? "ml-5 hover:overflow-x-auto mr-5" : ""
                      } transition-all duration-300 md:mr-5`}
                    >
                      {iconsLinks.map((subject, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-center max-w-full"
                        >
                          <a
                            href={subject.link}
                            className="truncate flex space-x-4"
                          >
                            <span className="flex items-center justify-center space-x-4 ">
                              {subject.component}
                            </span>
                            <span
                              className={`text-xl truncate ${
                                open ? "hover:overflow-x-auto" : ""
                              } md:hover:overflow-x-auto flex items-center`}
                            >
                              {subject.name}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </IconContext.Provider>
                ) : (
                  <ul
                    className={`flex flex-col items-start justify-between md:ml-5 px-2 space-y-3 ${
                      open ? "ml-5 hover:overflow-x-auto mr-5" : ""
                    } transition-all duration-300 md:mr-5`}
                  >
                    {iconsLinks.map((section, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-center max-w-full"
                      >
                        <a
                          href={section.link}
                          className="truncate flex space-x-4"
                        >
                          <span className="flex items-center justify-center space-x-4">
                            {section.component}
                          </span>
                          <span
                            className={`text-xl truncate ${
                              open ? "hover:overflow-x-auto" : ""
                            } md:hover:overflow-x-auto flex items-center`}
                          >
                            {section.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="">
              <div className={`px-3 md:px-6 py-3 ${open ? "px-[1.5rem]" : ""}`}>
                <hr className="border-t-2 rounded-full border-gray-200" />
              </div>
              <ul
                className={`flex flex-col items-start justify-center md:ml-5 px-2 space-y-3 ${
                  open ? "ml-5" : ""
                } transition-all duration-300`}
              >
                {bottomLinks.map((link, i) => (
                  <li key={i} className="">
                    <a href={link.link}>
                      <span className="flex items-center justify-center space-x-4 overflow-x-hidden w-max">
                        <span className="w-10 flex items-center justify-center">
                          {link.component}
                        </span>
                        <span className={`text-xl`}>{link.name}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="py-3"></div>

              <div
                className={`bg-gray-200 max-w-full w-full flex items-center pl-2 md:pl-6 pr-4 py-5 shadow-lg ${
                  open ? "pl-[1.5rem]" : ""
                } transition-all duration-300`}
              >
                <div className="rounded-full flex-none">
                  <a href="/dashboard/profile">
                    {profilePic ? (
                      <img
                        className={` rounded-full w-10 h-10 md:w-12 md:h-12 ${
                          open ? "w-12 h-12" : ""
                        } transition-all duration-300 cursor-pointer shadow-lg border-[0.5px]`}
                        src={profilePic}
                        alt={data.user.firstName + " " + data.user.lastName}
                      />
                    ) : (
                      <div className="text-indigo-600 hover:text-indigo-400">
                        <FaUserCircle
                          className={`w-10 h-10 md:w-12 md:h-12 ${
                            open ? "w-12 h-12" : ""
                          } transition-all duration-300 cursor-pointer`}
                        />
                      </div>
                    )}
                  </a>
                </div>
                <div className="flex flex-col pl-3 cursor-pointer flex-auto overflow-x-hidden max-w-[152px]">
                  <a href="/dashboard/profile">
                    <div className="text-xl font-semibold truncate">
                      {data.user.firstName} {data.user.lastName}
                    </div>
                    <div className="text-sm font-light tracking-tight truncate">
                      {data.user.email}
                    </div>
                  </a>
                </div>
                <div className="text-indigo-600 hover:text-indigo-400 flex cursor-pointer flex-none">
                  <span
                    className="ml-auto p-1"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <BiLogOut size={28} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`flex items-start justify-center md:ml-4 px-2 space-y-3 ${
              open ? "ml-4" : ""
            } transition-all duration-300 animate-puls w-max pt-[5.5rem] md:pt-16`}
          >
            <div
              className={`h-10 w-10 md:h-14 md:w-14 bg-gray-100 dark:bg-gray-200 rounded-full ${
                open ? "h-14 w-14" : ""
              }`}
            ></div>
            <span className="w-4"></span>
            <div className="h-8 w-40 bg-gray-100 dark:bg-gray-200 rounded-full"></div>
          </div>

          <ul
            className={`mt-7 flex flex-col items-start justify-center md:ml-5 px-2 space-y-3 ${
              open ? "ml-5" : ""
            } transition-all duration-300`}
          >
            {fallbackIcons.map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-center space-x-4 overflow-x-hidden w-max"
              >
                <SidebarIconFallback />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Sidebar;
