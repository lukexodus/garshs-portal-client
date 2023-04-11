import React, { useState, useEffect } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import { useToast } from "./contexts/ToastContext";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";
import { useData } from "./contexts/DataContext";
import axios from "axios";
import { useCustomModal } from "./contexts/CustomModalContext";
import Loading from "./Loading";

const selectPerson = "Select Person";
const selectPlace = "Select Place";
const selectCategory = "Select Category";

const validateForm = (formState) => {
  const fieldEmptyMsg = "Some of the required fields are empty";
  if (
    !formState.item ||
    !formState.personInCharge ||
    !formState.placeToFind ||
    !formState.category ||
    formState.category === selectCategory ||
    !formState.totalItemsNum
  ) {
    return fieldEmptyMsg;
  }
  if (parseInt(formState.totalItemsNum) < 0) {
    return "Total number cannot be a negative value";
  }
};

const AddItem = ({ setInInventoryListByCategoryMode, ...props }) => {
  const { data } = useData();
  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const [render, setRender] = useState(false);

  const [adminUsers, setAdminUsers] = useState([]);
  const [isAdminUsersReady, setIsAdminUsersReady] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isPlacesReady, setIsPlacesReady] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoriesReady, setIsCategoriesReady] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const [formState, inputHandler, setFormData] = useForm({
    item: { value: "" },
    personInCharge: { value: [] },
    placeToFind: { value: [] },
    category: { value: "" },
    totalItemsNum: { value: 1 },
  });

  const [formStateMid, inputHandlerMid, setFormDataMid] = useForm({
    personInChargeId: { value: "" },
    placeValue: { value: "" },
  });

  useEffect(() => {
    axios
      .get("/api/v1/users/users", {
        params: {
          category: "admins",
          mode: "inventory",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setAdminUsers(res.data.users);
          setIsAdminUsersReady(true);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch admin users");
        console.error(err);
      });

    axios
      .get("/api/v1/data", {
        params: { dataToFetch: JSON.stringify(["categories", "places"]) },
      })
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.categories);
          setIsCategoriesReady(true);
          setPlaces(res.data.places);
          setIsPlacesReady(true);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch categories and places");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (isAdminUsersReady && isPlacesReady && isCategoriesReady) {
      setIsFormReady(true);
    }
  }, [isAdminUsersReady, isPlacesReady, isCategoriesReady]);

  const addPersonHandler = () => {
    const personInChargeId = formStateMid.inputs.personInChargeId.value;
    const personInCharge = adminUsers.find(
      (user) => user._id === personInChargeId
    );
    if (personInCharge === selectPerson || !personInCharge) {
      setToast({
        message: "Please select a person",
        icon: "cross",
      });
      return;
    } else {
      setToast(null);
    }

    if (!formState.inputs.personInCharge.value.includes(personInCharge)) {
      formState.inputs.personInCharge.value.push(personInCharge);
      setRender((prev) => !prev);
    }
  };

  const addPlaceHandler = () => {
    const placeValue = formStateMid.inputs.placeValue.value;
    const placeDoc = places.find((place) => place.value === placeValue);
    console.log("placeDoc", placeDoc);
    if (!placeDoc || placeDoc.value === selectPerson) {
      setToast({
        message: "Please select a place",
        icon: "cross",
      });
      return;
    } else {
      setToast(null);
    }

    if (!formState.inputs.placeToFind.value.includes(placeDoc)) {
      formState.inputs.placeToFind.value.push(placeDoc);
      setRender((prev) => !prev);
    }
  };

  const removePersonInListHandler = (id) => {
    formState.inputs.personInCharge.value =
      formState.inputs.personInCharge.value.filter(
        (personDoc) => personDoc._id !== id
      );
    setRender((prev) => !prev);
  };

  const removePlaceFromListHandler = (value) => {
    formState.inputs.placeToFind.value =
      formState.inputs.placeToFind.value.filter(
        (placeDoc) => placeDoc.value !== value
      );
    setRender((prev) => !prev);
  };

  const submitHandler = () => {
    const processedFormState = processFormState(formState.inputs);
    console.log("processedFormState", processedFormState);

    const validationMsg = validateForm(processedFormState);
    if (validationMsg) {
      setToast({ message: validationMsg, icon: "cross" });
      return;
    } else {
      setToast(null);
    }

    processedFormState.placeToFind = processedFormState.placeToFind.map(
      (placeDoc) => placeDoc.value
    );

    axios
      .post("/api/v1/inventory", JSON.stringify(processedFormState), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setCustomModal(null);
          setInInventoryListByCategoryMode(false);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
          if (props.setRefetch) {
            props.setRefetch((prev) => !prev);
          }
        }
      })
      .catch((err) => {
        console.log("Failed to add item");
        console.error(err);
      });
  };

  return (
    <>
      {isFormReady ? (
        <div className="">
          <h3 className="mb-4 text-xl font-medium text-gray-900 ">Add Item</h3>
          <form className="space-y-6">
            <Input
              element="input"
              size="normalEven"
              variant="simple"
              id="item"
              name="item"
              type="text"
              placeholder="Enter item name or model"
              label="Item"
              labelStyle="block mb-2 text-sm font-medium text-gray-900"
              onInput={inputHandler}
            />
            <div>
              <label
                htmlFor="personInCharge"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Person in charge
              </label>
              <div className="flex space-x-2 items-center">
                <Select
                  id="personInChargeId"
                  name="personInChargeId"
                  arrayOfData={adminUsers.map((user) => {
                    return {
                      value: user._id,
                      name: `${user.firstName} ${user.lastName}`,
                    };
                  })}
                  onSelect={inputHandlerMid}
                  label={selectPerson}
                  className="w-auto mt-1"
                  display="inline-block"
                  variant="simple"
                  size="normal2"
                />
                <Button
                  variant="secondary"
                  size="small"
                  type="button"
                  onClick={addPersonHandler}
                  className="w-min h-min"
                >
                  Add
                </Button>
              </div>
              {formState.inputs.personInCharge.value.length !== 0 && (
                <div>
                  <ul className="w-min mt-2">
                    {formState.inputs.personInCharge.value.map(
                      (personDoc, i) => {
                        return (
                          <li
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-light text-gray-900 pr-2 whitespace-nowrap">
                              {personDoc.firstName} {personDoc.lastName}
                            </span>
                            <Button
                              variant="danger"
                              size="small"
                              type="button"
                              onClick={() => {
                                removePersonInListHandler(personDoc._id);
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
            <div>
              <label
                htmlFor="placeToFind"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Place to find
              </label>
              <div className="flex space-x-2 items-center">
                <Select
                  id="placeValue"
                  name="placeValue"
                  arrayOfData={places}
                  onSelect={inputHandlerMid}
                  label={selectPlace}
                  className="w-auto mt-1"
                  display="inline-block"
                  variant="simple"
                  size="normal2"
                />
                <Button
                  variant="secondary"
                  size="small"
                  type="button"
                  onClick={addPlaceHandler}
                  className="w-min h-min"
                >
                  Add
                </Button>
              </div>
              {formState.inputs.placeToFind.value.length !== 0 && (
                <div>
                  <ul className="w-min mt-2">
                    {formState.inputs.placeToFind.value.map((placeDoc, i) => {
                      return (
                        <li
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-light text-gray-900 pr-2 whitespace-nowrap">
                            {placeDoc.name}
                          </span>
                          <Button
                            variant="danger"
                            size="small"
                            type="button"
                            onClick={() => {
                              removePlaceFromListHandler(placeDoc.value);
                            }}
                            pill={true}
                            className="text-xs"
                          >
                            x
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Category
              </label>
              <div className="flex space-x-2 items-center">
                <Select
                  id="category"
                  name="category"
                  arrayOfData={categories}
                  onSelect={inputHandler}
                  label={selectCategory}
                  className="w-auto mt-1"
                  display="inline-block"
                  variant="simple"
                  size="normal2"
                />
              </div>
            </div>
            <div>
              <Input
                element="input"
                id="totalItemsNum"
                name="totalItemsNum"
                type="number"
                label="Total number"
                labelStyle="block mb-2 text-sm font-medium text-gray-900"
                onInput={inputHandler}
                size="normalEven"
                variant="simple"
                defaultValue={1}
              />
            </div>
            <Button
              variant="blue"
              className="w-full"
              onClick={() => {
                submitHandler();
              }}
            >
              Add Item
            </Button>
          </form>
        </div>
      ) : (
        <Loading bgBehindColor="white" />
      )}
    </>
  );
};

export default AddItem;
