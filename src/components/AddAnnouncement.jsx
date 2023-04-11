import React, { useState } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import { useToast } from "./contexts/ToastContext";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";
import Tooltip from "./Tooltip";
import { useData } from "./contexts/DataContext";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";

const selectScope = "Select Scope";

const validateForm = (formState, indefinite) => {
  const fieldEmptyMsg = "Some of the required fields are empty.";
  if (!formState.title || !formState.scope || formState.scope === selectScope) {
    return fieldEmptyMsg;
  }
  if (!indefinite) {
    if (!formState.startDateTime || !formState.endDateTime) {
      return fieldEmptyMsg;
    }

    if (new Date(formState.startDateTime) > new Date(formState.endDateTime)) {
      return "The 'To' time inputted is earlier than the 'From' time";
    }
  }
  return "";
};

const AddAnnouncement = ({ mode, params, setRefetch }) => {
  const date = new Date();
  date.setHours(date.getHours() + 8);

  const nowDateTimeLocalString = date.toISOString().slice(0, -8);

  date.setDate(date.getDate() + 7);

  const laterDateTimeLocalString = date.toISOString().slice(0, -8);

  const [pin, setPin] = useState(false);
  const [indefinite, setIndefinite] = useState(false);
  const { data } = useData();

  const section = params?.section;
  const subject = params?.subject;

  const scopes = [
    {
      value: "school",
      name: "School",
    },
  ];

  if (!data.user.nonTeaching) {
    if (data.user.adviseeSection) {
      scopes.push({
        value: "adviseeSection",
        name: `Advisee Section (${
          data.map.sections.find(
            (sectionItem) => sectionItem.value === data.user.adviseeSection
          ).name
        })`,
      });
    }

    if (mode === "subjectClass") {
      scopes.push({
        value: "subjectClass",
        name: `Subject Class (${
          data.map.subjects.find((subjectItem) => subjectItem.value === subject)
            .name
        } class in ${
          data.map.sections.find((sectionItem) => sectionItem.value === section)
            .name
        })`,
      });
    }
  }

  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const [formState, inputHandler, setFormData] = useForm({
    title: { value: "" },
    details: { value: "" },
    pin: { value: pin },
    scope: { value: "" },
    indefinite: { value: "" },
  });
  const [formState2, inputHandler2, setFormData2] = useForm({
    startDateTime: { value: "" },
    endDateTime: { value: "" },
  });

  let allFormState;

  const submitHandler = () => {
    setToast(null);
    const processedFormState = processFormState(formState.inputs);

    const processedFormState2 = processFormState(formState2.inputs);

    if (indefinite) {
      allFormState = { ...processedFormState };
    } else {
      allFormState = { ...processedFormState, ...processedFormState2 };
    }

    if (allFormState.scope === "subjectClass") {
      allFormState = { ...allFormState, section, subject };
    } else if (allFormState.scope === "adviseeSection") {
      allFormState = { ...allFormState, section: data.user.adviseeSection };
    }

    allFormState = {
      ...allFormState,
      author: {
        _id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      },
    };

    const validationMsg = validateForm(allFormState, indefinite);
    if (validationMsg) {
      setToast({ message: validationMsg, icon: "cross" });
      return;
    }

    axios
      .post("/api/v1/announcements", allFormState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setCustomModal(null);
          setRefetch((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("(Add Announcement) An error occured.");
        console.error(err);
      });
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900 ">
        Add Announcement
      </h3>
      <form className="space-y-6">
        <Input
          element="input"
          size="normalEven"
          variant="simple"
          id="title"
          name="title"
          type="text"
          placeholder="Enter title"
          label="Title"
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          onInput={inputHandler}
          required
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

        <div className="flex items-center flex-wrap">
          <Select
            id="scope"
            name="scope"
            arrayOfData={scopes}
            onSelect={inputHandler}
            label={selectScope}
            className="w-auto"
            display="inline-block"
            variant="simple"
            size="normal2"
          />

          <Tooltip
            size={25}
            message="Select which users will be able to see this announcement."
          />
        </div>

        <div className="flex items-center flex-wrap">
          <div className="flex items-center flex-wrap mr-10">
            <Input
              id="pin"
              name="pin"
              element="input"
              type="checkbox"
              label="Pin"
              labelStyle="ml-2 text-sm font-medium text-gray-900"
              containerClassName="w-min inline-block"
              labelPosition="right"
              onInput={inputHandler}
              checked={pin}
              onClick={() => {
                setPin((prev) => !prev);
              }}
            />

            <Tooltip
              size={25}
              message="Pinned announcements are shown before unpinned announcements."
            />
          </div>

          <div className="flex items-center flex-wrap">
            <Input
              id="indefinite"
              name="indefinite"
              element="input"
              type="checkbox"
              label="Always Show"
              labelStyle="ml-2 text-sm font-medium text-gray-900"
              containerClassName="w-max inline-block"
              labelPosition="right"
              onInput={inputHandler}
              checked={indefinite}
              onClick={() => {
                setIndefinite((prev) => !prev);
              }}
            />

            <Tooltip
              size={25}
              message="Always show announcement (unless deleted)."
            />
          </div>
        </div>
        <div className="">
          <p className="block mb-2 text-sm font-medium text-gray-900">
            Duration
          </p>
          <div className="flex items-center flex-wrap justify-between">
            <div className="mr-6">
              <label
                htmlFor="startDateTime"
                className="block mb-1 text-sm font-medium text-gray-600"
              >
                From
              </label>
              <Input
                defaultValue={nowDateTimeLocalString}
                disabled={indefinite}
                id="startDateTime"
                name="startDateTime"
                element="input"
                type="datetime-local"
                containerClassName="my-1 w-min inline-block"
                onInput={inputHandler2}
                size="normal"
                variant="simple"
              />
            </div>

            <div className="">
              <label
                htmlFor="endDateTime"
                className="block mb-1 text-sm font-medium text-gray-600"
              >
                To
              </label>
              <Input
                defaultValue={laterDateTimeLocalString}
                disabled={indefinite}
                id="endDateTime"
                name="endDateTime"
                element="input"
                type="datetime-local"
                containerClassName="my-1 w-min inline-block"
                onInput={inputHandler2}
                size="normal"
                variant="simple"
              />
            </div>
          </div>
        </div>

        <Button
          variant="blue"
          className="w-full"
          onClick={() => {
            submitHandler();
          }}
        >
          Add Announcement
        </Button>
      </form>
    </>
  );
};

export default AddAnnouncement;
