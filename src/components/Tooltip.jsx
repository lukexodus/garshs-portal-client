import React from "react";

const Tooltip = ({ message, children, ...props }) => {
  return (
    <span
      className={`group relative flex flex-col items-center justify-center p-1 z-10 ${
        props.className && props.className
      }`}
    >
      {children}
      <div className="[transform:perspective(50px)_translateZ(0)_rotateX(10deg)] group-hover:[transform:perspective(0px)_translateZ(0)_rotateX(0deg)] absolute bottom-0 mb-7 origin-bottom rounded text-white opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none min-w-min w-max max-w-[10rem]">
        <div className="flex max-w-md flex-col items-center">
          <div className="rounded bg-gray-900 p-2 text-xs text-center shadow-lg">
            {message}
          </div>
          <div className="clip-bottom h-2 w-4 bg-gray-900"></div>
        </div>
      </div>
    </span>
  );
};

Tooltip.defaultProps = {
  message: "Tooltip Title",
  children: (
    <div className=" cursor-pointer">
      <svg
        aria-haspopup="true"
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-info-circle"
        width={25}
        height={25}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#A0AEC0"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
        <polyline points="11 12 12 12 12 16 13 16" />
      </svg>
    </div>
  ),
};

export default Tooltip;
