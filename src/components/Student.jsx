import React from "react";
import Avatar from "./Avatar";
import { useData } from "./contexts/DataContext";

const Student = ({ student, section, ...props }) => {
  const { data } = useData();

  return (
    <div className="flex items-center justify-start space-x-4 w-full rounded-full">
      <Avatar user={student} size={7} />
      <span className="text-lg flex flex-col space-y-[0.1rem]">
        <span>
          {student.firstName} {student.lastName}
        </span>
        <span className="flex space-x-3 text-sm   underline">
          <a
            className="cursor-pointer text-gray-200 font-light"
            href={`/dashboard/user/${student._id}`}
            target="_blank"
          >
            Profile
          </a>
          {data.user.role === "admin" && !data.user.nonTeaching ? (
            <a
              className="cursor-pointer text-gray-200 font-light"
              href={`/dashboard/report-card/${section}/${student._id}`}
              target="_blank"
            >
              Report Card
            </a>
          ) : (
            <></>
          )}
        </span>
      </span>
    </div>
  );
};

export default Student;
