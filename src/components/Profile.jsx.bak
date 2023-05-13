import React, { useState, useEffect, useRef } from "react";
import PageFallback1 from "./PageFallback1";
import Input from "./Input";
import Button from "./Button";
import { useData } from "./contexts/DataContext";
import axios from "axios";
import { useToast } from "./contexts/ToastContext";
import Avatar from "./Avatar";
import Select from "./Select";
import {
  useForm,
  processFormState,
  mapFormState,
  initializeFormState,
} from "./hooks/formHook";
import WhoCanSeeForm from "./WhoCanSeeForm";
import { usePopupModal } from "./contexts/PopupModalContext";
import {
  capitalizeFirstLetter,
  validatePhoneNumber,
  isValidUrl,
  isValidNumber,
} from "../utils/utils";
import { useCustomModal } from "./contexts/CustomModalContext";

const selectSex = "Sex";
const selectVaccinationStatus = "Select vaccination status";
const selectBloodType = "Select blood type";
const sexes = [
  {
    value: "m",
    name: "Male",
  },
  {
    value: "f",
    name: "Female",
  },
  {
    value: "n",
    name: "Prefer not to say",
  },
];

const vaccinationStatuses = [
  {
    value: "full",
    name: "Fully vaccinated",
  },
  {
    value: "partial",
    name: "Partically vaccinated",
  },
  {
    value: "notVaccinated",
    name: "Not vaccinated",
  },
  {
    value: "eligible",
    name: "Vaccine eligible",
  },
  {
    value: "ineligible",
    name: "Vaccine ineligible",
  },
];

// const bloodTypes = [
//   {
//     value: "a+",
//     name: "A+",
//   },
//   {
//     value: "b+",
//     name: "B+",
//   },
//   {
//     value: "ab+",
//     name: "AB+",
//   },
//   {
//     value: "o+",
//     name: "O+",
//   },
//   {
//     value: "a-",
//     name: "A-",
//   },
//   {
//     value: "b-",
//     name: "B-",
//   },
//   {
//     value: "ab-",
//     name: "AB-",
//   },
//   {
//     value: "o-",
//     name: "O-",
//   },
// ];

const bloodTypes = [
  {
    value: "a",
    name: "A",
  },
  {
    value: "b",
    name: "B",
  },
  {
    value: "ab",
    name: "AB",
  },
  {
    value: "o",
    name: "O",
  },
];

const inputClassName = "max-w-[16rem] font-light text-xs";
const inputContainerClassName =
  "my-2 max-w-lg flex items-center justify-between space-x-5";
const inputsGroupClassName = "flex flex-col space-y-3";

