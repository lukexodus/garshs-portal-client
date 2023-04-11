import React, { useState, useEffect } from "react";
import { useForm, processFormState } from "./hooks/formHook";
import Input from "./Input";
import Button from "./Button";
import { useToast } from "./contexts/ToastContext";
import { capitalizeFirstLetter } from "../utils/utils";

const BorrowOrReturn = ({ item, mode, borrowCancelReturnHandler, userId }) => {
  const { setToast } = useToast();
  const [borrowedItemsNum, setBorrowedItemsNum] = useState(0);

  const [formState, inputHandler] = useForm({
    itemsToBorrowNum: { value: 1 },
  });

  useEffect(() => {
    if (mode === "return") {
      setBorrowedItemsNum(
        item.borrowers.find((borrowerObj) => borrowerObj._id === userId)
          .itemsToBorrowNum
      );
    }
  }, []);

  const submitHandler = () => {
    const itemsToBorrowNum = formState.inputs.itemsToBorrowNum.value;
    if (!itemsToBorrowNum || itemsToBorrowNum < 1) {
      setToast({
        message: "Number can't be zero or a negative value",
        icon: "cross",
      });
      return;
    }
    if (
      mode === "borrow" &&
      itemsToBorrowNum > item.totalItemsNum - item.borrowedItemsNum
    ) {
      setToast({
        message: `You can only borrow at most ${
          item.totalItemsNum - item.borrowedItemsNum
        } item/s`,
        icon: "cross",
      });
      return;
    }

    if (mode === "return") {
      if (itemsToBorrowNum > borrowedItemsNum) {
        setToast({
          message: `You can only return at most ${borrowedItemsNum} item/s`,
          icon: "cross",
        });
        return;
      }
    }

    borrowCancelReturnHandler(item, mode, itemsToBorrowNum);
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900 ">
        {`${capitalizeFirstLetter(mode)}`} {item.item}
      </h3>
      <form className="space-y-6">
        <Input
          element="input"
          id="itemsToBorrowNum"
          name="itemsToBorrowNum"
          type="number"
          label={`Number of items to ${mode} ${
            mode === "return"
              ? `(${borrowedItemsNum} borrowed)`
              : mode === "borrow"
              ? `(${item.totalItemsNum - item.borrowedItemsNum} available)`
              : ""
          }`}
          labelStyle="block mb-2 text-sm font-medium text-gray-900"
          onInput={inputHandler}
          size="normalEven"
          variant="simple"
          defaultValue={borrowedItemsNum}
        />
        <Button
          variant="blue"
          className="w-full"
          onClick={() => {
            submitHandler();
          }}
        >
          {`${capitalizeFirstLetter(mode)}`} Item
        </Button>
      </form>
    </>
  );
};

export default BorrowOrReturn;
