import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import AddPost from "./AddPost";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import Input from "./Input";

import { IoCalendar } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";

const Posts = ({ ...props }) => {
  const [posts, setPosts] = useState([]);
  const { setCustomModal } = useCustomModal();
  const { data } = useData();
  const { setToast } = useToast();

  return (
    <div className="flex flex-col space-y-3 py-8">
      <div className="flex justify-between flex-wrap">
        <h2 className="pr-80 flex items-center">
          <span className="mr-3">
            <IoCalendar />
          </span>
          <span>Events</span>
        </h2>
        {data &&
        (data.user.role === "admin" || data.user.role === "superadmin") ? (
          <span
            className="flex items-center hover:underline"
            onClick={() => {
              setCustomModal(<AddEvent onEventAdded={onEventAdded} />);
            }}
          >
            <MdOutlineAdd size={20} className="text-white" />
            <h5 className="my-0">Add Event</h5>
          </span>
        ) : (
          <></>
        )}
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        datesSet={(interval) => handleDatesSet(interval)}
        dateClick={(info) => {
          handleDateClick(info);
        }}
        eventClick={handleEventClick}
        displayEventTime={false}
      />
    </div>
  );
};

export default Posts;
