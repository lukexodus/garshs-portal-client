import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import roles from "../config/roles";
import { storeToken } from "../services/auth";
import { validateLRN, validateEmail } from "../utils/utils";
import { useForm, processFormState } from "./hooks/formHook";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import passwordValidator from "password-validator";
import { IoMdArrowRoundBack } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY } from "../config/config";

let schema = new passwordValidator();

schema.is().min(8).is().max(100).not().spaces();

const whatSubject = "what subject";
const whatSection = "what section";
const selectRole = "Select Role";
const selectSection = "Select Section";
const selectAdviseeSection = "Select Advisee Section";

const validateForm = (formState, isLoginMode) => {
  const fieldEmptyMsg = "Some of the required fields are empty.";
  let LRNInvalidMsg = "";
  if (!isLoginMode) {
    if (!formState.role || formState.role === selectRole) {
      return fieldEmptyMsg;
    }
    if (
      !formState.firstName ||
      !formState.lastName ||
      !formState.email ||
      !formState.password ||
      !formState.confirmPassword
    ) {
      return fieldEmptyMsg;
    }
    if (formState.role === "student") {
      if (
        !formState.lrn ||
        !formState.section ||
        formState.section === selectSection
      ) {
        return fieldEmptyMsg;
      } else {
        LRNInvalidMsg = validateLRN(String(formState.lrn));
        if (LRNInvalidMsg) {
          return LRNInvalidMsg;
        }
      }
    } else if (
      formState.role === "admin" &&
      !formState.nonTeaching &&
      !formState.subjectClasses
    ) {
      return fieldEmptyMsg;
    }

    if (formState.password !== formState.confirmPassword) {
      return "Passwords do not match";
    }

    let passwordValidation = schema.validate(formState.password, {
      details: true,
    });
    if (passwordValidation.length !== 0) {
      return passwordValidation[0].message;
    }
  } else {
    if (!formState.email || !formState.password) {
      return fieldEmptyMsg;
    }
  }
  return "";
};

