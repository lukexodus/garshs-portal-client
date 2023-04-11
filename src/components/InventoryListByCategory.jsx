import React, { useState, useEffect } from "react";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import InventoryItem from "./InventoryItem";
import Spinner from "./Spinner";
import axios from "axios";

import { IoMdArrowRoundBack } from "react-icons/io";

const InventoryListByCategory = ({
  category,
  setInInventoryListByCategoryMode,
  icon,
  ...props
}) => {
  const { setToast } = useToast();

  const [isListReady, setIsListReady] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const { data } = useData();

  useEffect(() => {
    axios
      .get("/api/v1/inventory", { params: { mode: "category", category } })
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
        <div className="flex flex-col space-y-2">
          <div className="pt-2  flex items-center justify-start">
            <span
              className="flex items-center group self-start"
              onClick={() => {
                setInInventoryListByCategoryMode(false);
              }}
            >
              <span className="mr-1">
                <IoMdArrowRoundBack size={27} />
              </span>
              <span className="text-lg group-hover:underline">Go back</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 ">
            <span>{icon}</span>
            <h3 className="text-xl tracking-wide">
              {
                data.map.categories.find(
                  (categoryObj) => categoryObj.value === category
                ).name
              }
            </h3>
          </div>
          <ul className="flex flex-col space-y-3 2xl:space-y-0 2xl:flex-row 2xl:flex-wrap w-full">
            {inventoryItems.length === 0 ? (
              <p>No items found under this category</p>
            ) : (
              inventoryItems.map((item, i) => (
                <li key={i} className="w-full 2xl:w-1/2">
                  <InventoryItem
                    item={item}
                    inventoryItems={inventoryItems}
                    setInventoryItems={setInventoryItems}
                    setRefetch={setRefetch}
                    setInInventoryListByCategoryMode={
                      setInInventoryListByCategoryMode
                    }
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default InventoryListByCategory;
