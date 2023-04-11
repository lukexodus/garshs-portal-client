import React from "react";
import { RxActivityLog } from "react-icons/rx";
import { FaPencilRuler } from "react-icons/fa";
import CircularProgress from "./CircularProgress";

const ActivityStudent = ({ activity, params, ...props }) => {
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

  // h-[calc(100%-1rem)]

  return (
    <div className="mx-auto bg-[#5355e0] shadow-lg rounded-lg px-6 py-5 flex items-start space-x-3 xl:space-x-4 h-full">
      <div className="h-full flex flex-none py-[4px] xl:mt-[1.2px]">
        {activity.type === "activity" ? (
          <FaPencilRuler className="xl:w-[19px] xl:h-[19px]" />
        ) : activity.type === "exam" ? (
          <RxActivityLog className="xl:w-[19px] xl:h-[19px]" />
        ) : (
          <></>
        )}
      </div>
      <div className="flex-grow flex justify-between">
        <div>
          <div className="w-full flex flex-row flex-nowrap justify-between items-center ">
            <span className="flex flex-col space-y-0">
              <h4 className="text-xl xl:text-2xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] flex-shrink my-0 flex-auto ">
                {activity.activity}
              </h4>
              <small className="font-extralight ml-[1px]">
                {specificDay
                  ? `${startDateTimeString}`
                  : `${startDateTimeString} - ${endDateTimeString}`}
              </small>
            </span>
          </div>
          <div className="flex items-end justify-between whitespace-normal">
            <p className="mb-2 text-indigo-100 text-sm lg:text-base">
              {activity.details}
            </p>
          </div>
        </div>

        {activity.trackScores ? (
          <span className="group flex items-center self-start pt-[5px] ml-7  flex-col space-y-2">
            <CircularProgress
              min={0}
              max={activity.totalScore}
              value={activity.scoresReport[0].score}
            />
            <span className="diagonal-fractions text-xl">
              {activity.scoresReport[0].score}/{activity.totalScore}
            </span>
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ActivityStudent;
