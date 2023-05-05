import React, { useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "./contexts/ToastContext";
import { QrcodeScanner } from "./QrcodeScanner";
import axios from "axios";
import { sanitizeString } from "../utils/utils";
import Loading from "./Loading";

const ScanAttendance = () => {
  document.title = `Attendance | Scan`;

  const [lastScannedCode, setLastScannedCode] = useState("");
  const recordedAudioRef = useRef(null);
  const tryAgainAudioRef = useRef(null);

  const { setToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLogsReady, setIsLogsReady] = useState(false);

  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  useEffect(() => {
    axios
      .get("/api/v1/attendance/day", {
        params: {
          // date: currentDate.toLocaleDateString(),
          date: "2023-04-10",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setIsLogsReady(true);
          let users = res.data.users;
          setLogs(
            res.data.records
              .map((record, i) => {
                return {
                  firstName: users.find((user) => user._id === record.userId)
                    .firstName,
                  lastName: users.find((user) => user._id === record.userId)
                    .lastName,
                  time: record.attendance[0].time,
                };
              })
              .sort((a, b) => parseInt(b.time) - parseInt(a.time))
          );
          setUsers(res.data.users);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch attendance records");
        console.error(err);
        setToast({
          message: "Failed to fetch attendance records",
          icon: "cross",
        });
      });
  }, []);

  useEffect(() => {
    if (lastScannedCode) {
      axios
        .patch(
          "/api/v1/attendance/record",
          {
            _id: lastScannedCode,
            status: true,
            date: currentDate,
            time: timeString,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            recordedAudioRef.current.play();
            console.log("res.data", res.data);
            setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
            setLogs([
              {
                firstName: res.data.user.firstName,
                lastName: res.data.user.lastName,
                time: timeString,
              },
              ...logs,
            ]);
          } else {
            tryAgainAudioRef.current.play();
            setToast({ message: res.data.msg, icon: "cross" });
          }
        })
        .catch((error) => {
          console.log("Failed to record attendance");
          console.error(error);
          setToast({ message: "Failed to record attendance", icon: "cross" });
          tryAgainAudioRef.current.play();
        });
    }
  }, [lastScannedCode]);

  const handleCodeScanned = useCallback((code) => {
    setLastScannedCode(code);
  }, []);

  const scannerViewMaxWidth = "max-w-[600px]";
  const scannerView2xlMaxWidth = "2xl:max-w-[600px]";
  const scannerViewWidth = "2xl:w-[600px]";

  return (
    <div className="flex flex-col space-y-8 w-full">
      <div className="flex flex-col space-y-5">
        <h2 className="my-0 py-0">SCAN</h2>
        <div className="">
          <hr className="opacity-40" />
        </div>
      </div>
      <div className={`flex flex-col space-y-3 2xl:flex-row 2xl:space-x-10`}>
        <div
          className={`px-2 py-4 flex-none w-full ${scannerView2xlMaxWidth} `}
        >
          <QrcodeScanner
            onCodeScanned={handleCodeScanned}
            className={`${scannerViewMaxWidth} ${scannerViewWidth}`}
          />
        </div>
        <div className="flex flex-col space-y-3 justify-center 2xl:justify-start w-full flex-auto max-w-[616px] 2xl:max-w-full px-2 py-4">
          <h3>Logs</h3>
          <ul className="flex flex-col space-y-2 w-full divide-y-[1px] divide-gray-300 divide-opacity-30 2xl:justify-start">
            {isLogsReady ? (
              <>
                {logs.length === 0 ? (
                  <span className="font-light">
                    No attendance recorded yet for today
                  </span>
                ) : (
                  <></>
                )}
                {logs.map((log, i) => (
                  <li
                    className="pt-2 flex items-center justify-between"
                    key={i}
                  >
                    <span className="">
                      {log.firstName} {log.lastName}
                    </span>
                    <span className="font-light">{log.time}</span>
                  </li>
                ))}
              </>
            ) : (
              <Loading />
            )}
          </ul>
        </div>
      </div>
      <audio
        ref={recordedAudioRef}
        className="hidden"
        src="/audio/attendanceRecorded.mp3"
      />
      <audio
        ref={tryAgainAudioRef}
        className="hidden"
        src="/audio/pleaseTryAgain.mp3"
      />
    </div>
  );
};

export default ScanAttendance;
