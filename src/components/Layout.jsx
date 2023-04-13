import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  document.title = "GARSHS Portal";

  let location = useLocation();

  const wrapperClassName =
    "flex flex-col items-center justify-between mx-auto min-h-screen bg-indigo-600";
  const mainClassName =
    "py-5 sm:py-6 md:py-11 lg:py-14 px-5 sm:px-7 md:px-7 lg:px-14 xl:px-20  max-w-7xl min-w-[70%] w-full";

  return (
    <div className="max-w-full min-h-screen">
      {location.pathname.startsWith("/dashboard") ? "" : <Header />}

      {location.pathname.startsWith("/dashboard") ? (
        <div className={wrapperClassName}>
          <main className={mainClassName}>{children}</main>
        </div>
      ) : (
        <div className={wrapperClassName}>
          <main className={mainClassName}>{children}</main>
          <Footer className="max-w-7xl" />
        </div>
      )}
    </div>
  );
};

export default Layout;
