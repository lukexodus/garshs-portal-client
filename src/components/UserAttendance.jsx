import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCustomModal } from "./contexts/CustomModalContext";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { useParams } from "react-router-dom";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import axios from "axios";
import Loading from "./Loading";
import Avatar from "./Avatar";
import { capitalizeFirstLetter } from "../utils/utils";
import EditAttendanceRecord from "./EditAttendanceRecord";

const UserAttendance = () => {
  const { _id } = useParams();
  const { setToast } = useToast();
  const { data } = useData();
  const { setCustomModal } = useCustomModal();
  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [isUserDataReady, setIsUserDataReady] = useState(false);
  const [user, setUser] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const calendarRef = useRef(null);

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  useEffect(() => {
    axios
      .get("/api/v1/users/user", {
        params: {
          _id,
          fields: [
            "firstName",
            "lastName",
            "hasProfilePic",
            "ext",
            "section",
            "adviseeSection",
            "alpha2",
          ],
        },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          document.title = `${res.data.user.firstName}'s Attendance Records`;
          console.log("res.data.user", res.data.user);
          setIsUserDataReady(true);
        } else {
          setToast({ icon: "cross", message: res.data.msg });
        }
      })
      .catch((err) => {
        setToast({ icon: "cross", message: "An error occured" });
        console.error(err);
        console.log("Failed to fetch user data");
      });
  }, []);

  const handleDatesSet = (interval) => {
    axios
      .get("/api/v1/attendance/", {
        params: {
          start: new Date(interval.start).toISOString(),
          end: new Date(interval.end).toISOString(),
          _id,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setAttendanceRecords(
            res.data.attendanceRecords[0].attendance.map((record) => {
              return { ...record, title: capitalizeFirstLetter(record.title) };
            })
          );
          console.log("res.data.attendanceRecords", res.data.attendanceRecords);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch attendance records");
        console.error(err);
      });
  };

  const refetch = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  };

  const handleDayClick = (info) => {
    console.log("info.event", info.event);
    const startDate = new Date(info.event.startStr);
    const startDateAfter = new Date(startDate);
    const startDateBefore = new Date(startDate);
    startDateAfter.setDate(startDateAfter.getDate() + 1);
    startDateBefore.setDate(startDateBefore.getDate() - 1);
    const record = attendanceRecords.find(
      (recordObj) =>
        startDateBefore < new Date(recordObj.start) &&
        new Date(recordObj.start) < startDateAfter
    );

    console.log("record", record);
    setCustomModal(<EditAttendanceRecord record={record} _id={_id} />);
  };

  return (
    <>
      {isLocalDataReady && isUserDataReady ? (
        <div className="bg-white rounded-lg text-indigo-500 p-7 m-4 lg:p-12 shadow flex flex-col space-y-7">
          <div className=" flex space-x-4 lg:space-x-6 items-center">
            <Avatar user={{ ...user, _id }} size={10} path="/user/" />
            <span className="flex flex-col space-y-1">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-l from-purple-500 to-sky-600 my-1">
                {user.firstName} {user.lastName}
              </h1>
              {user.section || user.adviseeSection ? (
                <span className="rounded-full px-3 py-1 text-base bg-indigo-400 w-max text-white font-semibold">
                  {user.section
                    ? data.map.sections.find(
                        (sectionObj) => sectionObj.value === user.section
                      ).name
                    : data.map.sections.find(
                        (sectionObj) => sectionObj.value === user.adviseeSection
                      ).name}
                </span>
              ) : (
                <></>
              )}
            </span>
          </div>
          <div className="">
            <hr />
          </div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-center font-bold underline underline-offset-4 decoration-3 decoration-blue-400">
              Attendance Records
            </h2>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={attendanceRecords}
              datesSet={(interval) => handleDatesSet(interval)}
              eventClick={handleDayClick}
              displayEventTime={false}
            />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UserAttendance;
