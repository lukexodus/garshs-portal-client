import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import Tooltip from "./Tooltip";
import { useData } from "./contexts/DataContext";
import ExcludeDay from "./ExcludeDay";
import Exclusion from "./Exclusion";
import Button from "./Button";

import { BsCalendar2RangeFill, BsCalendarMinusFill } from "react-icons/bs";
import { MdOutlineRemove } from "react-icons/md";

const SettingsAttendance = () => {
  document.title = `Attendance | Settings`;

  const calendarRef = useRef(null);
  const { setCustomModal } = useCustomModal();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();
  const { data } = useData();

  const [exclusions, setExclusions] = useState([]);

  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");

  const onExclusionAdded = (exclusionObj) => {
    if (calendarRef.current) {
      let calendar = calendarRef.current.getApi();
      calendar.addEvent(exclusionObj);
    }
  };

  const handleDatesSet = (interval) => {
    axios
      .get("/api/v1/attendance/exclusions", {
        params: {
          start: new Date(interval.start).toISOString(),
          end: new Date(interval.end).toISOString(),
        },
      })
      .then((res) => {
        if (res.data.success) {
          setExclusions(res.data.exclusions);
          console.log(res.data.exclusions);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch exclusions");
        console.error(err);
      });
  };

  const refetch = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  };

  const handleExclusionClick = (info) => {
    console.log("info.event.title", info.event.title);
    const exclusion = exclusions.find(
      (exclusionObj) => exclusionObj.title === info.event.title
    );
    console.log("exclusion", exclusion);
    setCustomModal(<Exclusion exclusion={exclusion} refetch={refetch} />);
  };

  const submitRangeSettings = () => {
    console.log("submit range settings");

    if (!fromDay || !toDay) {
      setToast({
        message: "Some of the required fields are empty",
        icon: "cross",
      });
      return;
    }

    if (new Date(fromDay) > new Date(toDay)) {
      setToast({
        message:
          "The 'To' date inputted is earlier than the 'From' date inputted",
        icon: "cross",
      });
      return;
    }

    setToast(null);

    console.log("formState", { fromDay, toDay });

    axios
      .post(
        "/api/v1/attendance/settings",
        { from: fromDay, to: toDay },
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
        console.error(err);
        setToast({ message: "An error occured", icon: "cross" });
      });
  };

  useEffect(() => {
    axios
      .get("/api/v1/attendance/settings")
      .then((res) => {
        if (res.data.success) {
          console.log("res.data.range", res.data?.range);
          if (res.data.range) {
            setFromDay(
              new Date(res.data.range.start).toISOString().slice(0, 10)
            );
            setToDay(new Date(res.data.range.end).toISOString().slice(0, 10));
          }
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Error fetching attendance settings");
        setToast({ message: "An error occured", icon: "cross" });
        console.error(err);
      });
  }, []);

  return (
    <div className="flex flex-col space-y-8 w-full">
      <div className="flex flex-col space-y-5">
        <h2 className="my-0 py-0">SETTINGS</h2>
        <div className="">
          <hr className="opacity-40" />
        </div>
      </div>
      <div className="flex flex-col space-y-16">
        <div className="flex flex-col space-y-5 rounded-lg border-indigo-300 border-opacity-50 border-2 p-5 lg:p-6 xl:p-8 shadow-lg max-w-sm self-center w-full 3xl:self-start">
          <h2 className="flex items-center  justify-between">
            <span className="flex items-center flex-none">
              <span className="mr-3 ">
                <BsCalendar2RangeFill />
              </span>
              <span className="mr-1">Range</span>
              <Tooltip
                message="Select the duration within which attendance is tracked."
                className="font-light"
              />
            </span>

            <Button
              variant="primary"
              size="small"
              className="h-min"
              onClick={() => {
                setPopupModal({
                  message: "Update range settings?",
                  primary: "Update",
                  handler: () => {
                    submitRangeSettings();
                  },
                });
              }}
            >
              Save
            </Button>
          </h2>
          <div className="">
            <hr className="opacity-40" />
          </div>
          <div className="flex flex-wrap justify-between  ">
            <div className="flex flex-col space-y-2 mr-10 mb-3">
              <span className="flex space-x-1 items-center justify-between">
                <label>From </label>
                <Tooltip
                  message={
                    <>
                      Ex.
                      <br />
                      The first day of classes
                    </>
                  }
                  className="font-light"
                />
              </span>
              <input
                id="fromDay"
                name="fromDay"
                type="date"
                onChange={(exclusion) => {
                  setFromDay(exclusion.target.value);
                }}
                value={fromDay}
                className="transition ease-in-out duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[9rem] p-[0.625rem]"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <span className="flex space-x-1 items-center justify-between">
                <label>To </label>
                <Tooltip
                  message={
                    <>
                      Ex.
                      <br />
                      The day before the closing day
                    </>
                  }
                  className="font-light"
                />
              </span>
              <input
                id="toDay"
                name="toDay"
                type="date"
                onChange={(exclusion) => {
                  setToDay(exclusion.target.value);
                }}
                value={toDay}
                className="transition ease-in-out duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[9rem] p-[0.625rem]"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-5 ">
          <div className="flex items-center justify-between px-5 lg:px-6 xl:px-8">
            <h2 className=" flex items-center">
              <span className="mr-3">
                <BsCalendarMinusFill />
              </span>
              <span className="mr-1">Blacklist</span>
              <Tooltip
                message="Select which days are excluded for the tracking of attendance (Suspended classes, holidays, etc.). Attendance will not be tracked during Saturdays and Sundays so you don't have to blacklist them. "
                className="font-light"
              />
            </h2>
            {(data.user.role === "admin" && !data.user.nonTeaching) ||
            data.user.role === "superadmin" ? (
              <span
                className="flex items-center hover:underline"
                onClick={() => {
                  setCustomModal(
                    <ExcludeDay onExclusionAdded={onExclusionAdded} />
                  );
                }}
              >
                <MdOutlineRemove size={20} />
                <h5 className="my-0">Exclude Day/s</h5>
              </span>
            ) : (
              <></>
            )}
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={exclusions}
            datesSet={(interval) => handleDatesSet(interval)}
            eventClick={handleExclusionClick}
            displayEventTime={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsAttendance;
