import React, { useState, useReducer, useEffect } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, value: action.val };
    default:
      return state;
  }
};

const Toggle = ({
  id,
  rightLabel,
  leftLabel,
  labelStyle,
  checked,
  disabled = false,
  onInput,
  leftLabelStyle,
  rightLabelStyle,
  defaultValue,
  ...props
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: defaultValue !== undefined ? defaultValue : false,
  });

  useEffect(() => {
    onInput(id, inputState.value);
  }, [id, onInput, inputState.value, checked]);

  const [select, setSelect] = useState(false);

  useEffect(() => {
    if (rightLabel && leftLabel) {
      setSelect(true);
    }
  }, []);

  return (
    <label className="flex items-center">
      {leftLabel ? (
        <span
          className={`mr-3 ${labelStyle} ${
            leftLabelStyle ? leftLabelStyle : ""
          }`}
        >
          {leftLabel}
        </span>
      ) : (
        <></>
      )}
      <span className="relative inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          value={inputState.value}
          className="sr-only peer"
          onChange={(event) => {
            dispatch({ type: "CHANGE", val: event.target.checked });
          }}
          disabled={disabled}
          onClick={props.onClick}
        />
        {/* bg-blue-600 peer-checked:bg-blue-600 */}
        <div
          className={`w-11 h-6  ${
            select
              ? "bg-sky-200 peer-checked:after:border-white after:bg-white after:border-sky-300"
              : "bg-gray-200 peer-checked:bg-blue-600 peer-checked:after:border-white after:bg-white after:border-gray-300 "
          }  rounded-full peer after:content-[''] after:absolute after:top-0.5 ${
            defaultValue
              ? "after:right-[2px] -peer-checked:after:translate-x-full"
              : "after:left-[2px] peer-checked:after:translate-x-full"
          } after:border after:rounded-full after:h-5 after:w-5 after:transition-all `}
        ></div>
      </span>
      {rightLabel ? (
        <span
          className={`ml-3 ${labelStyle} ${
            rightLabelStyle ? rightLabelStyle : ""
          }`}
        >
          {rightLabel}
        </span>
      ) : (
        <></>
      )}
    </label>
  );
};

Toggle.defaultProps = {
  labelStyle: "text-sm font-medium text-gray-900",
};

export default Toggle;
