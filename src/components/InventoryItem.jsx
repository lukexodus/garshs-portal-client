import React from "react";
import { useCustomModal } from "./contexts/CustomModalContext";
import CircularProgress from "./CircularProgress";
import { MdLocationPin, MdOutlinePersonPinCircle } from "react-icons/md";
import { GoRequestChanges } from "react-icons/go";
import { useData } from "./contexts/DataContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useToast } from "./contexts/ToastContext";
import axios from "axios";
import Button from "./Button";
import BorrowOrReturn from "./BorrowOrReturn";

import { MdDeleteForever } from "react-icons/md";

const InventoryItem = ({ item, ...props }) => {
  const { setCustomModal } = useCustomModal();
  const { data } = useData();
  const { setPopupModal } = usePopupModal();
  const { setToast } = useToast();

  const borrowers = [];
  if (item.borrowers.length !== 0) {
    for (const borrower of item.borrowers) {
      if (borrower.approved) {
        borrowers.push(borrower);
      }
    }
  }

  const deleteItemHandler = (itemObj) => {
    const _id = itemObj._id;
    const item = itemObj.item;

    axios
      .delete("/api/v1/inventory", {
        params: { _id, item },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          if (props.setInventoryItems && props.inventoryItems) {
            props.setInventoryItems(
              props.inventoryItems.filter((itemObj) => itemObj._id !== _id)
            );
          }
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to delete inventory item");
      });
  };

  const borrowCancelReturnHandler = (itemObj, mode, itemsToBorrowNum) => {
    const _id = itemObj._id;
    let message;

    if (mode === "borrow") {
      message =
        "Item borrowed successfully. Please wait for the approval of your borrow request.";
    } else if (mode === "cancel") {
      message = "Borrow request canceled";
    } else if (mode === "return") {
      message = "Item/s returned";
    }

    let requestData = {
      mode,
      _id,
    };

    if (mode === "borrow" || mode === "return") {
      requestData = { ...requestData, itemsToBorrowNum };
    }

    if (mode === "return") {
      requestData = { ...requestData, borrowingUserId: data.user._id };
    }

    axios
      .patch("/api/v1/inventory", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({
            message,
            icon: "check",
            lifetime: 10000,
          });
          if (props.setRefetch) {
            props.setRefetch((prev) => !prev);
          }
          if (mode === "borrow" && props.hasBorrowed) {
            props.hasBorrowed((prev) => !prev);
          }
          if (mode === "return" && props.hasReturned) {
            props.hasReturned((prev) => !prev);
          }
          if (mode === "cancel" && props.hasCanceled) {
            props.hasCanceled((prev) => !prev);
          }
          setCustomModal(null);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log(
          `Error ${mode === "cancel" ? "canceling" : ""}${
            mode === "return" ? "returning" : ""
          }${mode === "borrow" ? "borrowing" : ""} item`
        );
        console.error(err);
      });
  };

  return (
    <div
      className={`bg-[#5355e0] shadow-lg  rounded-lg px-4 py-5 2xl:mr-4 2xl:mb-4 flex group w-full ${
        props.className ? props.className : ""
      }`}
    >
      <span className="flex-none flex flex-col justify-between items-center h-full">
        <img
          src={`/qrcodes/${item._id}.svg`}
          className="bg-white w-16 h-16 mb-3"
          onClick={() =>
            setCustomModal(
              <div className="w-full flex flex-col items-center justify-center">
                <img
                  src={`/qrcodes/${item._id}.svg`}
                  className="bg-white w-72 h-72"
                />
                <span className="text-black">{item.item}</span>
              </div>
            )
          }
        />
        {Boolean(
          item.borrowers.find((borrowerObj) => {
            return (
              borrowerObj._id === data.user._id && borrowerObj.approved === true
            );
          })
        ) ? (
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={() => {
              setCustomModal(
                <BorrowOrReturn
                  item={item}
                  mode="return"
                  borrowCancelReturnHandler={borrowCancelReturnHandler}
                  userId={data.user._id}
                />
              );
            }}
            pill={true}
            className="text-xs m-0"
          >
            Return
          </Button>
        ) : Boolean(
            item.borrowers.find((borrowerObj) => {
              return (
                borrowerObj._id === data.user._id &&
                borrowerObj.approved === false
              );
            })
          ) ? (
          <Button
            variant="transparent"
            size="small"
            type="button"
            onClick={() => {
              setPopupModal({
                message: `Remove borrow request for ${item.item}?`,
                primary: "Remove",
                handler: () => {
                  borrowCancelReturnHandler(item, "cancel");
                },
              });
            }}
            pill={true}
            className="text-xs m-0"
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant="primary"
            size="small"
            type="button"
            onClick={() => {
              setCustomModal(
                <BorrowOrReturn
                  item={item}
                  mode="borrow"
                  borrowCancelReturnHandler={borrowCancelReturnHandler}
                  userId={data.user._id}
                />
              );
            }}
            pill={true}
            className="text-xs m-0"
          >
            Borrow
          </Button>
        )}
      </span>
      <div className="flex-auto ml-5 flex space-y-[0.65rem] flex-col">
        <h4 className="text-lg xl:text-xl leading-snug font-semibold lg:font-bold text-gray-50 mb-[2px] sm:mb-[3px] my-0">
          {item.item}
        </h4>
        <div className="flex items-center space-x-1 text-xs lg:text-sm">
          <span className="flex bg-indigo-500 p-1 rounded pr-[7px] mr-1 space-x-[2px] items-center">
            <MdLocationPin size={19} />
            <span className="">Location</span>
          </span>
          <ul className="flex flex-wrap">
            {item.placeToFind.map((place, i) => (
              <li key={i} className="mr-2">
                {
                  data.map.places.find((placeDoc) => placeDoc.value === place)
                    .name
                }
                {item.placeToFind.length !== 0 &&
                  i !== item.placeToFind.length - 1 &&
                  ","}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-1 text-xs lg:text-sm">
          <span className="flex bg-indigo-500 p-1 rounded pr-[7px] mr-1 space-x-[2px] items-center">
            <MdOutlinePersonPinCircle size={19} />
            <span className="">In charge</span>
          </span>
          <ul className="flex flex-wrap">
            {item.personInCharge.map((personDoc, i) => (
              <li key={i} className="mr-2">
                {personDoc.firstName} {personDoc.lastName}
                {item.personInCharge.length !== 0 &&
                  i !== item.personInCharge.length - 1 &&
                  ","}
              </li>
            ))}
          </ul>
        </div>
        {borrowers.length !== 0 && (
          <div className="flex items-start space-x-1 space-y-3 text-xs lg:text-sm flex-col">
            <span className="flex bg-indigo-500 p-1 rounded pr-[7px] mr-1 space-x-[5px] items-center">
              <GoRequestChanges className="ml-[2px] mt-[3px]" size={14} />
              <span className="">Borrowers</span>
            </span>
            <ul className="flex flex-col space-y-2">
              {borrowers.map((borrowerDoc, i) => (
                <li key={i} className="mr-2">
                  {borrowerDoc.firstName} {borrowerDoc.lastName}{" "}
                  <span className="font-extralight">
                    ({borrowerDoc.itemsToBorrowNum} items)
                  </span>
                  {/* {borrowers.length !== 0 && i !== borrowers.length - 1 && ","} */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <span className="flex-none flex items-center">
        <span className="flex flex-col justify-center items-center space-y-3 relative h-min">
          {Boolean(
            item.personInCharge.find(
              (personObj) => personObj._id === data.user._id
            )
          ) && (
            <span
              className={`bg-[#5355e0] absolute invisible -top-[4px] -right-[5px] group-hover:visible px-1 py-6 rounded-full z-10`}
            >
              <MdDeleteForever
                className="w-10 h-10 text-red-300 hover:text-red-500"
                onClick={() => {
                  setPopupModal({
                    message: "Are you sure you want to delete this item?",
                    variant: "danger",
                    primary: "Delete",
                    handler: () => {
                      deleteItemHandler(item);
                    },
                  });
                }}
              />
            </span>
          )}
          <CircularProgress
            min={0}
            max={item.totalItemsNum}
            value={item.borrowedItemsNum}
          />
          <span className="text-xs">
            {item.borrowedItemsNum}/{item.totalItemsNum}
          </span>
        </span>
      </span>
    </div>
  );
};

export default InventoryItem;
