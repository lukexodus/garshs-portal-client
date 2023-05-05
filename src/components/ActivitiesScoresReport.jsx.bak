import React, { useState, useEffect, useReducer } from "react";
import Table from "./Table";
import { useToast } from "./contexts/ToastContext";
import Spinner from "./Spinner";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import Button from "./Button";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.studentId]: parseInt(action.score) };
    default:
      return state;
  }
};

const ActivitiesScoresReport = ({
  activity,
  params,
  setIsScoresReportOpen,
  studentsNum,
  setRefetch,
  ...props
}) => {
  const [activityDoc, setActivityDoc] = useState([]);
  const [isActivitiesScoresReportReady, setIsActivitiesScoresReportReady] =
    useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const { setToast } = useToast();
  const { section, subject } = params;

  const startDateTime = new Date(activity.startDateTime);
  const endDateTime = new Date(activity.endDateTime);

  const options = { month: "short", day: "numeric" };
  // hour: 'numeric', minute: 'numeric'
  const startDateTimeString = startDateTime.toLocaleString("en-US", options);

  let endDateTimeString;
  let specificDay;

  if (
    startDateTime.getFullYear() === endDateTime.getFullYear() &&
    startDateTime.getMonth() === endDateTime.getMonth() &&
    startDateTime.getDate() === endDateTime.getDate()
  ) {
    specificDay = true;
  } else {
    specificDay = false;
    endDateTimeString = endDateTime.toLocaleString("en-US", options);
  }

  const [scoresState, dispatch] = useReducer(inputReducer, {});

  const setStudentScore = (studentId, score) => {
    console.log(`set score | ${studentId} ${score}`);
    dispatch({ type: "CHANGE", studentId, score });
  };

  let initialScores = {};

  useEffect(() => {
    axios
      .get("/api/v1/activities", {
        params: {
          mode: "scoresReport",
          section,
          subject,
          activityId: activity._id,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setActivityDoc(res.data.activityDoc);
          setIsActivitiesScoresReportReady(true);
          console.log("res.data.activityDoc", res.data.activityDoc);

          for (const studentScoreObj of res.data.activityDoc.scoresReport) {
            setStudentScore(studentScoreObj._id, studentScoreObj.score);
            // initialScores[studentScoreObj._id] = studentScoreObj.score;
          }
        } else {
          setToast({
            message: "Failed to fetch activity scores report",
            icon: "cross",
          });
        }
      })
      .catch((err) => {
        console.log("(Fetch activity scores report) An error occured.");
        console.error(err);
      });
  }, []);

  const submitScores = (userIds) => {
    console.log("submit scores");
    console.log("scoresState", scoresState);
    for (const id of Object.keys(scoresState)) {
      if (scoresState[id] < 0) {
        setToast({
          message: "Score can't be a negative value",
          icon: "cross",
        });
        return;
      }

      if (scoresState[id] > activity.totalScore) {
        setToast({
          message: "Some scores inputted are higher than the total score",
          icon: "cross",
        });
        return;
      }
    }

    axios
      .patch(
        "/api/v1/activities",
        {
          section,
          subject,
          activityId: activity._id,
          scoresState,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 7000 });
          setIsScoresReportOpen(false);
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="pt-2 flex items-center justify-start">
        <span
          className="flex items-center group self-start"
          onClick={() => {
            setIsScoresReportOpen(false);
          }}
        >
          <span className="mr-1">
            <IoMdArrowRoundBack size={27} />
          </span>
          <span className="text-lg group-hover:underline">Go back</span>
        </span>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col ">
          <div className="flex items-center justify-between w-full">
            <h4 className="text-xl xl:text-2xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] flex-shrink my-0 flex-auto">
              {activity.activity}
            </h4>
            <span className="ml-10">Total Score: {activity.totalScore}</span>
          </div>
          <small className="font-extralight">
            {specificDay
              ? `${startDateTimeString}`
              : `${startDateTimeString} - ${endDateTimeString}`}
          </small>
        </div>
        <div className="flex items-end justify-between whitespace-normal">
          <p className="mb-2 text-indigo-100 text-sm lg:text-base">
            {activity.details}
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        {isActivitiesScoresReportReady ? (
          <>
            <Table
              headersList={["Name", "Score"]}
              itemsList={activityDoc.scoresReport.map((studentScoreObj) => {
                return [
                  `${studentScoreObj.firstName} ${studentScoreObj.lastName}`,
                  <input
                    id={studentScoreObj._id}
                    name={studentScoreObj._id}
                    type="number"
                    onChange={(event) => {
                      setStudentScore(studentScoreObj._id, event.target.value);
                    }}
                    value={scoresState[studentScoreObj._id]}
                    className="transition ease-in-out duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[7rem] p-[0.625rem]"
                  />,
                ];
              })}
            />
            <div className="flex justify-between">
              <Button
                className=""
                variant="primary"
                size="small"
                type="button"
                onClick={() => {
                  submitScores();
                }}
                shouldRender={shouldRender}
              >
                Submit scores
              </Button>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default ActivitiesScoresReport;
