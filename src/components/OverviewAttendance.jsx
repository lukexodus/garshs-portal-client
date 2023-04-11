import React, { useEffect, useState } from "react";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import AccordionOverviewAttendance from "./AccordionOverviewAttendance";
import Loading from "./Loading";
import axios from "axios";
import SectionIcon from "./SectionIcon";
import UserCardAttendance from "./UserCardAttendance";
import CircularProgress from "./CircularProgress";

const OverviewAttendance = () => {
  document.title = `Attendance | Overview`;

  const { data } = useData();
  const { setToast } = useToast();

  const [isStatusReady, setIsStatusReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalSchoolDays, setTotalSchoolDays] = useState(null);
  const [finishedSchoolDays, setFinishedSchoolDays] = useState(null);

  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isGroupDataReady, setIsGroupDataReady] = useState(false);
  const [adviser, setAdviser] = useState(null);

  useEffect(() => {
    console.log("fetch attendance status")
    axios
      .get("/api/v1/attendance/status")
      .then((res) => {
        if (res.data.success) {
          setIsInitialized(res.data.isInitialized);
          setTotalSchoolDays(res.data.totalSchoolDays);
          setFinishedSchoolDays(res.data.finishedSchoolDays);
          setIsStatusReady(true);
          console.log("res.data", res.data);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch attendance status");
        console.error(err);
        setToast({ message: "An error occured", icon: "cross" });
      });
  }, []);

  let sectionGroups;

  if (data.user.role === "admin" && !data.user.nonTeaching) {
    sectionGroups = Object.keys(data.user.subjectClasses).map((section, i) => {
      return { type: "section", section, i };
    });
    if (
      !sectionGroups.find(
        (sectionObj) => sectionObj.section === data.user.adviseeSection
      )
    ) {
      sectionGroups.unshift({ type: "section", section: adviseeSection });
    }
  }

  if (data.user.role === "superadmin") {
    sectionGroups = data.map.sections.map((sectionObj, i) => {
      return { type: "section", section: sectionObj.value, i };
    });
  }

  useEffect(() => {
    if (data.user.role === "student") {
      console.log("fetch attendance overview for student");
      axios
        .get("/api/v1/attendance/overview", {
          params: {
            type: "section",
            section: data.user.section,
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
  }, []);

  const gridStyle =
    "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4";

  return (
    <div className="w-full">
      {isStatusReady ? (
        <>
          {isInitialized ? (
            <>
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="my-0 py-0">OVERVIEW</h2>
                  <span
                    className="flex items-center space-x-2"
                    title="Finished school days / Total school days"
                  >
                    <span className="font-mono text-xl">
                      {finishedSchoolDays}/{totalSchoolDays}
                    </span>
                    <CircularProgress
                      min={0}
                      max={totalSchoolDays}
                      value={finishedSchoolDays}
                      radiusParam={46}
                      strokeParam={4}
                      normRadiusParam={8}
                    />
                  </span>
                </div>
                <div className="py-5">
                  <hr className="opacity-40" />
                </div>
              </div>
              {data.user.role === "student" ? (
                <>
                  {isGroupDataReady ? (
                    <div className="w-full">
                      <h3
                        className={`my-0 bg-indigo-500 font-medium text-left text-white text-2xl p-4 rounded-t-xl flex space-x-2 items-center`}
                      >
                        <span className="text-sm font-light flex space-x-2 items-center">
                          <SectionIcon
                            alpha2={
                              data.map.sections.find(
                                (obj) => obj.value === data.user.section
                              ).alpha2
                            }
                            className="text-[0.75rem] h-7 w-7 text-white bg-gradient-to-t  from-blue-400 to-purple-400"
                          />
                        </span>
                        <span className="text-2xl font-light">
                          {" "}
                          {
                            data.map.sections.find(
                              (obj) => obj.value === data.user.section
                            ).name
                          }
                        </span>
                      </h3>
                      <div
                        className={`bg-indigo-500 p-5 border-t border-gray-200 border-opacity-40 rounded-b-xl`}
                      >
                        <div className="flex flex-col space-y-7">
                          {users.length === 0 ? (
                            <>There are no users in this group.</>
                          ) : attendanceRecords.length === 0 ? (
                            <>There are no classes for today.</>
                          ) : (
                            <>
                              <>
                                {adviser ? (
                                  <div className="flex flex-col space-y-3">
                                    <h4 className="my-1 font-semibold">
                                      Adviser
                                    </h4>
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
                                  <h4 className="my-1 font-semibold">
                                    Students
                                  </h4>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Loading />
                  )}
                </>
              ) : (
                <></>
              )}
              {data.user.role === "admin" || data.user.role === "superadmin" ? (
                <div className="flex items-start justify-center flex-col space-y-10 xl:grid xl:grid-cols-2 xl:space-y-0 xl:gap-7 w-full">
                  {!data.user.nonTeaching ? (
                    <div className="w-full flex flex-col space-y-6">
                      <h2>Sections</h2>
                      <AccordionOverviewAttendance groups={sectionGroups} />
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="w-full flex flex-col space-y-6">
                    <h2>Staff</h2>
                    <AccordionOverviewAttendance
                      groups={[
                        { type: "teaching" },
                        { type: "nonTeaching" },
                        { type: "superadmin" },
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>Attendance has not been yet set to be tracked...</>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default OverviewAttendance;
