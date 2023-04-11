import React from "react";
import { generateCode } from "../utils/utils";

const sizes = {
  1: "w-5 h-5 ",
  2: "w-6 h-6 ",
  3: "w-7 h-7 text-[0.8rem]",
  4: "w-8 h-8 text-[0.87rem]",
  5: "w-10 h-10 text-[1rem]",
  6: "w-12 h-12 text-xl",
  7: "w-14 h-14 text-[1.35rem]",
  8: "w-16 h-16",
  9: "w-20 h-20 min text-4xl",
  10: "w-24 h-24 min-w-24 min-h-24 text-4xl",
};

const fontSizes = {
  5: "",
};

const Avatar = ({ user, size, path, ...props }) => {
  return (
    <>
      {user.hasProfilePic ? (
        <img
          className={`rounded-full shadow  ${sizes[size]} flex-none cursor-pointer ${props.className} border-[0.5px] border-gray-300`}
          src={`${path}${user._id}.${user.ext}`}
        />
      ) : (
        <div
          className={`rounded-full shadow  flex items-center justify-center font-semibold bg-indigo-500 ${sizes[size]} ${fontSizes[size]} flex-none cursor-pointer text-white ${props.className} border-[0.5px] border-white`}
        >
          {generateCode(user.firstName)}
        </div>
      )}
    </>
  );
};

export default Avatar;

Avatar.defaultProps = {
  size: 5,
  path: "/user/",
};
