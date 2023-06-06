import React, { useState, useEffect } from "react";
import PageFallback1 from "./PageFallback1";
import { useToast } from "./contexts/ToastContext";
import LinkButton from "./LinkButton";
import ButtonGroup from "./ButtonGroup";
import { useData } from "./contexts/DataContext";
import ScanInventory from "./ScanInventory";
import BorrowRequests from "./BorrowRequests";
import InventoryList from "./InventoryList";
import BorrowedItems from "./BorrowedItems";

import { MdInventory2 } from "react-icons/md";

const options = [
  {
    name: "Inventory List",
    value: "inventoryList",
  },
  {
    name: "Scan",
    value: "scan",
  },
  {
    name: "Borrowed",
    value: "borrowedItems",
  },
];

let borrowRequestsTabAdded = false;

const Sections = () => {
  const { setToast } = useToast();
  const [tab, setTab] = useState("inventoryList");

  const { data } = useData();
  const [isLocalDataReady, setIsLocalDataReady] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
      if (
        !borrowRequestsTabAdded &&
        ["admin", "superadmin"].includes(data.user.role)
      ) {
        options.push({
          name: "Requests",
          value: "borrowRequests",
        });
        borrowRequestsTabAdded = true;
      }
    }
  }, [data]);

  return (
    <>
      {isLocalDataReady ? (
        <div className="flex flex-col space-y-10">
          <div className="flex flex-col space-y-1">
            <h1 className="flex space-x-3 md:space-x-4">
              <span className="my-0 py-0">
                <MdInventory2 />
              </span>
              <span>Inventory</span>
            </h1>
            <ButtonGroup options={options} stateHandler={setTab} state={tab} />
          </div>
          {tab === "scan" ? <ScanInventory /> : ""}
          {tab === "borrowRequests" ? <BorrowRequests /> : ""}
          {tab === "inventoryList" ? <InventoryList /> : ""}
          {tab === "borrowedItems" ? <BorrowedItems /> : ""}
        </div>
      ) : (
        <PageFallback1 />
      )}
    </>
  );
};

export default Sections;
