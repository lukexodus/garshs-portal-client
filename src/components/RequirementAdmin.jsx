import React from "react";
import CircularProgress from "./CircularProgress";

const RequirementAdmin = ({
  requirement,
  studentsNum,
  params,
  setIsStatusReportOpen,
  setRequirement,
  ...props
}) => {
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

  return (
    <div className="mx-auto bg-[#5355e0] shadow-lg rounded-lg h-[calc(100%-1rem)] 2xl:mr-4 2xl:mb-4 px-6 py-5 flex items-start">
      <span className="mr-3">
        <CircularProgress
          min={0}
          max={studentsNum}
          value={requirement.passedNum}
        />
      </span>
      <div className="flex-grow">
        <div className="w-full flex flex-row flex-nowrap justify-between items-center mb-3 ">
          <span className="flex flex-col ">
            <h4 className="text-xl xl:text-2xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] flex-shrink my-0 flex-auto ">
              {requirement.requirement}
            </h4>
            <small className="font-extralight">
              Due {deadlineDateTimeString}
            </small>
          </span>
          <span
            className="group flex items-center self-start pt-[5px] cursor-pointer ml-4"
            onClick={() => {
              setRequirement(requirement);
              setIsStatusReportOpen(true);
            }}
          >
            <span className="text-sm group-hover:underline">Status</span>
            <span className="flex-shrink-0 flex self-start items-center justify-center text-indigo-600 w-8 h-8 rounded-full bg-gradient-to-b from-indigo-50 to-indigo-100 hover:from-white hover:to-indigo-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150 ml-2 cursor-pointer">
              <span className="block font-bold"> -&gt;</span>
            </span>
          </span>
        </div>
        <div className="flex items-end justify-between whitespace-normal">
          <p className="mb-2 text-indigo-100 text-sm lg:text-base">
            {requirement.details}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequirementAdmin;
