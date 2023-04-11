import React, { useEffect, useState } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import { useToast } from "./contexts/ToastContext";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import Toggle from "./Toggle";

const validateForm = (formState) => {
  const {
    activity,
    startDateTime,
    endDateTime,
    trackScores,
    type,
    totalScore,
  } = formState;
  const fieldEmptyMsg = "Some of the required fields are empty.";
  if (
    !activity ||
    !startDateTime ||
    !endDateTime ||
    !type ||
    (trackScores && !totalScore)
  ) {
    return fieldEmptyMsg;
  }
  if (new Date(formState.startDateTime) > new Date(formState.endDateTime)) {
    return "The 'To' time inputted is earlier than the 'From' time";
  }

  if (totalScore <= 0) {
    return "Total score can't be zero or a negative number";
  }
  return "";
};

const AddActivity = ({ params, setRefetch, setIsScoresReportOpen }) => {
  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const section = params?.section;
  const subject = params?.subject;

  const [formState, inputHandler, setFormData] = useForm({
    activity: { value: "" },
    details: { value: "" },
    startDateTime: { value: "" },
    endDateTime: { value: "" },
    trackScores: { value: false },
    type: { value: "activity" },
    totalScore: { value: 0 },
  });

  const [midFormState, inputHandlerMid] = useForm({
    date: { value: "" },
    dateOrDuration: { value: false },
    typeBoolean: { value: false },
  });

  useEffect(() => {
    if (midFormState.inputs.typeBoolean.value) {
      formState.inputs.type.value = "exam";
    } else {
      formState.inputs.type.value = "activity";
    }
  }, [midFormState.inputs.typeBoolean.value]);

  useEffect(() => {
    setFormData({
      ...formState.inputs,
      startDateTime: { value: "" },
      endDateTime: { value: "" },
    });
  }, [midFormState.inputs.dateOrDuration.value]);

  useEffect(() => {
    if (midFormState.inputs.date.value) {
      formState.inputs.startDateTime.value =
        midFormState.inputs.date.value + "T00:00";
      formState.inputs.endDateTime.value =
        midFormState.inputs.date.value + "T23:59";
    }
  }, [midFormState.inputs.date.value]);

  const submitHandler = () => {
    let processedFormState = processFormState(formState.inputs);
    const validationMsg = validateForm(processedFormState);
    processedFormState = { ...processedFormState, section, subject };

    if (validationMsg) {
      setToast({ message: validationMsg, icon: "cross" });
      return;
    } else {
      setToast(null);
    }

    axios
      .post("/api/v1/activities", processedFormState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setCustomModal(null);
          setRefetch((prev) => !prev);
          setIsScoresReportOpen(false);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("(Add Activity) An error occured.");
        console.error(err);
      });
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900 ">Add Activity</h3>
      <form className="space-y-9">
        <Input
          element="input"
          size="normalEven"
          variant="simple"
          id="activity"
          name="activity"
          type="text"
          placeholder="Enter activity title"
          label="Title"
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          onInput={inputHandler}
        />

        <Input
          element="textarea"
          size="normalEven"
          variant="simple"
          id="details"
          name="details"
          type="text"
          placeholder="Enter details (optional)"
          label="Details"
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          onInput={inputHandler}
        />
        <div>
          <label
            htmlFor="type"
            className="block mb-3 text-sm font-medium text-gray-900"
          >
            Type
          </label>
          <div className="flex w-full justify-start">
            <Toggle
              id="typeBoolean"
              checked={midFormState.inputs.typeBoolean.value}
              leftLabel="Activity"
              rightLabel="Exam"
              labelStyle="text-sm text-gray-600"
              onInput={inputHandlerMid}
              leftLabelStyle={`${
                midFormState.inputs.typeBoolean.value
                  ? "font-light"
                  : "border-b border-black border-opacity-20"
              }`}
              rightLabelStyle={`${
                midFormState.inputs.typeBoolean.value
                  ? "border-b border-black border-opacity-20"
                  : "font-light"
              }`}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
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
                id="date"
                name="date"
                element="input"
                type="date"
                containerClassName="mb-1 pt-3 w-min inline-block"
                onInput={inputHandlerMid}
                size="normal"
                variant="simple"
              />
            </>
          ) : (
            <div className="flex flex-wrap justify-between">
              <Input
                id="startDateTime"
                name="startDateTime"
                element="input"
                type="datetime-local"
                containerClassName="my-1 w-min inline-block"
                onInput={inputHandler}
                size="normal"
                variant="simple"
                label="From"
                labelStyle="text-sm font-medium text-gray-600"
              />
              <Input
                id="endDateTime"
                name="endDateTime"
                element="input"
                type="datetime-local"
                containerClassName="my-1 w-min inline-block"
                onInput={inputHandler}
                size="normal"
                variant="simple"
                label="To"
                labelStyle="text-sm font-medium text-gray-600"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-3">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-900"
          >
            Track scores
          </label>
          <div className="flex w-full justify-start">
            <Toggle
              id="trackScores"
              checked={formState.inputs.trackScores.value}
              rightLabel="Track scores"
              labelStyle="text-sm font-medium text-gray-600"
              onInput={inputHandler}
            />
          </div>
          {formState.inputs.trackScores.value ? (
            <Input
              element="input"
              id="totalScore"
              name="totalScore"
              type="number"
              label="Total Score:"
              onInput={inputHandler}
              size="normalEven"
              variant="simple"
              className="max-w-[10rem] inline-block"
              labelStyle="text-gray-900 font-light text-sm inline-block mr-3"
            />
          ) : (
            <></>
          )}
        </div>
        <Button
          variant="blue"
          className="w-full"
          onClick={() => {
            submitHandler();
          }}
        >
          Add Activity
        </Button>
      </form>
    </>
  );
};

export default AddActivity;
