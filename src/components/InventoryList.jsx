import React, { useState, useEffect } from "react";
import { useCustomModal } from "./contexts/CustomModalContext";
import { MdOutlineAdd } from "react-icons/md";
import AddItem from "./AddItem";
import { useData } from "./contexts/DataContext";
import InventoryHistory from "./InventoryHistory";

import { BiChair, BiCctv } from "react-icons/bi";
import { BsSpeakerFill, BsLadder } from "react-icons/bs";
import { TbDevices2 } from "react-icons/tb";
import { MdBiotech, MdSportsBaseball } from "react-icons/md";
import {
  FaGuitar,
  FaFireExtinguisher,
  FaPaperclip,
  FaPaintBrush,
} from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";
import { GiBookshelf, GiWateringCan, GiWifiRouter } from "react-icons/gi";
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import InventoryListByCategory from "./InventoryListByCategory";

const categoryIcons = [
  { value: "furnitures", icon: <BiChair /> },
  { value: "audioVisualEquipment", icon: <BsSpeakerFill /> },
  { value: "computerHardwareAndPeripherals", icon: <TbDevices2 /> },
  { value: "labEquipment", icon: <MdBiotech /> },
  { value: "sportsEquipment", icon: <MdSportsBaseball /> },
  { value: "musicalInstrumentsAndEquipment", icon: <FaGuitar /> },
  { value: "janitorialEquipment", icon: <BsLadder /> },
  { value: "transportationEquipment", icon: <AiFillCar /> },
  { value: "safetyEquipment", icon: <FaFireExtinguisher /> },
  { value: "artSuppliesAndEquipment", icon: <FaPaintBrush /> },
  { value: "libraryResources", icon: <GiBookshelf /> },
  { value: "officeSuppliesAndEquipment", icon: <FaPaperclip /> },
  { value: "foodServiceEquipment", icon: <CgSmartHomeRefrigerator /> },
  { value: "outdoorEquipment", icon: <GiWateringCan /> },
  { value: "technologyInfrastructure", icon: <GiWifiRouter /> },
  { value: "securityEquipment", icon: <BiCctv /> },
];

const InventoryList = ({ ...props }) => {
  document.title = `Inventory | Inventory List`;
  const { setCustomModal } = useCustomModal();
  const [inInventoryListByCategoryMode, setInInventoryListByCategoryMode] =
    useState(false);
  const [category, setCategory] = useState("");
  const [refetch, setRefetch] = useState(false);

  const { data } = useData();

  return (
    <>
      <div
        className={`flex flex-col space-y-2 ${
          props.className && props.className
        } rounded-lg border-indigo-300 border-opacity-50 border-2 p-5 lg:p-6 xl:p-8 shadow-lg `}
      >
        <div className="flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <h2>Inventory List</h2>
            {["admin", "superadmin"].includes(data.user.role) && (
              <span className="flex space-x-1 self-end group">
                <span className="flex justify-center items-center">
                  <MdOutlineAdd size={22} className="text-white" />
                </span>
                <h5
                  className="my-0 group-hover:underline"
                  onClick={() =>
                    setCustomModal(
                      <AddItem
                        setInInventoryListByCategoryMode={
                          setInInventoryListByCategoryMode
                        }
                        setRefetch={setRefetch}
                      />
                    )
                  }
                >
                  Add Item
                </h5>
              </span>
            )}
          </div>
          <div className="pt-1">
            <hr className="opacity-40" />
          </div>
          {inInventoryListByCategoryMode ? (
            <InventoryListByCategory
              setInInventoryListByCategoryMode={
                setInInventoryListByCategoryMode
              }
              category={category}
              icon={categoryIcons.find((obj) => category === obj.value).icon}
            />
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="flex">
                <h3>Categories</h3>
              </div>
              <ul className="flex flex-col xl:flex-row xl:flex-wrap space-y-2 lg:space-y-3 xl:space-y-0 xl:mb-3">
                {data.map.categories.map((categoryObj, i) => {
                  return (
                    <li
                      key={i}
                      className="xl:w-1/2 2xl:w-1/3 xl:pr-2 xl:pb-2 content-box xl:h-max space-y-2 "
                      onClick={() => {
                        setCategory(categoryObj.value);
                        setInInventoryListByCategoryMode(true);
                      }}
                    >
                      <span className="bg-indigo-500 px-3 py-2 rounded-md w-full shadow-md cursor-pointer hover:bg-indigo-400 flex items-center space-x-1">
                        <span>
                          {
                            categoryIcons.find(
                              (obj) => categoryObj.value === obj.value
                            ).icon
                          }
                        </span>
                        <span className="text-sm lg:text-base">
                          {categoryObj.name}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      <InventoryHistory mode="inventoryList" />
    </>
  );
};

export default InventoryList;
