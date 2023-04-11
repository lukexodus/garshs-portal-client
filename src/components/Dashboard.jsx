import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row relative">
      <div className="bg-indigo-600 fixed left-0 top-0 w-14 md:w-72 h-screen transition-all duration-300 z-10"></div>
      <Sidebar open={open} toggleSidebar={setOpen} />
      <div
        className={`flex-auto h-screen w-[calc(100%-3.5rem)] absolute left-14 z-0 md:left-72 md:w-[calc(100%-18rem)] ${
          open ? "md:left-72 md:w-[calc(100%-18rem)]" : ""
        } transition-all duration-300 flex flex-col`}
      >
        <span className="text-yellow-100 w-full text-center">
          {/* みんなとエテルの未来のため頑張って！ */}
        </span>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
