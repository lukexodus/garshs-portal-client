import React, { useEffect } from "react";
import { useData } from "./contexts/DataContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import axios from "axios";

import { RxActivityLog } from "react-icons/rx";
import { FaPencilRuler } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const ActivityAdmin = ({
  activity,
  studentsNum,
  params,
  setIsScoresReportOpen,
  setActivity,
  setActivities,
  activities,
  ...props
}) => {
  const { data } = useData();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();

  const section = params.section;
  const subject = params.subject;

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

  const deleteActivityHandler = (activityId) => {
    axios
      .delete("/api/v1/activities", {
        params: { _id: activityId, section, subject },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setActivities(
            activities.filter((activityObj) => activityObj._id !== activity._id)
          );
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const bgColor = "bg-[#5355e0]";

  return (
    <>
      <span
        className={`${bgColor} absolute top-5 left-[1.1rem] md:left-[0.906rem] lg:left-[0.93rem] xl:left-[0.75rem] invisible group-hover:visible px-0 py-0 md:px-1 rounded`}
      >
        <MdDeleteForever
          className="w-7 h-7 lg:w-[29px] lg:h-[29px] xl:w-9 xl:h-9 text-red-300 hover:text-red-500"
          onClick={() => {
            setPopupModal({
              message: "Are you sure you want to delete this activity?",
              variant: "danger",
              primary: "Delete",
              handler: () => {
                deleteActivityHandler(activity._id);
              },
            });
          }}
        />
      </span>
      {/* h-[calc(100%-1rem)] */}
      <div
        className={`mx-auto ${bgColor} shadow-lg rounded-lg  px-6 py-5 flex items-start space-x-3 xl:space-x-4 h-full`}
      >
        <div className="h-full flex flex-none py-[4px] xl:mt-[1.2px]">
          {activity.type === "activity" ? (
            <FaPencilRuler className="xl:w-[19px] xl:h-[19px]" />
          ) : activity.type === "exam" ? (
            <RxActivityLog className="xl:w-[19px] xl:h-[19px]" />
          ) : (
            <></>
          )}
        </div>
        <div className="flex-grow">
          <div className="w-full flex flex-row flex-nowrap justify-between items-center mb-3 ">
            <span className="flex flex-col space-y-0">
              <h4 className="text-xl xl:text-2xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] flex-shrink my-0 flex-auto ">
                {activity.activity}
              </h4>
              <small className="font-extralight  ml-[1px]">
                {specificDay
                  ? `${startDateTimeString}`
                  : `${startDateTimeString} - ${endDateTimeString}`}
              </small>
            </span>
            {activity.trackScores ? (
              <span
                className="group flex items-center self-start pt-[5px] cursor-pointer ml-7"
                onClick={() => {
                  setActivity(activity);
                  setIsScoresReportOpen(true);
                }}
              >
                <span className="text-sm group-hover:underline">Scores</span>
                <span className="flex-shrink-0 flex self-start items-center justify-center text-indigo-600 w-8 h-8 rounded-full bg-gradient-to-b from-indigo-50 to-indigo-100 hover:from-white hover:to-indigo-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150 ml-2 cursor-pointer">
                  <span className="block font-bold"> -&gt;</span>
                </span>
              </span>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-end justify-between whitespace-normal">
            <p className="mb-2 text-indigo-100 text-sm lg:text-base">
              {activity.details}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityAdmin;
