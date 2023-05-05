import React, { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { useForm, processFormState } from "./hooks/formHook";
import { useToast } from "./contexts/ToastContext";
import { useCustomModal } from "./contexts/CustomModalContext";
import Toggle from "./Toggle";
import axios from "axios";
import { useData } from "./contexts/DataContext";
import useUpdateEffect from "./hooks/useUpdateEffect";

const EditAttendanceRecord = ({ record, _id, ...props }) => {
  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();
  const { data } = useData();

  const date = new Date(record.start);
  const options = { month: "short", day: "numeric", year: "numeric" };
  // hour: 'numeric', minute: 'numeric'
  const dateTimeString = date.toLocaleString("en-US", options);

  const [formState, inputHandler, setFormData] = useForm({
    status: { value: record.title.toLowerCase() === "present" },
    time: { value: record.time ? record.time : "" },
    date: { value: record.start },
    _id: { value: _id },
  });

  useUpdateEffect(() => {
    if (formState.inputs.status.value === false) {
      formState.inputs.time.value = "";
    }
  }, [formState.inputs.status.value]);

  const submitHandler = () => {
    let processedFormState = processFormState(formState.inputs);

    if (!processedFormState.status) {
      setToast({
        icon: "cross",
        message: "Some of the required fields are empty",
      });
    }


    setToast(null);

    axios
      .patch("/api/v1/attendance/record", processedFormState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update record");
        console.error(error);
        setToast({ message: "Failed to update record", icon: "cross" });
      });
  };

  return (
    <div className="text-gray-900">
      {(data.user.role === "admin" && !data.user.nonTeaching) ||
      data.user.role === "superadmin" ? (
        <>
          <h3 className="mb-5 text-xl font-medium text-gray-900 ">
            Edit Record ({dateTimeString})
          </h3>
          <form className="space-y-7">
            <div>
              <label
                htmlFor="type"
                className="block mb-3 text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <div className="flex w-full justify-start">
                <Toggle
                  id="status"
                  checked={formState.inputs.status.value}
                  defaultValue={formState.inputs.status.value}
                  leftLabel="Absent"
                  rightLabel="Present"
                  labelStyle="text-sm text-gray-600"
                  onInput={inputHandler}
                  leftLabelStyle={`${
                    formState.inputs.status.value
                      ? "font-light"
                      : "border-b border-black border-opacity-20"
                  }`}
                  rightLabelStyle={`${
                    formState.inputs.status.value
                      ? "border-b border-black border-opacity-20"
                      : "font-light"
                  }`}
                />
              </div>
            </div>
            {formState.inputs.status.value === true ? (
              <Input
                id="time"
                name="time"
                element="input"
                type="time"
                containerClassName="inline-block flex flex-col space-y-3"
                onInput={inputHandler}
                size="normal"
                variant="simple"
                label={
                  <>
                    Arrival Time
                    <br />
                    <span className="text-sm font-light">
                      (Leave this blank if unknown)
                    </span>
                  </>
                }
                labelStyle="font-medium text-gray-600"
                className="w-min"
                defaultValue={formState.inputs.time.value}
              />
            ) : (
              <></>
            )}
            <Button
              variant="blue"
              className="w-full"
              onClick={() => {
                submitHandler();
              }}
            >
              Update Record
            </Button>
          </form>
        </>
      ) : (
        <div className="flex flex-col space-y-2">
          <h4 className="my-1">
            {record.title} at {dateTimeString}
          </h4>
          <span className="font-light text-sm">
            {record.title !== "Absent" ? (
              record.time ? (
                <>Arrived at {record.time}</>
              ) : (
                <>Arrival time unknown</>
              )
            ) : (
              <></>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default EditAttendanceRecord;
