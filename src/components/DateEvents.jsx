import React, { useEffect, useState } from "react";
import { isSameDate } from "../utils/utils";
import { useCustomModal } from "./contexts/CustomModalContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import axios from "axios";
import { useData } from "./contexts/DataContext";

import { MdDeleteForever } from "react-icons/md";

const DateEvents = ({ dateString, events, refetch, ...props }) => {
  const date = new Date(dateString);
  const [dateEvents, setDateEvents] = useState([]);
  const { data } = useData();

  const { setCustomModal } = useCustomModal();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();

  const options = { month: "short", day: "numeric", year: "numeric" };
  const dateFormatted = date.toLocaleDateString("en-US", options);

  useEffect(() => {
    setDateEvents(
      events.filter((event) => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        if (
          isSameDate(startDate, date) ||
          (event.end && isSameDate(endDate, date)) ||
          (startDate < date && endDate > date)
        ) {
          return true;
        }

        return false;
      })
    );
  }, []);

  const deleteEventHandler = (eventId) => {
    axios
      .delete("/api/v1/events", {
        params: { _id: eventId },
      })
      .then((res) => {
        if (res.data.success) {
          setCustomModal(null);
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          refetch();
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="text-gray-900 flex flex-col space-y-2">
      <h4>{dateFormatted} Events</h4>
      <ul className="flex flex-col space-y-5">
        {dateEvents.length === 0 ? <span>No events for this date</span> : <></>}
        {dateEvents.map((dateEvent, i) => (
          <li key={i} className="flex flex-col space-y-2 relative group">
            {data &&
            (data.user.role === "admin" || data.user.role === "superadmin") ? (
              <span
                className={`bg-red-100 absolute invisible group-hover:visible top-3 right-0 p-1 rounded-full`}
              >
                <MdDeleteForever
                  className="w-7 h-7 lg:w-[29px] lg:h-[29px] xl:w-9 xl:h-9 text-red-500 hover:text-red-600"
                  onClick={() => {
                    setPopupModal({
                      message: "Are you sure you want to delete this event?",
                      variant: "danger",
                      primary: "Delete",
                      handler: () => {
                        deleteEventHandler(dateEvent._id);
                      },
                    });
                  }}
                />
              </span>
            ) : (
              <></>
            )}
            <div className="flex flex-col space-y-0">
              <h3 className="my-0 max-w-[28rem]">{dateEvent.title}</h3>
              <span className="font-extralight text-sm">
                {dateEvent.author.firstName} {dateEvent.author.lastName}
              </span>
            </div>
            {dateEvent.details ? <div>{dateEvent.details}</div> : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DateEvents;
