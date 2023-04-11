import React from "react";

const Tabs2 = ({ options, stateHandler, state, ...props }) => {
  return (
    <div
      className={`flex w-full items-center justify-around  ${props.className}`}
      role="group"
    >
      {options.map((option, i) => (
        <button
          key={i}
          className={`py-4 ${
            state === option.value
              ? "text-indigo-600 fill-indigo-600 border-b-[0.2rem] border-indigo-600"
              : ""
          } w-1/2 flex space-x-2 items-center justify-center font-base text-gray-700`}
          onClick={() => {
            stateHandler(option.value);
          }}
        >
          {option.icon ? option.icon : ""}
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default Tabs2;
