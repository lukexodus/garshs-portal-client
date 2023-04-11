import ReacAt, { useState, useEffect } from "react";
import useUpdateEffect from "./hooks/useUpdateEffect";
import Loading from "./Loading";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import {
  BsFillCalendarCheckFill,
  BsFillCalendarXFill,
  BsFillCalendarFill,
} from "react-icons/bs";
import ButtonGroup from "./ButtonGroup";
import ScanAttendance from "./ScanAttendance";
import OverviewAttendance from "./OverviewAttendance";
import SettingsAttendance from "./SettingsAttendance";

const options = [
  {
    name: "Overview",
    value: "overview",
  },
  {
    name: "Scan",
    value: "scan",
  },
  {
    name: "Settings",
    value: "settings",
  },
];

const Attendance = () => {
  document.title = `Attendance`;
  const { setToast } = useToast();
  const { data } = useData();
  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  return (
    <>
      {isLocalDataReady ? (
        <div className=" flex items-start justify-center p-8 md:py-12 lg:px-10 2xl:px-14 flex-col space-y-12 text-white">
          <div className="flex flex-col space-y-2 w-full">
            <h1 className="flex space-x-3 md:space-x-5">
              <span className="my-0 py-0">
                <BsFillCalendarCheckFill />
              </span>
              <span>Attendance</span>
            </h1>
            {(data.user.role === "admin" && !data.user.nonTeaching) ||
            data.user.role === "superadmin" ? (
              <ButtonGroup
                options={options}
                stateHandler={setTab}
                state={tab}
              />
            ) : (
              <></>
            )}
          </div>
          {tab === "overview" ? <OverviewAttendance /> : ""}
          {tab === "scan" ? <ScanAttendance /> : ""}
          {tab === "settings" ? <SettingsAttendance /> : ""}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Attendance;