const Profile = () => {
  document.title = `Profile`;

  const { setPopupModal } = usePopupModal();
  const { setCustomModal } = useCustomModal();

  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  const { data } = useData();
  const { setToast } = useToast();

  const fileInputRef = useRef(null);

  let personalInfoDefaultState = userData.find(
    (obj) => obj.type === "personalInfo"
  );
  if (!personalInfoDefaultState) {
    personalInfoDefaultState = {
      sex: { value: "" },
      birthdate: { value: "" },
      address: { value: "" },
      student: { value: false },
      adminTeaching: { value: false },
      adminNonTeaching: { value: false },
      superadmin: { value: false },
    };
  } else {
    personalInfoDefaultState = initializeFormState(personalInfoDefaultState);
    delete personalInfoDefaultState.type;
  }

  const [
    personalInfoFormState,
    pesonalInfoInputHandler,
    setPersonalInfoFormData,
  ] = useForm(personalInfoDefaultState);

  const updatePersonalInfo = () => {
    let mappedFormState = mapFormState(personalInfoFormState.inputs);

    if (mappedFormState.sex === selectSex) {
      personalInfoFormState.inputs.sex.value = "";
    }

    mappedFormState = mapFormState(personalInfoFormState.inputs);

    console.log("perInfo mappedFormState", mappedFormState);

    axios
      .post(
        "/api/v1/users/profile",
        { formState: mappedFormState, type: "personalInfo" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update personal info");
        console.error(error);
        setToast({ message: "Failed to update personal info", icon: "cross" });
      });
  };

  let contactInfoDefaultState = userData.find((obj) => obj.type === "contact");
  if (!contactInfoDefaultState) {
    contactInfoDefaultState = {
      phoneNumbers: { value: [] },
      socialMediaLinks: { value: [] },
      student: { value: false },
      adminTeaching: { value: false },
      adminNonTeaching: { value: false },
      superadmin: { value: false },
    };
  } else {
    contactInfoDefaultState = initializeFormState(contactInfoDefaultState);
    delete contactInfoDefaultState.type;
  }

  const [contactFormState, contactInputHandler, setContactFormData] = useForm(
    contactInfoDefaultState
  );

  const [contactFormMidState, contactInputMidHandler, setContactFormMidData] =
    useForm({
      phoneNumber: { value: "" },
      socialMediaLink: { value: "" },
    });

  const updateContact = () => {
    let mappedFormState = mapFormState(contactFormState.inputs);
    console.log("contact mappedFormState", mappedFormState);

    axios
      .post(
        "/api/v1/users/profile",
        { formState: mappedFormState, type: "contact" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update contact info");
        console.error(error);
        setToast({ message: "Failed to update contact info", icon: "cross" });
      });
  };

  const addPhoneNumberHandler = () => {
    console.log("add phone number");
    let mappedFormState = mapFormState(contactFormMidState.inputs);

    if (!mappedFormState.phoneNumber) {
      setToast({ icon: "cross", message: "No phone number inputted" });
      return;
    }

    const phoneNumber = mappedFormState.phoneNumber;
    const trimmed = validatePhoneNumber(phoneNumber);

    if (!trimmed) {
      setToast({ icon: "cross", message: "Phone number is invalid" });
      return;
    }

    setToast(null);

    if (!contactFormState.inputs.phoneNumbers.value.includes(trimmed)) {
      contactInputHandler(
        "phoneNumbers",
        contactFormState.inputs.phoneNumbers.value.concat([trimmed])
      );
    }
  };

  const addSocialMediaLinkHandler = () => {
    console.log("add social media link");

    let mappedFormState = mapFormState(contactFormMidState.inputs);

    if (!mappedFormState.socialMediaLink) {
      setToast({ icon: "cross", message: "No social media link inputted" });
      return;
    }

    setToast(null);

    const socialMediaLink = mappedFormState.socialMediaLink;

    if (
      !contactFormState.inputs.socialMediaLinks.value.includes(socialMediaLink)
    ) {
      contactInputHandler(
        "socialMediaLinks",
        contactFormState.inputs.socialMediaLinks.value.concat([socialMediaLink])
      );
    }
  };

  let bioDefaultState = userData.find((obj) => obj.type === "bio");
  if (!bioDefaultState) {
    bioDefaultState = {
      bio: { value: "" },
      student: { value: false },
      adminTeaching: { value: false },
      adminNonTeaching: { value: false },
      superadmin: { value: false },
    };
  } else {
    bioDefaultState = initializeFormState(bioDefaultState);
    delete bioDefaultState.type;
  }

  const [bioFormState, bioInputHandler] = useForm(bioDefaultState);

  const updateBio = () => {
    let mappedFormState = mapFormState(bioFormState.inputs);

    if (mappedFormState.bio === undefined) {
      bioFormState.inputs.bio.value = "";
    }

    mappedFormState = mapFormState(bioFormState.inputs);

    console.log("bio mappedFormState", mappedFormState);

    axios
      .post(
        "/api/v1/users/profile",
        { formState: mappedFormState, type: "bio" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update bio info");
        console.error(error);
        setToast({ message: "Failed to update bio info", icon: "cross" });
      });
  };

  let educationInfoDefaultState = userData.find(
    (obj) => obj.type === "education"
  );
  if (!educationInfoDefaultState) {
    educationInfoDefaultState = {
      elementarySchool: { value: "" },
      juniorHighSchool: { value: "" },
      targetCourses: { value: [] },
      student: { value: false },
      adminTeaching: { value: false },
      adminNonTeaching: { value: false },
      superadmin: { value: false },
    };
  } else {
    educationInfoDefaultState = initializeFormState(educationInfoDefaultState);
    delete educationInfoDefaultState.type;
  }

  const [educationFormState, educationInputHandler, setEducationFormData] =
    useForm(educationInfoDefaultState);

  const [
    educationMidFormState,
    educationInputMidHandler,
    setEducationFormMidData,
  ] = useForm({
    targetCourse: { value: "" },
  });

  const updateEducation = () => {
    let mappedFormState = mapFormState(educationFormState.inputs);
    console.log("education mappedFormState", mappedFormState);

    axios
      .post(
        "/api/v1/users/profile",
        { formState: mappedFormState, type: "education" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update bio info");
        console.error(error);
        setToast({ message: "Failed to update bio info", icon: "cross" });
      });
  };

  const addTargetCourseHandler = () => {
    console.log("add target course link");

    let mappedFormState = mapFormState(educationMidFormState.inputs);

    console.log(mappedFormState);

    const targetCourse = mappedFormState.targetCourse;

    if (!targetCourse) {
      setToast({ icon: "cross", message: "No course inputted" });
      return;
    }

    setToast(null);

    if (!educationFormState.inputs.targetCourses.value.includes(targetCourse)) {
      educationInputHandler(
        "targetCourses",
        educationFormState.inputs.targetCourses.value.concat([targetCourse])
      );
    }
  };

  let healthInfoDefaultState = userData.find((obj) => obj.type === "health");
  if (!healthInfoDefaultState) {
    healthInfoDefaultState = {
      height: { value: 0 },
      weight: { value: 0 },
      vaccinationStatus: { value: "" },
      bloodType: { value: "" },
      student: { value: false },
      adminTeaching: { value: false },
      adminNonTeaching: { value: false },
      superadmin: { value: false },
    };
  } else {
    healthInfoDefaultState = initializeFormState(healthInfoDefaultState);
    delete healthInfoDefaultState.type;
  }

  const [healthFormState, healthInputHandler, setHealthFormData] = useForm(
    healthInfoDefaultState
  );

  const updateHealth = () => {
    let mappedFormState = mapFormState(healthFormState.inputs);

    if (mappedFormState.height < 0) {
      setToast({
        icon: "cross",
        message: `Height can't be a negative value`,
      });
      return;
    } else if (mappedFormState.weight < 0) {
      setToast({
        icon: "cross",
        message: `Weight can't be a negative value`,
      });
      return;
    } else if (
      mappedFormState.height !== 0 &&
      !isValidNumber(mappedFormState.height)
    ) {
      setToast({
        icon: "cross",
        message: `Height inputted is invalid`,
      });
      return;
    } else if (
      mappedFormState.weight !== 0 &&
      !isValidNumber(mappedFormState.weight)
    ) {
      setToast({
        icon: "cross",
        message: `Weight inputted is invalid`,
      });
      return;
    }

    if (mappedFormState.vaccinationStatus === selectVaccinationStatus) {
      healthFormState.inputs.vaccinationStatus.value = "";
    }

    if (mappedFormState.bloodType === selectBloodType) {
      healthFormState.inputs.bloodType.value = "";
    }

    setToast(null);

    mappedFormState = mapFormState(healthFormState.inputs);

    console.log("health mappedFormState", mappedFormState);

    axios
      .post(
        "/api/v1/users/profile",
        { formState: mappedFormState, type: "health" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update health info");
        console.error(error);
        setToast({ message: "Failed to update health info", icon: "cross" });
      });
  };

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  const uploadProfilePicHandler = () => {
    let imageFile;
    if (fileInputRef.current) {
      imageFile = fileInputRef.current?.files[0];
      if (!imageFile) {
        setToast({ icon: "cross", message: "Please upload an image file" });
        return;
      }
    } else {
      setToast({ icon: "cross", message: "An error occured" });
      return;
    }

    setToast(null);

    console.log("imageFile", imageFile);

    axios
      .post(
        "/api/v1/profile-pic",
        { imageFile },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to add post");
        console.error(error);
      });
  };

  const removeProfilePicHandler = () => {
    axios
      .delete("/api/v1/profile-pic")
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to remove profile picture");
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("/api/v1/users/profile")
      .then((res) => {
        if (res.data.success) {
          setIsUserDataReady(true);
          setUserData(res.data.userData);
          let contactInitialState = res.data.userData.find(
            (obj) => obj.type === "contact"
          );
          if (contactInitialState) {
            contactInputHandler(
              "phoneNumbers",
              contactInitialState.phoneNumbers
            );
            contactInputHandler(
              "socialMediaLinks",
              contactInitialState.socialMediaLinks
            );
          }
          let educationInitialState = res.data.userData.find(
            (obj) => obj.type === "education"
          );
          if (educationInitialState) {
            educationInputHandler(
              "targetCourses",
              educationInitialState.targetCourses
            );
          }
          console.log(res.data.userData);
        }
      })
      .catch((err) => {
        setToast({ icon: "cross", message: "An error occured" });
        console.error(err);
        console.log("Failed to fetch user data");
      });
  }, []);

  const formContainerClassName =
    "flex flex-col space-y-4 border-indigo-300 border-opacity-50 border-2 p-5 lg:p-6 xl:p-8 shadow-lg rounded-lg max-w-lg w-full mt-7 h-full";

  return (
    <>
      {isLocalDataReady && isUserDataReady ? (
        <div className="flex flex-col space-y-7">
          <h1 className="my-0">Profile</h1>
          <div className="flex flex-wrap xl:grid xl:grid-cols-2 xl:gap-8">
            <div className={formContainerClassName}>
              <label
                htmlFor="fileInput"
                className="flex items-center justify-between"
              >
                <h3 className="my-0">Profile Picture</h3>
              </label>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              {!data.user.hasProfilePic ? (
                <div className="flex justify-between items-center space-x-3 max-w-lg">
                  <Avatar user={data.user} className="flex-none" />
                  <div className="flex space-x-3 items-center">
                    <Input
                      id="fileInput"
                      name="fileInput"
                      element="input"
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      variant="simple"
                      size="small"
                      onInput={() => {}}
                      className="max-w-xs"
                    />
                    <Button
                      variant="primary"
                      size="small"
                      className="h-min"
                      onClick={() => {
                        uploadProfilePicHandler();
                      }}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center space-x-3 max-w-lg">
                  <Avatar user={data.user} />
                  <div className="flex space-x-2 items-center">
                    <Button
                      variant="secondary"
                      size="small"
                      className="h-min"
                      onClick={() => {
                        setPopupModal({
                          message:
                            "Are you sure you want to remove your profile picture?",
                          variant: "danger",
                          primary: "Remove",
                          handler: () => {
                            removeProfilePicHandler();
                          },
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className={formContainerClassName}>
              <label
                htmlFor="fileInput"
                className="flex items-center justify-between"
              >
                <h3 className="my-0">QR Code ID</h3>
              </label>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <div className="flex items-center justify-between w-full">
                <img
                  src={`/user/qrcodes/${data.user._id}.svg`}
                  className="bg-white w-16 h-16 mr-3"
                  onClick={() =>
                    setCustomModal(
                      <div className="w-full flex flex-col items-center justify-center">
                        <img
                          src={`/user/qrcodes/${data.user._id}.svg`}
                          className="bg-white w-72 h-72"
                        />
                        <span className="text-black">
                          {data.user.firstName} {data.user.lastName}
                        </span>
                      </div>
                    )
                  }
                />
                <div className="max-w-xs text-sm">
                  Show this QR Code to the scanner for your attendance to be
                  recorded.
                </div>
              </div>
            </div>
          </div>
          <div className="flex rounded-lg flex-wrap xl:grid xl:grid-cols-2 xl:gap-8">
            <div className={formContainerClassName}>
              <label
                htmlFor="fileInput"
                className="flex items-center justify-between"
              >
                <h3 className="my-0">Personal Info</h3>
                <Button
                  variant="primary"
                  size="small"
                  className="h-min"
                  onClick={() => {
                    setPopupModal({
                      message: "Update personal info?",
                      primary: "Update",
                      handler: () => {
                        updatePersonalInfo();
                      },
                    });
                  }}
                >
                  Save
                </Button>
              </label>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <div className={`flex flex-col space-y-4`}>
                <span className="flex items-center justify-between max-w-lg">
                  <span>{selectSex}:&nbsp;</span>
                  <Select
                    id="sex"
                    name="sex"
                    label={selectSex}
                    arrayOfData={sexes}
                    onSelect={pesonalInfoInputHandler}
                    className="w-auto"
                    display="inline-block"
                    variant="simple"
                    size="normal2"
                    defaultValue={
                      personalInfoDefaultState.sex.value
                        ? personalInfoDefaultState.sex.value
                        : selectSex
                    }
                  />
                </span>
                <Input
                  element="input"
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  label="Birthdate:&nbsp;"
                  labelStyle="flex-none"
                  onInput={pesonalInfoInputHandler}
                  size="normalEven"
                  variant="simple"
                  className={inputClassName}
                  containerClassName={inputContainerClassName}
                  defaultValue={personalInfoDefaultState.birthdate.value}
                />
                <Input
                  element="input"
                  id="address"
                  name="address"
                  type="text"
                  label="Address:&nbsp;"
                  labelStyle="flex-none"
                  placeholder="Enter your address"
                  onInput={pesonalInfoInputHandler}
                  size="normalEven"
                  variant="simple"
                  className={inputClassName}
                  containerClassName={inputContainerClassName}
                  defaultValue={personalInfoDefaultState.address.value}
                />
              </div>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <WhoCanSeeForm
                formState={personalInfoFormState}
                inputHandler={pesonalInfoInputHandler}
                defaultState={personalInfoDefaultState}
              />
            </div>
            <div className={formContainerClassName}>
              <label
                htmlFor="fileInput"
                className="flex items-center justify-between"
              >
                <h3 className="my-0">Contact</h3>
                <Button
                  variant="primary"
                  size="small"
                  className="h-min"
                  onClick={() => {
                    setPopupModal({
                      message: "Update contact info?",
                      primary: "Update",
                      handler: () => {
                        updateContact();
                      },
                    });
                  }}
                >
                  Save
                </Button>
              </label>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <div className={inputsGroupClassName}>
                <div className="flex space-x-3 items-center max-w-[35.5rem]">
                  <Input
                    element="input"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    label="Phone Numbers:&nbsp;"
                    labelStyle="flex-none"
                    onInput={contactInputMidHandler}
                    size="normalEven"
                    variant="simple"
                    className="max-w-[16rem] font-light text-xs"
                    containerClassName="my-2 max-w-lg flex items-center justify-between space-x-5 flex-auto"
                    placeholder="Enter phone number"
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    onClick={addPhoneNumberHandler}
                    className="h-min flex-none"
                  >
                    Add
                  </Button>
                </div>
                <div>
                  <ul className="flex flex-col space-y-2">
                    {contactFormState.inputs.phoneNumbers.value.map(
                      (number, i) => {
                        return (
                          <li key={i} className="ml-4">
                            <span className="font-mono">{number}</span>{" "}
                            <Button
                              variant="secondary"
                              size="small"
                              className="h-min"
                              onClick={() => {
                                contactInputHandler(
                                  "phoneNumbers",
                                  contactFormState.inputs.phoneNumbers.value.filter(
                                    (numInList) => {
                                      return numInList !== number;
                                    }
                                  )
                                );
                              }}
                            >
                              x
                            </Button>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
                <div className="flex space-x-3 items-center max-w-[35.5rem]">
                  <Input
                    element="input"
                    id="socialMediaLink"
                    name="socialMediaLink"
                    type="url"
                    label="Social Media Links:&nbsp;"
                    labelStyle="flex-none"
                    onInput={contactInputMidHandler}
                    size="normalEven"
                    variant="simple"
                    className="max-w-[16rem] font-light text-xs"
                    containerClassName="my-2 max-w-lg flex items-center justify-between space-x-5 flex-auto"
                    placeholder="Enter social media link"
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    onClick={addSocialMediaLinkHandler}
                    className="h-min flex-none"
                  >
                    Add
                  </Button>
                </div>
                <div>
                  <ul className="flex flex-col space-y-2">
                    {contactFormState.inputs.socialMediaLinks.value.map(
                      (link, i) => {
                        return (
                          <li key={i} className="ml-4">
                            <span className="">{link}</span>{" "}
                            <Button
                              variant="secondary"
                              size="small"
                              className="h-min"
                              onClick={() => {
                                contactInputHandler(
                                  "socialMediaLinks",
                                  contactFormState.inputs.socialMediaLinks.value.filter(
                                    (linkInList) => {
                                      return linkInList !== link;
                                    }
                                  )
                                );
                              }}
                            >
                              x
                            </Button>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <WhoCanSeeForm
                formState={contactFormState}
                inputHandler={contactInputHandler}
                defaultState={contactInfoDefaultState}
              />
            </div>
            <div className={formContainerClassName}>
              <label
                htmlFor="fileInput"
                className="flex items-center justify-between"
              >
                <h3 className="my-0">Bio</h3>
                <Button
                  variant="primary"
                  size="small"
                  className="h-min"
                  onClick={() => {
                    setPopupModal({
                      message: "Update bio ?",
                      primary: "Update",
                      handler: () => {
                        updateBio();
                      },
                    });
                  }}
                >
                  Save
                </Button>
              </label>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <div className={inputsGroupClassName}>
                <Input
                  element="textarea"
                  id="bio"
                  name="bio"
                  onInput={bioInputHandler}
                  size="normalEven"
                  variant="simple"
                  className="max-w-lg font-light text-xs h-44 resize-none"
                  containerClassName={inputContainerClassName}
                  placeholder="Tell something about yourself.
                
Your interests, hobbies, experiences, talents, achievements, history, quirks, beliefs, and the like.

Anything :)"
                  defaultValue={bioDefaultState.bio.value}
                />
              </div>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <WhoCanSeeForm
                formState={bioFormState}
                inputHandler={bioInputHandler}
                defaultState={bioDefaultState}
              />
            </div>
            {data.user.role === "student" ? (
              <div className={formContainerClassName}>
                <label
                  htmlFor="fileInput"
                  className="flex items-center justify-between"
                >
                  <h3 className="my-0">Education</h3>
                  <Button
                    variant="primary"
                    size="small"
                    className="h-min"
                    onClick={() => {
                      setPopupModal({
                        message: "Update education info?",
                        primary: "Update",
                        handler: () => {
                          updateEducation();
                        },
                      });
                    }}
                  >
                    Save
                  </Button>
                </label>
                <div className="py-1">
                  <hr className="opacity-40" />
                </div>
                <div className={inputsGroupClassName}>
                  <Input
                    element="input"
                    id="elementarySchool"
                    name="elementarySchool"
                    type="text"
                    label="Elementary School:&nbsp;"
                    labelStyle="flex-none"
                    placeholder="Which elementary school did you attend?"
                    onInput={educationInputHandler}
                    size="normalEven"
                    variant="simple"
                    className={inputClassName}
                    containerClassName={inputContainerClassName}
                    defaultValue={
                      educationInfoDefaultState.elementarySchool.value
                    }
                  />
                  <Input
                    element="input"
                    id="juniorHighSchool"
                    name="juniorHighSchool"
                    type="text"
                    label="Junior High School:&nbsp;"
                    labelStyle="flex-none"
                    placeholder="Which junior high school did you attend?"
                    onInput={educationInputHandler}
                    size="normalEven"
                    variant="simple"
                    className={inputClassName}
                    containerClassName={inputContainerClassName}
                    defaultValue={
                      educationInfoDefaultState.juniorHighSchool.value
                    }
                  />
                  <div className="flex space-x-3 items-center max-w-[35.5rem]">
                    <Input
                      element="input"
                      id="targetCourse"
                      name="targetCourse"
                      type="url"
                      label="Target courses:&nbsp;"
                      labelStyle="flex-none"
                      onInput={educationInputMidHandler}
                      size="normalEven"
                      variant="simple"
                      className="max-w-[16rem] font-light text-xs"
                      containerClassName="my-2 max-w-lg flex items-center justify-between space-x-5 flex-auto"
                      placeholder="Enter course"
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      onClick={addTargetCourseHandler}
                      className="h-min flex-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div>
                    <ul className="flex flex-col space-y-2">
                      {educationFormState.inputs.targetCourses.value.map(
                        (course, i) => {
                          return (
                            <li key={i} className="ml-4">
                              <span className="">{course}</span>{" "}
                              <Button
                                variant="secondary"
                                size="small"
                                className="h-min"
                                onClick={() => {
                                  educationInputHandler(
                                    "targetCourses",
                                    educationFormState.inputs.targetCourses.value.filter(
                                      (courseInList) => {
                                        return courseInList !== course;
                                      }
                                    )
                                  );
                                }}
                              >
                                x
                              </Button>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
                <div className="py-1">
                  <hr className="opacity-40" />
                </div>
                <WhoCanSeeForm
                  formState={educationFormState}
                  inputHandler={educationInputHandler}
                  defaultState={educationInfoDefaultState}
                />
              </div>
            ) : (
              <></>
            )}
            <div className={formContainerClassName}>
              <label
                htmlFor="fileInput"
                className="flex items-center justify-between"
              >
                <h3 className="my-0">Health</h3>
                <Button
                  variant="primary"
                  size="small"
                  className="h-min"
                  onClick={() => {
                    setPopupModal({
                      message: "Update health info?",
                      primary: "Update",
                      handler: () => {
                        updateHealth();
                      },
                    });
                  }}
                >
                  Save
                </Button>
              </label>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <div className={inputsGroupClassName}>
                <Input
                  element="input"
                  id="height"
                  name="height"
                  type="number"
                  label="Height (cm):&nbsp;"
                  labelStyle="flex-none"
                  placeholder="Enter your height (in meters)"
                  onInput={healthInputHandler}
                  size="normalEven"
                  variant="simple"
                  className={inputClassName}
                  containerClassName={inputContainerClassName}
                  defaultValue={healthInfoDefaultState.height.value}
                />
                <Input
                  element="input"
                  id="weight"
                  name="weight"
                  type="number"
                  label="Weight (kg):&nbsp;"
                  labelStyle="flex-none"
                  placeholder="Enter your weight (in kilograms)"
                  onInput={healthInputHandler}
                  size="normalEven"
                  variant="simple"
                  className={inputClassName}
                  containerClassName={inputContainerClassName}
                  defaultValue={healthInfoDefaultState.weight.value}
                />
                <span className="flex items-center justify-between max-w-lg">
                  <span>Vaccination status:&nbsp;</span>
                  <Select
                    id="vaccinationStatus"
                    name="vaccinationStatus"
                    label={selectVaccinationStatus}
                    arrayOfData={vaccinationStatuses}
                    onSelect={healthInputHandler}
                    className="w-auto"
                    display="inline-block"
                    variant="simple"
                    size="normal2"
                    defaultValue={
                      healthInfoDefaultState.vaccinationStatus.value
                        ? healthInfoDefaultState.vaccinationStatus.value
                        : selectVaccinationStatus
                    }
                  />
                </span>
                <span className="flex items-center justify-between max-w-lg">
                  <span>Blood type:&nbsp;</span>
                  <Select
                    id="bloodType"
                    name="bloodType"
                    label={selectBloodType}
                    arrayOfData={bloodTypes}
                    onSelect={healthInputHandler}
                    className="w-auto"
                    display="inline-block"
                    variant="simple"
                    size="normal2"
                    defaultValue={
                      healthInfoDefaultState.bloodType.value
                        ? healthInfoDefaultState.bloodType.value
                        : selectBloodType
                    }
                  />
                </span>
              </div>
              <div className="py-1">
                <hr className="opacity-40" />
              </div>
              <WhoCanSeeForm
                formState={healthFormState}
                inputHandler={healthInputHandler}
                defaultState={healthInfoDefaultState}
              />
            </div>
          </div>
        </div>
      ) : (
        <PageFallback1 />
      )}
    </>
  );
};

export default Profile;
