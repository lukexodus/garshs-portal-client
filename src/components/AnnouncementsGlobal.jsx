import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useToast } from "./contexts/ToastContext";
import Spinner from "./Spinner";
import Announcement from "./Announcement";
import { NODE_ENV } from "../config/config";

const AnnouncementsGlobal = ({ bgBehindColor, ...props }) => {
  const { setToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [isAnnouncementsReady, setIsAnnouncementsReady] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [announcementsSeeAll, setAnnouncementsSeeAll] = useState(false);

  const getAnnouncementsEffectRan = useRef(false);

  useEffect(() => {
    if (
      getAnnouncementsEffectRan.current === true ||
      NODE_ENV !== "development"
    ) {
      axios
        .get("/api/v1/announcements", {
          params: {
            mode: "global",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setAnnouncements(
              res.data.announcements.sort((a, b) => {
                return a.pin === b.pin ? 0 : a.pin ? -1 : 1;
              })
            );
            setIsAnnouncementsReady(true);
          } else {
            setToast({
              message: "Failed to fetch announcements.",
              icon: "cross",
            });
          }
        })
        .catch((err) => {
          console.log("(Fetch announcements) An error occured.");
          console.error(err);
        });
    }

    return () => {
      getAnnouncementsEffectRan.current = true;
    };
  }, [refetch]);

  return (
    <div className={`${props.className}`}>
      {isAnnouncementsReady ? (
        announcements.length !== 0 ? (
          <div className="flex flex-col space-y-3 px-1">
            <ul
              className={`flex flex-col space-y-2 2xl:space-y-3 overflow-auto ${
                announcementsSeeAll
                  ? "overflow-visible max-h-screen"
                  : "max-h-[21rem]"
              }`}
            >
              {announcements.map((announcement, i) => (
                <li key={i} className="w-full">
                  <Announcement
                    announcement={announcement}
                    announcements={announcements}
                    setAnnouncements={props.setAnnouncements}
                    bgBehindColor={bgBehindColor}
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
              <span className="text-sm font-light 2xl:hidden">
                {announcementsSeeAll ? "See less" : "See all"}
              </span>
            </p>
          </div>
        ) : (
          <span>No Announcements</span>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default AnnouncementsGlobal;
