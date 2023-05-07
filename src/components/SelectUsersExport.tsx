import React, { useState, useEffect } from "react";
import Button from "./Button";
import Table from "./Table";
import { useToast } from "./contexts/ToastContext";
import Loading from "./Loading";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import ExcelJS from "exceljs";
import { capitalizeFirstLetter } from "../utils/utils";

let usersToBeExported: string[] = [];

const options = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const SelectUsersExport = ({ type, section, users, ...props }) => {
  const [userDocs, setUserDocs] = useState([]);
  const [isUsersListReady, setIsUsersListReady] = useState(false);
  const [usersToBeExportedLength, setUsersToBeExportedLength] = useState(0);
  const [render, setRender] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const selectHandler = (event, id: string) => {
    if (event.target.checked) {
      usersToBeExported.push(id);
    } else {
      usersToBeExported.splice(usersToBeExported.indexOf(id), 1);
    }
    setUsersToBeExportedLength(usersToBeExported.length);
    setRender(!render);
  };

  const generateFile = () => {
    setIsProcessing(true);

    axios
      .get("/api/v1/attendance/records", {
        params: {
          userIds: usersToBeExported,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 7000 });

          const attendanceRecords = res.data.attendanceRecords;
          const userDocs = users.filter((obj) =>
            usersToBeExported.includes(obj._id)
          );

          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("First Sheet", {
            views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
          });
          let columns = [{ header: "Student", key: "student", width: 10 }];

          for (let attendanceRecord of attendanceRecords[0].attendance) {
            columns.push({
              header: new Date(attendanceRecord.start).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
              }),
              key: attendanceRecord.start,
              width: 10,
            });
          }

          sheet.columns = columns;

          const studentObjs = userDocs.map((user) => [
            user._id,
            `${user.lastName}, ${user.firstName}`,
          ]);

          const rows = [];

          for (const [studentId, name] of studentObjs) {
            let rowObj = { student: name };
            for (let date of attendanceRecords[0].attendance.map(
              (obj) => obj.start
            )) {
              const attendanceRecord = attendanceRecords.find(
                (obj) => obj.userId === studentId
              );
              console.log("attendanceRecord", attendanceRecord);
              const attendanceDayRecord = attendanceRecord.attendance.find(
                (obj) => obj.start === date
              );

              let recordString = `${capitalizeFirstLetter(
                attendanceDayRecord.title
              )}`;
              if (attendanceDayRecord.time) {
                recordString += ` (${attendanceDayRecord.time})`;
              }

              rowObj[date] = recordString;
            }

            console.log(rowObj);
            rows.push(rowObj);
          }

          sheet.addRows(rows);

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `Attendace Records ${new Date().toLocaleString(
              "en-US",
              options
            )}.xlsx`;
            document.body.appendChild(link);
            link.click();

            URL.revokeObjectURL(url);
          });

          setCustomModal(null);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch attendance records");
        setToast({
          icon: "cross",
          message: "Failed to fetch attendance records",
        });
        console.error(err);
      })
      .finally(() => {
        setUsersToBeExportedLength(0);
        usersToBeExported = [];
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    setUserDocs(users);
    setIsUsersListReady(true);
  }, []);

  return (
    <div className="text-gray-900">
      {isUsersListReady ? (
        <form className="flex flex-col space-y-4 justify-center items-center">
          <h3 className="text-xl font-medium w-full">
            Select Which User Data to Export
          </h3>
          <Table
            headersList={["User", "Select"]}
            itemsList={userDocs.map((userDoc) => {
              return [
                <span>
                  {userDoc.lastName}, {userDoc.firstName}
                </span>,
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  onClick={(event) => selectHandler(event, userDoc._id)}
                />,
              ];
            })}
            className="w-full"
          />
          {isProcessing ? (
            <Loading />
          ) : (
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                generateFile();
              }}
              disabled={usersToBeExportedLength === 0}
              className="w-min"
              size="semiSmall"
            >
              Generate&nbsp;and&nbsp;Download&nbsp;File
            </Button>
          )}
        </form>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default SelectUsersExport;
