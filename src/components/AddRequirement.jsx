import React, { useState, useEffect } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import { useToast } from "./contexts/ToastContext";

const fieldEmptyMsg = "Some of the required fields are empty.";

const AddRequirement = ({
  params,
  setRefetch,
  setIsStatusReportOpen,
  ...props
}) => {
  const [formState, inputHandler] = useForm({
    requirement: { value: "" },
    details: { value: "" },
    deadlineDateTime: { value: "" },
  });

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const section = params?.section;
  const subject = params?.subject;

  const submitHandler = (event) => {
    event.preventDefault();
    let processedFormState = processFormState(formState.inputs);

    console.log("processedFormState", processedFormState);

    if (
      !processedFormState.requirement ||
      !processedFormState.deadlineDateTime
    ) {
      setToast({ message: fieldEmptyMsg, icon: "cross" });
      return;
    } else {
      setToast(null);
    }

    const now = new Date();
    now.setHours(now.getHours() + 8);
    const nowDateString = now.toISOString().slice(0, 16);
    processedFormState = {
      ...processedFormState,
      announceDateTime: nowDateString,
      section,
      subject,
    };
    const finalFormState = JSON.stringify(processedFormState);
    console.log("finalFormState", finalFormState);

    axios
      .post("/api/v1/requirements", finalFormState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setCustomModal(null);
          setRefetch((prev) => !prev);
          setIsStatusReportOpen(false);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900 ">
        Add Requirement
      </h3>
      <form onSubmit={submitHandler} className="space-y-6">
        <Input
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          size="normalEven"
          variant="simple"
          id="requirement"
          name="requirement"
          onInput={inputHandler}
          element="input"
          label="Requirement"
          placeholder="Enter requirement"
          type="text"
        />
        <Input
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          size="normalEven"
          variant="simple"
          id="details"
          name="details"
          onInput={inputHandler}
          element="textarea"
          label="Details"
          type="text"
          placeholder="Enter details (optional)"
        />
        <span className="flex justify-between w-full">
          <Input
            labelStyle="block mb-2 text-sm font-medium text-gray-900"
            size="normalEven"
            variant="simple"
            label="Deadline"
            id="deadlineDateTime"
            name="deadlineDateTime"
            onInput={inputHandler}
            element="input"
            type="datetime-local"
            className="w-min"
          />
        </span>
        <br />
        <Button
          variant="blue"
          className="w-full"
          onClick={(event) => {
            submitHandler(event);
          }}
        >
          Add Requirement
        </Button>
      </form>
    </>
  );
};

export default AddRequirement;
