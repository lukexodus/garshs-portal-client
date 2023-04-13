import React, { useEffect, useState, Suspense, lazy } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useCustomModal } from "./contexts/CustomModalContext";
import Spinner from "./Spinner";
import ButtonGroup from "./ButtonGroup";
import { useData } from "./contexts/DataContext";
import AddActivity from "./AddActivity";
import ActivityAdmin from "./ActivityAdmin";
import ActivityStudent from "./ActivityStudent";
// import ActivitiesScoresReport from "./ActivitiesScoresReport";

const ActivitiesScoresReport = lazy(() => import("./ActivitiesScoresReport"));

import { BiBookReader } from "react-icons/bi";

const tabs = [
  {
    name: "Upcoming",
    value: "upcoming",
  },
  {
    name: "Past",
    value: "past",
  },
];

const Activities = ({
  activities,
  isActivitiesReady,
  studentsNum,
  tab,
  setTab,
  setRefetch,
  params,
  isScoresReportOpen,
  setIsScoresReportOpen,
  setActivities,
  ...props
}) => {
  const { setCustomModal } = useCustomModal();
  const { data } = useData();
  const user = data.user;
  const [activity, setActivitiy] = useState({});

  // useEffect(() => {
  //   console.log("isActivitiesReady", isActivitiesReady);
  // }, [isActivitiesReady]);

  return (
    <div
      className={`flex flex-col space-y-2 ${
        props.className && props.className
      } border-indigo-300 border-opacity-50 border-2 p-4 sm:p-5 lg:p-6 xl:p-8 shadow-lg rounded-lg`}
    >
      <div className="flex justify-between flex-wrap">
        <h2 className="pr-12 flex items-center">
          <span className="mr-3">
            <BiBookReader />
          </span>
          <span>Activities</span>
        </h2>
        {user.role === "admin" && !user.nonTeaching ? (
          <span
            className="flex items-center hover:underline"
            onClick={() => {
              setCustomModal(
                <AddActivity
                  setRefetch={setRefetch}
                  params={params}
                  setIsScoresReportOpen={setIsScoresReportOpen}
                />
              );
            }}
          >
            <MdOutlineAdd size={20} className="text-white" />
            <h5 className="my-0">Add Activity</h5>
          </span>
        ) : (
          <></>
        )}
      </div>

      {!isScoresReportOpen ? (
        <div className="py-2">
          <ButtonGroup options={tabs} stateHandler={setTab} state={tab} />
        </div>
      ) : (
        <></>
      )}

      <div className={`${isScoresReportOpen ? "hidden" : ""}`}>
        {isActivitiesReady ? (
          activities.length !== 0 ? (
            <div className="flex flex-col items-center justify-center">
              <ul
                className={`flex flex-col space-y-3 2xl:space-y-0 2xl:grid 2xl:grid-cols-2 2xl:gap-4 w-full h-full`}
              >
                {activities.map((activityObj, i) => (
                  <li key={i} className="w-full h-full relative group ">
                    {user.role === "admin" ? (
                      <ActivityAdmin
                        activity={activityObj}
                        studentsNum={studentsNum}
                        params={params}
                        setIsScoresReportOpen={setIsScoresReportOpen}
                        setActivity={setActivitiy}
                        activities={activities}
                        setActivities={setActivities}
                      />
                    ) : (
                      <ActivityStudent
                        activity={activityObj}
                        studentsNum={studentsNum}
                        params={params}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <span>No {tab} activities</span>
          )
        ) : (
          <Spinner />
        )}
      </div>
      {isScoresReportOpen ? (
        <Suspense fallback={<Spinner />}>
          <ActivitiesScoresReport
            activity={activity}
            params={params}
            studentsNum={studentsNum}
            setIsScoresReportOpen={setIsScoresReportOpen}
            setRefetch={setRefetch}
          />
        </Suspense>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Activities;
