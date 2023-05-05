import React, { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import Table from "./Table";
import Button from "./Button";
import Loading from "./Loading";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { average } from "../utils/utils";
import { usePopupModal } from "./contexts/PopupModalContext";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [`q${action.quarterNum}`]: {
          ...state[`q${action.quarterNum}`],
          [action.subject]: action.grade,
        },
      };
    default:
      return state;
  }
};

const ReportCard = () => {
  document.title = `Report Card`;

  const { _id, section } = useParams();
  const { data } = useData();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();
  const [isGradesReady, setIsGradesReady] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isSubjectsReady, setIsSubjectsReady] = useState(false);
  const [firstSemSubjects, setFirstSemSubjects] = useState([]);
  const [secondSemSubjects, setSecondSemSubjects] = useState([]);
  const [student, setStudent] = useState(null);
  const [adviser, setAdviser] = useState(null);

  const [isLocalDataReady, setIsLocalDataReady] = useState(false);

  const cellInputStyle =
    "transition ease-in-out duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[4.5rem] p-[0.625rem]";

  useEffect(() => {
    axios
      .get("/api/v1/subjects", {
        params: {
          section,
          _id,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setIsSubjectsReady(true);
          setSubjects(res.data.subjects);
          setStudent(res.data.student);
          setAdviser(res.data.adviser);
          console.log("res.data.student", res.data.student);
          console.log("res.data.subjects", res.data.subjects);
        } else {
          setToast({
            message: "Failed to fetch subjects",
            icon: "cross",
          });
        }
      })
      .catch((err) => {
        console.log("(Fetch subjects) An error occured.");
        console.error(err);
      });
  }, []);

  const [gradesState, dispatch] = useReducer(inputReducer, {});

  const setStudentGrade = (quarterNum, subject, grade) => {
    dispatch({ type: "CHANGE", quarterNum, subject, grade });
  };

  useUpdateEffect(() => {
    if (isSubjectsReady) {
      axios
        .get("/api/v1/report-card", {
          params: {
            _id,
            section,
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log("grades res.data", res.data);
            let firstSemSubjectsList = [];
            let secondSemSubjectsList = [];
            for (const subject of subjects) {
              if (
                subject.semesters.includes(1) &&
                subject.semesters.includes(2)
              ) {
                firstSemSubjectsList.push(subject.subject);
                secondSemSubjectsList.push(subject.subject);
              } else if (subject.semesters.includes(1)) {
                firstSemSubjectsList.push(subject.subject);
              } else if (subject.semesters.includes(2)) {
                secondSemSubjectsList.push(subject.subject);
              }
            }
            setFirstSemSubjects(firstSemSubjectsList);
            setSecondSemSubjects(secondSemSubjectsList);
            if (res.data.reportCard) {
              for (const quarterNum of [1, 2]) {
                for (const subject of firstSemSubjectsList) {
                  setStudentGrade(
                    quarterNum,
                    subject,
                    res.data.reportCard[`q${quarterNum}`][subject]
                  );
                }
              }
              for (const quarterNum of [3, 4]) {
                for (const subject of secondSemSubjectsList) {
                  setStudentGrade(
                    quarterNum,
                    subject,
                    res.data.reportCard[`q${quarterNum}`][subject]
                  );
                }
              }
              console.log("grades from db fetched");
            } else {
              console.log("no stored grades");
              for (const quarterNum of [1, 2]) {
                for (const subject of firstSemSubjectsList) {
                  setStudentGrade(quarterNum, subject, 0);
                }
              }
              for (const quarterNum of [3, 4]) {
                for (const subject of secondSemSubjectsList) {
                  setStudentGrade(quarterNum, subject, 0);
                }
              }
            }
            setIsGradesReady(true);
          } else {
            setToast({
              message: res.data.msg,
              icon: "cross",
            });
          }
        })
        .catch((err) => {
          console.log("(Fetch student grades) An error occured.");
          console.error(err);
        });
    }
  }, [isSubjectsReady]);

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  const [q1FinalGrade, setQ1FinalGrade] = useState(0);
  const [q2FinalGrade, setQ2FinalGrade] = useState(0);
  const [q3FinalGrade, setQ3FinalGrade] = useState(0);
  const [q4FinalGrade, setQ4FinalGrade] = useState(0);
  const [firstSemFinalGrade, setFirstSemFinalGrade] = useState(0);
  const [secondSemFinalGrade, setSecondSemFinalGrade] = useState(0);
  const [finalGrade, setFinalGrade] = useState(0);

  const [isQ1Initialized, setIsQ1Initialized] = useState(false);
  const [isQ2Initialized, setIsQ2Initialized] = useState(false);
  const [isQ3Initialized, setIsQ3Initialized] = useState(false);
  const [isQ4Initialized, setIsQ4Initialized] = useState(false);

  const [firstSemSubjectsExistsState, setFirstSemSubjectsExistsState] =
    useState(false);
  const [secondSemSubjectsExistsState, setSecondSemSubjectsExistsState] =
    useState(false);

  useUpdateEffect(() => {
    if (isGradesReady) {
      let q1Initialized;
      let q2Initialized;
      let q3Initialized;
      let q4Initialized;
      let firstSemFinalGradeNum;
      let secondSemFinalGradeNum;

      const firstSemSubjectsExist = Boolean(gradesState.q1);
      const secondSemSubjectsExist = Boolean(gradesState.q3);
      setFirstSemSubjectsExistsState(firstSemSubjectsExist);
      setSecondSemSubjectsExistsState(secondSemSubjectsExist);

      if (firstSemSubjectsExist) {
        let q1Grades = [];
        let q2Grades = [];
        for (const firstSemSubject of Object.keys(gradesState.q1)) {
          q1Grades.push(
            gradesState.q1[firstSemSubject]
              ? gradesState.q1[firstSemSubject]
              : 0
          );
          q2Grades.push(
            gradesState.q2[firstSemSubject]
              ? gradesState.q2[firstSemSubject]
              : 0
          );
        }
        const q1Average = average(q1Grades);
        const q2Average = average(q2Grades);
        q1Initialized = !q1Grades.every((value) => value === 0);
        q2Initialized = !q2Grades.every((value) => value === 0);
        setIsQ1Initialized(q1Initialized);
        setIsQ2Initialized(q2Initialized);
        setQ1FinalGrade(q1Average);
        setQ2FinalGrade(q2Average);

        if (q1Initialized && q2Initialized) {
          firstSemFinalGradeNum = Number(
            average([q1Average, q2Average]).toFixed(2)
          );
          setFirstSemFinalGrade(firstSemFinalGradeNum);
        }
      }

      if (secondSemSubjectsExist) {
        let q3Grades = [];
        let q4Grades = [];
        for (const secondSemSubject of Object.keys(gradesState.q3)) {
          q3Grades.push(
            gradesState.q3[secondSemSubject]
              ? gradesState.q3[secondSemSubject]
              : 0
          );
          q4Grades.push(
            gradesState.q4[secondSemSubject]
              ? gradesState.q4[secondSemSubject]
              : 0
          );
        }

        const q3Average = average(q3Grades);
        const q4Average = average(q4Grades);
        q3Initialized = !q3Grades.every((value) => value === 0);
        q4Initialized = !q4Grades.every((value) => value === 0);
        setIsQ3Initialized(q3Initialized);
        setIsQ4Initialized(q4Initialized);
        setQ3FinalGrade(q3Average);
        setQ4FinalGrade(q4Average);

        if (q3Initialized && q4Initialized) {
          secondSemFinalGradeNum = Number(
            average([q3Average, q4Average]).toFixed(2)
          );
          setSecondSemFinalGrade(secondSemFinalGradeNum);
        }
      }

      if (
        firstSemSubjectsExist &&
        secondSemSubjectsExist &&
        q1Initialized &&
        q2Initialized &&
        q3Initialized &&
        q4Initialized
      ) {
        setFinalGrade(average([firstSemFinalGradeNum, secondSemFinalGradeNum]));
      }
    }
  }, [isGradesReady, gradesState]);

  const submitReportCardHandler = () => {
    if (
      firstSemSubjectsExistsState &&
      secondSemSubjectsExistsState &&
      finalGrade
    ) {
      gradesState.finalGrade = finalGrade;
    }

    if (firstSemSubjectsExistsState) {
      if (firstSemFinalGrade) {
        gradesState.firstSemFinalGrade = firstSemFinalGrade;
      }

      if (q1FinalGrade) {
        gradesState.q1FinalGrade = q1FinalGrade;
      }

      if (q2FinalGrade) {
        gradesState.q2FinalGrade = q2FinalGrade;
      }
    }

    if (secondSemSubjectsExistsState) {
      if (secondSemFinalGrade) {
        gradesState.secondSemFinalGrade = secondSemFinalGrade;
      }

      if (q3FinalGrade) {
        gradesState.q3FinalGrade = q3FinalGrade;
      }
      if (q4FinalGrade) {
        gradesState.q4FinalGrade = q4FinalGrade;
      }
    }

    axios
      .post(
        "/api/v1/report-card",
        { studentId: _id, section, reportCard: gradesState },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("(Submit report card) An error occured.");
        console.error(err);
        setToast({ message: "An error occured", icon: "cross" });
      });
  };

  return (
    <div className="flex items-center justify-center pt-2 pb-16 xl:pt-0 flex-col space-y-7 md:space-y-9">
      {isLocalDataReady && isGradesReady && isSubjectsReady ? (
        <>
          <div className="flex items-center justify-center flex-col">
            <h1 className="mb-[0.4rem] md:mb-3">Report Card</h1>
            <div className="flex space-x-3 items-center">
              <h2 className="text-bg-gray-200 my-1 font-semibold text-2xl underline underline-offset-4 decoration-2 decoration-indigo-400">
                {student.firstName} {student.lastName}
              </h2>
              <span className="rounded-full px-[0.54rem] py-[0.18rem] text-base bg-indigo-400 w-max text-white font-semibold h-min">
                {data.map.sections.find((obj) => obj.value === section).name}
              </span>
            </div>
          </div>
          {(data.user.role === "student" && data.user._id === _id) ||
          data.user.role === "superadmin" ||
          (adviser &&
            data.user.role === "admin" &&
            !data.user.nonTeaching &&
            data.user._id !== adviser._id) ? (
            <div className="w-full flex flex-col space-y-12">
              {firstSemSubjectsExistsState ? (
                <div className="flex flex-col space-y-6">
                  <h3 className="my-1">1st Semester</h3>
                  <Table
                    headersList={["Subject", "Q1", "Q2"]}
                    itemsList={[...firstSemSubjects, { subject: "FINAL" }].map(
                      (subject, i) => {
                        if (i === firstSemSubjects.length) {
                          return [
                            "FINAL",
                            <span>{Number(q1FinalGrade.toFixed(2))}</span>,
                            <span>{Number(q2FinalGrade.toFixed(2))}</span>,
                          ];
                        }
                        return [
                          <span className="">
                            {
                              data.map.subjects.find(
                                (obj) => obj.value === subject
                              ).name
                            }
                          </span>,
                          gradesState.q1[subject] ? gradesState.q1[subject] : 0,
                          gradesState.q2[subject] ? gradesState.q2[subject] : 0,
                        ];
                      }
                    )}
                    className="w-full"
                  />
                  {isQ1Initialized && isQ2Initialized ? (
                    <span>
                      1st Semester Final Grade: <b>{firstSemFinalGrade}</b>
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div>No subjects yet for the first semester</div>
              )}
              {secondSemSubjectsExistsState ? (
                <div className="flex flex-col space-y-6">
                  <h3 className="my-1">2nd Semester</h3>
                  <Table
                    headersList={["Subject", "Q3", "Q4"]}
                    itemsList={[...secondSemSubjects, { subject: "FINAL" }].map(
                      (subject, i) => {
                        if (i === secondSemSubjects.length) {
                          return [
                            "FINAL",
                            <span>{Number(q3FinalGrade.toFixed(2))}</span>,
                            <span>{Number(q4FinalGrade.toFixed(2))}</span>,
                          ];
                        }
                        return [
                          data.map.subjects.find((obj) => obj.value === subject)
                            .name,
                          gradesState.q3[subject] ? gradesState.q3[subject] : 0,
                          gradesState.q4[subject] ? gradesState.q4[subject] : 0,
                        ];
                      }
                    )}
                    className="w-full"
                  />
                  {isQ3Initialized && isQ4Initialized ? (
                    <span>
                      2nd Semester Final Grade: <b>{secondSemFinalGrade}</b>
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div>No subjects yet for the second semester</div>
              )}

              {isQ1Initialized &&
              isQ2Initialized &&
              isQ3Initialized &&
              isQ4Initialized ? (
                <div>
                  <h3>Final Grade: {finalGrade}</h3>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : data.user.role === "admin" && !data.user.nonTeaching ? (
            <div className="w-full flex flex-col space-y-12">
              {firstSemSubjectsExistsState ? (
                <div className="flex flex-col space-y-6">
                  <h3 className="my-1">1st Semester</h3>
                  <Table
                    headersList={["Subject", "Q1", "Q2"]}
                    itemsList={[...firstSemSubjects, { subject: "FINAL" }].map(
                      (subject, i) => {
                        if (i === firstSemSubjects.length) {
                          return [
                            "FINAL",
                            <span>{Number(q1FinalGrade.toFixed(2))}</span>,
                            <span>{Number(q2FinalGrade.toFixed(2))}</span>,
                          ];
                        }
                        return [
                          <span className="">
                            {
                              data.map.subjects.find(
                                (obj) => obj.value === subject
                              ).name
                            }
                          </span>,
                          <input
                            id={`q1_${subject}`}
                            name={`q1_${subject}`}
                            type="number"
                            onChange={(event) => {
                              setStudentGrade(
                                1,
                                subject,
                                parseInt(event.target.value)
                              );
                            }}
                            value={
                              gradesState.q1[subject]
                                ? gradesState.q1[subject] > 0
                                  ? gradesState.q1[subject]
                                  : 0
                                : 0
                            }
                            className={cellInputStyle}
                          />,
                          <input
                            id={`q2_${subject}`}
                            name={`q2_${subject}`}
                            type="number"
                            onChange={(event) => {
                              setStudentGrade(
                                2,
                                subject,
                                parseInt(event.target.value)
                              );
                            }}
                            value={
                              gradesState.q2[subject]
                                ? gradesState.q2[subject] > 0
                                  ? gradesState.q2[subject]
                                  : 0
                                : 0
                            }
                            className={cellInputStyle}
                          />,
                        ];
                      }
                    )}
                    className="w-full"
                  />
                  {isQ1Initialized && isQ2Initialized ? (
                    <span>
                      1st Semester Final Grade: <b>{firstSemFinalGrade}</b>
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div>No subjects yet for the first semester</div>
              )}
              {secondSemSubjectsExistsState ? (
                <div className="flex flex-col space-y-6">
                  <h3 className="my-1">2nd Semester</h3>
                  <Table
                    headersList={["Subject", "Q3", "Q4"]}
                    itemsList={[...secondSemSubjects, { subject: "FINAL" }].map(
                      (subject, i) => {
                        if (i === secondSemSubjects.length) {
                          return [
                            "FINAL",
                            <span>{Number(q3FinalGrade.toFixed(2))}</span>,
                            <span>{Number(q4FinalGrade.toFixed(2))}</span>,
                          ];
                        }
                        return [
                          data.map.subjects.find((obj) => obj.value === subject)
                            .name,
                          <input
                            id={`q3_${subject}`}
                            name={`q3_${subject}`}
                            type="number"
                            onChange={(event) => {
                              setStudentGrade(
                                3,
                                subject,
                                parseInt(event.target.value)
                              );
                            }}
                            value={
                              gradesState.q3[subject]
                                ? gradesState.q3[subject] > 0
                                  ? gradesState.q3[subject]
                                  : 0
                                : 0
                            }
                            className={cellInputStyle}
                          />,
                          <input
                            id={`q4_${subject}`}
                            name={`q4_${subject}`}
                            type="number"
                            onChange={(event) => {
                              setStudentGrade(
                                4,
                                subject,
                                parseInt(event.target.value)
                              );
                            }}
                            value={
                              gradesState.q4[subject]
                                ? gradesState.q4[subject] > 0
                                  ? gradesState.q4[subject]
                                  : 0
                                : 0
                            }
                            className={cellInputStyle}
                          />,
                        ];
                      }
                    )}
                    className="w-full"
                  />
                  {isQ3Initialized && isQ4Initialized ? (
                    <span>
                      2nd Semester Final Grade: <b>{secondSemFinalGrade}</b>
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div>No subjects yet for the second semester</div>
              )}

              {isQ1Initialized &&
              isQ2Initialized &&
              isQ3Initialized &&
              isQ4Initialized ? (
                <div>
                  <h3>Final Grade: {finalGrade}</h3>
                </div>
              ) : (
                <></>
              )}
              <div className="flex items-center justify-center w-full">
                <Button
                  variant="primary"
                  type="button"
                  onClick={() =>
                    setPopupModal({
                      message: `Update ${student.firstName} ${student.lastName}'s report card?`,
                      primary: "Update",
                      handler: () => {
                        submitReportCardHandler();
                      },
                    })
                  }
                  className="h-min"
                >
                  Update Report Card
                </Button>
              </div>
            </div>
          ) : (
            <span className="text-center font-bold text-2xl text-red-300 flex flex-col space-y-1">
              Unauthorized
              <br />
              {data.user.role === "student" ? (
                <span className="text-white text-sm font-light">
                  You can't see other students' report cards
                </span>
              ) : (
                ""
              )}
            </span>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ReportCard;
