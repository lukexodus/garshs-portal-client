import React from "react";
import AccordionReedSections from "./AccordionReedSections";

{
  /* <svg
            data-accordion-icon
            className="w-6 h-6 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
            ></path>
          </svg> */
}

const AccordionSections = ({ sections, ...props }) => {
  return (
    <div
      key={props.i}
      className={`w-full divide-y-[1px] divide-gray-100 divide-opacity-40 ${sections.length === 0 ? '' : 'shadow-md'}`}
    >
      {sections.length === 0 ? <span className="text-sm font-light">There are no students yet here.</span> : <></>}
      {sections.map((section, i) => {
        return (
          <AccordionReedSections
            section={section}
            i={i}
            corners={`${
              i === 0
                ? "rounded-t-xl"
                : i === sections.length - 1
                ? "rounded-b-xl"
                : ""
            }`}
            isLast={i === sections.length - 1}
          />
        );
      })}
    </div>
  );
};

export default AccordionSections;
