import React from "react";

const ButtonGroup = ({ options, stateHandler, state }) => {
  return (
    <div className="flex flex-wrap" role="group">
      {options.map((option, i) => (
        <button
          key={i}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semilight sm:font-medium rounded-none ${
            i === 0
              ? "rounded-l-lg"
              : i === options.length - 1
              ? "rounded-r-md"
              : "border-l border-r"
          } border-gray-300 hover:bg-indigo-200 hover:text-indigo-700 focus:z-10 ${
            state === option.value
              ? "bg-indigo-200 text-indigo-700"
              : "text-white bg-indigo-400"
          }`}
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

export default ButtonGroup;
