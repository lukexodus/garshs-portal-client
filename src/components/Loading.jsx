import React from "react";
import Spinner from "./Spinner";

const Loading = ({ bgBehindColor, ...props }) => {
  let color;
  let spinnerColor;
  if (bgBehindColor === "indigo") {
    color =
      "bg-gradient-to-r hover:bg-gradient-to-l from-teal-100 to-sky-100 opacity-80";
    spinnerColor = "border-indigo-400";
  } else if (bgBehindColor === "white") {
    color =
      "bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-sky-400";
    spinnerColor = "border-white";
  }

  return (
    <div className={`flex flex-col items-center justify-center h-full`}>
      {/* <h4
        className={`${color} font-bold tracking-widest bg-clip-text text-transparent`}
      >
        LOADING
      </h4> */}
      <span className={`${color} p-3 rounded-full`}>
        <Spinner bgColor={spinnerColor} />
      </span>
      {/* <h4
        className={`${color} font-bold tracking-widest bg-clip-text text-transparent`}
      >
        PLEASE WAIT
      </h4> */}
    </div>
  );
};

Loading.defaultProps = {
  bgBehindColor: "indigo",
};

export default Loading;
