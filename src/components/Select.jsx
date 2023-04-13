import React, { useReducer, useEffect } from "react";
import { cls } from "../utils/utils";

const classes = {
  base: "focus:outline-none transition ease-in-out duration-300 rounded-lg my-1",
  disabled: "opacity-50 cursor-not-allowed",
  pill: "rounded-full",
  size: {
    small: "px-2 py-1 text-sm",
    normal: "px-4 py-2",
    large: "px-8 py-3 text-lg",
    small2: "p-2 text-sm",
    normal2: "p-[0.625rem] text-sm",
    large2: "px-4 py-3 text-base",
  },
  variant: {
    primary:
      "bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white",
    secondary:
      "bg-gray-200 hover:hover:bg-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 hover:text-white",
    danger:
      "bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-white",
    simple:
      "bg-gray-100 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
  },
};

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, value: action.val };
    default:
      return state;
  }
};

const Select = ({
  children,
  className,
  containerClassName,
  variant = "secondary",
  size = "small",
  pill,
  disabled = false,
  width,
  display = "block",
  arrayOfData,
  labelValue,
  label,
  defaultValue,
  ...props
}) => {
  const [selectState, dispatch] = useReducer(inputReducer, {
    value: defaultValue ? defaultValue : "",
  });

  const { id, onSelect } = props;
  const { value } = selectState;

  // console.log("arrayOfData", arrayOfData);

  useEffect(() => {
    onSelect(id, value);
  }, [id, onSelect, value]);

  const changeHandler = (event) => {
    dispatch({ type: "CHANGE", val: event.target.value });
  };

  let options = arrayOfData.map((item, i) => {
    return (
      <option key={i + 1} value={item.value}>
        {item.name}
      </option>
    );
  });

  return (
    <span
      className={`${display === "block" ? "block" : "inline-block"} ${
        width ? width : ""
      } ${containerClassName ? containerClassName : ""}`}
    >
      <select
        id={props.id}
        name={props.name}
        onChange={changeHandler}
        value={selectState.value}
        disabled={disabled}
        className={cls(`
                ${classes.base}
                ${classes.size[size]}
                ${classes.variant[variant]}
                ${pill && classes.pill}
                ${disabled && classes.disabled}
                ${className}
            `)}
        {...props}
      >
        <option key={0} value={labelValue}>
          {label}
        </option>
        {options}
      </select>
    </span>
  );
};

export default Select;
