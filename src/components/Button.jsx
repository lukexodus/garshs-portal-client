import React, { forwardRef } from "react";
import { cls } from "../utils/utils";

const classes = {
  base: "focus:outline-none transition ease-in-out duration-300 shadow-md font-medium",
  disabled: "opacity-50 cursor-not-allowed",
  pill: "rounded-full",
  size: {
    small: "px-2 py-1 text-sm rounded-md",
    semiSmall: "px-3 py-2 text-sm rounded-md",
    smallResponsive: "px-1 py-1 md:px-2 md:py-1 text-sm rounded-md",
    normal: "px-3 sm:px-5 py-[0.625rem] text-xs sm:text-sm rounded-lg",
    withIcon: "py-2 px-3 text-sm rounded-lg",
    large: "px-8 py-3 text-lg rounded-2xl",
  },
  variant: {
    primary:
      "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white",
    secondary:
      "text-white bg-indigo-400 hover:bg-blue-600 focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50 hover:text-white ",
    danger:
      "bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white",
    cta: "bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-sky-400 text-white py-2 px-6 md:ml-8 hover:bg-indigo-400 duration-500",
    transparent: "border hover:bg-indigo-100 hover:text-indigo-900",
    blue: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
  },
};

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      className,
      variant = "primary",
      size = "normal",
      pill,
      disabled = false,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      type={type}
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
      {children}
    </button>
  )
);

export default Button;
