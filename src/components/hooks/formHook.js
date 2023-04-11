import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value },
        },
      };
    case "SET_DATA":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...action.inputs,
        },
      };
    default:
      return state;
  }
};

export const useForm = (initialInput) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInput,
  });

  const inputHandler = useCallback((id, value) => {
    dispatch({ type: "INPUT_CHANGE", value: value, inputId: id });
  }, []);

  const setFormData = useCallback((inputData) => {
    dispatch({ type: "SET_DATA", inputs: inputData });
  }, []);

  return [formState, inputHandler, setFormData];
};

export const processFormState = (formState) => {
  const keys = Object.keys(formState);
  let newFormState = {};
  for (let key of keys) {
    let value = formState[key].value;
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }
    if (typeof value === "object" && Object.keys(value).length === 0) {
      continue;
    }
    if (typeof value === "boolean" || value) {
      newFormState[key] = formState[key].value;
    }
  }
  return newFormState;
};

export const mapFormState = (formState) => {
  const keys = Object.keys(formState);
  let newFormState = {};
  for (let key of keys) {
    newFormState[key] = formState[key].value;
  }
  return newFormState;
};

export const initializeFormState = (mappedFormState) => {
  const keys = Object.keys(mappedFormState);
  let newFormState = {};
  for (let key of keys) {
    newFormState[key] = { value: mappedFormState[key] };
  }
  return newFormState;
};
