import React, { useEffect, useState } from "react";
import { useData } from "./contexts/DataContext";
import LinkButton from "./LinkButton";
import PageFallback1 from "./PageFallback1";
import { useToast } from "./contexts/ToastContext";
import { useCustomModal } from "./contexts/CustomModalContext";
import axios from "axios";
import Announcements from "./Announcements";
import Events from "./Events";
import useUpdateEffect from "./hooks/useUpdateEffect";

const Main = () => {
  const { setToast } = useToast();
  const { data } = useData();
  const { setCustomModal } = useCustomModal();
  const [announcements, setAnnouncements] = useState([]);
  const [isAnnouncementsReady, setIsAnnouncementsReady] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [isLocalDataReady, setIsLocalDataReady] = useState(false);

  // | ${
  //   data.map.sections.find((obj) => obj.value === data.user.section).name
  // }

  // | ${
  //   data.map.sections.find(
  //     (obj) => obj.value === data.user.adviseeSection
  //   ).name
  // }

  document.title = `Dashboard`;

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
      axios
        .get("/api/v1/announcements", {
          params: {
            mode: "main",
            _id: data.user._id,
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
  }, [refetch, data]);

  return (
    <>
      {isLocalDataReady ? (
        <>
          <div className="flex flex-col items-start">
            <h1 className="mb-9">
              Welcome back{data ? `, ` : "!"}
              {data ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-200 to-sky-200">
                  {data.user.firstName}!
                </span>
              ) : (
                ""
              )}
            </h1>
            <div className="w-full flex flex-col space-y-12">
              {data.user.role === "admin" ? (
                data.user.nonTeaching ? (
                  <></>
                ) : (
                  <>
                    <div>
                      <div>
                        <h2>Manage</h2>
                      </div>
                      <div className="mt-4 flex flex-row flex-wrap">
                        <LinkButton
                          link="/dashboard/admin/requests"
                          name="Account&nbsp;Requests"
                        />
                        <LinkButton link="/dashboard/admin/lrn" name="LRNs" />
                      </div>
                    </div>
                  </>
                )
              ) : data.user.role === "superadmin" ? (
                <>
                  <div>
                    <div>
                      <h2>Manage</h2>
                    </div>
                    <div className="py-4 flex flex-row flex-wrap">
                      <LinkButton
                        link="/dashboard/superadmin/sections"
                        name="Sections"
                      />
                      <LinkButton
                        link="/dashboard/superadmin/subjects"
                        name="Subjects"
                      />
                      <LinkButton
                        link="/dashboard/superadmin/users"
                        name="Users"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <Announcements
                announcements={announcements}
                isAnnouncementsReady={isAnnouncementsReady}
                user={data.user}
                mode="main"
                setAnnouncements={setAnnouncements}
                setRefetch={setRefetch}
              />
              <Events headerStyle="px-5 lg:px-6 xl:px-8" />
            </div>
          </div>
        </>
      ) : (
        <PageFallback1 />
      )}
    </>
  );
};

export default Main;
