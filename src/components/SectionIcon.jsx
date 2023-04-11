import React from "react";

const SectionIcon = ({ alpha2, className, ...props }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold  ${className}`}
    >
      {alpha2}
    </div>
  );
};

SectionIcon.defaultProps = {
  className: "text-lg h-10 w-10 text-white bg-indigo-600 hover:bg-indigo-400",
};

export default SectionIcon;
