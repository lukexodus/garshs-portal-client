import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "./hooks/formHook";
import Input from "./Input";
import { validateLRN } from "../utils/utils";
import { useToast } from "./contexts/ToastContext";
import Button from "./Button";

const validateInput = (LRNsStr) => {
  let validationStr = "";

  const LRNs = LRNsStr.split("\n");

  for (let i = 0; i < LRNs.length; i++) {
    validationStr = validateLRN(LRNs[i]);
    if (validationStr) {
      break;
    }
  }

  if (validationStr) {
    return [null, validationStr];
  }
  return [LRNs, ""];
};

const LRN = (props) => {
  document.title = `LRNs`;
  const [LRNs, setLRNs] = useState([]);
  const [postSucess, setPostSuccess] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  const { setToast } = useToast();

  const textAreaRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/v1/users/lrn")
      .then((res) => {
        if (res.data.success) {
          setLRNs(res.data.LRNs);
          setIsDataReady(true);
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postSucess]);

  const [formState, inputHandler] = useForm({
    LRNs: { value: "" },
  });

  const submitHandler = (event, mode) => {
    event.preventDefault();

    const [LRNs, validationStr] = validateInput(formState.inputs.LRNs.value);

    if (validationStr) {
      setToast({ message: validationStr, icon: "cross" });
      return;
    } else {
      setToast(null);
      const objectLRNs = JSON.stringify(
        LRNs.map((lrn) => {
          return { _id: Number(lrn) };
        })
      );
      const data = { LRNs: objectLRNs };

      if (mode === "add") {
        axios
          .post("/api/v1/users/lrn", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            textAreaRef.current.value = "";
            setToast({ message: res.data.msg, icon: "check" });
            setPostSuccess(!postSucess);
          })
          .catch((error) => {
            console.log("(LRN) An error occured.");
            console.error(error);
          });
      } else if (mode === "remove") {
        axios
          .delete("/api/v1/users/lrn", {
            params: { LRNs: objectLRNs },
          })
          .then((res) => {
            console.log("(LRN) res.data", res.data);
            textAreaRef.current.value = "";
            setToast({ message: res.data.msg, icon: "check" });
            setPostSuccess(!postSucess);
          })
          .catch((error) => {
            console.log("(LRN) An error occured.");
            console.error(error);
          });
      }
    }
  };

  return (
    <>
      <>
        <h2>LRNs</h2>
        <small>Please type one LRN per line.</small>
        <br />
        <Input
          id="LRNs"
          name="LRNs"
          element="textarea"
          onInput={inputHandler}
          ref={textAreaRef}
          placeholder="100000000001
100000000002"
        />
        <div className="flex space-x-3 mt-4">
          <Button
            size="small"
            type="submit"
            onClick={(event) => submitHandler(event, "add")}
          >
            Add
          </Button>
          <Button
            size="small"
            variant="danger"
            type="submit"
            onClick={(event) => submitHandler(event, "remove")}
          >
            Remove
          </Button>
        </div>
        <br />

        <br />
        <br />

        <h2>List</h2>
        {isDataReady ? (
          <ul>
            {LRNs.sort((a, b) => a._id - b._id).map((LRN, i) => (
              <li key={i} className="inline-block mr-3">
                {LRN._id}
              </li>
            ))}
          </ul>
        ) : (
          "No LRNs registered"
        )}
      </>
    </>
  );
};

export default LRN;
