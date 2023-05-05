import React, { useState, useEffect, useRef } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import { useToast } from "./contexts/ToastContext";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import Loading from "./Loading";

const PassRequirement = ({
  setRefetch,
  requirementId,
  section,
  subject,
  ...props
}) => {
  const [render, setRender] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const fileInputRef = useRef(null);

  const [formState, inputHandler, setFormData] = useForm({
    links: { value: [] },
    files: { value: [] },
  });

  const [formStateMid, inputHandlerMid, setFormDataMid] = useForm({
    link: { value: "" },
  });

  const addLinkHandler = () => {
    const link = formStateMid.inputs.link.value;

    if (link && !formState.inputs.links.value.includes(link)) {
      formState.inputs.links.value.push(link);
      setRender((prev) => !prev);
    }
  };

  const removeLink = (link: string) => {
    formState.inputs.links.value = formState.inputs.links.value.filter(
      (linkInList: string) => linkInList !== link
    );
    setRender((prev) => !prev);
  };

  const submitHandler = () => {
    setIsUploading(true);

    const processedFormState = processFormState(formState.inputs);
    if (fileInputRef.current) {
      processedFormState.files = fileInputRef.current.files;
    } else {
      setToast({
        message: "An error occured in the browser",
        icon: "cross",
      });
      return;
    }

    setToast(null);

    const formData = new FormData();
    formData.append("mode", "setAsPassed");
    formData.append("requirementId", requirementId);
    formData.append("section", section);
    formData.append("subject", subject);
    formData.append("passedDateTime", new Date());
    if (processedFormState.files) {
      for (const file of processedFormState.files) {
        formData.append("files", file);
      }
    }
    if (processedFormState.links && processedFormState.links.length !== 0) {
      for (const link of processedFormState.links) {
        formData.append("links", link);
      }
    }

    axios
      .patch("/api/v1/requirements", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({
            message: "Requirement passed",
            icon: "check",
            lifetime: 5000,
          });
          setRefetch((prev: boolean) => !prev);
          setIsUploading(false);
          setCustomModal(null);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to pass requirement");
        console.error(error);
      });
  };

  return (
    <div className="">
      <h3 className="mb-4 text-xl font-medium text-gray-900 ">
        Pass Requirement
      </h3>
      <form className="space-y-3">
        <div className="flex flex-col">
          <label
            htmlFor="links"
            className="block text-sm font-medium text-gray-900"
          >
            Links
          </label>
          <div className="flex space-x-2 items-center">
            <Input
              element="input"
              id="link"
              name="link"
              type="url"
              onInput={inputHandlerMid}
              size="normalEven"
              variant="simple"
              placeholder="website.com/path/to/file.ext"
            />
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={addLinkHandler}
              className="w-min h-min"
            >
              Add
            </Button>
          </div>
        </div>
        {formState.inputs.links.value.length !== 0 && (
          <div>
            <ul className="w-min mt-2 flex flex-col space-y-2">
              {formState.inputs.links.value.map((link: string, i: number) => {
                return (
                  <li key={i} className="flex justify-between items-center">
                    <span className="text-sm font-light text-gray-900 pr-2 whitespace-nowrap">
                      {link}
                    </span>
                    <Button
                      variant="danger"
                      size="small"
                      type="button"
                      onClick={() => {
                        removeLink(link);
                      }}
                      pill={true}
                      className="text-xs"
                    >
                      x
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="flex flex-col">
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-900"
          >
            Files
          </label>
          <div className="flex space-x-2 items-center">
            <Input
              id="fileInput"
              name="fileInput"
              element="input"
              accept=""
              multiple="multiple"
              type="file"
              ref={fileInputRef}
              variant="simple"
              size="normalEven"
              onInput={() => {}}
            />
          </div>
        </div>
        {isUploading ? (
          <Loading />
        ) : (
          <Button
            variant="blue"
            className="w-full"
            onClick={() => {
              submitHandler();
            }}
          >
            Pass Requirement
          </Button>
        )}
      </form>
    </div>
  );
};

export default PassRequirement;
