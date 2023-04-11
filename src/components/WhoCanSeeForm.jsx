import React from "react";
import Input from "./Input";
import Tooltip from "./Tooltip";

const checkboxContainerClassName = "w-max my-2  text-sm font-light";
const checkboxGroupClassName = "flex space-x-[0.2rem] mr-9";

const WhoCanSeeForm = ({ formState, inputHandler, defaultState, ...props }) => {
  return (
    <div className={`${props.className}`}>
      <h6 className="mb-3">Who will be able to see these info?</h6>
      <div className="flex flex-wrap">
        <span className={checkboxGroupClassName}>
          <Input
            id="student"
            name="student"
            element="input"
            type="checkbox"
            label="&nbsp;Students"
            labelPosition="right"
            onInput={inputHandler}
            width="w-max"
            checked={formState.inputs.student.value}
            containerClassName={checkboxContainerClassName}
            labelStyle="pointer-events-none"
            defaultValue={defaultState.student.value}
          />
          <Tooltip
            size={25}
            message="All students of GARSHS. Both those who are currently studying and those who have graduated."
            className="inline-block"
          />
        </span>

        <span className={checkboxGroupClassName}>
          <Input
            id="adminTeaching"
            name="adminTeaching"
            element="input"
            type="checkbox"
            label="&nbsp;Admins (Teaching)"
            labelPosition="right"
            onInput={inputHandler}
            width="w-max"
            checked={formState.inputs.adminTeaching.value}
            containerClassName={checkboxContainerClassName}
            labelStyle="pointer-events-none"
            defaultValue={defaultState.adminTeaching.value}
          />
          <Tooltip
            size={25}
            message="Teachers of GARSHS."
            className="inline-block"
          />
        </span>

        <span className={checkboxGroupClassName}>
          <Input
            id="adminNonTeaching"
            name="adminNonTeaching"
            element="input"
            type="checkbox"
            label="&nbsp;Admins (Non-teaching)"
            labelPosition="right"
            onInput={inputHandler}
            width="w-max"
            checked={formState.inputs.adminNonTeaching.value}
            containerClassName={checkboxContainerClassName}
            labelStyle="pointer-events-none"
            defaultValue={defaultState.adminNonTeaching.value}
          />
          <Tooltip
            size={25}
            message="Non-teaching staff of GARSHS, club officers, etc."
            className="inline-block"
          />
        </span>

        <span className={checkboxGroupClassName}>
          <Input
            id="superadmin"
            name="superadmin"
            element="input"
            type="checkbox"
            label="&nbsp;Superadmins"
            labelPosition="right"
            onInput={inputHandler}
            width="w-max"
            checked={formState.inputs.superadmin.value}
            containerClassName={checkboxContainerClassName}
            labelStyle="pointer-events-none"
            defaultValue={defaultState.superadmin.value}
          />
          <Tooltip
            size={25}
            message="School principal, website maintainer, etc."
            className="inline-block"
          />
        </span>
      </div>
    </div>
  );
};

export default WhoCanSeeForm;
