import React, { useState, useEffect, useRef } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import { useToast } from "./contexts/ToastContext";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import Loading from "./Loading";

const EditRequirementAttachments = ({
  setRefetch,
  requirementId,
  section,
  subject,
  ...props
}) => {
  const [render, setRender] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [requirementDoc, setRequirementDoc] = useState(null);
  const [isRequirementDataReady, setIsRequirementDataReady] = useState(false);

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const fileInputRef = useRef(null);

  const [formState, inputHandler, setFormData] = useForm({
    links: { value: [] },
    files: { value: [] },
    filesToBeDeleted: { value: [] },
  });

  const [formStateMid, inputHandlerMid, setFormDataMid] = useForm({
    link: { value: "" },
  });

  useEffect(() => {
    axios
      .get("/api/v1/requirements", {
        params: {
          mode: "attachments",
          requirementId,
          section,
          subject,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setRequirementDoc(res.data.requirementDoc);
          formState.inputs.links.value =
            res.data.requirementDoc.statusReport[0].links;
          formState.inputs.files.value =
            res.data.requirementDoc.statusReport[0].files;
          setIsRequirementDataReady(true);
        } else {
          setToast({
            message: "Failed to fetch requirement data",
            icon: "cross",
          });
        }
      })
      .catch((err) => {
        console.log("(Fetch requirement data) An error occured.");
        console.error(err);
      });
  }, []);

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

  const removeFile = (filename: string) => {
    formState.inputs.filesToBeDeleted.value.push(filename);
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
    formData.append("mode", "editAttachments");
    formData.append("requirementId", requirementId);
    formData.append("section", section);
    formData.append("subject", subject);
    if (processedFormState.files) {
      for (const file of processedFormState.files) {
        formData.append("files", file);
      }
    }
    if (processedFormState.links && processedFormState.links.length !== 0) {
      formData.append("links", JSON.stringify(processedFormState.links));
    }
    if (
      processedFormState.filesToBeDeleted &&
      processedFormState.filesToBeDeleted.length !== 0
    ) {
      formData.append(
        "filesToBeDeleted",
        JSON.stringify(processedFormState.filesToBeDeleted)
      );
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
            message: "Requirement updated",
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
        console.log("Failed to update requirement");
        console.error(error);
      });
  };

  return (
    <>
      {isRequirementDataReady ? (
        <div className="">
          <h3 className="mb-4 text-xl font-medium text-gray-900 ">
            Edit Attachments
          </h3>
          <form className="space-y-9">
            <div className="flex flex-col space-y-0">
              <div>
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
                    {formState.inputs.links.value.map(
                      (link: string, i: number) => {
                        return (
                          <li
                            key={i}
                            className="flex justify-between items-center"
                          >
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
                      }
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <div>
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
              {formState.inputs.files.value.length !== 0 && (
                <div>
                  <ul className="w-min mt-2 flex flex-col space-y-2">
                    {formState.inputs.files.value.map(
                      (filename: string, i: number) => {
                        return (
                          <li
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span
                              className={`text-sm font-light text-gray-900 pr-2 whitespace-nowrap ${
                                formState.inputs.filesToBeDeleted.value.includes(
                                  filename
                                )
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {filename}
                            </span>
                            {formState.inputs.filesToBeDeleted.value.includes(
                              filename
                            ) ? (
                              <></>
                            ) : (
                              <Button
                                variant="danger"
                                size="small"
                                type="button"
                                onClick={() => {
                                  removeFile(filename);
                                }}
                                pill={true}
                                className="text-xs"
                              >
                                x
                              </Button>
                            )}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              )}
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
                Update Attachments
              </Button>
            )}
          </form>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default EditRequirementAttachments;
