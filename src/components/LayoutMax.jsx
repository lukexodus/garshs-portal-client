import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const LayoutMax = ({ children, bgColor, ...props }) => {
  let location = useLocation();

  const wrapperClassName = `flex flex-col items-center justify-between mx-auto min-h-screen  text-black ${bgColor}`;
  const mainClassName = "w-full min-h-screen";

  return (
    <div className="max-w-full min-h-screen relative">
      {location.pathname.startsWith("/dashboard") ? "" : <Header />}

      {location.pathname.startsWith("/dashboard") ? (
        <div className={wrapperClassName}>
          <main className={mainClassName}>{children}</main>
        </div>
      ) : (
        <div className={wrapperClassName}>
          <main className={mainClassName}>{children}</main>
          {/* <Footer className="max-w-7xl" /> */}
        </div>
      )}
    </div>
  );
};

LayoutMax.defaultProps = {
  bgColor: "bg-[#F0F2F5]",
};

export default LayoutMax;
