import React, { forwardRef } from "react";

const Dropdown = (
  {
    items = [
      { onClick: () => {}, name: "Edit" },
      { onClick: () => {}, name: "Share" },
    ],
    isOpen,
    ...props
  },
  ref
) => {
  return (
    <div
      className={`z-10 ${
        isOpen ? "" : "hidden"
      } bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 ${
        props.className
      } border-[0.1px] border-gray-200 border-opacity-40`}
      ref={ref}
    >
      <ul className="py-2 text-sm">
        {items.map((itemObj, i) => {
          return (
            <li key={i} onClick={() => itemObj.onClick()}>
              <a className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                {itemObj.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default forwardRef(Dropdown);
