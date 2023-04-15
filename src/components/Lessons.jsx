import React, { useEffect, useState, Suspense, lazy } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useCustomModal } from "./contexts/CustomModalContext";
import Spinner from "./Spinner";
import { useData } from "./contexts/DataContext";
import AddLesson from "./AddLesson";
const LessonView = lazy(() => import("./LessonView"));

import { IoMdBookmarks } from "react-icons/io";

const Lessons = ({
  lessonTitles,
  isLessonTitlesReady,
  setRefetch,
  isLessonViewOpen,
  setIsLessonViewOpen,
  setLessonTitles,
  params,
  ...props
}) => {
  const { setCustomModal } = useCustomModal();
  const { data } = useData();
  const user = data.user;
  const [lesson, setLesson] = useState({});
  const [isInAddLessonMode, setIsInAddLessonMode] = useState(false);

  return (
    <div
      className={`flex flex-col space-y-5 ${
        props.className && props.className
      } border-indigo-300 border-opacity-50 border-2 p-5 lg:p-6 xl:p-8 shadow-lg rounded-lg`}
    >
      <div className="flex justify-between flex-wrap">
        <h2 className="pr-12 flex items-center">
          <span className="mr-3">
            <IoMdBookmarks />
          </span>
          <span>Lessons</span>
        </h2>
        {user.role === "admin" && !user.nonTeaching ? (
          <span
            className={`flex items-center hover:underline ${
              isInAddLessonMode ? "hidden" : ""
            }`}
            onClick={() => {
              setIsInAddLessonMode(true);
              setIsLessonViewOpen(false);
            }}
          >
            <MdOutlineAdd size={20} className="text-white" />
            <h5 className="my-0">Add Lesson</h5>
          </span>
        ) : (
          <></>
        )}
      </div>

      <div
        className={`${
          isLessonViewOpen || isInAddLessonMode ? "hidden" : ""
        } pl-3`}
      >
        {isLessonTitlesReady ? (
          lessonTitles.length !== 0 ? (
            <div className="flex flex-col items-center justify-center">
              <ul
                className={`grid grid-cols-1 gap-3 lg:grid-cols-2 w-full h-full list-disc pl-3`}
              >
                {lessonTitles.map((lessonObj, i) => (
                  <li key={i} className="">
                    <Lesson
                      lesson={lessonObj}
                      setIsLessonViewOpen={setIsLessonViewOpen}
                      setLesson={setLesson}
                      lessonTitles={lessonTitles}
                      setLessonTitles={setLessonTitles}
                      params={params}
                      i={i}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <span>No lessons yet</span>
          )
        ) : (
          <Spinner />
        )}
      </div>
      {isLessonViewOpen ? (
        <Suspense fallback={<Spinner />}>
          <LessonView
            lesson={lesson}
            setIsLessonViewOpen={setIsLessonViewOpen}
            setRefetch={setRefetch}
            params={params}
            setIsInAddLessonMode={setIsInAddLessonMode}
          />
        </Suspense>
      ) : (
        <></>
      )}
      {isInAddLessonMode ? (
        <>
          <AddLesson
            setRefetch={setRefetch}
            setIsLessonViewOpen={setIsLessonViewOpen}
            params={params}
            setIsInAddLessonMode={setIsInAddLessonMode}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const Lesson = ({ lesson, setIsLessonViewOpen, setLesson, ...props }) => {
  return (
    <div
      className=""
      key={props.i}
      onClick={() => {
        setIsLessonViewOpen(true);
        setLesson(lesson);
      }}
    >
      <span className="hover:underline">{lesson.title}</span>
    </div>
  );
};

export default Lessons;
