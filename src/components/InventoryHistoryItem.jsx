import React from "react";
import { RiUserReceivedFill } from "react-icons/ri";
import {
  MdOutlineCancelScheduleSend,
  MdOutlineAdd,
  MdRemoveCircle,
} from "react-icons/md";
import { GiReturnArrow } from "react-icons/gi";
import { HiBadgeCheck, HiOutlineBan } from "react-icons/hi";

const icons = [
  { value: "borrow", icon: <RiUserReceivedFill /> },
  { value: "cancel", icon: <MdOutlineCancelScheduleSend /> },
  { value: "return", icon: <GiReturnArrow /> },
  { value: "add", icon: <MdOutlineAdd /> },
  { value: "remove", icon: <MdRemoveCircle /> },
  { value: "approve", icon: <HiBadgeCheck /> },
  { value: "reject", icon: <HiOutlineBan /> },
];

const InventoryHistoryItem = ({ historyRecord, ...props }) => {
  const {
    mode,
    borrowingUser,
    managingUser,
    item,
    user,
    date,
    _id,
    itemsToBorrowNum,
  } = historyRecord;

  const historyDate = new Date(date);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = historyDate.toLocaleString("en-US", options);

  let message;
  switch (mode) {
    case "borrow":
      message = `${borrowingUser.firstName} ${borrowingUser.lastName} requested to borrow ${itemsToBorrowNum} ${item}`;
      break;

    case "cancel":
      message = `${borrowingUser.firstName} ${borrowingUser.lastName} canceled the request to borrow ${item}`;
      break;

    case "return":
      message = `${borrowingUser.firstName} ${borrowingUser.lastName} returned ${itemsToBorrowNum} ${item}`;
      break;

    case "add":
      message = `${user.firstName} ${user.lastName} added the item '${item}'`;
      break;

    case "remove":
      message = `${user.firstName} ${user.lastName} removed the item '${item}'`;
      break;

    case "approve":
      message = `${managingUser.firstName} ${managingUser.lastName} approved ${borrowingUser.firstName} ${borrowingUser.lastName}'s request to borrow ${itemsToBorrowNum} ${item}`;
      break;

    case "reject":
      message = `${managingUser.firstName} ${managingUser.lastName} rejected ${borrowingUser.firstName} ${borrowingUser.lastName}'s request to borrow ${itemsToBorrowNum} ${item}`;
      break;

    default:
      message = `...`;
  }
  return (
    <div className="flex space-x-2 items-center w-full">
      <span className=" flex-none">
        {icons.find((iconObj) => iconObj.value === mode).icon}
      </span>
      <span className="flex-auto text-sm font-light lg:text-base ">
        {message}
      </span>
      <span className="text-xs font-extralight flex-none">{formattedDate}</span>
    </div>
  );
};

export default InventoryHistoryItem;
