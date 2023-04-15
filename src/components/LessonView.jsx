import React, { useEffect, useState } from "react";
import { useToast } from "./contexts/ToastContext";
import Spinner from "./Spinner";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useData } from "./contexts/DataContext";
import Reader from "./Reader";
import Dropdown from "./Dropdown";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "./hooks/useClickOutside";
import { usePopupModal } from "./contexts/PopupModalContext";
import EditLesson from "./EditLesson";

import { BsFillFileEarmarkTextFill } from "react-icons/bs";

const LessonView = ({
  lesson,
  setIsLessonViewOpen,
  setIsInAddLessonMode,
  setRefetch,
  params,
  ...props
}) => {
  const [lessonDoc, setLessonDoc] = useState(null);
  const [isLessonReady, setIsLessonReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState("view");

  const { subject } = params;

  const { setToast } = useToast();
  const { setPopupModal } = usePopupModal();
  const { data } = useData();

  let dropdownNode = useClickOutside(() => {
    setIsDropdownOpen(false);
  });

  useEffect(() => {
    axios
      .get("/api/v1/lesson", {
        params: {
          _id: lesson._id,
          subject,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setLessonDoc(res.data.lesson);
          setIsLessonReady(true);
        } else {
          setToast({
            message: "Failed to fetch lesson data",
            icon: "cross",
          });
        }
      })
      .catch((err) => {
        console.log("(Fetch lesson data) An error occured.");
        console.error(err);
      });
  }, []);

  const deleteHandler = () => {
    axios
      .delete("/api/v1/lessons", {
        params: { _id: lesson._id, userId: lesson.author._id, subject },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setIsLessonViewOpen(false);
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
        setToast({ message: "An errror occured", icon: "cross" });
        console.log("Failed to delete lesson");
      });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="pt-2 flex items-center justify-start">
        <span
          className="flex items-center group self-start"
          onClick={() => {
            setIsLessonViewOpen(false);
            setToast(null);
          }}
        >
          <span className="mr-1">
            <IoMdArrowRoundBack size={27} />
          </span>
          <span className="text-lg group-hover:underline">Go back</span>
        </span>
      </div>
      {isLessonReady ? (
        <>
          {mode === "view" ? (
            <>
              <div className="flex flex-col space-y-5 max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-center">
                  <span className="flex flex-col space-y-0">
                    <h3 className="my-0">{lesson.title}</h3>
                    <span className="font-light text-sm">
                      {lessonDoc.author.firstName} {lessonDoc.author.lastName}
                    </span>
                  </span>
                  {data.user._id === lesson.author._id ? (
                    <div className="flex justify-center items-start flex-none relative">
                      <BsThreeDots
                        size={30}
                        className={`text-gray-100 hover:bg-indigo-500 rounded-full p-[0.4rem] w-9 h-9 ${
                          isDropdownOpen ? "pointer-events-none" : ""
                        }`}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                      />
                      <Dropdown
                        className="absolute top-9 right-2"
                        isOpen={isDropdownOpen}
                        ref={dropdownNode}
                        items={[
                          {
                            onClick: () => {
                              setMode("edit");
                              setIsDropdownOpen(false);
                              setIsInAddLessonMode(false);
                            },
                            name: "Edit",
                          },
                          {
                            onClick: () =>
                              setPopupModal({
                                message:
                                  "Are you sure you want to delete this lesson?",
                                variant: "danger",
                                primary: "Delete",
                                handler: () => deleteHandler(),
                              }),
                            name: "Delete",
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {JSON.parse(lessonDoc.body).root.children[0].children.length !==
                0 ? (
                  <Reader
                    editorState={lessonDoc.body}
                    className="border-white border-[0.05rem] border-opacity-20 shadow-md px-1 py-2 rounded-lg"
                  />
                ) : (
                  ""
                )}
                {lessonDoc.attachments && lessonDoc.attachments.length !== 0 ? (
                  <div className="flex flex-col space-y-1">
                    <h5 className="my-0 font-bold">Attachments</h5>
                    <ul className="list-disc list-inside">
                      {lessonDoc.attachments.map((attachment, i) => (
                        <li>
                          <a
                            className="text-gray-200 text-sm font-semilight hover:underline"
                            href={`/lessons/attachments/${attachment}`}
                            key={i}
                          >
                            {attachment}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : (
            ""
          )}
          {mode === "edit" ? (
            <EditLesson
              lesson={lessonDoc}
              // setPostRefetch={setPostRefetch}
              setMode={setMode}
              setIsLessonViewOpen={setIsLessonViewOpen}
              setRefetch={setRefetch}
              params={params}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default LessonView;
