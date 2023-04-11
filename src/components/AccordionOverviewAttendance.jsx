import React from "react";
import AccordionReedOverviewAttendance from "./AccordionReedOverviewAttendance";

const AccordionOverviewAttendance = ({ groups, ...props }) => {
  return (
    <div
      key={props.i}
      className="w-full divide-y-[1px] divide-gray-100 divide-opacity-40 shadow-md"
    >
      {groups.map((group, i) => {
        return (
          <AccordionReedOverviewAttendance
            group={group}
            i={props.i}
            corners={`${
              i === 0
                ? "rounded-t-xl"
                : i === groups.length - 1
                ? "rounded-b-xl"
                : ""
            }`}
            isLast={i === groups.length - 1}
          />
        );
      })}
    </div>
  );
};

export default AccordionOverviewAttendance;
