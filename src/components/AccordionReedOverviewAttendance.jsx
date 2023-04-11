import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useData } from "./contexts/DataContext";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { FaChalkboardTeacher, FaPeopleCarry } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import UserCardAttendance from "./UserCardAttendance";

import SectionIcon from "./SectionIcon";

import Spinner from "./Spinner";
import axios from "axios";
import { useToast } from "./contexts/ToastContext";

const AccordionReedOverviewAttendance = ({ group, i, isLast, ...props }) => {
  const { data } = useData();
  const { setToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isGroupDataReady, setIsGroupDataReady] = useState(false);
  const [adviser, setAdviser] = useState(null);

  useUpdateEffect(() => {
    if (!isGroupDataReady && isInitialized) {
      axios
        .get("/api/v1/attendance/overview", {
          params: {
            type: group.type,
            section: group?.section,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setUsers(res.data.users);
            setAttendanceRecords(res.data.attendanceRecords);
            setAdviser(res.data?.adviser);
            console.log("res.data", res.data);
            setIsGroupDataReady(true);
          } else {
            setToast({
              message: "Failed to fetch overview data",
              icon: "cross",
            });
          }
        })
        .catch((err) => {
          console.log("(Fetch overview data) An error occured.");
          setToast({
            message: "Failed to fetch overview data",
            icon: "cross",
          });
          console.error(err);
        });
    }
  }, [isInitialized]);

  const gridStyle =
    "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4";

  return (
    <div className={`w-full ${props.className ? props.className : ""}`} key={i}>
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
              {group.type === "section" ? (
                <SectionIcon
                  alpha2={
                    data.map.sections.find((obj) => obj.value === group.section)
                      .alpha2
                  }
                  className="text-[0.75rem] h-7 w-7 text-white bg-gradient-to-t  from-blue-400 to-purple-400"
                />
              ) : (
                <></>
              )}
              {group.type === "teaching" ? (
                <span className="w-6 h-6 flex justify-center items-center">
                  <FaChalkboardTeacher size={30} />
                </span>
              ) : (
                <></>
              )}
              {group.type === "nonTeaching" ? (
                <span className="w-6 h-6 flex justify-center items-center">
                  <FaPeopleCarry size={30} />
                </span>
              ) : (
                <></>
              )}
              {group.type === "superadmin" ? (
                <span className="w-6 h-6 flex justify-center items-center">
                  <RiAdminFill size={30} />
                </span>
              ) : (
                <></>
              )}
              <span className="text-2xl">
                {group.type === "section" ? (
                  <>
                    {
                      data.map.sections.find(
                        (obj) => obj.value === group.section
                      ).name
                    }
                  </>
                ) : (
                  <></>
                )}
                {group.type === "teaching" ? <>Teachers</> : <></>}
                {group.type === "nonTeaching" ? <>Non-teaching Staff</> : <></>}
                {group.type === "superadmin" ? <>Superadmins</> : <></>}
              </span>
            </span>
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
        {isGroupDataReady ? (
          <div className="flex flex-col space-y-7">
            {users.length === 0 ? (
              <>There are no users in this group.</>
            ) : attendanceRecords.length === 0 ? (
              <>There are no classes for today.</>
            ) : (
              <>
                {group.type === "section" ? (
                  <>
                    {adviser ? (
                      <div className="flex flex-col space-y-3">
                        <h4 className="my-1 font-semibold">Adviser</h4>
                        <div className={gridStyle}>
                          <UserCardAttendance
                            user={adviser}
                            attendanceRecords={attendanceRecords}
                            i={1}
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="my-1 font-semibold">Students</h4>
                        <span className="font-mono text-xl">
                          {
                            attendanceRecords
                              .filter((record) => record.userId !== adviser._id)
                              .filter((record) => record.title === "present")
                              .length
                          }
                          /{users.length}
                        </span>
                      </div>
                      <div className={gridStyle}>
                        {users.map((user, i) => (
                          <UserCardAttendance
                            user={user}
                            attendanceRecords={attendanceRecords}
                            i={i}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {["teaching", "nonTeaching", "superadmin"].includes(
                  group.type
                ) ? (
                  <div className={gridStyle}>
                    {users.map((user, i) => (
                      <UserCardAttendance
                        user={user}
                        attendanceRecords={attendanceRecords}
                        i={i}
                      />
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        ) : (
          <Spinner bgColor="bg-indigo-500 " />
        )}
      </div>
    </div>
  );
};

export default AccordionReedOverviewAttendance;
