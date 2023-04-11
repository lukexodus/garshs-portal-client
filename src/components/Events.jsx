import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import AddEvent from "./AddEvent";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import DateEvents from "./DateEvents";
import Event from "./Event";

import { IoCalendar } from "react-icons/io5";
import { MdOutlineAdd } from "react-icons/md";

const textColors = {
  indigo: "text-white",
  white: "text-gray-500",
};

const Events = ({ bgBehindColor, showHeader, ...props }) => {
  const [events, setEvents] = useState([]);
  const { setCustomModal } = useCustomModal();
  const { data } = useData();
  const { setToast } = useToast();

  const calendarRef = useRef(null);

  const onEventAdded = (eventObj) => {
    if (calendarRef.current) {
      let calendar = calendarRef.current.getApi();
      calendar.addEvent(eventObj);
    }
  };

  const handleDatesSet = (interval) => {
    axios
      .get("/api/v1/events", {
        params: {
          start: new Date(interval.start).toISOString(),
          end: new Date(interval.end).toISOString(),
        },
      })
      .then((res) => {
        if (res.data.success) {
          setEvents(res.data.events);
          console.log(res.data.events);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch events");
        console.error(err);
      });
  };

  const refetch = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  };

  const handleDateClick = (info) => {
    setCustomModal(
      <DateEvents dateString={info.date} events={events} refetch={refetch} />
    );
  };

  const handleEventClick = (info) => {
    const event = events.find(
      (eventObj) => eventObj.title === info.event.title
    );
    console.log("event", event);
    setCustomModal(<Event event={event} refetch={refetch} />);
  };

  return (
    <div className={`flex flex-col space-y-4 lg:space-y-5 ${props.className}`}>
      <div
        className={`flex flex-wrap ${textColors[bgBehindColor]} ${
          !showHeader ? "justify-start" : "justify-between"
        } ${props.headerStyle ? props.headerStyle : ""}`}
      >
        {showHeader ? (
          <h2 className="pr-12 flex items-center">
            <span className="mr-3">
              <IoCalendar />
            </span>
            <span>Events</span>
          </h2>
        ) : (
          <></>
        )}

        {data &&
        (data.user.role === "admin" || data.user.role === "superadmin") ? (
          <span
            className="flex items-center hover:underline"
            onClick={() => {
              setCustomModal(<AddEvent onEventAdded={onEventAdded} />);
            }}
          >
            <MdOutlineAdd
              size={20}
              className={`${textColors[bgBehindColor]}`}
            />
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

Events.defaultProps = {
  bgBehindColor: "indigo",
  showHeader: true,
};

export default Events;
