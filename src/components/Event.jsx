import React from "react";
import { useCustomModal } from "./contexts/CustomModalContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import axios from "axios";
import { useData } from "./contexts/DataContext";

import { MdDeleteForever } from "react-icons/md";

const Event = ({ event, refetch, ...props }) => {
  const { setCustomModal } = useCustomModal();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();
  const { data } = useData();

  if (!event) {
    setCustomModal(null);
    setToast({
      message: "Sync required. Please refresh the page.",
      icon: "cross",
      lifetime: 6000,
    });
  }

  console.log("event", event);

  const startDate = new Date(event.start);

  const options = { month: "short", day: "numeric", year: "numeric" };
  const startDateFormatted = startDate.toLocaleDateString("en-US", options);
  let endDateFormatted;
  if (event.end) {
    const endDate = new Date(event.end);
    endDateFormatted = endDate.toLocaleDateString("en-US", options);
  }

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
    <div className="flex flex-col space-y-2  text-gray-900">
      <div className="py-3"> </div>
      <div className="relative group">
        {data &&
        (data.user.role === "admin" || data.user.role === "superadmin") ? (
          <span
            className={`bg-red-100 absolute invisible group-hover:visible top-2 right-0 p-1 rounded-full`}
          >
            <MdDeleteForever
              className="w-7 h-7 lg:w-[29px] lg:h-[29px] xl:w-9 xl:h-9 text-red-500 hover:text-red-600"
              onClick={() => {
                setPopupModal({
                  message: "Are you sure you want to delete this event?",
                  variant: "danger",
                  primary: "Delete",
                  handler: () => {
                    deleteEventHandler(event._id);
                  },
                });
              }}
            />
          </span>
        ) : (
          <></>
        )}
        <div className="flex flex-col space-y-0">
          <h3 className="my-0 max-w-[28rem]">
            {event.title} ({startDateFormatted}
            {endDateFormatted ? ` - ${endDateFormatted}` : ""})
          </h3>
          <span className="font-extralight text-sm">
            {event.author.firstName} {event.author.lastName}
          </span>
        </div>
        {event.details ? <div>{event.details}</div> : ""}
      </div>
    </div>
  );
};

export default Event;
