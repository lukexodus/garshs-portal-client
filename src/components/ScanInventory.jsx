import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "./contexts/ToastContext";
import { QrcodeScanner } from "./QrcodeScanner";
import axios from "axios";
import { sanitizeString } from "../utils/utils";
import InventoryItem from "./InventoryItem";

import NotFound from "./svgs/NotFound";
import useUpdateEffect from "./hooks/useUpdateEffect";

const ScanInventory = () => {
  document.title = `Inventory | Scan QR Code`;
  const [lastScannedCode, setLastScannedCode] = useState("");
  const { setToast } = useToast();
  const [itemFound, setItemFound] = useState(false);
  const [itemObj, setItemObj] = useState(null);
  const [hasBorrowed, setHasBorrowed] = useState(false);
  const [hasReturned, setHasReturned] = useState(false);
  const [hasCanceled, setHasCanceled] = useState(false);

  useEffect(() => {
    if (lastScannedCode) {
      axios
        .get("/api/v1/inventory", {
          params: { mode: "one", _id: sanitizeString(lastScannedCode) },
        })
        .then((res) => {
          if (res.data.success) {
            setItemObj(res.data.inventoryItem);
            setItemFound(true);
            console.log("res.data.inventoryItem", res.data.inventoryItem);
          } else {
            setItemFound(false);
            setItemObj(null);
          }
        })
        .catch((err) => {
          console.log("Failed to fetch inventory items");
          console.error(err);
        });
    }
  }, [lastScannedCode, hasReturned, hasCanceled]);

  const handleCodeScanned = useCallback((code) => {
    setLastScannedCode(code);
  }, []);

  useUpdateEffect(() => {
    setLastScannedCode("");
  }, [hasBorrowed]);

  return (
    <div className="flex flex-col space-y-3">
      <h2>Scan</h2>
      <div className="flex flex-col space-y-3 2xl:flex-row 2xl:space-x-10">
        <div className="px-2 py-4 flex-none w-full 2xl:w-[580px]">
          <QrcodeScanner
            onCodeScanned={handleCodeScanned}
            className="max-w-[580px]"
          />
        </div>
        <div className="flex flex-col space-y-3 items-center justify-center w-full flex-auto max-w-[596px] px-2 py-4">
          {lastScannedCode ? (
            itemFound ? (
              <InventoryItem
                item={itemObj}
                hasReturned={setHasReturned}
                hasCanceled={setHasCanceled}
                hasBorrowed={setHasBorrowed}
              />
            ) : (
              <>
                <NotFound className="w-20 h-20 fill-white" />
                <h4>Item not found in the database</h4>
              </>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanInventory;
