import React from "react";

const Spinner = ({ bgColor, ...props }) => {
  return (
    <div className={`w-full flex items-center justify-center`}>
      <div
        className={`w-10 h-10 border-4 border-dashed rounded-full animate-spin ${bgColor}`}
      ></div>
    </div>
  );
};

Spinner.defaultProps = {
  bgColor: "border-sky-400",
};

export default Spinner;