const Auth = (props) => {
  const [formState, inputHandler, setFormData] = useForm({
    email: { value: "" },
    password: { value: "" },
    confirmPassword: { value: "" },
    firstName: { value: "" },
    lastName: { value: "" },
    role: { value: "" },
    LRN: { value: 0 },
    section: { value: "" },
    adviseeSection: { value: "" },
    subjectClasses: { value: {} },
    gradeLevel: { value: "" },
    nonTeaching: { value: "" },
  });

  const [midDataState, midInputHandler] = useForm({
    subject: { value: whatSubject },
    section: { value: whatSection },
  });

  const formRef = useRef(null);
  const captchaRef = useRef(null);

  const navigate = useNavigate();

  const { setData } = useData();
  const { setToast } = useToast();

  const [validToken, setValidToken] = useState([]);
  const [render, setRender] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isInResetPasswordMode, setIsInResetPasswordMode] = useState(false);
  const [authRoute, setAuthRoute] = useState(`/api/v1/users/login`);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isNonTeaching, setIsNonTeaching] = useState(false);
  const [stateDataMsg2, setStateDataMsg2] = useState(null);

  const location = useLocation();
  let stateDataMsg;
  const stateData = location.state;
  if (stateData) {
    stateDataMsg = stateData.msg;
  }

  const gradeLevelHandler = useCallback(inputHandler, [formState.section]);

  useEffect(() => {
    if (localStorage.getItem("authMessage")) {
      setStateDataMsg2(localStorage.getItem("authMessage"));
      localStorage.removeItem("authMessage");
    }

    axios
      .get("/api/v1/data", {
        params: { dataToFetch: JSON.stringify(["sections", "subjects"]) },
      })
      .then((res) => {
        if (res.data.success) {
          setSections(res.data.sections);
          setSubjects(res.data.subjects);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    gradeLevelHandler(
      "gradeLevel",
      formState.inputs.section.value.match(/^\d*/)[0]
    );
  }, [formState.inputs.section.value]);

  useEffect(() => {
    const role = formState.inputs.role.value;
    if (role === "student") {
      setFormData({
        ...formState.inputs,
        adviseeSection: { value: "" },
        subjectClasses: { value: {} },
        nonTeaching: { value: "" },
      });
    } else if (role === "admin") {
      setFormData({
        ...formState.inputs,
        lrn: { value: 0 },
        section: { value: "" },
        nonTeaching: { value: isNonTeaching },
      });
    } else if (role === "parent") {
      setFormData({
        ...formState.inputs,
        lrn: { value: 0 },
        adviseeSection: { value: "" },
        subjectClasses: { value: {} },
        nonTeaching: { value: "" },
      });
    }
  }, [formState.inputs.role.value]);

  const switchModeHandler = () => {
    setIsLoginMode((prev) => !prev);
    setToast(null);
    setIsNonTeaching(false);
    if (isLoginMode) {
      setAuthRoute(`/api/v1/users/register`);
      // captchaRef.current.execute();
    } else {
      setAuthRoute(`/api/v1/users/login`);
      setFormData({
        ...formState.inputs,
        firstName: { value: "" },
        lastName: { value: "" },
        role: { value: "" },
        lrn: { value: 0 },
        section: { value: "" },
        adviseeSection: { value: "" },
        subjectClasses: { value: {} },
        gradeLevel: { value: "" },
        nonTeaching: { value: "" },
      });
    }
  };

  const addSubjectClassHandler = () => {
    const section = midDataState.inputs.section.value;
    const subject = midDataState.inputs.subject.value;
    if (
      section === whatSection ||
      !section ||
      subject === whatSubject ||
      !subject
    ) {
      setToast({
        message: "Please enter both subject and section.",
        icon: "cross",
      });
      return;
    } else {
      setToast(null);
    }

    if (!formState.inputs.subjectClasses.value[section]) {
      formState.inputs.subjectClasses.value[section] = [subject];
      setRender((prev) => !prev);
    } else if (
      formState.inputs.subjectClasses.value[section].includes(subject)
    ) {
      return;
    } else {
      formState.inputs.subjectClasses.value[section].push(subject);
      setRender((prev) => !prev);
    }
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (formState.inputs.adviseeSection.value === selectAdviseeSection) {
      formState.inputs.adviseeSection.value = "";
    } else if (formState.inputs.nonTeaching.value) {
      formState.inputs.subjectClasses.value = {};
    }
    let processedFormState = processFormState(formState.inputs);

    const validationStr = validateForm(processedFormState, isLoginMode);
    if (validationStr) {
      setToast({ message: validationStr, icon: "cross" });
      return;
    } else {
      setToast(null);
    }

    if (!isLoginMode) {
      const verifyToken = async (token) => {
        const APIResponse = [];

        try {
          let res = await axios.post(`/api/v1/verify-recaptcha-token`, {
            reCAPTCHA_TOKEN: token,
            secretKey: RECAPTCHA_SECRET_KEY,
          });

          APIResponse.push(res["data"]);
          return APIResponse;
        } catch (error) {
          console.log(error);
          console.log("Failed to verify token (reCAPTCHA)");
        }
      };

      const token = captchaRef.current.getValue();
      captchaRef.current.reset();

      if (token) {
        let validToken = await verifyToken(token);
        setValidToken(validToken);

        if (validToken[0].success === true) {
          console.log("verified");
        } else {
          console.log("not verified");
          setToast({ icon: "cross", message: "Verify you are not a bot" });
          return;
        }
      } else {
        setToast({ icon: "cross", message: "Verify you are not a bot" });
        return;
      }
    }

    delete processedFormState.confirmPassword;

    axios
      .post(authRoute, JSON.stringify(processedFormState), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          if (res.data.role === "student") {
            storeToken(res.data);
            setData({
              user: res.data.user,
              map: res.data.map,
              subjects: res.data.subjects,
            });
            navigate("/dashboard");
          } else {
            if (res.data.mode === "login") {
              storeToken(res.data);
              setData({ user: res.data.user, map: res.data.map });
              navigate("/dashboard");
            } else {
              setToast({
                message:
                  "Account requested. Please ask for the approval of your account from the school admins",
                icon: "check",
              });
              // formRef.current.reset();
              // const textInputs = document.querySelectorAll('input[type="text"]');
              // const numInputs = document.querySelectorAll('input[type="number"]');
              // const selects = document.querySelectorAll('select');

              // for (let i = 0; i < textInputs.length; i++) {
              //     textInputs[i].value = '';
              // }

              // for (let i = 0; i < numInputs.length; i++) {
              //     numInputs[i].value = 0;
              // }

              // for (let i = 0; i < selects.length; i++) {
              //     selects[i].selectedIndex = 0;
              // }
              // setFormData({
              //     email: { value: ''},
              //     password: {value: ''},
              //     firstName: {value: ''},
              //     lastName: {value: ''},
              //     role: {value: ''},
              //     LRN: {value: 0},
              //     section: { value: '' },
              //     adviseeSection: { value: '' },
              //     subjectClasses: { value: {} },
              //     gradeLevel: { value: '' },
              //     nonTeaching: { value: '' }
              // })
            }
          }
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("(Auth) An error occured.");
        console.error(error);
      });
  };

  const requestPasswordResetHandler = (event) => {
    event.preventDefault();
    console.log("request password reset");

    let processedFormState = processFormState(formState.inputs);

    if (!validateEmail(processedFormState.email)) {
      setToast({ message: "Email is not valid", icon: "cross" });
      return;
    }

    setToast(null);

    axios
      .post(
        "/api/v1/users/request-reset-password",
        { email: processedFormState.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ icon: "check", message: res.data.msg, lifetime: 7000 });
        } else {
          setToast({ icon: "cross", message: res.data.msg });
        }
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to request account password reset");
      });
  };

  const inputClassName = "max-w-[14.5rem] sm:max-w-xs font-light text-xs";

  return (
    <div className="xl:min-h-full bg-indigo-600 flex xl:grid xl:grid-cols-5">
      <div className="hidden xl:flex xl:items-start px-5 xl:col-span-3 relative h-max">
        <img src="/login.svg" className="w-[200%]" />
        <span className="absolute xl:-bottom-14 2xl:-bottom-12 3xl:bottom-16 xl:w-[50rem] xl:mx-auto left-0 right-0 transform text-center text-white text-5xl font-black">
          Your{" "}
          <mark class="px-2 text-white bg-gradient-to-r hover:bg-gradient-to-l from-indigo-500 to-sky-400 rounded dark:bg-blue-500">
            All-in-One
          </mark>{" "}
          Learning Partner
        </span>
      </div>

      <div className="w-full xl:w-auto flex items-start xl:items-center justify-center flex-none py-10 px-8 sm:px-16 xl:pl-0 xl:pr-16 xl:pt-16 2xl:pr-20 xl:col-span-2">
        <div className="max-w-xl w-full  bg-white text-sm text-gray-900 p-8 rounded-xl shadow-sm xs:w-4/5 min-w-2/3">
          {isInResetPasswordMode ? (
            <span
              className="flex space-x-1 items-center group mb-3"
              onClick={() => setIsInResetPasswordMode(false)}
            >
              <span className="">
                <IoMdArrowRoundBack size={27} className="fill-indigo-600" />
              </span>
              <span className="text-lg group-hover:underline text-indigo-700">
                Go back
              </span>
            </span>
          ) : (
            <></>
          )}
          <h2 className="text-center pt-1 pb-3 md:pb-4 text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-sky-500 text-2xl md:text-3xl">
            {isInResetPasswordMode
              ? "Reset Password"
              : isLoginMode
              ? "LOGIN"
              : "SIGN UP"}
          </h2>
          <div className="text-center text-red-300">{stateDataMsg2}</div>
          <div className="text-center text-red-300">{stateDataMsg}</div>
          <div className="pb-1"></div>
          <form
            onSubmit={authSubmitHandler}
            ref={formRef}
            className="flex flex-col space-y-1"
          >
            {/* GLOBAL */}

            {!isLoginMode && !isInResetPasswordMode && (
              <>
                <Input
                  element="input"
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="First Name:&nbsp;"
                  placeholder="Enter your first name"
                  onInput={inputHandler}
                  size="normalEven"
                  variant="simple"
                  className={inputClassName}
                />
                <Input
                  element="input"
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="Last Name:&nbsp;"
                  placeholder="Enter your last name"
                  onInput={inputHandler}
                  size="normalEven"
                  variant="simple"
                  className={inputClassName}
                />
                <div>
                  <span className="flex items-center justify-between">
                    <span>{selectRole}:&nbsp;</span>
                    <Select
                      id="role"
                      name="role"
                      label={selectRole}
                      arrayOfData={roles}
                      onSelect={inputHandler}
                      className="w-auto"
                      display="inline-block"
                      variant="simple"
                      size="normal2"
                    />
                  </span>
                </div>
              </>
            )}

            {/* STUDENT */}

            {!isLoginMode &&
              !isInResetPasswordMode &&
              formState.inputs.role.value === "student" && (
                <div>
                  <span className="flex items-center justify-between">
                    <span>{selectSection}:&nbsp;</span>
                    <Select
                      id="section"
                      name="section"
                      label={selectSection}
                      arrayOfData={sections}
                      onSelect={inputHandler}
                      className="w-auto"
                      display="inline-block"
                      variant="simple"
                      size="normal2"
                    />
                  </span>
                  <Input
                    element="input"
                    id="lrn"
                    name="lrn"
                    type="number"
                    label="LRN:&nbsp;"
                    onInput={inputHandler}
                    size="normalEven"
                    variant="simple"
                    className={inputClassName}
                  />
                </div>
              )}

            {/* ADMIN */}

            {!isLoginMode &&
              !isInResetPasswordMode &&
              formState.inputs.role.value === "admin" && (
                <>
                  <div className="py-3">
                    <hr />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="">{selectAdviseeSection}:&nbsp;</span>
                    <Select
                      id="adviseeSection"
                      name="adviseeSection"
                      label={selectAdviseeSection}
                      arrayOfData={sections}
                      onSelect={inputHandler}
                      disabled={isNonTeaching}
                      className="w-auto"
                      display="inline-block"
                      variant="simple"
                      size="normal2"
                    />
                  </div>
                  {formState.inputs.adviseeSection.value &&
                    formState.inputs.adviseeSection.value !==
                      selectAdviseeSection && (
                      <>
                        <div className="py-1"></div>
                        <span
                          className={`${
                            isNonTeaching ? "opacity-50" : ""
                          } ml-5 px-4 max-w-md duration-300 py-2 my-3 bg-indigo-100 rounded-lg flex flex-col shadow-sm`}
                        >
                          <span className="text-lg border-b border-indigo-300 mb-2 py-1">
                            {
                              sections.find(
                                (doc) =>
                                  doc.value ===
                                  formState.inputs.adviseeSection.value
                              ).name
                            }
                          </span>
                          <span>Advisee Section</span>
                        </span>
                      </>
                    )}
                  <div className="py-2"></div>
                  <div>
                    <span className="">Add Subject Classes:</span>
                    <br />
                    <span className="text-center w-full">
                      <small className="text-xs text-gray-700">
                        I teach&nbsp;
                      </small>
                      <Select
                        id="subject"
                        name="subject"
                        label={whatSubject}
                        arrayOfData={subjects}
                        onSelect={midInputHandler}
                        display="inline-block"
                        disabled={isNonTeaching}
                        className="w-auto mx-1"
                        variant="simple"
                        size="small"
                      />
                      &nbsp;
                      <small className="text-xs text-gray-700">at&nbsp;</small>
                      <Select
                        id="section"
                        name="section"
                        label={whatSection}
                        arrayOfData={sections}
                        onSelect={midInputHandler}
                        display="inline-block"
                        disabled={isNonTeaching}
                        className="w-autoo mx-1"
                        variant="simple"
                        size="small"
                      />
                      &nbsp;
                      <Button
                        variant="secondary"
                        size="small"
                        type="button"
                        onClick={addSubjectClassHandler}
                        disabled={isNonTeaching}
                      >
                        Add
                      </Button>
                    </span>
                  </div>
                  {Object.keys(formState.inputs.subjectClasses.value).length !==
                    0 && (
                    <>
                      <div className="py-2"></div>
                      <span className="mt-2 inline-block">
                        Subject Classes:
                      </span>
                      <ul
                        className={`${
                          isNonTeaching ? "opacity-50" : ""
                        } pl-5 max-w-md duration-300`}
                      >
                        {Object.keys(formState.inputs.subjectClasses.value).map(
                          (section, i) => (
                            <li
                              key={i}
                              className="px-4 py-2 my-3 bg-indigo-100 rounded-lg shadow-md"
                            >
                              <span className="flex items-center justify-between mb-2 py-1 border-b border-indigo-300">
                                <span className="text-lg">
                                  {
                                    sections.find(
                                      (doc) => doc.value === section
                                    ).name
                                  }
                                </span>{" "}
                                <Button
                                  disabled={isNonTeaching}
                                  pill={true}
                                  className="hover:hover:bg-red-500"
                                  variant="secondary"
                                  size="small"
                                  onClick={() => {
                                    delete formState.inputs.subjectClasses
                                      .value[section];
                                    setRender((prev) => !prev);
                                  }}
                                >
                                  X
                                </Button>
                              </span>
                              <ul>
                                {formState.inputs.subjectClasses.value[
                                  section
                                ].map((subject, j) => (
                                  <li key={j} className="inline-block mr-6">
                                    {
                                      subjects.find(
                                        (doc) => doc.value === subject
                                      ).name
                                    }
                                  </li>
                                ))}
                              </ul>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                  <div className="py-3"></div>
                  <Input
                    id="nonTeaching"
                    name="nonTeaching"
                    element="input"
                    type="checkbox"
                    label="&nbsp;Non-teaching staff"
                    labelPosition="right"
                    onInput={inputHandler}
                    width="w-max"
                    checked={isNonTeaching}
                    containerClassName="w-max my-2"
                    onClick={() => {
                      setIsNonTeaching((prev) => !prev);
                    }}
                  />
                  <div className="py-3">
                    <hr />
                  </div>
                </>
              )}

            {/* PARENT (TODO) */}

            {/* {(!isLoginMode && formState.inputs.role.value === 'parent') && (
            <>
            <Input element="input" id="lrn" name="lrn" type="text" label="LRN"
                    onInput={inputHandler} required="required" />
            <Select id="section" name="section" label="Select Section" arrayOfData={sections} onSelect={inputHandler} />
            </>
            )} */}

            {/* GLOBAL */}

            <Input
              id="email"
              name="email"
              element="input"
              type="email"
              label="E-mail:&nbsp;"
              onInput={inputHandler}
              placeholder={
                isInResetPasswordMode
                  ? "Enter your registered email"
                  : "name@provider.com"
              }
              size="normalEven"
              variant="simple"
              className={inputClassName}
            />
            {!isInResetPasswordMode ? (
              <Input
                id="password"
                name="password"
                element="input"
                type="password"
                label="Password:&nbsp;"
                placeholder="••••••••"
                onInput={inputHandler}
                size="normalEven"
                variant="simple"
                className={`${inputClassName} mt-2`}
              />
            ) : (
              <></>
            )}

            {!isLoginMode && !isInResetPasswordMode ? (
              <Input
                id="confirmPassword"
                name="confirmPassword"
                element="input"
                type="password"
                label="Confirm Password:&nbsp;"
                placeholder="••••••••"
                onInput={inputHandler}
                size="normalEven"
                variant="simple"
                className={`${inputClassName} mt-2`}
              />
            ) : (
              <></>
            )}

            {!isLoginMode && !isInResetPasswordMode ? (
              <div className="pt-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  ref={captchaRef}
                  className=""
                  size="compact"
                />
              </div>
            ) : (
              <></>
            )}

            <div className="pt-4 flex flex-col space-y-5 self-start sm:self-stretch sm:space-y-0 sm:flex-row items-center justify-between space-x-[0.15rem] sm:space-x-5">
              {isInResetPasswordMode ? (
                <div className="flex-none">
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={(event) => requestPasswordResetHandler(event)}
                  >
                    Request Password Reset
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-none flex space-x-2">
                    <Button type="submit" variant="primary">
                      {isLoginMode ? "LOGIN" : "SIGN UP"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={switchModeHandler}
                    >
                      SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
                    </Button>
                  </div>
                  {isLoginMode ? (
                    <a
                      className="cursor-pointer hover:underline text-[0.8rem] leading-3 sm:leading-4 sm:text-sm self-start sm:self-center"
                      onClick={() => setIsInResetPasswordMode(true)}
                    >
                      Forgot password
                    </a>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;

