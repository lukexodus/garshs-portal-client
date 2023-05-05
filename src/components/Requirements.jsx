import React, { useState, lazy, Suspense } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useCustomModal } from "./contexts/CustomModalContext";
import AddRequirement from "./AddRequirement";
import RequirementAdmin from "./RequirementAdmin";
import RequirementStudent from "./RequirementStudent";
import Spinner from "./Spinner";
import ButtonGroup from "./ButtonGroup";
import { useData } from "./contexts/DataContext";

import { BsCardChecklist } from "react-icons/bs";
import { BiExport } from "react-icons/bi";

const RequirementStatusReport = lazy(() => import("./RequirementStatusReport"));
import SelectRequirementsExport from "./SelectRequirementsExport";

const adminTabs = [
  {
    name: "Incomplete",
    value: "incomplete",
  },
  {
    name: "Completed",
    value: "completed",
  },
];

const studentTabs = [
  {
    name: "Unfinished",
    value: "unfinished",
  },
  {
    name: "Finished",
    value: "finished",
  },
];

const Requirements = ({
  requirements,
  isRequirementsReady,
  studentsNum,
  tab,
  setTab,
  setRefetch,
  params,
  isStatusReportOpen,
  setIsStatusReportOpen,
  setRequirements,
  ...props
}) => {
  const { data } = useData();
  const { setCustomModal } = useCustomModal();
  const user = data.user;
  const [requirement, setRequirement] = useState({});

  let tabs;
  if (user.role === "admin") {
    tabs = adminTabs;
  } else if (user.role === "student") {
    tabs = studentTabs;
  }

  return (
    <div
      className={`flex flex-col space-y-2 ${
        props.className && props.className
      } border-indigo-300 border-opacity-50 border-2 p-4 sm:p-5 lg:p-6 xl:p-8 shadow-lg rounded-lg`}
    >
      <div className="flex justify-between flex-wrap">
        <h2 className="pr-12 flex items-center">
          <span className="mr-3">
            <BsCardChecklist />
          </span>
          <span>Requirements</span>
        </h2>
        {user.role === "admin" && !user.nonTeaching ? (
          <span className="flex space-x-5 items-center">
            <span
              className="flex items-center hover:underline space-x-1"
              onClick={() => {
                setCustomModal(
                  <SelectRequirementsExport
                    section={params.section}
                    subject={params.subject}
                  />
                );
              }}
            >
              <BiExport size={18} className="text-white" />
              <h5 className="my-0">Export</h5>
            </span>
            <span
              className="flex items-center hover:underline"
              onClick={() => {
                setCustomModal(
                  <AddRequirement
                    setRefetch={setRefetch}
                    params={params}
                    setIsStatusReportOpen={setIsStatusReportOpen}
                  />
                );
              }}
            >
              <MdOutlineAdd size={20} className="text-white" />
              <h5 className="my-0">Add Requirement</h5>
            </span>
          </span>
        ) : (
          <></>
        )}
      </div>

      {!isStatusReportOpen ? (
        <div className="py-2">
          <ButtonGroup options={tabs} stateHandler={setTab} state={tab} />
        </div>
      ) : (
        <></>
      )}

      <div className={`${isStatusReportOpen ? "hidden" : ""}`}>
        {isRequirementsReady ? (
          requirements.length !== 0 ? (
            <div className="flex flex-col items-center justify-center">
              <ul
                className={`flex flex-col space-y-3 2xl:space-y-0 2xl:flex-row 2xl:flex-wrap w-full`}
              >
                {requirements.map((requirement, i) => (
                  <li key={i} className="w-full 2xl:w-1/2 ">
                    {user.role === "admin" ? (
                      <RequirementAdmin
                        requirement={requirement}
                        studentsNum={studentsNum}
                        params={params}
                        setIsStatusReportOpen={setIsStatusReportOpen}
                        setRequirement={setRequirement}
                      />
                    ) : (
                      <RequirementStudent
                        requirement={requirement}
                        studentsNum={studentsNum}
                        params={params}
                        setRefetch={setRefetch}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <span>No {tab} requirements</span>
          )
        ) : (
          <Spinner />
        )}
      </div>
      {isStatusReportOpen ? (
        <Suspense fallback={<Spinner />}>
          <RequirementStatusReport
            requirement={requirement}
            params={params}
            studentsNum={studentsNum}
            setIsStatusReportOpen={setIsStatusReportOpen}
            setRefetch={setRefetch}
          />
        </Suspense>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Requirements;
