import React, { useState, useEffect } from "react";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import InventoryItem from "./InventoryItem";
import InventoryItemManage from "./InventoryItemManage";
import Spinner from "./Spinner";
import axios from "axios";
import InventoryHistory from "./InventoryHistory";

const BorrowRequests = ({ ...props }) => {
  document.title = `Inventory | Borrow Requests`;
  const { setToast } = useToast();

  const [isListReady, setIsListReady] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const { data } = useData();

  useEffect(() => {
    axios
      .get("/api/v1/inventory", { params: { mode: "requests" } })
      .then((res) => {
        if (res.data.success) {
          setInventoryItems(res.data.inventoryItems);
          setIsListReady(true);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Failed to fetch inventory items");
        console.error(err);
      });
  }, [refetch]);

  return (
    <>
      {isListReady ? (
        <div className="flex flex-col space-y-40">
          <ul className="flex flex-col space-y-3 2xl:space-y-0 2xl:flex-row 2xl:flex-wrap w-full">
            {inventoryItems.length === 0 ? (
              <p>No borrow requests</p>
            ) : (
              inventoryItems.map((item, i) => (
                <li key={i} className="w-full 2xl:w-1/2">
                  <InventoryItemManage
                    item={item}
                    inventoryItems={inventoryItems}
                    setInventoryItems={setInventoryItems}
                    setRefetch={setRefetch}
                  />
                </li>
              ))
            )}
          </ul>
          <InventoryHistory mode="borrowRequests" />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default BorrowRequests;
