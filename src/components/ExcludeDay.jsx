import React, { useState, useEffect } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import { useToast } from "./contexts/ToastContext";
import Toggle from "./Toggle";

const fieldEmptyMsg = "Some of the required fields are empty.";

const ExcludeDay = ({ onExclusionAdded, ...props }) => {
  const [formState, inputHandler] = useForm({
    title: { value: "" },
    start: { value: "" },
    end: { value: "" },
  });

  const [midFormState, inputHandlerMid] = useForm({
    dateOrDuration: { value: false },
  });

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  useEffect(() => {
    if (!midFormState.inputs.dateOrDuration.value) {
      formState.inputs.end.value = "";
    }
  }, [midFormState.inputs.dateOrDuration.value]);

  const submitHandler = (event) => {
    event.preventDefault();
    let processedFormState = processFormState(formState.inputs);

    if (
      !processedFormState.title ||
      !processedFormState.start ||
      (midFormState.inputs.dateOrDuration.value === true &&
        !processedFormState.end)
    ) {
      setToast({ message: fieldEmptyMsg, icon: "cross" });
      return;
    }

    if (midFormState.inputs.dateOrDuration.value === true) {
      if (
        new Date(processedFormState.start) > new Date(processedFormState.end)
      ) {
        setToast({
          message:
            "The end date inputted is earlier than the start date inputted",
          icon: "cross",
        });
        return;
      }
    }

    setToast(null);

    console.log("processedFormState", processedFormState);

    const startDate = new Date(processedFormState.start);
    const endDate = new Date(processedFormState.end);

    const processedFormStateConverted = {
      title: processedFormState.title,
      start: startDate,
    };
    if (processedFormState.end) {
      processedFormStateConverted.end = endDate;
    }

    console.log("processedFormStateConverted", processedFormStateConverted);

    axios
      .post("/api/v1/attendance/exclusions", processedFormState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setCustomModal(null);
          onExclusionAdded(processedFormStateConverted);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
        setToast({ message: "Unauthorized", icon: "cross" });
      });
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900 ">Exclude Day/s</h3>
      <form onSubmit={submitHandler} className="space-y-5 flex flex-col">
        <Input
          element="input"
          size="normalEven"
          variant="simple"
          id="title"
          name="title"
          type="text"
          placeholder="Enter label / reason"
          label="Label / Reason"
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          onInput={inputHandler}
        />
        <div className="flex flex-col space-y-3">
          <label
            htmlFor="dateOrDuration"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            Date or duration
          </label>
          <div className="flex w-full justify-start">
            <Toggle
              id="dateOrDuration"
              checked={midFormState.inputs.dateOrDuration.value}
              rightLabel="Duration"
              leftLabel="Specific Day"
              labelStyle="text-sm text-gray-600"
              onInput={inputHandlerMid}
              leftLabelStyle={`${
                midFormState.inputs.dateOrDuration.value
                  ? "font-light"
                  : "border-b border-black border-opacity-20"
              }`}
              rightLabelStyle={`${
                midFormState.inputs.dateOrDuration.value
                  ? "border-b border-black border-opacity-20"
                  : "font-light"
              }`}
            />
          </div>
          {!midFormState.inputs.dateOrDuration.value ? (
            <>
              <Input
                id="start"
                name="start"
                element="input"
                type="date"
                containerClassName="w-min inline-block"
                onInput={inputHandler}
                size="normal"
                variant="simple"
                label="Date"
                labelStyle="text-sm font-medium text-gray-600"
              />
            </>
          ) : (
            <div className="flex flex-wrap justify-between">
              <Input
                id="start"
                name="start"
                element="input"
                type="date"
                containerClassName="w-min inline-block"
                onInput={inputHandler}
                size="normal"
                variant="simple"
                label="From"
                labelStyle="text-sm font-medium text-gray-600"
              />
              <Input
                id="end"
                name="end"
                element="input"
                type="date"
                containerClassName="w-min inline-block"
                onInput={inputHandler}
                size="normal"
                variant="simple"
                label="To"
                labelStyle="text-sm font-medium text-gray-600"
              />
            </div>
          )}
        </div>

        <Button
          variant="blue"
          className="w-full"
          onClick={(event) => {
            submitHandler(event);
          }}
        >
          Exclude Day/s
        </Button>
      </form>
    </>
  );
};

export default ExcludeDay;
