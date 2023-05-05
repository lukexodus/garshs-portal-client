import React, { useState, useEffect } from "react";
import Button from "./Button";
import Table from "./Table";
import { useToast } from "./contexts/ToastContext";
import Loading from "./Loading";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import ExcelJS from "exceljs";

let activitiesToBeExported: string[] = [];

const options = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const SelectActivitiesExport = ({ section, subject, ...props }) => {
  const [activityDocs, setActivityDocs] = useState([]);
  const [isActivitiesListReady, setIsActivitiesListReady] = useState(false);
  const [activitiesToBeExportedLength, setActivitiesToBeExportedLength] =
    useState(0);
  const [render, setRender] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const selectHandler = (event, id: string) => {
    if (event.target.checked) {
      activitiesToBeExported.push(id);
    } else {
      activitiesToBeExported.splice(activitiesToBeExported.indexOf(id), 1);
    }
    setActivitiesToBeExportedLength(activitiesToBeExported.length);
    setRender(!render);
  };

  const generateFile = () => {
    setIsProcessing(true);

    axios
      .get("/api/v1/activities", {
        params: {
          section,
          subject,
          mode: "scoreReports",
          activityIds: activitiesToBeExported,
        },
      })
      .then((res) => {
        if (res.data.success) {
          const activityDocs = res.data.activityDocs;
          setToast({ message: res.data.msg, icon: "check", lifetime: 7000 });
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("First Sheet", {
            views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
          });
          let columns = [{ header: "Student", key: "student", width: 10 }];

          for (let activity of activityDocs) {
            columns.push({
              header: activity.activity,
              key: activity._id,
              width: 10,
            });
          }

          sheet.columns = columns;

          const studentObjs = activityDocs[0].scoresReport.map((report) => [
            report._id,
            `${report.lastName}, ${report.firstName}`,
          ]);

          const rows = [];

          for (const [studentId, name] of studentObjs) {
            let rowObj = { student: name };
            for (let activityDoc of activityDocs) {
              const studentReport = activityDoc.scoresReport.find(
                (report: string) => report._id === studentId
              );
              rowObj[activityDoc._id] = studentReport.score;
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
            link.download = `Activities ${new Date().toLocaleString(
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
        console.error(err);
      })
      .finally(() => {
        setActivitiesToBeExportedLength(0);
        activitiesToBeExported = [];
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    axios
      .get("/api/v1/activities", {
        params: {
          mode: "list",
          section,
          subject,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setActivityDocs(res.data.activityDocs);
          setIsActivitiesListReady(true);
          console.log("res.data.activityDocs", res.data.activityDocs);
        } else {
          setToast({
            message: "Failed to fetch activities list report",
            icon: "cross",
          });
        }
      })
      .catch((err) => {
        console.log("(Fetch activities list report) An error occured.");
        console.error(err);
      });
  }, []);

  return (
    <div className="text-gray-900">
      {isActivitiesListReady ? (
        <form className="flex flex-col space-y-4 justify-center items-center">
          <h3 className="text-xl font-medium w-full">
            Select Which Activity Data to Export
          </h3>
          {activityDocs.length !== 0 ? (
            <>
              <Table
                headersList={["Activity", "Select"]}
                itemsList={activityDocs.map((activityDoc) => {
                  return [
                    activityDoc.activity,
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      onClick={(event) => selectHandler(event, activityDoc._id)}
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
                  disabled={activitiesToBeExportedLength === 0}
                  className="w-min"
                  size="semiSmall"
                >
                  Generate&nbsp;and&nbsp;Download&nbsp;File
                </Button>
              )}
            </>
          ) : (
            <>No data to be exported</>
          )}
        </form>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default SelectActivitiesExport;
