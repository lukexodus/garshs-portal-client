import React from "react";
import { HiClipboardCheck, HiBadgeCheck } from "react-icons/hi";
import { useCustomModal } from "./contexts/CustomModalContext";
import PassRequirement from "./PassRequirement";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import axios from "axios";
import EditRequirementAttachments from "./EditRequirementAttachments";


const RequirementStudent = ({
  requirement,
  studentsNum,
  setRefetch,
  params,
  ...props
}) => {
  const options = { month: "short", day: "numeric" };
  // hour: 'numeric', minute: 'numeric'
  const deadlineDateTime = new Date(requirement.deadlineDateTime);
  const deadlineDateTimeString = deadlineDateTime.toLocaleString(
    "en-US",
    options
  );
  const { section, subject } = params;
  const { setCustomModal } = useCustomModal();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();

  const unsubmit = (requirementId) => {
    axios
      .patch(
        "/api/v1/requirements",
        { requirementId, section, subject, mode: "unsubmit" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({
            message: "Requirement unsubmitted",
            icon: "check",
            lifetime: 5000,
          });
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to unsubmit requirement");
        console.error(error);
      });
  };

  return (
    <div className="mx-auto bg-[#5355e0] shadow-lg rounded-lg h-[calc(100%-1rem)] 2xl:mr-4 2xl:mb-4 px-6 py-5 flex flex-col items-start flex-grow space-y-4">
      <div className="w-full flex flex-row flex-nowrap justify-between items-center mb-1 ">
        <span className="flex flex-col ">
          <h4 className="text-xl xl:text-2xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] flex-shrink my-0 flex-auto ">
            {requirement.requirement}
          </h4>
          <small className="font-extralight">
            Due {deadlineDateTimeString}
          </small>
        </span>
        {requirement.statusReport[0].confirmedPassed ? (
          <span className="flex items-center self-start pt-[5px] cursor-pointer ml-4">
            <span className="text-sm">Passed</span>
            <span className="ml-2">
              <HiBadgeCheck className="w-6 h-6" />
            </span>
          </span>
        ) : requirement.statusReport[0].passed ? (
          <span className="flex items-center self-start pt-[5px] cursor-pointer ml-4 pointer-events-none">
            <span className="text-sm w-min sm:w-max md:w-min lg:w-max 2xl:w-min">
              Waiting for confirmation
            </span>
            <span className="ml-2">
              <HiBadgeCheck className="w-6 h-6" />
            </span>
          </span>
        ) : (
          <span
            className="group flex items-center self-start pt-[2px] cursor-pointer hover:underline h-[33px] ml-4"
            onClick={() => {
              setCustomModal(
                <PassRequirement
                  setRefetch={setRefetch}
                  requirementId={requirement._id}
                  userId={requirement.statusReport[0]._id}
                  section={section}
                  subject={subject}
                />
              );
            }}
          >
            <span className="text-sm w-min sm:w-max md:w-min lg:w-max 2xl:w-min">
              Pass requirement
            </span>
            <span className="ml-2">
              <HiClipboardCheck className="w-6 h-6 group-hover:w-7 group-hover:h-7" />
            </span>
          </span>
        )}
      </div>
      <div className="flex items-end justify-between whitespace-normal">
        <p className="mb-2 text-indigo-100 text-sm lg:text-base">
          {requirement.details}
        </p>
      </div>
      {requirement.statusReport[0].passed ? (
        <div className="text-sm lg:text-base self-end">
          <span
            className="opacity-90 hover:opacity-100 hover:underline"
            onClick={() => {
              setCustomModal(
                <EditRequirementAttachments
                  setRefetch={setRefetch}
                  requirementId={requirement._id}
                  section={section}
                  subject={subject}
                />
              );
            }}
          >
            Edit attachments
          </span>{" "}
          |{" "}
          <span
            className="opacity-90 hover:opacity-100 hover:underline"
            onClick={() => {
              setPopupModal({
                handler: () => {
                  unsubmit(requirement._id);
                },
                message: `Are you sure you want to unsubmit your requirement for "${requirement.requirement}"?`,
                primary: "Unsubmit",
              });
            }}
          >
            Unsubmit
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RequirementStudent;
