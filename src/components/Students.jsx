import React, { useState, useEffect } from "react";
import { BsPeopleFill } from "react-icons/bs";
import Student from "./Student";
import Spinner from "./Spinner";

const Students = ({ students, isStudentsReady, section, ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-4 ${
        props.className && props.className
      } rounded-lg border-indigo-300 border-opacity-50 border-2 p-4 sm:p-5 lg:p-6 xl:p-8 shadow-lg `}
    >
      <div className="flex justify-between flex-col space-y-5">
        <h2 className="pr-16 flex items-center">
          <span className="mr-3">
            <BsPeopleFill />
          </span>
          <span className="">Students</span>
        </h2>
        {isStudentsReady ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 2xl:grid-cols-3">
              {students && students.length !== 0 ? (
                <>
                  {students.map((student, i) => {
                    return <Student student={student} section={section} />;
                  })}
                </>
              ) : (
                <>No students yet</>
              )}
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default Students;
