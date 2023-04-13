import React, { useEffect, useState } from "react";
import SectionIcon from "./SectionIcon";
import Avatar from "./Avatar";
import { useData } from "./contexts/DataContext";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { FaChalkboardTeacher } from "react-icons/fa";

import { GiTeacher } from "react-icons/gi";
import Spinner from "./Spinner";
import axios from "axios";
import { useToast } from "./contexts/ToastContext";
import { subjectIconsForSidebar } from "../config/icons";
import { addSwipeUpListener } from "./utils/swipe";

const AccordionReed = ({ section, i, isLast, ...props }) => {
  const { data } = useData();
  const { setToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const [isSectionDataReady, setIsSectionDataReady] = useState(false);

  useUpdateEffect(() => {
    if (!isSectionDataReady && isInitialized) {
      axios
        .get("/api/v1/section", {
          params: {
            section: section.section,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setSectionData(res.data.section);
            console.log("section", res.data.section);
            setIsSectionDataReady(true);
          } else {
            setToast({
              message: "Failed to fetch section data",
              icon: "cross",
            });
          }
        })
        .catch((err) => {
          console.log("(Fetch section data) An error occured.");
          setToast({
            message: "Failed to fetch section data",
            icon: "cross",
          });
          console.error(err);
        });
    }
  }, [isInitialized]);

  return (
    <div className={`w-full ${props.className}`}>
      <h3
        className={`cursor-pointer my-0 focus:ring-4 focus:ring-gray-200 bg-indigo-500 hover:bg-indigo-400 font-medium text-left text-white text-2xl p-4 ${
          !isLast ? props.corners : isOpen ? "" : props.corners
        }`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setIsInitialized(true);
        }}
      >
        <button
          type="button"
          className={`flex items-center justify-between w-full ${
            !isLast ? props.corners : isOpen ? "" : props.corners
          }`}
        >
          <span className="flex  items-center justify-between w-full  ">
            <span className="text-sm font-light flex space-x-2 items-center">
              <SectionIcon
                alpha2={
                  data.map.sections.find((obj) => obj.value === section.section)
                    .alpha2
                }
                className="text-[0.75rem] h-7 w-7 text-white bg-gradient-to-t  from-blue-400 to-purple-400"
              />
              <span className="text-lg sm:text-2xl">
                {
                  data.map.sections.find((obj) => obj.value === section.section)
                    .name
                }
              </span>
            </span>

            {section.adviser ? (
              <>
                <span className="text-sm font-light flex space-x-2 items-center mr-3">
                  <FaChalkboardTeacher className="hidden sm:block" />
                  <span className="">
                    {section.adviser.firstName} {section.adviser.lastName}
                  </span>
                </span>
              </>
            ) : (
              <span className="mr-3 font-extralight text-[0.7rem] sm:text-xs">
                No adviser yet
              </span>
            )}
          </span>
          <svg
            className={`w-6 h-6 shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </h3>
      <div
        className={`${isOpen ? "" : "hidden"} bg-indigo-500 ${
          isLast && isOpen ? props.corners : ""
        } p-5 border-t border-gray-200 border-opacity-40`}
      >
        {isSectionDataReady ? (
          <div className="flex flex-col space-y-7">
            {sectionData.subjects && sectionData.subjects.length !== 0 ? (
              <div className="flex flex-col space-y-1">
                <h4 className="my-1 font-semibold">Subjects</h4>
                <div className="flex flex-col space-y-2 divide-y-[1px] divide-gray-300 divide-opacity-30">
                  {sectionData.subjects.map((subject, i) => (
                    <span className="flex space-x-2 items-center pt-2 ">
                      <span className="hidden sm:block">{subjectIconsForSidebar[subject.subject]}</span>
                      <span className="flex items-center justify-between w-full max-w-full truncate">
                        <span className="text-sm max-w-sm w-5/12 truncate" title={data.map.subjects.find(
                              (obj) => obj.value === subject.subject
                            ).name}>
                          {
                            data.map.subjects.find(
                              (obj) => obj.value === subject.subject
                            ).name
                          }
                        </span>
                        <span className="flex items-center space-x-2">
                          {/* <GiTeacher size={13} /> */}
                          <a
                            className="text-xs sm:text-sm font-extralight text-white hover:underline"
                            href={`/dashboard/user/${subject.subjectTeacher._id}`}
                            target="_blank"
                          >
                            {subject.subjectTeacher.firstName}{" "}
                            {subject.subjectTeacher.lastName}
                          </a>
                        </span>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <span className="font-light text-sm">No subjects yet</span>
            )}

            <div className="flex flex-col space-y-3">
              {sectionData.students && sectionData.students.length !== 0 ? (
                <>
                  <h4 className="my-1 font-semibold">Students</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                    {sectionData.students.map((student, i) => (
                      <a
                        className=" cursor-pointer flex items-center space-x-2 hover:bg-indigo-400 w-full rounded-full p-[0.4rem]"
                        href={`/dashboard/user/${student._id}`}
                        target="_blank"
                      >
                        <Avatar user={student} size={4} path="/user/" />
                        <a
                          href={`/dashboard/user/${student._id}`}
                          className="text-white text-xs sm:text-base"
                          target="_blank"
                        >
                          {student.firstName} {student.lastName}
                        </a>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <span className="font-light text-sm">No students yet</span>
              )}
            </div>
          </div>
        ) : (
          <Spinner bgColor="bg-indigo-500 " />
        )}
      </div>
    </div>
  );
};

export default AccordionReed;
