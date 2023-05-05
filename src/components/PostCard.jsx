import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import Avatar from "./Avatar";
import { isValidObjectIdString } from "../utils/utils";
import Reader from "./Reader";
import Dropdown from "./Dropdown";
import { useData } from "./contexts/DataContext";
import useClickOutside from "./hooks/useClickOutside";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { useCustomModal } from "./contexts/CustomModalContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import axios from "axios";
import EditPost from "./EditPost";
import Spinner from "./Spinner";

import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import { GiConsoleController } from "react-icons/gi";

const PostCard = ({
  post,
  i,
  isRefetchedPostReady,
  setPostsRefetchAfterModification,
  setPostRefetch,
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([
    { onClick: () => {}, name: "Share" },
  ]);
  const [mode, setMode] = useState("view");

  const { data } = useData();
  const { setCustomModal } = useCustomModal();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();

  useEffect(() => {
    if (data) {
      if (data.user._id === post.author._id) {
        setDropdownOptions(
          dropdownOptions.concat([
            {
              onClick: () => {
                setMode("edit");
                setIsDropdownOpen(false);
              },
              name: "Edit",
            },
            {
              onClick: () =>
                setPopupModal({
                  message: "Are you sure you want to delete this post?",
                  variant: "danger",
                  primary: "Delete",
                  handler: () => deleteHandler(),
                }),
              name: "Delete",
            },
          ])
        );
      }
    }
  }, [data]);

  let userIsTheAuthor = false;
  if (typeof post.postAs === "string" && isValidObjectIdString(post.postAs)) {
    userIsTheAuthor = true;
  }

  let src;
  let path;
  if (userIsTheAuthor) {
    src = post.author;
    path = "/user/";
  } else {
    src = {
      ext: "png",
      _id: post.postAs.short,
      firstName: post.postAs.long,
      hasProfilePic: true,
    };
    path = "/";
  }

  const images = [];

  const createdDate = new Date(post.createdDateTime);
  const options = { month: "short", day: "numeric" };
  const dateString = createdDate.toLocaleString("en-US", options);

  if (!(post.images.length === 0)) {
    for (const imageFilename of post.images) {
      images.push({ image: `/posts/images/${imageFilename}` });
    }
  }

  let dropdownNode = useClickOutside(() => {
    setIsDropdownOpen(false);
  });

  const deleteHandler = () => {
    axios
      .delete("/api/v1/posts", {
        params: { _id: post._id },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setPostsRefetchAfterModification((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
        setToast({ message: "An errror occured", icon: "cross" });
        console.log("Failed to delete post");
      });
  };

  return (
    <div
      className="bg-white w-full shadow-md pt-1 pb-4 max-w-2xl sm:rounded-lg flex flex-col space-y-1"
      key={i}
    >
      <div className="flex flex-col space-y-[0.65rem] px-4 py-2">
        <div className="flex space-x-[0.6rem]">
          <span className="flex justify-center items-start pt-[0.17rem] flex-none">
            <Avatar user={src} path={path} className="" />
          </span>
          <div className="flex flex-col w-full">
            <h5 className="my-0 py-0  w-full font-semibold">
              {userIsTheAuthor ? (
                `${post.author.firstName} ${post.author.lastName}`
              ) : (
                <>{post.postAs.long}</>
              )}
            </h5>
            <div className=" w-full text-xs">{dateString}</div>
          </div>
          {mode === "view" ? (
            <div className="flex justify-center items-start flex-none relative">
              <BsThreeDots
                size={30}
                className={`text-gray-600 hover:bg-gray-100 rounded-full p-[0.5rem] w-9 h-9 ${
                  isDropdownOpen ? "pointer-events-none" : ""
                }`}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
              <Dropdown
                className="absolute top-9 right-2"
                isOpen={isDropdownOpen}
                ref={dropdownNode}
                items={dropdownOptions}
              />
            </div>
          ) : (
            <span
              className="text-black h-full"
              onClick={() => {
                setMode("view");
              }}
            >
              <VscChromeClose className="w-9 h-9 bg-gray-100 rounded-full p-[0.4rem] fill-gray-500 hover:bg-gray-200" />
            </span>
          )}
        </div>
        {mode === "view" ? <Reader editorState={post.body} /> : <></>}
      </div>
      {images.length !== 0 && mode === "view" ? (
        <Carousel images={images} />
      ) : (
        <></>
      )}
      {mode === "edit" ? (
        <EditPost
          post={post}
          // setPostRefetch={setPostRefetch}
          setMode={setMode}
          isRefetchedPostReady={isRefetchedPostReady}
          setPostsRefetchAfterModification={setPostsRefetchAfterModification}
        />
      ) : (
        <>
          {/* <div className=" flex flex-col divide-y-[0.4px] space-y-1 px-4">
            <div className="flex justify-between items-center pt-2 pb-[0.3rem]">
              <span>2.3K</span>
              <span>121 518</span>
            </div>
            <div className="flex items-center justify-around font-medium text-gray-600 pt-1">
              <span className="hover:bg-gray-100 py-1 px-4 flex-auto text-center mx-1 rounded-md cursor-pointer flex space-x-2 items-center justify-center">
                <AiOutlineLike size={20} />
                <span>Like</span>
              </span>
              <span className="hover:bg-gray-100 py-1 px-4 flex-auto text-center mx-1 rounded-md cursor-pointer flex space-x-2 items-center justify-center">
                <AiOutlineComment size={20} />
                <span>Comment</span>
              </span>
              <span className="hover:bg-gray-100 py-1 px-4 flex-auto text-center mx-1 rounded-md cursor-pointer flex space-x-2 items-center justify-center">
                <RiShareForwardLine size={20} />
                <span>Share</span>
              </span>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default PostCard;
