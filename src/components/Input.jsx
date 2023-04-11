import React, { useReducer, useEffect, forwardRef } from "react";
import { cls } from "../utils/utils";

const classes = {
  base: "outline-none transition ease-in-out duration-300 bg-gray-200 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500",
  disabled: "opacity-50 cursor-not-allowed",
  pill: "rounded-full",
  size: {
    small: "px-2 py-1 text-sm",
    normal: "px-4 py-2",
    mid: "px-[0.75rem] py-[0.5rem]",
    large: "px-8 py-3 text-lg",
    normalEven: "p-[0.625rem]",
  },
  variant: {
    simple:
      "bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full transition ease-in-out transition ease-in-out",
    onWhite: "bg-gray-100 max-w-none w-full font-semilight",
  },
  checkbox:
    "w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-300",
};

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, value: action.val };
    default:
      return state;
  }
};

const Input = (
  {
    children,
    className,
    containerClassName = "block w-full my-2",
    size = "small",
    pill,
    disabled = false,
    labelPosition = "left",
    variant,
    labelStyle,
    defaultValue,
    multiple,
    accept,
    ...props
  },
  ref
) => {
  let defaultVal = defaultValue;
  if (!defaultValue) {
    switch (props.type) {
      case "checkbox":
        defaultVal = props.checked;
        break;
      case "number":
        defaultVal = 0;
        break;
      case "date":
        if (defaultValue) {
          defaultVal = defaultValue;
        } else {
          defaultVal = "";
        }
        break;
      case "time":
        if (defaultValue) {
          defaultVal = defaultValue;
        } else {
          defaultVal = "";
        }
        break;
      case "datetime-local":
        if (defaultValue) {
          defaultVal = defaultValue;
        } else {
          defaultVal = "";
        }
        break;
      case "password":
        defaultVal = "";
        break;
      case "textarea":
        defaultVal = "";
        break;
      case "text":
        defaultVal = "";
        break;
      default:
        defaultValue = "";
    }
  }
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: defaultVal,
  });

  const { id, onInput, checked } = props;
  const { value } = inputState;

  // Update the state of this component
  let onChangeHandler = (event) => {
    dispatch({ type: "CHANGE", val: event.target.value });
  };

  if (props.type === "checkbox") {
    onChangeHandler = (event) => {
      dispatch({ type: "CHANGE", val: event.target.checked });
    };
  }

  // Update the state of the form outside
  useEffect(() => {
    if (props.type === "number") {
      onInput(id, parseInt(value));
    } else {
      onInput(id, value);
    }
  }, [id, onInput, value, checked]);

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        value={inputState.value}
        ref={ref}
        disabled={disabled}
        onClick={props.onClick}
        checked={props.checked}
        multiple={multiple}
        accept={accept}
        className={cls(`
            ${!variant ? classes.base : ""}
            ${classes.size[size]}
            ${props.rounded}
            ${pill && classes.pill}
            ${disabled && classes.disabled}
            ${classes.variant[variant]}
            ${className}
            ${props.type === "checkbox" && classes.checkbox}
        `)}
      />
    ) : (
      <textarea
        id={props.id}
        name={props.name}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        value={inputState.value}
        ref={ref}
        disabled={disabled}
        onClick={props.onClick}
        className={cls(`
            ${!variant ? classes.base : ""}
            ${classes.size[size]}
            ${props.rounded}
            ${pill && classes.pill}
            ${disabled && classes.disabled}
            ${classes.variant[variant]}
            ${className}
        `)}
      />
    );

  const label = (
    <label htmlFor={props.id} className={labelStyle}>
      {props.label}
    </label>
  );

  return (
    <span
      className={`${
        props.type === "checkbox"
          ? "flex justify-between items-center"
          : labelStyle
          ? ""
          : "flex justify-between items-center"
      } ${containerClassName && containerClassName}`}
    >
      {props.label && labelPosition === "left" ? label : ""}
      {element}
      {props.label && labelPosition === "right" ? label : ""}
    </span>
  );
};

export default forwardRef(Input);
