import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LayoutPlain = ({ children }) => {
  document.title = "GARSHS Portal";

  let location = useLocation();

  const wrapperClassName =
    "flex flex-col items-center justify-between mx-auto min-h-screen bg-indigo-600";
  const mainClassName =
    "py-6 md:py-11 lg:py-14 md:px-14 lg:px-20 xl:px-24 px-7 max-w-7xl min-w-[70%] w-full";

  return (
    <div className="max-w-full min-h-screen">
      <div className={wrapperClassName}>
        <main className={mainClassName}>{children}</main>
      </div>
    </div>
  );
};

export default LayoutPlain;
