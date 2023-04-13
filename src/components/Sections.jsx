import React, { useState, useEffect } from "react";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import axios from "axios";

import { SiGoogleclassroom } from "react-icons/si";

import AccordionSections from "./AccordionSections";
import Loading from "./Loading";

const Sections = () => {
  document.title = `Sections`;
  const { setToast } = useToast();
  const { data } = useData();

  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [isSectionsReady, setIsSectionsReady] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/sections")
      .then((res) => {
        if (res.data.success) {
          setSections(res.data.sections);
          setIsSectionsReady(true);
          console.log(res.data.sections);
        } else {
          setToast({ icon: "cross", message: "An error occured" });
        }
      })
      .catch((err) => {
        setToast({ icon: "cross", message: "An error occured" });
        console.error(err);
        console.log("Failed to fetch sections data");
      });
  }, []);

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  return (
    <>
      {isLocalDataReady && isSectionsReady ? (
        <div className="flex items-start justify-center p-6 sm:p-8 md:py-12 lg:px-10 2xl:px-14 flex-col space-y-6 text-white">
          <h1 className="flex space-x-3 md:space-x-5">
            <span className="my-0 py-0">
              <SiGoogleclassroom />
            </span>
            <span>Sections</span>
          </h1>
          <div className="flex items-start justify-center  flex-col space-y-7 xl:grid xl:grid-cols-2 xl:space-y-0 xl:gap-7 w-full">
            <div className="w-full flex flex-col space-y-6">
              <h2>Grade 11</h2>
              <AccordionSections
                sections={sections.filter((obj) => obj.gradeLevel === 11)}
              />
            </div>
            <div className="w-full flex flex-col space-y-6">
              <h2>Grade 12</h2>
              <AccordionSections
                sections={sections.filter((obj) => obj.gradeLevel === 12)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-auto h-auto flex items-start justify-center pt-10">
          <Loading />
        </div>
      )}
    </>
  );
};

export default Sections;
