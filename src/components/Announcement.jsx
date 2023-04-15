import React from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { VscGlobe } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";
import SectionIcon from "./SectionIcon";
import { subjectIcons } from "../config/icons";
import { useData } from "./contexts/DataContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import axios from "axios";
import { useToast } from "./contexts/ToastContext";

const textColors = {
  indigo: "white",
  white: "",
};

const dividerColors = {
  indigo: "divide-indigo-300",
  white: "divide-gray-300",
};

const bgColors = {
  indigo: "bg-indigo-600",
  white: "bg-white",
};

const Announcement = ({ announcement, bgBehindColor, setRefetch, ...props }) => {
  const { data } = useData();

  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();

  const createdDateTime = new Date(announcement.createdDateTime);
  const today = new Date();

  const scope = announcement.scope;

  const isToday =
    createdDateTime.getFullYear() === today.getFullYear() &&
    createdDateTime.getMonth() === today.getMonth() &&
    createdDateTime.getDate() === today.getDate();

  const formattedDate = createdDateTime.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  let createdTime;
  if (isToday) {
    const hours = createdDateTime.getHours().toString().padStart(2, "0");
    const minutes = createdDateTime.getMinutes().toString().padStart(2, "0");
    createdTime = `${hours}:${minutes}`;
  }

  let icon;
  const sectionIconStyle =
    "text-[0.655rem] h-[1.2rem] w-[1.2rem] text-indigo-600 bg-indigo-100 transform -translate-y-[0.07rem]";
  if (scope === "school") {
    icon = (
      <VscGlobe
        className="inline-block transform -translate-y-[0.1rem]"
        size={21}
      />
    );
  } else if (scope === "adviseeSection") {
    icon = (
      <SectionIcon
        alpha2={
          data.map.sections.find(
            (sectionItem) => sectionItem.value === announcement.section
          ).alpha2
        }
        className={sectionIconStyle}
      />
    );
  } else if (scope === "subjectClass") {
    if (data && data.user.role === "admin") {
      icon = (
        <SectionIcon
          alpha2={
            data.map.sections.find(
              (sectionItem) => sectionItem.value === announcement.section
            ).alpha2
          }
          className={sectionIconStyle}
        />
      );
    } else if (data && data.user.role === "student") {
      icon = (
        <SectionIcon
          alpha2={
            data.map.sections.find(
              (sectionItem) => sectionItem.value === announcement.section
            ).alpha2
          }
          className={sectionIconStyle}
        />
      );
    }
  }

  const deleteAnnouncementHandler = (_id) => {
    axios
      .delete("/api/v1/announcements", {
        params: { _id },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const bgColor = bgColors[bgBehindColor];

  return (
    <div className={`relative group ${textColors[bgBehindColor]}`}>
      {announcement.pin ? (
        <BsPinAngleFill className="absolute right-2 top-0" />
      ) : (
        <></>
      )}
      {data && announcement.author._id === data.user._id ? (
        <span
          className={`${bgColor} absolute top-2 -left-[0.11rem] md:left-[0.35rem] lg:left-[0.5rem] invisible group-hover:visible pl-0 pr-1 lg:pr-2 py-0 md:px-1 rounded`}
        >
          <MdDeleteForever
            className="w-10 h-10 text-red-300 hover:text-red-500"
            onClick={() => {
              setPopupModal({
                message: "Are you sure you want to delete this announcement?",
                variant: "danger",
                primary: "Delete",
                handler: () => {
                  deleteAnnouncementHandler(announcement._id);
                },
              });
            }}
          />
        </span>
      ) : (
        <></>
      )}
      <div
        className={`${bgColor} w-full flex flex-row py-2 md:px-3 md:py-2 divide-x-[1px] divide-opacity-70 ${dividerColors[bgBehindColor]} rounded-md 2xl:rounded-lg`}
      >
        <span className="flex flex-col justify-start items-start pr-3 md:pr-4 lg:pr-5 = whitespace-nowrap font-light text-xs lg:font-normal lg:text-sm w-14 lg:w-[70px]">
          <span className="">
            {isToday ? "Today" : formattedDate.substr(0, 6)}
          </span>
          <span>{isToday ? createdTime : formattedDate.substr(8, 4)}</span>
        </span>

        <span className="pl-3 md:pl-4 lg:pl-5 flex flex-col w-full overflow-hidden space-y-3">
          <div className="flex flex-col space-y-1">
            <div className="flex space-x-2 items-center mt-1">
              <span className="inline-block">{icon}</span>
              <span className="text-xs font-extralight">
                {announcement.author.firstName} {announcement.author.lastName}
              </span>
            </div>
            <h4 className="text-xl xl:text-xl leading-snug font-semibold lg:font-semibold mb-[2px] sm:mb-[3px] flex items-center justify-between">
              <span className="">{announcement.title}</span>
            </h4>
          </div>

          <p className="font-light whitespace-pre-line text-sm tracking-[0.015rem]">
            {announcement.details && announcement.details}
          </p>
        </span>
      </div>
    </div>
  );
};

Announcement.defaultProps = {
  bgBehindColor: "indigo",
};

export default Announcement;
