import React from "react";
import Avatar from "./Avatar";
import { capitalizeFirstLetter } from "../utils/utils";

const UserCardAttendance = ({ user, attendanceRecords, ...props }) => {
  return (
    <span
      className="flex items-center space-x-2 w-full rounded-full p-[0.4rem]"
      key={props.i}
    >
      <a
        href={`/dashboard/user/${user._id}`}
        target="_blank"
        title={`${user.firstName}'s profile`}
        className="flex-none"
      >
        <Avatar user={user} size={5} path="/user/" />
      </a>
      <span className="flex flex-col space-y-[0.07rem] w-full">
        <a
          href={`/dashboard/attendance/user/${user._id}`}
          className="text-white text-sm sm:text-base hover:underline self-start"
          target="_blank"
          title={`${user.firstName}'s attendance records`}
        >
          {user.firstName} {user.lastName}
        </a>
        <span className="flex items-center justify-between">
          <span className="text-xs font-light">
            {capitalizeFirstLetter(
              attendanceRecords.find((record) => record.userId === user._id)
                .attendance[0].title
            )}
          </span>
          <span className="text-xs font-light">
            {
              attendanceRecords.find((record) => record.userId === user._id)
                .attendance[0].time
            }
          </span>
        </span>
      </span>
    </span>
  );
};

export default UserCardAttendance;
