import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { useData } from "./contexts/DataContext";
import { subjectIcons } from "../config/icons";
import PageFallback1 from "./PageFallback1";
import Button from "./Button";
import { useCustomModal } from "./contexts/CustomModalContext";
import { useToast } from "./contexts/ToastContext";
import Announcements from "./Announcements";
import Requirements from "./Requirements";
import Activities from "./Activities";
import Students from "./Students";
import axios from "axios";

import { FaChalkboardTeacher } from "react-icons/fa";
import { NODE_ENV } from "../config/config";

const SubjectClass = () => {
  const params = useParams();
  const section = params?.section;
  const subject = params?.subject;
  console.log(section, subject);

  const { setToast } = useToast();
  const { data } = useData();
  const { setCustomModal } = useCustomModal();

  const [announcements, setAnnouncements] = useState([]);
  const [isAnnouncementsReady, setIsAnnouncementsReady] = useState(false);

  const [students, setStudents] = useState([]);
  const [isStudentsReady, setIsStudentsReady] = useState(false);

  const [requirements, setRequirements] = useState([]);
  const [isRequirementsReady, setIsRequirementsReady] = useState(false);
  const [studentsNum, setStudentsNum] = useState(40);
  const [requirementsTab, setRequirementsTab] = useState("");
  const [unifinishedIncompleteReqs, setUnfinishedIncompleteReqs] =
    useState(null);
  const [finishedCompletedReqs, setFinishedIncompleteReqs] = useState(null);

  const [activities, setActivities] = useState([]);
  const [isActivitiesReady, setIsActivitiesReady] = useState(false);
  const [activitiesTab, setActivitiesTab] = useState("upcoming");
  const [upcomingActivities, setUpcomingActivities] = useState(null);
  const [pastActivities, setPastActivities] = useState(null);

  const [announcementsRefetch, setAnnouncementsRefetch] = useState(false);
  const [requirementsRefetch, setRequirementsRefetch] = useState(false);
  const [startRequirementsRefetch, setStartRequirementsRefetch] =
    useState(false);
  const [activitiesRefetch, setActivitiesRefetch] = useState(false);
  const [startActivitiesRefetch, setStartActivitiesRefetch] = useState(false);

  const [isStatusReportOpen, setIsStatusReportOpen] = useState(false);
  const [isScoresReportOpen, setIsScoresReportOpen] = useState(false);

  const [navigateSubject, setNavigateSubject] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      axios
        .get("/api/v1/announcements", {
          params: {
            mode: "subjectClass",
            section,
            subject,
            _id: data.user._id,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setAnnouncements(
              res.data.announcements.sort((a, b) => {
                return a.pin === b.pin ? 0 : a.pin ? -1 : 1;
              })
            );
            setIsAnnouncementsReady(true);
          } else {
            setToast({
              message: "Failed to fetch announcements.",
              icon: "cross",
            });
          }
        })
        .catch((err) => {
          console.log("(Fetch announcements) An error occured.");
          console.error(err);
        });
    }
  }, [announcementsRefetch, data, navigateSubject]);

  useEffect(() => {
    if (data) {
      if (data.user.role === "student") {
        if (subject) {
          document.title = `${
            data.map.subjects.find((obj) => obj.value === subject).name
          }`;
        } else {
          document.title = `Loading...`;
        }
      } else if (
        data.user.role === "admin" &&
        data.user.nonTeaching === false
      ) {
        if (subject && section) {
          console.log("subject", subject, "section", section);
          document.title = `${
            data.map.sections.find((obj) => obj.value === section).name
          } | ${data.map.subjects.find((obj) => obj.value === subject).name}`;
        } else {
          document.title = `Loading...`;
        }
      }
      if (data.user.role === "admin") {
        setRequirementsTab("incomplete");
      } else if (data.user.role === "student") {
        setRequirementsTab("unfinished");
      }
    }
  }, [data, navigateSubject]);

  useUpdateEffect(() => {
    if (requirementsTab) {
      if (
        requirementsTab === "incomplete" ||
        requirementsTab === "unfinished"
      ) {
        setUnfinishedIncompleteReqs(null);
      } else if (
        requirementsTab === "completed" ||
        requirementsTab === "finished"
      ) {
        setFinishedIncompleteReqs(null);
      }

      setStartRequirementsRefetch((prev) => !prev);
    }
  }, [requirementsRefetch, navigateSubject]);

  useEffect(() => {
    if (data && requirementsTab) {
      if (
        (requirementsTab === "incomplete" ||
          requirementsTab === "unfinished") &&
        unifinishedIncompleteReqs
      ) {
        setRequirements(unifinishedIncompleteReqs);
        return;
      } else if (
        (requirementsTab === "completed" || requirementsTab === "finished") &&
        finishedCompletedReqs
      ) {
        setRequirements(finishedCompletedReqs);
        return;
      }
      axios
        .get("/api/v1/requirements", {
          params: {
            mode: "previewAll",
            section,
            subject,
            status: requirementsTab,
          },
        })
        .then((res) => {
          if (res.data.success) {
            if (
              requirementsTab === "incomplete" ||
              requirementsTab === "unfinished"
            ) {
              setUnfinishedIncompleteReqs(res.data.requirements);
            } else if (
              requirementsTab === "completed" ||
              requirementsTab === "finished"
            ) {
              setFinishedIncompleteReqs(res.data.requirements);
            }
            setRequirements(res.data.requirements);
            setStudentsNum(res.data.studentsNum);
            setIsRequirementsReady(true);
          } else {
            setToast({
              message: "Failed to fetch requirements.",
              icon: "cross",
            });
          }
        })
        .catch((err) => {
          console.log("(Fetch requirements) An error occured.");
          console.error(err);
        });
    }
  }, [requirementsTab, data, startRequirementsRefetch, navigateSubject]);

  useUpdateEffect(() => {
    if (activitiesTab === "upcoming") {
      setUpcomingActivities(null);
    } else if (activitiesTab === "past") {
      setPastActivities(null);
    }

    setStartActivitiesRefetch((prev) => !prev);
  }, [activitiesRefetch, navigateSubject]);

  const getActivitiesEffectRan = useRef(false);

  useEffect(() => {
    console.log("activitiesTab", activitiesTab);
    console.log("data", data);
    console.log("startActivitiesRefetch", startActivitiesRefetch);
    console.log("         ");
    if (getActivitiesEffectRan.current === true || NODE_ENV !== "development") {
      if (data) {
        if (activitiesTab === "upcoming" && upcomingActivities) {
          setActivities(upcomingActivities);
          return;
        } else if (activitiesTab === "past" && pastActivities) {
          setActivities(pastActivities);
          return;
        }
        axios
          .get("/api/v1/activities", {
            params: {
              mode: "previewAll",
              section,
              subject,
              status: activitiesTab,
            },
          })
          .then((res) => {
            if (res.data.success) {
              if (activitiesTab === "upcoming") {
                setUpcomingActivities(res.data.activities);
              } else if (activitiesTab === "past") {
                setPastActivities(res.data.activities);
              }
              setActivities(res.data.activities);
              setStudentsNum(res.data.studentsNum);
              console.log("res.data.activities", res.data.activities);
              setIsActivitiesReady(true);
            } else {
              setToast({
                message: "Failed to fetch activities",
                icon: "cross",
              });
            }
          })
          .catch((err) => {
            console.log("(Fetch activities) An error occured.");
            console.error(err);
          });
      }
    }
    return () => {
      getActivitiesEffectRan.current = true;
    };
  }, [activitiesTab, data, startActivitiesRefetch, navigateSubject]);

  const getStudentsEffectRan = useRef(false);

  useEffect(() => {
    if (getStudentsEffectRan.current === true || NODE_ENV !== "development") {
      if (
        data &&
        ((data.user.role === "admin" && !data.user.nonTeaching) ||
          data.user.role === "student")
      ) {
        axios
          .get("/api/v1/students", {
            params: {
              section,
            },
          })
          .then((res) => {
            if (res.data.success) {
              setStudents(res.data.students);
              setIsStudentsReady(true);
              console.log("students", students);
            } else {
              setToast({
                message: "Failed to fetch students",
                icon: "cross",
              });
            }
          })
          .catch((err) => {
            console.log("(Fetch students) An error occured.");
            console.error(err);
          });
      }
    }
    return () => {
      getStudentsEffectRan.current = true;
    };
  }, [data]);

  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (data) {
      if (data.user.role === "admin") {
        setSubjects(data.user.subjectClasses[section]);
      } else if (data.user.role === "student") {
        setSubjects([subject]);
      }
      setIsLocalDataReady(true);
    }
  }, [data]);

  const contentStyle = "w-full flex flex-col space-y-7 lg:space-y-7";

  return (
    <>
      {isLocalDataReady ? (
        <>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center">
              <h1 className="uppercase text-transparent bg-clip-text bg-gradient-to-l from-purple-200 to-sky-200">
                {section}
              </h1>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {data.user.role === "admin" || data.user.role === "student" ? (
                  <ul className="flex flex-wrap">
                    {subjects.map((subjectItem, i) => (
                      <li key={i} className="mr-2 mt-2">
                        <Button
                          variant="transparent"
                          size="smallResponsive"
                          className={`flex items-center space-x-1 ${
                            subjectItem === subject
                              ? "bg-indigo-100 text-indigo-900 fill-current"
                              : ""
                          }`}
                          onClick={() => {
                            navigate(`/dashboard/${section}/${subjectItem}`);
                            setIsStatusReportOpen(false);
                            setNavigateSubject((prev) => !prev);
                          }}
                        >
                          <span className={``}>
                            {subjectIcons[subjectItem]}
                          </span>
                          <span className="">
                            {
                              data.map.subjects.find(
                                (subj) => subj.value === subjectItem
                              ).name
                            }
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <></>
                )}
              </div>
              {data.subjects ? (
                <div className="self-start mt-2  flex items-center">
                  <span className="mr-2">
                    <FaChalkboardTeacher />
                  </span>
                  {
                    data.subjects.find(
                      (subjectObj) => subjectObj.subject === subject
                    ).subjectTeacher.firstName
                  }{" "}
                  {
                    data.subjects.find(
                      (subjectObj) => subjectObj.subject === subject
                    ).subjectTeacher.lastName
                  }
                  <span></span>
                </div>
              ) : (
                <></>
              )}
            </div>

            {data.user.role === "admin" ? (
              <div className={contentStyle}>
                {/* <div>
                  <h2>Add</h2>
                  <div className="pt-3 flex flex-row flex-wrap">
                    <LinkButton link="/event" name="Event" />
                    <LinkButton link="/achievement" name="Achievement" />
                  </div>
                </div> */}
                <Announcements
                  announcements={announcements}
                  isAnnouncementsReady={isAnnouncementsReady}
                  user={data.user}
                  mode="subjectClass"
                  setRefetch={setAnnouncementsRefetch}
                  params={params}
                />
                <Requirements
                  requirements={requirements}
                  isRequirementsReady={isRequirementsReady}
                  params={params}
                  studentsNum={studentsNum}
                  setRefetch={setRequirementsRefetch}
                  tab={requirementsTab}
                  setTab={setRequirementsTab}
                  isStatusReportOpen={isStatusReportOpen}
                  setIsStatusReportOpen={setIsStatusReportOpen}
                  setRequirements={setRequirements}
                />
                <Activities
                  activities={activities}
                  isActivitiesReady={isActivitiesReady}
                  studentsNum={studentsNum}
                  tab={activitiesTab}
                  setTab={setActivitiesTab}
                  setRefetch={setActivitiesRefetch}
                  params={params}
                  setActivities={setActivities}
                  defaultTab={activitiesTab}
                  isScoresReportOpen={isScoresReportOpen}
                  setIsScoresReportOpen={setIsScoresReportOpen}
                />
                <Students
                  students={students}
                  isStudentsReady={isStudentsReady}
                  section={section}
                />
              </div>
            ) : data.user.role === "student" ? (
              <div className={contentStyle}>
                <Announcements
                  announcements={announcements}
                  isAnnouncementsReady={isAnnouncementsReady}
                  user={data.user}
                  mode="subjectClass"
                  setRefetch={setAnnouncementsRefetch}
                  params={params}
                />
                <Requirements
                  requirements={requirements}
                  isRequirementsReady={isRequirementsReady}
                  params={params}
                  studentsNum={studentsNum}
                  setRefetch={setRequirementsRefetch}
                  tab={requirementsTab}
                  setTab={setRequirementsTab}
                  isStatusReportOpen={isStatusReportOpen}
                />
                <Activities
                  activities={activities}
                  isActivitiesReady={isActivitiesReady}
                  studentsNum={studentsNum}
                  tab={activitiesTab}
                  setTab={setActivitiesTab}
                  params={params}
                  setActivities={setActivities}
                  defaultTab={activitiesTab}
                  isScoresReportOpen={isScoresReportOpen}
                  setIsScoresReportOpen={setIsScoresReportOpen}
                />
                <Students
                  students={students}
                  isStudentsReady={isStudentsReady}
                  section={section}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <PageFallback1 />
      )}
    </>
  );
};

export default SubjectClass;
