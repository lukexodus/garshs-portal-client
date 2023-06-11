import React, { useState, useEffect } from "react";
import Table from "./Table";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import Spinner from "./Spinner";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import CircularProgress from "./CircularProgress";
import Button from "./Button";

let usersToBeUpdatedIds = [];

const RequirementStatusReport = ({
  requirement,
  params,
  setIsStatusReportOpen,
  studentsNum,
  setRefetch,
  ...props
}) => {
  const [requirementDoc, setRequirementDoc] = useState([]);
  const [isRequirementStatusReportReady, setIsRequirementStatusReportReady] =
    useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [usersToBeUpdatedIdsLength, setUsersToBeUpdatedIdsLength] = useState(0);

  const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const deadlineDateTime = new Date(requirement.deadlineDateTime);
  const deadlineDateTimeString = deadlineDateTime.toLocaleString(
    "en-US",
    options
  );

  const { setToast } = useToast();
  const { data } = useData();

  const { section, subject } = params;

  const selectHandler = (event, studentId) => {
    if (event.target.checked) {
      usersToBeUpdatedIds.push(studentId);
    } else {
      usersToBeUpdatedIds.splice(usersToBeUpdatedIds.indexOf(studentId), 1);
    }
    setUsersToBeUpdatedIdsLength(usersToBeUpdatedIds.length);
    setShouldRender(!shouldRender);
  };

  useEffect(() => {
    axios
      .get("/api/v1/requirements", {
        params: {
          mode: "statusReport",
          section,
          subject,
          requirementId: requirement._id,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setRequirementDoc(res.data.requirementDoc);
          setIsRequirementStatusReportReady(true);
        } else {
          setToast({
            message: "Failed to fetch requirement status report",
            icon: "cross",
          });
        }
      })
      .catch((err) => {
        console.log("(Fetch requirement status report) An error occured.");
        console.error(err);
      });
  }, []);

  const setAsPassedHandler = (userIds) => {
    setIsRequirementStatusReportReady(false);

    axios
      .patch(
        "/api/v1/requirements",
        {
          section,
          subject,
          mode: "confirmAsPassed",
          userIds: usersToBeUpdatedIds,
          requirementId: requirement._id,
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
          setIsStatusReportOpen(false);
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setUsersToBeUpdatedIdsLength(0);
        usersToBeUpdatedIds = [];
        setIsRequirementStatusReportReady(true);
      });
  };

  const deleteRequirementHandler = (id) => {
    axios
      .delete("/api/v1/requirements", {
        params: { requirementId: id, section, subject },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({
            message: "Requirement deleted successfully",
            icon: "check",
            lifetime: 5000,
          });
          setIsStatusReportOpen(false);
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: "An error occured", icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("(Delete requirement) An error occured");
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="pt-2 flex items-center justify-start">
        <span
          className="flex items-center group self-start"
          onClick={() => {
            setIsStatusReportOpen(false);
          }}
        >
          <span className="mr-1">
            <IoMdArrowRoundBack size={27} />
          </span>
          <span className="text-lg group-hover:underline">Go back</span>
        </span>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col ">
            <h4 className="text-xl xl:text-2xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] flex-shrink my-0 flex-auto">
              {requirement.requirement}
            </h4>
            <small className="font-extralight">
              Due {deadlineDateTimeString}
            </small>
          </div>
          <span className="mr-3">
            <CircularProgress
              min={0}
              max={studentsNum}
              value={requirement.passedNum}
            />
          </span>
        </div>
        <div className="flex items-end justify-between whitespace-normal">
          <p className="mb-2 text-indigo-100 text-sm lg:text-base">
            {requirement.details}
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        {isRequirementStatusReportReady ? (
          <>
            <Table
              headersList={["Name", "Status", "Attachments", "Select"]}
              itemsList={requirementDoc.statusReport.map((studentStatusObj) => {
                const lastCell =
                  studentStatusObj.passed &&
                  studentStatusObj.confirmedPassed ? (
                    `Confirmed`
                  ) : (
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      onClick={(event) =>
                        selectHandler(event, studentStatusObj._id)
                      }
                    />
                  );

                return [
                  `${studentStatusObj.firstName} ${studentStatusObj.lastName}`,
                  `${
                    studentStatusObj.passed
                      ? studentStatusObj.confirmedPassed
                        ? studentStatusObj.passedDateTime
                          ? `Passed on ${new Date(
                              studentStatusObj.passedDateTime
                            ).toLocaleString("en-US", options)} (${
                              new Date(studentStatusObj.passedDateTime) >
                              new Date(deadlineDateTime)
                                ? `Late`
                                : `On Time`
                            })`
                          : `Passed`
                        : studentStatusObj.passedDateTime
                        ? `Passed on ${new Date(
                            studentStatusObj.passedDateTime
                          ).toLocaleString("en-US", options)} (${
                            new Date(studentStatusObj.passedDateTime) >
                            new Date(deadlineDateTime)
                              ? `Late`
                              : `On Time`
                          }) (Unconfirmed)`
                        : `Passed (Unconfirmed)`
                      : "Not yet passed"
                  }`,
                  <span className="flex flex-col space-y-2">
                    {(!studentStatusObj.files ||
                      studentStatusObj.files.length === 0) &&
                    (!studentStatusObj.links ||
                      studentStatusObj.links.length === 0) ? (
                      <span className="">No attachments</span>
                    ) : (
                      ""
                    )}
                    {studentStatusObj.files &&
                    studentStatusObj.files.length !== 0 ? (
                      <ul className="flex flex-col space-y-2">
                        {studentStatusObj.files.map((filename, i) => (
                          <a
                            href={`/requirements/${data.user.schoolYear}/${section}/${subject}/${filename}`}
                            key={i}
                          >
                            {filename}
                          </a>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                    {studentStatusObj.links &&
                    studentStatusObj.links.length !== 0 ? (
                      <ul className="flex flex-col space-y-2">
                        {studentStatusObj.links.map((link, i) => (
                          <a href={"https://" + link} key={i}>
                            {link}
                          </a>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                  </span>,
                  lastCell,
                ];
              })}
            />
            <div className="flex justify-between">
              <Button
                variant="danger"
                size="small"
                type="button"
                onClick={() => {
                  deleteRequirementHandler(requirement._id);
                }}
                shouldRender={shouldRender}
              >
                Delete Requirement
              </Button>
              <Button
                className=""
                variant="primary"
                size="small"
                type="button"
                onClick={() => {
                  setAsPassedHandler(usersToBeUpdatedIds);
                }}
                disabled={usersToBeUpdatedIdsLength === 0}
                shouldRender={shouldRender}
              >
                Set as passed
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

export default RequirementStatusReport;
