import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, processFormState } from "./hooks/formHook";
import Button from "./Button";
import Input from "./Input";
import passwordValidator from "password-validator";
import { useToast } from "./contexts/ToastContext";

let schema = new passwordValidator();

schema.is().min(8).is().max(100).has().not().spaces();

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const { setToast } = useToast();
  const navigate = useNavigate();

  const [formState, inputHandler] = useForm({
    newPassword: { value: "" },
    newPasswordConfirmation: { value: "" },
  });

  const submitNewPasswordHandler = (event) => {
    event.preventDefault();
    console.log("password reset");

    let processedFormState = processFormState(formState.inputs);

    if (
      !processedFormState.newPassword ||
      !processedFormState.newPasswordConfirmation
    ) {
      setToast({
        icon: "cross",
        message: "Some of the required fields are empty",
      });
      return;
    }

    let passwordValidation = schema.validate(processedFormState.newPassword, {
      details: true,
    });
    if (passwordValidation.length !== 0) {
      setToast({ icon: "cross", message: passwordValidation[0].message });
      return;
    }

    if (
      processedFormState.newPassword !==
      processedFormState.newPasswordConfirmation
    ) {
      setToast({ icon: "cross", message: "Passwords do not match" });
      return;
    }

    setToast(null);

    delete processedFormState.newPasswordConfirmation;

    console.log(processedFormState);

    axios
      .post(
        "/api/v1/users/reset-password",
        {
          token: searchParams.get("token"),
          id: searchParams.get("id"),
          newPassword: processedFormState.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({
            icon: "check",
            message: res.data.msg + ". Redirecting...",
            lifetime: 7000,
          });
          setTimeout(() => {
            navigate("/auth");
          }, 3000);
        } else {
          setToast({ icon: "cross", message: res.data.msg });
        }
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to request account password reset");
      });
  };

  const inputClassName = "max-w-xs font-light text-xs";

  return (
    <div className="w-full xl:w-auto flex items-start xl:items-center justify-center flex-none py-1 px-1 sm:py-3 sm:px-6 xl:pl-0 xl:pr-16 xl:pt-16  2xl:pr-20 xl:col-span-2">
      <div className="max-w-xl w-full  bg-white text-sm text-gray-900 p-8 rounded-xl shadow-sm xs:w-4/5 min-w-2/3">
        <h2 className="text-center pt-1 pb-3 md:pb-4 text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-sky-500 text-2xl md:text-3xl">
          Set New Password
        </h2>
        <Input
          id="newPassword"
          name="newPassword"
          element="input"
          type="password"
          label="New Password:&nbsp;"
          placeholder="••••••••"
          onInput={inputHandler}
          size="normalEven"
          variant="simple"
          className={`${inputClassName} mt-2`}
        />
        <Input
          id="newPasswordConfirmation"
          name="newPasswordConfirmation"
          element="input"
          type="password"
          label="Confirm New Password:&nbsp;"
          placeholder="••••••••"
          onInput={inputHandler}
          size="normalEven"
          variant="simple"
          className={`${inputClassName} mt-2`}
        />
        <div className="pt-4 flex items-center justify-between">
          <Button
            type="submit"
            variant="primary"
            onClick={(event) => submitNewPasswordHandler(event)}
          >
            Submit New Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
