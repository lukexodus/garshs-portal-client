import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";

const OrgButton = ({
  author,
  setAuthor,
  orgPostCount,
  mode,
  setPostsRefetchAfterModification,
  ...props
}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (author && author === orgPostCount.name.short) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }, [author, orgPostCount]);

  return (
    <>
      {mode === "compact" ? (
        <span
          className={`flex-none self-start w-20 truncate space-y-2 flex flex-col items-center justify-center cursor-pointer h-full ${
            clicked ? "" : "pt-[0.17rem]"
          }`}
          onClick={() => {
            if (clicked) {
              setAuthor(null);
              setPostsRefetchAfterModification((prev) => !prev);
            } else {
              setAuthor(orgPostCount.name.short);
            }
          }}
          title={orgPostCount.name.long}
          key={props.i}
        >
          <span
            className={`  hover:bg-gradient-to-l from-indigo-600 to-sky-400 rounded-full flex items-center justify-center ${
              clicked
                ? "p-[0.3rem] bg-gradient-to-l shadow-xl"
                : "p-[0.2rem] bg-gradient-to-r"
            }`}
          >
            <span
              className={`p-[0.2rem] bg-white rounded-full flex items-center justify-center ${
                clicked ? "" : ""
              }`}
            >
              <Avatar
                user={{
                  ext: "png",
                  _id: orgPostCount.name.short,
                  firstName: orgPostCount.name.long,
                  hasProfilePic: true,
                }}
                path="/"
                size={8}
              />
            </span>
          </span>

          <span
            className={`w-16 text-xs truncate ${
              clicked ? "font-black underline" : ""
            }`}
          >
            {orgPostCount.name.long}
          </span>
        </span>
      ) : mode === "extended" ? (
        <span
          className={`p-[0.3rem] flex space-x-2 items-center justify-start cursor-pointer rounded-full hover:bg-gray-200 ${
            clicked ? "bg-gray-200" : ""
          }`}
          onClick={() => {
            if (clicked) {
              setAuthor(null);
              setPostsRefetchAfterModification((prev) => !prev);
            } else {
              setAuthor(orgPostCount.name.short);
            }
          }}
          title={orgPostCount.name.long}
          key={props.i}
        >
          <Avatar
            user={{
              ext: "png",
              _id: orgPostCount.name.short,
              firstName: orgPostCount.name.long,
              hasProfilePic: true,
            }}
            path="/"
            size={5}
          />

          <span className="text-xs xl:text-sm truncate font-medium">
            {orgPostCount.name.long}
          </span>
        </span>
      ) : (
        <></>
      )}
    </>
  );
};

export default OrgButton;
