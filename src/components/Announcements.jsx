import React, { useState } from "react";
import Announcement from "./Announcement";
import AddAnnouncement from "./AddAnnouncement";
import { MdOutlineAdd } from "react-icons/md";
import { useCustomModal } from "./contexts/CustomModalContext";
import Spinner from "./Spinner";

import { TfiAnnouncement } from "react-icons/tfi";

const Announcements = ({
  announcements,
  isAnnouncementsReady,
  user,
  mode,
  ...props
}) => {
  const { setCustomModal } = useCustomModal();
  const [announcementsSeeAll, setAnnouncementsSeeAll] = useState(false);

  return (
    <div
      className={`flex flex-col space-y-4 ${
        props.className && props.className
      } rounded-lg border-indigo-300 border-opacity-50 border-2 p-4 sm:p-5 lg:p-6 xl:p-8 shadow-lg `}
    >
      <div className="flex justify-between flex-wrap">
        <h2 className="pr-12 flex items-center">
          <span className="mr-3">
            <TfiAnnouncement />
          </span>
          <span className="">Announcements</span>
        </h2>
        {user.role === "admin" || user.role === "superadmin" ? (
          <span
            className="flex items-center hover:underline"
            onClick={() => {
              setCustomModal(
                <AddAnnouncement
                  mode={mode}
                  setRefetch={props.setRefetch}
                  params={props.params}
                />
              );
            }}
          >
            <MdOutlineAdd size={20} className="text-white" />
            <h5>Add Announcement</h5>
          </span>
        ) : (
          <></>
        )}
      </div>
      {isAnnouncementsReady ? (
        announcements.length !== 0 ? (
          <div className="flex flex-col space-y-3">
            <ul
              className={`flex flex-col space-y-2 overflow-auto ${
                announcementsSeeAll
                  ? "overflow-visible max-h-screen"
                  : "max-h-[21rem]"
              }`}
            >
              {announcements.map((announcement, i) => (
                <li key={i} className="w-full">
                  <Announcement
                    announcement={announcement}
                    user={user}
                    announcements={announcements}
                    setAnnouncements={props.setAnnouncements}
                  />
                </li>
              ))}
            </ul>
            <p
              className="text-center hover:underline"
              onClick={() => {
                setAnnouncementsSeeAll(!announcementsSeeAll);
              }}
            >
              {announcementsSeeAll ? "See less" : "See all"}
            </p>
          </div>
        ) : (
          <span>No Announcements</span>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Announcements;
